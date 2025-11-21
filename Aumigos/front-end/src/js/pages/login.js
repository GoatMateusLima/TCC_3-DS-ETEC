// /src/js/login.js
async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert('Preencha email e senha.');
        return;
    }

    try {
        const response = await axios.post('https://tcc-3-ds-etec.onrender.com/login', { email, senha });
        const data = response.data;

        console.log("LOGIN RECEBIDO:", data);

        if (!data.tipo || !data.usuario && !data.dados) {
            alert("Erro: resposta do backend inválida.");
            return;
        }

        // --- garantir compatibilidade com ong.js ---
        const usuarioStorage = {
            tipo: data.tipo,
            info: data.usuario || data.dados || {} // ⚡ sempre salva como info
        };

        localStorage.setItem('usuarioAtual', JSON.stringify(usuarioStorage));

        alert(data.message || 'Login realizado com sucesso.');

        // --- redirecionamento ---
        if (data.tipo === 'ong') {
            window.location.href = '/src/pages/user/ong.html';
        } else if (data.tipo === 'adotante') {
            window.location.href = '/index.html';
        } else {
            alert('Tipo de usuário desconhecido.');
            window.location.href = '/src/pages/login/login.html';
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error);
        alert(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
}

// --- adicionar listener ao form ---
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    if (formLogin) formLogin.addEventListener('submit', fazerLogin);
});
