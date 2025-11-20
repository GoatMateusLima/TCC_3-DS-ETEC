document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".faq-link");
    const sections = document.querySelectorAll(".container-info-faq > section");

    function mostrarSecao(targetId) {
        // Remove active de todos os links e seções
        links.forEach(link => link.classList.remove("active"));
        sections.forEach(sec => sec.classList.remove("active"));

        // Adiciona active no link e na seção certa
        const linkAtivo = document.querySelector(`a[data-target="${targetId}"]`);
        const secaoAtiva = document.getElementById(targetId);

        if (linkAtivo) linkAtivo.classList.add("active");
        if (secaoAtiva) secaoAtiva.classList.add("active");
    }

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const target = this.getAttribute("data-target");
            mostrarSecao(target);
        });
    });

    // Mostra a primeira aba ao carregar
    const primeiro = document.querySelector(".faq-link");
    if (primeiro) mostrarSecao(primeiro.getAttribute("data-target"));
});