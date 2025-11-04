document.addEventListener("DOMContentLoaded", () => {
    const formAdotante = document.querySelector(".form-adotante");
    const formOng = document.querySelector(".form-ong");

    async function enviarCadastro(url, dados, tipo) {
        try {
            const response = await axios.post(url, dados);
            alert(`${tipo} cadastrado com sucesso!`);
            console.log(response.data);

            if (tipo === "Adotante") {
                window.location.href = "";
            }
        }
    }