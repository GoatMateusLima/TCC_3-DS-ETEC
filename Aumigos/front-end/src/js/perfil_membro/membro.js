document.addEventListener("DOMContentLoaded", () => {
    console.log("[MEMBRO] Carregando nome...");

    // --- PEGAR MEMBRO ---
    const usuarioJSON = localStorage.getItem("usuarioAtual");
    if (!usuarioJSON) {
        alert("Faça login primeiro.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    let usuario;
    try {
        usuario = JSON.parse(usuarioJSON);
    } catch (err) {
        console.error("Erro ao ler usuarioAtual:", err);
        alert("Erro interno, faça login novamente.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    // Nome do membro
    const nomeMembro = usuario.info.nome || "Membro";

    // --- PEGAR NOME DA ONG ---
    const ongJSON = localStorage.getItem("ongLogada");
    let nomeOng = "ONG";

    if (ongJSON) {
        try {
            const ongInfo = JSON.parse(ongJSON);
            nomeOng = ongInfo.nome || "ONG";
        } catch (err) {
            console.error("Erro ao ler ongLogada:", err);
        }
    }

    console.log("Membro:", nomeMembro);
    console.log("ONG:", nomeOng);

    // Colocar os nomes na tela
    const elMembro = document.getElementById("membro-nome");
    const elOng = document.getElementById("ong-nome");

    if (elMembro) elMembro.textContent = nomeMembro;
    if (elOng) elOng.textContent = nomeOng;
});
