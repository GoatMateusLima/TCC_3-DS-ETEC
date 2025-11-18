function verificarConta() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAtual"));

    // Se não tem ninguém logado → login
    if (!usuario || !usuario.tipo) {
        window.location.href = "http://localhost:5050/front-end/src/pages/login.html";
        return;
    }

    // Redireciona para a página do tipo
    switch (usuario.tipo) {
        case "adotante":
            window.location.href = "http://localhost:5050/front-end/src/pages/user/adotante.html";
            break;

        case "ong":
            window.location.href = "http://localhost:5050/front-end/src/pages/user/ong.html";
            break;

        case "membro":
            window.location.href = "http://localhost:5050/front-end/src/pages/user/membro_ong.html";
            break;

        default:
            window.location.href = "http://localhost:5050/front-end/src/pages/login.html";
            break;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btnDesktop = document.getElementById("btn-conta-desktop");
    const btnMobile = document.getElementById("btn-conta-mobile");

    if (btnDesktop) btnDesktop.addEventListener("click", verificarConta);
    if (btnMobile) btnMobile.addEventListener("click", verificarConta);
});