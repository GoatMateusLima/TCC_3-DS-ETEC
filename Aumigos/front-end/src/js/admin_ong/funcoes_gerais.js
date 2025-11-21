// ============= FUNÇÕES GERAIS =============

/**
 * Abre o modal especificado.
 * @param {string} id - O ID do elemento modal.
 */
function abrirModal(id) {
    document.getElementById(id).style.display = "flex";
}

/**
 * Fecha o modal especificado e limpa seus campos de formulário.
 * @param {string} id - O ID do elemento modal.
 */
function fecharModal(id) {
    document.getElementById(id).style.display = "none";
    // Limpa os campos do formulário
    document.querySelectorAll(`#${id} input, #${id} textarea`).forEach(i => i.value = "");
    document.querySelectorAll(`#${id} [id$="-id"]`).forEach(i => i.value = "");
}

/**
 * Filtra as linhas de uma tabela com base no texto de busca.
 * @param {string} tabelaId - O ID da tabela.
 * @param {string} texto - O texto a ser procurado.
 */
function filtrarTabela(tabelaId, texto) {
    const trs = document.querySelectorAll(`#${tabelaId} tbody tr`);
    texto = texto.toLowerCase();
    trs.forEach(tr => {
        const conteudo = tr.textContent.toLowerCase();
        tr.style.display = conteudo.includes(texto) ? "" : "none";
    });
}

/**
 * Função de Logout (remove ONG do localStorage e redireciona)
 */
function logout() {
    localStorage.removeItem("ongLogada");
    localStorage.removeItem("usuarioAtual");
    // redireciona para tela de login
    window.location.href = "/src/pages/login/login.html";
}

// ============= NAVEGAÇÃO POR HASH =============
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".faq-link");
    const sections = document.querySelectorAll(".container-info-faq > section");

    function mostrarSecao(id) {
        links.forEach(l => l.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));
        document.querySelector(`a[data-target="${id}"]`)?.classList.add("active");
        document.getElementById(id)?.classList.add("active");
    }

    links.forEach(l => l.addEventListener("click", e => {
        e.preventDefault();
        const target = l.dataset.target;
        mostrarSecao(target);
        history.pushState(null, null, `#${target}`);
    }));

    const hash = location.hash.replace("#", "") || "Membros";
    mostrarSecao(hash);

    window.addEventListener("hashchange", () => mostrarSecao(location.hash.replace("#", "") || "Membros"));
});