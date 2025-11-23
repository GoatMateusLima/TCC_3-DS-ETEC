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

        console.log("[DEBUG] Resposta do backend:", data);

        if (!data || !data.tipo || !data.dados) {
            alert("Erro: resposta do backend inválida.");
            return;
        }

        // Sanitiza: remove senha e dados sensíveis
        const rawInfo = data.dados || {};
        const info = { ...rawInfo };
        delete info.senha;

        // Garante um id canônico
        info.id = info.id || info.ong_id || info.adotante_id || info.membro_id || null;

        if (!info.id) {
            console.error("[ERRO] ID do usuário não encontrado:", info);
            alert("Erro: ID do usuário não encontrado.");
            return;
        }

        // Salva no localStorage de forma consistente
        const usuarioStorage = {
            tipo: data.tipo,
            info
        };
        localStorage.setItem('usuarioAtual', JSON.stringify(usuarioStorage));

        // Salva também para scripts antigos que esperam objetos separados
        switch (data.tipo) {
            case 'ong':
                localStorage.setItem('ongLogada', JSON.stringify({ id: info.id, nome: info.nome || '' }));
                break;
            case 'membro':
                localStorage.setItem('membroLogado', JSON.stringify({ id: info.id, nome: info.nome || '' }));
                break;
            case 'adotante':
                localStorage.setItem('adotanteLogado', JSON.stringify({ id: info.id, nome: info.nome || '' }));
                break;
            default:
                console.warn("[WARN] Tipo de usuário desconhecido:", data.tipo);
        }

        console.log(`[INFO] Login OK - tipo: ${data.tipo}, id: ${info.id}`);

        alert(data.message || 'Login realizado com sucesso.');

        // Redirecionamento
        switch (data.tipo) {
            case 'ong':
                window.location.href = '/src/pages/user/ong.html';
                break;
            case 'membro':
                window.location.href = '/src/pages/user/membro_ong.html';
                break;
            case 'adotante':
                window.location.href = '/index.html';
                break;
            default:
                alert('Tipo de usuário desconhecido.');
                window.location.href = '/src/pages/login/login.html';
        }

    } catch (error) {
        console.error('[ERRO] Falha no login:', error.response?.data || error);
        alert(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
}

// --- adiciona listener ao form ---
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    if (formLogin) formLogin.addEventListener('submit', fazerLogin);
});
