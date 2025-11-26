// /src/js/admin_ong/ong.js - versão final corrigida com UF
document.addEventListener('DOMContentLoaded', async () => {
    console.log("[ONG] Iniciando painel da ONG...");

    const usuarioRaw = localStorage.getItem('usuarioAtual');
    if (!usuarioRaw) {
        alert("Faça login primeiro.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    let usuario;
    try {
        usuario = JSON.parse(usuarioRaw);
    } catch (e) {
        console.error("[ONG] JSON inválido em usuarioAtual:", e);
        localStorage.removeItem('usuarioAtual');
        alert("Erro no login. Faça login novamente.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    if (!usuario || usuario.tipo !== 'ong') {
        alert("Acesso negado. Faça login como ONG.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    let ongId = usuario.id || usuario.ong_id || null;
    let dadosOngAtuais = null;

    const nomeSpans = document.querySelectorAll('.ong-name');
    const nomeTitulo = document.getElementById('ong-nome');
    const emailSpan = document.getElementById('ong-email');
    const cnpjSpan = document.getElementById('ong-cnpj');
    const whatsappSpan = document.getElementById('ong-whatsapp');
    const ruaSpan = document.getElementById('ong-rua');
    const numeroSpan = document.getElementById('ong-numero');
    const bairroSpan = document.getElementById('ong-bairro');
    const cepSpan = document.getElementById('ong-cep');
    const ufSpan = document.getElementById('ong-uf');
    const btnEditarDados = document.querySelector('#Dados .btn-edit');

    function preencherNomeLocal(nome) {
        if (!nome) return;
        nomeSpans.forEach(el => el.textContent = nome);
        if (nomeTitulo) nomeTitulo.textContent = nome;
    }
    preencherNomeLocal(usuario.nome);

    async function resolveOngIdPorNome(nome) {
        if (!nome) return null;
        try {
            const q = encodeURIComponent(nome);
            const resFiltro = await axios.get(`/ongs?nome=${q}`);
            const lista = resFiltro.data.dados || resFiltro.data || [];
            if (lista && lista.length === 1) return lista[0].id || lista[0].ong_id || null;
            if (lista && lista.length > 1) {
                const exact = lista.find(o => (o.nome || '').toLowerCase() === nome.toLowerCase());
                if (exact) return exact.id || exact.ong_id || null;
            }
        } catch (err) {
            console.warn("[ONG] Falha ao buscar /ongs?nome=, tentando buscar todas", err);
        }

        try {
            const resAll = await axios.get('/ongs');
            const todas = resAll.data.dados || resAll.data || [];
            const found = todas.find(o => (o.nome || '').toLowerCase() === (nome || '').toLowerCase());
            return found ? (found.id || found.ong_id || null) : null;
        } catch (err) {
            console.error("[ONG] Erro ao buscar todas as ONGs:", err);
            return null;
        }
    }

    async function carregarDadosDaOng() {
        try {
            if (!ongId) {
                ongId = await resolveOngIdPorNome(usuario.info.nome);
                if (!ongId) {
                    alert("Não foi possível identificar a ONG. Faça login novamente ou contate o admin.");
                    return;
                }
                console.log("[ONG] ID resolvido por nome:", ongId);
            }

            const res = await axios.get(`/ongs/${ongId}`);
            const ong = res.data || res.data.ong || res.data.dados || res.data;
            if (!ong) throw new Error("Resposta inválida ao buscar ONG");

            dadosOngAtuais = ong;

            if (nomeSpans.length) nomeSpans.forEach(el => el.textContent = ong.nome || '—');
            if (nomeTitulo) nomeTitulo.textContent = ong.nome || '—';
            if (emailSpan) emailSpan.textContent = ong.email || '-';
            if (cnpjSpan) cnpjSpan.textContent = ong.cnpj || '-';
            if (whatsappSpan) whatsappSpan.textContent = ong.whatsapp || '-';
            if (ruaSpan) ruaSpan.textContent = ong.rua || '-';
            if (numeroSpan) numeroSpan.textContent = ong.numero || '-';
            if (bairroSpan) bairroSpan.textContent = ong.bairro || '-';
            if (cepSpan) cepSpan.textContent = ong.cep || '-';
            if (ufSpan) ufSpan.textContent = ong.uf || '-';

            const novoUsuario = {
                tipo: 'ong',
                id: ong.id || ong.ong_id,
                nome: ong.nome,
                email: ong.email,
                cnpj: ong.cnpj,
                whatsapp: ong.whatsapp,
                rua: ong.rua,
                numero: ong.numero,
                bairro: ong.bairro,
                cep: ong.cep,
                uf: ong.uf
            };
            localStorage.setItem('usuarioAtual', JSON.stringify(novoUsuario));
            console.log("[ONG] localStorage atualizado e padronizado.");

        } catch (err) {
            console.error("[ONG] Erro ao carregar dados da ONG:", err);
            alert("Não foi possível carregar os dados da ONG. Verifique a conexão com o servidor.");
        }
    }

    await carregarDadosDaOng();

    function criarModalEdicao() {
        if (document.getElementById('modal-editar-ong')) return;

        const ong = dadosOngAtuais || usuario;

        const modalHtml = `
            <div class="modal" id="modal-editar-ong" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;">
                <div style="width:90%;max-width:720px;background:#383838;border-radius:8px;padding:18px;position:relative;color:white;">
                    <h3>Editar Dados da ONG</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <input id="edit-nome" placeholder="Nome" value="${ong.nome || ''}">
                        <input id="edit-email" placeholder="Email" value="${ong.email || ''}">
                        <input id="edit-cnpj" placeholder="CNPJ" value="${ong.cnpj || ''}">
                        <input id="edit-whatsapp" placeholder="WhatsApp" value="${ong.whatsapp || ''}">
                        <input id="edit-rua" placeholder="Rua" value="${ong.rua || ''}">
                        <input id="edit-numero" placeholder="Número" value="${ong.numero || ''}">
                        <input id="edit-bairro" placeholder="Bairro" value="${ong.bairro || ''}">
                        <input id="edit-cep" placeholder="CEP" value="${ong.cep || ''}">
                        <input id="uf-edit" placeholder="UF" value="${ong.uf || ''}">
                        <input id="edit-senha" type="password" placeholder="Nova senha (opcional)">
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                        <button id="btn-cancelar-edicao">Cancelar</button>
                        <button id="btn-salvar-edicao" style="background:#27ae60;color:white;">Salvar</button>
                    </div>
                    <button id="fechar-modal-x" style="position:absolute;top:8px;right:8px;background:transparent;border:none;font-size:24px;color:white;">×</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('btn-cancelar-edicao').onclick = fecharModalEdicao;
        document.getElementById('fechar-modal-x').onclick = fecharModalEdicao;
        document.getElementById('btn-salvar-edicao').onclick = salvarEdicao;
    }

    function abrirModalEdicao() {
        criarModalEdicao();
        const m = document.getElementById('modal-editar-ong');
        if (m) m.style.display = 'flex';
    }

    function fecharModalEdicao() {
        const modal = document.getElementById('modal-editar-ong');
        if (modal) modal.remove();
    }

    async function salvarEdicao() {
        const payload = {
            nome: document.getElementById('edit-nome').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            cnpj: document.getElementById('edit-cnpj').value.trim(),
            whatsapp: document.getElementById('edit-whatsapp').value.trim(),
            rua: document.getElementById('edit-rua').value.trim(),
            numero: document.getElementById('edit-numero').value.trim(),
            bairro: document.getElementById('edit-bairro').value.trim(),
            cep: document.getElementById('edit-cep').value.trim(),
            uf: document.getElementById('uf-edit').value.trim()
        };

        const senha = document.getElementById('edit-senha').value.trim();
        if (senha) payload.senha = senha;

        try {
            const res = await axios.put(`/ongs/${ongId}`, payload);
            const updated = res.data.ong || res.data || payload;

            if (nomeSpans.length) nomeSpans.forEach(el => el.textContent = updated.nome);
            if (nomeTitulo) nomeTitulo.textContent = updated.nome;
            if (emailSpan) emailSpan.textContent = updated.email;
            if (cnpjSpan) cnpjSpan.textContent = updated.cnpj;
            if (whatsappSpan) whatsappSpan.textContent = updated.whatsapp;

            const novoUsuario = {
                tipo: 'ong',
                id: updated.id || ongId,
                nome: updated.nome,
                email: updated.email,
                cnpj: updated.cnpj,
                whatsapp: updated.whatsapp,
                rua: updated.rua,
                numero: updated.numero,
                bairro: updated.bairro,
                cep: updated.cep,
                uf: updated.uf
            };
            localStorage.setItem("usuarioAtual", JSON.stringify(novoUsuario));

            alert("Dados atualizados com sucesso.");
            fecharModalEdicao();
            await carregarDadosDaOng();
        } catch (err) {
            console.error("[ONG] Erro ao salvar edição:", err);
            alert("Falha ao salvar. Verifique os dados e tente novamente.");
        }
    }

    if (btnEditarDados) {
        btnEditarDados.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalEdicao();
        });
    }
});
