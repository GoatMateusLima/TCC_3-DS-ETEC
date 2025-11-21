// ong.js — VERSÃO FINAL FUNCIONANDO (sem BASE_URL, igual ao login)

document.addEventListener("DOMContentLoaded", function () {
    carregarDadosONG();

    const formOng = document.getElementById('form-ong');
    if (formOng) {
        formOng.addEventListener('submit', salvarDadosONG);
    }

    // Carrega as tabelas assim que tiver o ID da ONG
    if (typeof carregarMembros === 'function') carregarMembros();
    if (typeof carregarAnimais === 'function') carregarAnimais();
    if (typeof carregarAdocoes === 'function') carregarAdocoes();
});

/**
 * Carrega e exibe os dados da ONG logada
 */
function carregarDadosONG() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    const nomeOng = ong.nome ? ong.nome.trim() : "ONG Desconhecida";
    document.title = `${nomeOng} - ADMIN`;

    document.querySelectorAll(".ong-name").forEach(el => el.textContent = nomeOng);
    document.getElementById("ong-nome").textContent = ong.nome || "-";
    document.getElementById("ong-email").textContent = ong.email || "-";
    document.getElementById("ong-cnpj").textContent = ong.cnpj || "-";
    document.getElementById("ong-whatsapp").textContent = ong.whatsapp || "-";

    // Preenche o modal de edição
    document.getElementById("edit-ong-nome").value = ong.nome || "";
    document.getElementById("edit-ong-email").value = ong.email || "";
    document.getElementById("edit-ong-cnpj").value = ong.cnpj || "";
    document.getElementById("edit-ong-whatsapp").value = ong.whatsapp || "";
}

/**
 * Salva os dados atualizados da ONG no backend
 */
async function salvarDadosONG(e) {
    e.preventDefault();
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const ongId = ong.id;

    if (!ongId) {
        alert("Erro: ID da ONG não encontrado.");
        return;
    }

    const dadosAtualizados = {
        nome: document.getElementById("edit-ong-nome").value.trim(),
        email: document.getElementById("edit-ong-email").value.trim(),
        cnpj: document.getElementById("edit-ong-cnpj").value.trim(),
        whatsapp: document.getElementById("edit-ong-whatsapp").value.trim()
    };

    try {
        const response = await axios.put(
            `https://tcc-3-ds-etec.onrender.com/ongs/${ongId}`,
            dadosAtualizados
        );

        // Atualiza o localStorage com os dados novos
        localStorage.setItem("ongLogada", JSON.stringify(response.data.ong || response.data));

        carregarDadosONG();
        fecharModal('modal-ong');
        alert("Dados da ONG atualizados com sucesso!");

    } catch (error) {
        console.error("Erro ao atualizar ONG:", error.response || error);
        const msg = error.response?.data?.error || "Erro desconhecido.";
        alert(`Falha ao atualizar: ${msg}`);
    }
}

/**
 * Abre o modal de edição da ONG
 */
function abrirModalONG() {
    carregarDadosONG(); // garante que os campos estão com os dados mais recentes
    abrirModal('modal-ong');
}