// /src/js/admin_ong/ong.js
document.addEventListener('DOMContentLoaded', async () => {
    // --- validação de login ---
    const usuarioJSON = localStorage.getItem('usuarioAtual');
    if (!usuarioJSON) {
        alert("Faça login primeiro.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    const usuarioStorage = JSON.parse(usuarioJSON);
    if (!usuarioStorage.tipo || usuarioStorage.tipo !== 'ong') {
        alert("Acesso negado. Área exclusiva para ONG.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    const info = usuarioStorage.info || {};
    const ongId = info.id || info.ong_id;
    if (!ongId) {
        alert("Erro: ONG sem ID.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    // --- elementos da página ---
    const nomeSpans = document.querySelectorAll('.ong-name');
    const nomeTitulo = document.getElementById('ong-nome');
    const emailSpan = document.getElementById('ong-email');
    const cnpjSpan = document.getElementById('ong-cnpj');
    const whatsappSpan = document.getElementById('ong-whatsapp');
    const btnEditarDados = document.querySelector('#Dados .btn-edit');

    let dadosOngAtuais = null;

    // --- preencher nome local ---
    function preencherNomeLocal(nome) {
        if (!nome) return;
        nomeSpans.forEach(el => el.textContent = nome);
    }
    preencherNomeLocal(info.nome);

    // --- buscar dados reais da ONG ---
    async function carregarDadosDaOng() {
        try {
            let ong = null;

            // Tenta buscar pelo ID primeiro
            try {
                const res = await axios.get(`/ongs/${ongId}`);
                ong = res.data;
            } catch (errId) {
                console.warn("Falha ao buscar ONG pelo ID, tentando buscar todas e filtrar...", errId);

                // Fallback: buscar todas e filtrar
                const resAll = await axios.get('/ongs');
                const todas = resAll.data.dados || resAll.data;
                ong = todas.find(o => o.id == ongId || o.ong_id == ongId);
            }

            if (!ong) {
                alert("Não foi possível localizar a ONG no servidor.");
                return;
            }

            dadosOngAtuais = ong;

            // --- preencher UI ---
            if (nomeSpans.length) nomeSpans.forEach(el => el.textContent = ong.nome || '—');
            if (nomeTitulo) nomeTitulo.textContent = ong.nome || '—';
            if (emailSpan) emailSpan.textContent = ong.email || '-';
            if (cnpjSpan) cnpjSpan.textContent = ong.cnpj || '-';
            if (whatsappSpan) whatsappSpan.textContent = ong.whatsapp || '-';
           

        } catch (err) {
            console.error('Erro ao carregar dados da ONG:', err);
            alert('Não foi possível carregar os dados da ONG. Verifique a conexão com o servidor.');
        }
    }

    await carregarDadosDaOng();

    // --- criar modal de edição ---
    function criarModalEdicao() {
        if (document.getElementById('modal-editar-ong')) return;

        const modalHtml = `
            <div class="modal" id="modal-editar-ong" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0, 0, 0, 0);z-index:9999;">
                <div style="width:90%;max-width:720px;background:rgba(56, 56, 56, 0.93);border-radius:8px;padding:18px;position:relative;">
                    <h3 style="margin:0 0 12px; color:white;">Editar Dados da ONG</h3>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <input id="edit-nome" placeholder="Nome" />
                        <input id="edit-email" placeholder="Email" />
                        <input id="edit-cnpj" placeholder="CNPJ" />
                        <input id="edit-whatsapp" placeholder="WhatsApp" />
                        <input id="edit-rua" placeholder="Rua" />
                        <input id="edit-numero" placeholder="Número" />
                        <input id="edit-bairro" placeholder="Bairro" />
                        <input id="edit-cep" placeholder="CEP" />
                        <input id="edit-senha" type="password" placeholder="Nova senha (opcional)" />
                    </div>
                    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                        <button id="btn-cancelar-edicao" style="padding:10px 14px;border-radius:6px;border:1px solid #000000ff;background:white;color:black;">Cancelar</button>
                        <button id="btn-salvar-edicao" style="padding:10px 14px;border-radius:6px;border:none;background:#27ae60;color:#fff;">Salvar</button>
                    </div>
                    <button id="fechar-modal-x" style="position:absolute;top:8px;right:8px;background:transparent;border:none;font-size:20px;cursor:pointer;">×</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const fill = () => {
            const ong = dadosOngAtuais || {};
            document.getElementById('edit-nome').value = ong.nome || '';
            document.getElementById('edit-email').value = ong.email || '';
            document.getElementById('edit-cnpj').value = ong.cnpj || '';
            document.getElementById('edit-whatsapp').value = ong.whatsapp || '';
            document.getElementById('edit-rua').value = ong.rua || '';
            document.getElementById('edit-numero').value = ong.numero || '';
            document.getElementById('edit-bairro').value = ong.bairro || '';
            document.getElementById('edit-cep').value = ong.cep || '';
            document.getElementById('edit-senha').value = '';
        };
        fill();

        document.getElementById('btn-cancelar-edicao').addEventListener('click', fecharModalEdicao);
        document.getElementById('fechar-modal-x').addEventListener('click', fecharModalEdicao);
        document.getElementById('btn-salvar-edicao').addEventListener('click', salvarEdicao);
    }

    function abrirModalEdicao() {
        criarModalEdicao();
        const m = document.getElementById('modal-editar-ong');
        if (m) m.style.display = 'flex';
    }

    function fecharModalEdicao() {
        const m = document.getElementById('modal-editar-ong');
        if (m) m.remove();
    }

    // --- salvar edição ---
    async function salvarEdicao() {
        const nome = document.getElementById('edit-nome').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const cnpj = document.getElementById('edit-cnpj').value.trim();
        const whatsapp = document.getElementById('edit-whatsapp').value.trim();
        const rua = document.getElementById('edit-rua').value.trim();
        const numero = document.getElementById('edit-numero').value.trim();
        const bairro = document.getElementById('edit-bairro').value.trim();
        const cep = document.getElementById('edit-cep').value.trim();
        const senha = document.getElementById('edit-senha').value.trim();

        const payload = { nome, email, cnpj, whatsapp, rua, numero, bairro, cep };
        if (senha) payload.senha = senha;

        try {
            const res = await axios.put(`/ongs/${ongId}`, payload);
            const updated = res.data.ong || res.data;

            if (nomeSpans.length) nomeSpans.forEach(el => el.textContent = updated.nome || nome);
            if (nomeTitulo) nomeTitulo.textContent = updated.nome || nome;
            if (emailSpan) emailSpan.textContent = updated.email || email;
            if (cnpjSpan) cnpjSpan.textContent = updated.cnpj || cnpj;
            if (whatsappSpan) whatsappSpan.textContent = updated.whatsapp || whatsapp;

            // Atualiza storage mantendo compatibilidade
            const novoUsuario = {
                tipo: 'ong',
                info: updated
            };
            localStorage.setItem('usuarioAtual', JSON.stringify(novoUsuario));

            alert('Dados atualizados com sucesso.');
            fecharModalEdicao();
            await carregarDadosDaOng();

        } catch (err) {
            console.error('Erro ao salvar edição:', err);
            alert('Falha ao salvar. Verifique os dados e tente novamente.');
        }
    }

    // --- ligar botão editar ---
    if (btnEditarDados) {
        btnEditarDados.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalEdicao();
        });
    } else {
        const fallback = Array.from(document.querySelectorAll('button')).find(b => /editar\s+dados/i.test(b.textContent));
        if (fallback) fallback.addEventListener('click', (e) => { e.preventDefault(); abrirModalEdicao(); });
    }
});
