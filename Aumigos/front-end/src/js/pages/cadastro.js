// ======================
// Cadastro Adotante
// ======================
document.getElementById('formAdotante').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAdotante').value.trim();
    const cpf = document.getElementById('cpfAdotante').value.trim();
    const email = document.getElementById('emailAdotante').value.trim();
    const senha = document.getElementById('senhaAdotante').value.trim();
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

        // Limpar formulário
        e.target.reset();

    } catch (error) {
        console.error('Erro ao cadastrar adotante:', error.response?.data || error);
        alert(error.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
});

// ======================
// Cadastro ONG
// ======================
document.getElementById('formOng').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeOng').value.trim();
    const email = document.getElementById('emailOng').value.trim();
    const senha = document.getElementById('senhaOng').value.trim();
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

        // Limpar formulário
        e.target.reset();

    } catch (error) {
        console.error('Erro ao cadastrar ONG:', error.response?.data || error);
        alert(error.response?.data?.error || 'Erro ao conectar com o servidor.');
    }
});
