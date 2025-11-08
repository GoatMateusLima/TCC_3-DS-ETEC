// ======================
// Efeito Hacker Visual em Campo de Senha
// ======================
function aplicarEfeitoHackerSenha(inputId) {
    const input = document.getElementById(inputId);
    let valorReal = "";
    let animando = false;
    const simbolos = "!@#$%&*?<>/+=";

    input.addEventListener("input", (e) => {
        const novoTexto = e.target.value;
        const ultimoCaractere = novoTexto.slice(-1);

        if (novoTexto.length < valorReal.length) {
            valorReal = valorReal.slice(0, novoTexto.length);
        } else {
            valorReal += ultimoCaractere;
        }

        input.dataset.realValue = valorReal;

        // Efeito hacker piscando ao digitar
        if (!animando) {
            animando = true;
            let frame = 0;
            const totalFrames = 10;
            const animacao = setInterval(() => {
                let fake = "";
                for (let i = 0; i < valorReal.length; i++) {
                    fake += simbolos[Math.floor(Math.random() * simbolos.length)];
                }
                e.target.value = fake;
                frame++;
                if (frame >= totalFrames) {
                    clearInterval(animacao);
                    e.target.value = "*".repeat(valorReal.length);
                    animando = false;
                }
            }, 30);
        }
    });

    input.addEventListener("focusout", () => {
        input.value = "*".repeat((input.dataset.realValue || "").length);
    });
}

// ======================
// Cadastro Adotante
// ======================
document.getElementById('formAdotante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAdotante').value.trim();
    const cpf = document.getElementById('cpfAdotante').value.trim();
    const email = document.getElementById('emailAdotante').value.trim();
    const senhaInput = document.getElementById('senhaAdotante');
    const senha = senhaInput.dataset.realValue || senhaInput.value.trim();
    const whatsapp = document.getElementById('whatsappAdotante').value.trim();
    const dataNascimento = document.getElementById('dataNascimentoAdotante').value;

    if (!nome || !cpf || !email || !senha) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/adotante', {
            nome,
            cpf,
            email,
            senha,
            whatsapp,
            data_nascimento: dataNascimento
        });

        const data = response.data;
        alert(data.message || 'Cadastro realizado com sucesso!');
        e.target.reset();
    } catch (error) {
        console.error('Erro ao cadastrar adotante:', error.response?.data || error);
        alert(error.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
});

// ======================
// Cadastro ONG
// ======================

// 🔹 Bloqueia caracteres não numéricos no campo CNPJ
document.getElementById('cnpjOng').addEventListener('input', (e) => {
    const campo = e.target;
    campo.value = campo.value.replace(/\D/g, '');
    if (campo.value.length > 14) campo.value = campo.value.slice(0, 14);
});

document.getElementById('formOng').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeOng').value.trim();
    const email = document.getElementById('emailOng').value.trim();
    const senhaInput = document.getElementById('senhaOng');
    const senha = senhaInput.dataset.realValue || senhaInput.value.trim();
    const cnpj = document.getElementById('cnpjOng').value.trim();
    const whatsapp = document.getElementById('whatsappOng').value.trim();

    if (!nome || !email || !senha || !cnpj) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/ongs', {
            nome,
            email,
            senha,
            cnpj,
            whatsapp
        });

        const data = response.data;
        alert(data.message || 'ONG cadastrada com sucesso!');
        e.target.reset();
    } catch (error) {
        console.error('Erro ao cadastrar ONG:', error.response?.data || error);
        alert(error.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
});

// ======================
// Inicializar efeitos de senha com digitação hacker
// ======================
aplicarEfeitoHackerSenha("senhaAdotante");
aplicarEfeitoHackerSenha("senhaOng");
