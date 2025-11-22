async function initAdocoes() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");

    if (!ong.id) {
        console.warn("ONG não logada. Redirecionando.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    const ongId = ong.id;
    const tbody = document.querySelector("#tabela-adocoes tbody");

    // --------------------------------------------------
    // --- FUNÇÃO PARA GERAR URL COMPLETA DO SUPABASE ---
    // --------------------------------------------------
    function gerarUrlImagemSupabase(caminho) {
        if (!caminho) return "/src/img/pet-default.png";

        const PROJECT_ID = "****************"; // <<< COLOCA AQUI O ID DO SEU PROJETO
        const BUCKET = "pets"; // <<< COLOCA O NOME EXATO DO BUCKET

        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${caminho}`;
    }

    // --------------------------------------------------
    // --- MODAL DE DETALHES ---
    // --------------------------------------------------
    function abrirModalDetalhes(adocao) {
        const pet = adocao.animal || {};
        const adotante = adocao.adotante || {};

        const imgUrl = gerarUrlImagemSupabase(pet.link_img);

        const modalHtml = `
            <div id="modal-detalhes-adocao"
                 style="position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:999999;">
                 
                <div style="
                    background:white;
                    border-radius:10px;
                    width:95%;
                    max-width:900px;
                    padding:20px;
                    color:black;
                    max-height:92vh;
                    overflow:auto;
                ">

                    <h2 style="margin-bottom:15px;">Detalhes da Adoção #${adocao.adocao_id}</h2>

                    <div style="display:flex;gap:20px;flex-wrap:wrap;">
                        
                        <div style="flex:1;min-width:260px;">
                            <img src="${imgUrl}"
                                 onerror="this.src='/src/img/pet-default.png'"
                                 style="width:100%;height:260px;object-fit:cover;border-radius:10px;background:#ddd;" />
                        </div>

                        <div style="flex:2;min-width:260px;">
                            <h3>Animal</h3>
                            <p><strong>ID:</strong> ${pet.animal_id}</p>
                            <p><strong>Nome:</strong> ${pet.nome}</p>
                            <p><strong>Espécie:</strong> ${pet.especie}</p>
                            <p><strong>Raça:</strong> ${pet.raca}</p>
                            <p><strong>Sexo:</strong> ${pet.sexo}</p>
                            <p><strong>Status:</strong> ${pet.status || "—"}</p>
                        </div>
                    </div>

                    <hr style="margin:14px 0;">

                    <h3>Adotante</h3>
                    <p><strong>ID:</strong> ${adotante.adotante_id}</p>
                    <p><strong>Nome:</strong> ${adotante.nome}</p>
                    <p><strong>Email:</strong> ${adotante.email}</p>
                    <p><strong>Telefone:</strong> ${adotante.telefone}</p>

                    <hr style="margin:14px 0;">

                    <h3>Status da Adoção</h3>
                    <p><strong>Status:</strong> ${adocao.status}</p>
                    <p><strong>Data:</strong> ${adocao.data_adocao ? new Date(adocao.data_adocao).toLocaleDateString("pt-BR") : "—"}</p>

                    <div style="display:flex;justify-content:end;margin-top:18px;">
                        <button onclick="document.getElementById('modal-detalhes-adocao').remove()" 
                                style="padding:8px 14px;border:none;background:#222;color:white;border-radius:6px;cursor:pointer;">
                                Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);
    }

    window.detalhesAdocao = async (id) => {
        try {
            const resp = await axios.get(`/adocao/${id}`);
            abrirModalDetalhes(resp.data.adocao);
        } catch (err) {
            console.error("Erro:", err);
            alert("Erro ao carregar detalhes.");
        }
    };

    // --------------------------------------------------
    // --- CARREGAR ADOÇÕES ---
    // --------------------------------------------------

    async function carregarAdocoes() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="7">Carregando adoções...</td></tr>';

        try {
            const resp = await axios.get(`/adocao?ong_id=${ongId}`);
            const adocoes = resp.data.adocoes || [];

            if (!adocoes.length) {
                tbody.innerHTML = '<tr><td colspan="7">Nenhuma adoção encontrada.</td></tr>';
                return;
            }

            tbody.innerHTML = adocoes
                .map(a => {
                    const imgUrl = gerarUrlImagemSupabase(a.animal?.link_img);

                    return `
                    <tr>
                        <td>${a.adocao_id}</td>
                        <td>
                            <img src="${imgUrl}"
                                onerror="this.src='/src/img/pet-default.png'"
                                style="width:60px;height:60px;object-fit:cover;border-radius:6px;background:#ddd;" />
                        </td>
                        <td>${a.animal?.nome || '-'}</td>
                        <td>${a.adotante?.nome || '-'}</td>
                        <td>${a.data_adocao ? new Date(a.data_adocao).toLocaleDateString("pt-BR") : '-'}</td>
                        <td>
                            <span style="color:${
                                a.status === 'em análise'
                                    ? '#f1c40f'
                                    : a.status === 'aprovado'
                                        ? '#27ae60'
                                        : '#e74c3c'
                            }">${a.status}</span>
                        </td>
                        <td>
                            ${
                                a.status === "em análise"
                                    ? `<button class="btn btn-finalizar" onclick="finalizarAdocao(${a.adocao_id})">Finalizar</button>`
                                    : 'Finalizada'
                            }
                            <button class="btn" onclick="detalhesAdocao(${a.adocao_id})">Detalhes</button>
                        </td>
                    </tr>`;
                })
                .join("");
        } catch (err) {
            console.error("Erro ao carregar adoções:", err);
            tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar adoções.</td></tr>';
        }
    }

    // --------------------------------------------------
    // --- FINALIZAR ADOÇÃO ---
    // --------------------------------------------------

    window.finalizarAdocao = async (id) => {
        if (!confirm(`Finalizar adoção ID ${id}?`)) return;

        try {
            await axios.put(`/adocao/${id}`, { status: "aprovado" });
            alert("Adoção finalizada!");
            carregarAdocoes();
        } catch (err) {
            console.error("Erro ao finalizar adoção:", err);
            alert("Erro ao finalizar: " + (err.response?.data?.message || err.message));
        }
    };

    // --------------------------------------------------
    // --- MODAL NOVA ADOÇÃO (mantido) ---
    // --------------------------------------------------

    window.abrirModalNovaAdocao = async () => {
        /* ... modal original permanece aqui ... */
    };

    // botão + Nova Adoção
    const sec = document.getElementById("Adocao");
    if (sec) {
        const btn = document.createElement("button");
        btn.className = "btn btn-verde";
        btn.textContent = "+ Nova Adoção";
        btn.style.marginBottom = "10px";
        btn.onclick = window.abrirModalNovaAdocao;
        sec.insertBefore(btn, sec.firstChild.nextSibling);
    }

    carregarAdocoes();
    window.carregarAdocoes = carregarAdocoes;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdocoes);
} else {
    initAdocoes();
}
