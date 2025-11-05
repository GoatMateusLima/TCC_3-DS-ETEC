// cadastro.js
document.addEventListener("DOMContentLoaded", () => {
    const formAdotante = document.querySelector(".form-adotante");
    const formOng = document.querySelector(".form-ong");

    // ---------- CADASTRO ADOTANTE ----------
    if (formAdotante) {
        formAdotante.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = formAdotante.querySelector("input[type='text']").value.trim();
            const cpf = formAdotante.querySelector("input[type='number']").value.trim();
            const email = formAdotante.querySelector("input[type='text']").value.trim();
            const whatsapp = formAdotante.querySelector("input[max='15']").value.trim();
            const dataNascimento = formAdotante.querySelector("input[type='date']").value;

            if (!nome || !cpf || !email || !whatsapp || !dataNascimento) {
                alert("Preencha todos os campos obrigatórios!");
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/adotante", {
                    nome,
                    cpf,
                    email,
                    whatsapp,
                    data_nascimento: dataNascimento
                });

                alert(response.data.message);
                // Redireciona para tela de login ou perfil
                window.location.href = "login.html"; 
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.error || "Erro ao cadastrar adotante");
            }
        });
    }

    // ---------- CADASTRO ONG ----------
    if (formOng) {
        formOng.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = formOng.querySelector("input[type='text']").value.trim();
            const email = formOng.querySelector("input[type='email']").value.trim();
            const cnpj = formOng.querySelector("input[type='number']").value.trim();
            const whatsapp = formOng.querySelectorAll("input[type='number']")[1].value.trim();
            const senha = formOng.querySelector("input[type='password']").value.trim();

            if (!nome || !email || !cnpj || !whatsapp || !senha) {
                alert("Preencha todos os campos obrigatórios!");
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/ongs", {
                    nome,
                    email,
                    cnpj,
                    whatsapp,
                    senha
                });

                alert(response.data.message);
                // Redireciona para página de administração da ONG
                window.location.href = "admin_ong.html"; 
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.error || "Erro ao cadastrar ONG");
            }
        });
    }
});
