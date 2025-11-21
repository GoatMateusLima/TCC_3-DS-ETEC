async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
        const response = await axios.post('https://tcc-3-ds-etec.onrender.com/login', { email, senha });
        const data = response.data;

        console.log("LOGIN RECEBIDO:", data);

        if (!data.usuario) {
            alert("Erro: backend não enviou usuário.");
            return;
        }

        // SALVA TUDO - COMPLETO
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        alert(data.message);

        // REDIRECIONA USANDO O CAMINHO CERTO: data.usuario.tipo
        if (data.usuario.tipo === 'ong') {
            window.location.href = '/src/pages/user/ong.html';

        } else if (data.usuario.tipo === 'adotante') {
            window.location.href = '/index.html';

        } else if (data.usuario.tipo === 'membro') {
            window.location.href = '/src/pages/user/membro_ong.html';
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error);
        alert(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
}
