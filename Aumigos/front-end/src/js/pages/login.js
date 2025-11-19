async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
        const response = await axios.post('https://tcc-3-ds-etec.onrender.com/login', { email, senha });
        const data = response.data;

        // ✅ Salvando informações do usuário no localStorage
        localStorage.setItem('usuarioAtual', JSON.stringify({
            tipo: data.tipo,
            info: data.usuario
        }));

        alert(data.message);

        if (data.tipo === 'ong') {
            window.location.href = '/src/pages/user/ong.html';
        } else if (data.tipo === 'adotante') {
            window.location.href = '/src/pages/user/adotante.html';
        }

    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error);
        alert(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
}
