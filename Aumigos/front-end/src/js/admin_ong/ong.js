document.addEventListener("DOMContentLoaded", function () {
    carregarDadosONG();

    const formOng = document.getElementById('form-ong');
    if (formOng) {
        formOng.addEventListener('submit', salvarDadosONG);
    }

    if (typeof carregarMembros === 'function') carregarMembros();
    if (typeof carregarAnimais === 'function') carregarAnimais();
    if (typeof carregarAdocoes === 'function') carregarAdocoes();
});

/**
 * Carrega e exibe os dados da ONG logada
 */
function carregarDadosONG() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");

    // Se não existir nome → erro direto, sem frescura
    if (!ong.nome) {
        alert("Erro grave: Nenhuma ONG carregada. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    // Nome REAL da ONG
    const nomeOng = ong.nome.trim();

    document.title = `${nomeOng} - ADMIN`;

    // Todos os lugares onde aparece "ong-name"
    document.querySelectorAll(".ong-name").forEach(el => el.textContent = nomeOng);

    // Informações principais
    document.getElementById("ong-nome").textContent = ong.nome;
    document.getElementById("ong-email").textContent = ong.email || "-";
    document.getElementById("ong-cnpj").textContent = ong.cnpj || "-";
    document.getElementById("ong-whatsapp").textContent = ong.whatsapp || "-";

    // Modal de edição
    document.getElementById("edit-ong-nome").value = ong.nome;
    document.getElementById("edit-ong-email").value = ong.email || "";
    document.getElementById("edit-ong-cnpj").value = ong.cnpj || "";
    document.getElementById("edit-ong-whatsapp").value = ong.whatsapp || "";
}

/**
 * Salva os dados atualizados da ONG
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

        localStorage.setItem("ongLogada", JSON.stringify(response.data.ong || response.data));

        carregarDadosONG();
        fecharModal('modal-ong');
        alert("Dados atualizados com sucesso!");

    } catch (error) {
        console.error("Erro ao atualizar ONG:", error.response || error);
        alert("Falha ao atualizar a ONG.");
    }
}

/**
 * Abre o modal
 */
function abrirModalONG() {
    carregarDadosONG();
    abrirModal('modal-ong');
}
