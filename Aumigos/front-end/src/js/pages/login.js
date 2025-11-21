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
        const response = await axios.post('/login', { email, senha });
        const data = response.data;

        console.log("LOGIN RECEBIDO:", data);

        if (!data || !data.tipo || !data.dados) {
            alert("Erro: resposta do backend inválida.");
            return;
        }

        // sanitize: não armazenar senha nem dados sensíveis
        const rawInfo = data.dados || {};
        const info = { ...rawInfo };
        delete info.senha;

        // garante um campo id canônico para uso front-end (id)
        info.id = info.id || info.ong_id || info.adotante_id || info.membro_id || null;

        const usuarioStorage = {
            tipo: data.tipo,
            info
        };

        // salva de forma compatível com código existente
        localStorage.setItem('usuarioAtual', JSON.stringify(usuarioStorage));
        if (data.tipo === 'ong') {
            // alguns scripts antigos esperam 'ongLogada' com ao menos { id }
            localStorage.setItem('ongLogada', JSON.stringify({ id: info.id, nome: info.nome || '' }));
        }

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
