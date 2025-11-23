// adocao_membro_ong.js — versão final corrigida para membro
async function initAdocoes() {

    console.log("[MEMBRO] Iniciando tela de adoções...");

    // PEGAR USUÁRIO ATUAL
    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual") || "{}");

    if (!usuarioAtual || usuarioAtual.tipo !== "membro" || !usuarioAtual.info) {
        alert("Você precisa estar logado como membro.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    const ongId = usuarioAtual.info.ong_id;

    if (!ongId) {
        console.error("[ERRO] ONG_ID NÃO ENCONTRADO:", usuarioAtual);
        alert("Erro ao carregar ONG. Faça login novamente.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    console.log("[MEMBRO] ONG ID:", ongId);

    const tbody = document.getElementById("adocao-tbody");

    function gerarUrlImagemSupabase(caminho) {
        if (!caminho) return "/src/img/pet-default.png";
        if (caminho.startsWith("http")) return caminho;
        const PROJECT_ID = "***************";
        const BUCKET = "pets";
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${caminho}`;
    }

    // MODAL DETALHES
    const modalDetalhes = document.getElementById("modal-detalhes");
    document.getElementById("modal-close-btn")
        .addEventListener("click", () => modalDetalhes.classList.add("hidden"));

    function abrirModal(adocao) {
        const pet = adocao.animal || {};
        const adotante = adocao.adotante || {};

        document.getElementById("modal-title").textContent =
            `Detalhes da Adoção #${adocao.adocao_id}`;

        document.getElementById("modal-img").src = gerarUrlImagemSupabase(pet.link_img);

        document.getElementById("animal-id").textContent = pet.animal_id || "-";
        document.getElementById("animal-nome").textContent = pet.nome || "-";
        document.getElementById("animal-especie").textContent = pet.especie || "-";
        document.getElementById("animal-raca").textContent = pet.raca || "-";
        document.getElementById("animal-sexo").textContent = pet.sexo || "-";
        document.getElementById("animal-status").textContent = pet.status || "-";

        document.getElementById("adotante-id").textContent = adotante.adotante_id || "-";
        document.getElementById("adotante-nome").textContent = adotante.nome || "-";
        document.getElementById("adotante-email").textContent = adotante.email || "-";
        document.getElementById("adotante-telefone").textContent = adotante.telefone || "-";

        document.getElementById("adocao-status").textContent = adocao.status || "-";
        document.getElementById("adocao-data").textContent =
            adocao.data_adocao
                ? new Date(adocao.data_adocao).toLocaleDateString("pt-BR")
                : "-";

        modalDetalhes.classList.remove("hidden");
    }

    window.detalhesAdocao = async (id) => {
        try {
            const resp = await axios.get(`/adocao/${id}`);
            abrirModal(resp.data.adocao);
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
            alert("Erro ao carregar detalhes da adoção");
        }
    };

    // MODAL "NOVA ADOÇÃO"
    const modalNova = document.getElementById("modal-nova-adocao");
    const btnNova = document.getElementById("btn-nova-adocao");
    const closeNova = document.getElementById("modal-nova-close-btn");

    let listaAnimaisCache = [];
    let listaAdotantesCache = [];
    let animalSelecionado = null;
    let adotanteSelecionado = null;

    async function carregarAnimais() {
        try {
            const res = await axios.get(`/pets?ong_id=${ongId}`);
            listaAnimaisCache = res.data || [];
            mostrarAnimais(listaAnimaisCache);
        } catch (error) {
            listaAnimaisCache = [];
            mostrarAnimais([]);
        }
    }

    function mostrarAnimais(lista) {
        const container = document.getElementById("lista-animais-modal");
        if (!container) return;

        if (!lista.length) {
            container.innerHTML =
                '<div style="padding:10px;text-align:center;color:#666;">Nenhum animal cadastrado</div>';
            return;
        }

        container.innerHTML = '';
        lista.forEach(a => {
            const div = document.createElement("div");
            div.textContent = `${a.nome} (${a.especie}) - ${a.status || "disponível"}`;
            div.style.cursor = "pointer";
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";

            if (["adotado", "em análise"].includes(a.status)) {
                div.style.background = "#f8d7da";
                div.style.color = "#721c24";
            }

            div.addEventListener("click", () => {
                if (["adotado", "em análise"].includes(a.status)) {
                    alert("Este animal já está em processo de adoção!");
                    return;
                }
                animalSelecionado = a;
                Array.from(container.children).forEach(c => (c.style.background = ""));
                div.style.background = "#27ae60";
                div.style.color = "white";
            });

            container.appendChild(div);
        });
    }

    async function carregarAdotantes() {
        try {
            const res = await axios.get(`/adotante`);
            listaAdotantesCache = res.data || [];
            mostrarAdotantes(listaAdotantesCache);
        } catch (error) {
            listaAdotantesCache = [];
            mostrarAdotantes([]);
        }
    }

    function mostrarAdotantes(lista) {
        const container = document.getElementById("lista-adotantes-modal");
        if (!container) return;

        if (!lista.length) {
            container.innerHTML =
                '<div style="padding:10px;text-align:center;color:#666;">Nenhum adotante cadastrado</div>';
            return;
        }

        container.innerHTML = '';
        lista.forEach(a => {
            const div = document.createElement("div");
            div.textContent = `${a.nome} - ${a.email || "Sem email"}`;
            div.style.cursor = "pointer";
            div.style.padding = "10px";
            div.style.borderBottom = "1px solid #eee";

            div.addEventListener("click", () => {
                adotanteSelecionado = a;
                Array.from(container.children).forEach(c => (c.style.background = ""));
                div.style.background = "#27ae60";
                div.style.color = "white";
            });

            container.appendChild(div);
        });
    }

    btnNova.addEventListener("click", async () => {
        await carregarAnimais();
        await carregarAdotantes();
        animalSelecionado = null;
        adotanteSelecionado = null;
        modalNova.classList.remove("hidden");
    });

    closeNova.addEventListener("click", () => modalNova.classList.add("hidden"));

    document.getElementById("buscar-animal-modal")
        ?.addEventListener("input", e => {
            const termo = e.target.value.toLowerCase();
            mostrarAnimais(listaAnimaisCache.filter(a =>
                a.nome.toLowerCase().includes(termo) ||
                a.especie.toLowerCase().includes(termo)
            ));
        });

    document.getElementById("buscar-adotante-modal")
        ?.addEventListener("input", e => {
            const termo = e.target.value.toLowerCase();
            mostrarAdotantes(listaAdotantesCache.filter(a =>
                a.nome.toLowerCase().includes(termo) ||
                (a.email && a.email.toLowerCase().includes(termo))
            ));
        });

    document.getElementById("btn-criar-adocao")
        ?.addEventListener("click", async () => {
            if (!animalSelecionado || !adotanteSelecionado) {
                alert("Selecione um animal e um adotante!");
                return;
            }

            const novaAdocao = {
                ong_id: Number(ongId),
                animal_id: Number(animalSelecionado.animal_id),
                adotante_id: Number(adotanteSelecionado.adotante_id),
                status: "em análise",
                data_adocao: new Date().toISOString().slice(0, 10)
            };

            try {
                await axios.post("/adocao", novaAdocao);
                modalNova.classList.add("hidden");
                await carregarAdocoes();
                alert("Adoção criada com sucesso!");
            } catch (err) {
                alert("Erro ao criar adoção: " + (err.response?.data?.error || err.message));
            }
        });

    window.editarAdocao = async id => {
        try {
            const resp = await axios.get(`/adocao/${id}`);
            const adocao = resp.data.adocao;

            await carregarAnimais();
            await carregarAdotantes();

            animalSelecionado = adocao.animal;
            adotanteSelecionado = adocao.adotante;

            modalNova.classList.remove("hidden");
        } catch (error) {
            alert("Erro ao carregar dados para edição");
        }
    };

    window.excluirAdocao = async id => {
        if (!confirm("Tem certeza que deseja excluir esta adoção?")) return;

        try {
            await axios.delete(`/adocao/${id}`);
            await carregarAdocoes();
        } catch (error) {
            alert("Erro ao excluir adoção");
        }
    };

    async function carregarAdocoes() {
        tbody.innerHTML = "<tr><td colspan='7'>Carregando...</td></tr>";

        try {
            const resp = await axios.get(`/adocao?ong_id=${ongId}`);
            const adocoes = resp.data.adocoes || [];

            if (!adocoes.length) {
                tbody.innerHTML = "<tr><td colspan='7'>Nenhuma adoção encontrada.</td></tr>";
                return;
            }

            tbody.innerHTML = adocoes
                .map(a => `
            <tr>
                <td>${a.adocao_id}</td>
                <td>${
                    a.animal?.link_img
                        ? `<img src="${gerarUrlImagemSupabase(a.animal.link_img)}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">`
                        : "-"
                }</td>
                <td>${a.animal?.nome || "-"}</td>
                <td>${a.adotante?.nome || "-"}</td>
                <td>${
                    a.data_adocao
                        ? new Date(a.data_adocao).toLocaleDateString("pt-BR")
                        : "-"
                }</td>
                <td>
                    <select onchange="atualizarStatus(${a.adocao_id}, this.value)">
                        <option value="em análise" ${a.status === "em análise" ? "selected" : ""}>Em análise</option>
                        <option value="cancelado" ${a.status === "cancelado" ? "selected" : ""}>Cancelado</option>
                        <option value="concluido" ${a.status === "concluido" ? "selected" : ""}>Concluído</option>
                    </select>
                </td>
                <td>
                    <button onclick="detalhesAdocao(${a.adocao_id})">Detalhes</button>
                    <button onclick="editarAdocao(${a.adocao_id})">Editar</button>
                    <button onclick="excluirAdocao(${a.adocao_id})" style="background:#e74c3c;color:white;">Excluir</button>
                </td>
            </tr>
            `)
                .join("");
        } catch (error) {
            tbody.innerHTML =
                "<tr><td colspan='7'>Erro ao carregar adoções</td></tr>";
        }
    }

    window.atualizarStatus = async (id, status) => {
        try {
            await axios.put(`/adocao/${id}`, { status });
            await carregarAdocoes();
        } catch (error) {
            alert("Erro ao atualizar status");
        }
    };

    carregarAdocoes();
}

document.addEventListener("DOMContentLoaded", initAdocoes);
