async function fazerLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    try {
        const response = await axios.post('https://tcc-3-ds-etec.onrender.com/login', { email, senha });

        // debug: ver exatamente o que o servidor retornou
        console.log('login response.data ->', response.data);

        const data = response.data;

        // Normaliza possíveis formatos de resposta:
        // - { tipo: 'ong', ong: { ong_id, nome, ... }, message }
        // - { tipo: 'ong', usuario: { ... } , message }
        // - ou retorna o próprio objeto da ong (com ong_id) sem "ong" wrapper
        let tipo = data.tipo || data.type || null;
        let ongObj = null;

        if (data.ong) ongObj = data.ong;
        else if (data.usuario) ongObj = data.usuario;
        else if (data.adotante) ongObj = data.adotante;
        else if (data.ong_id || data.nome) ongObj = data; // servidor pode ter retornado diretamente o objeto

        // fallback: se nao encontrou tipo, tenta inferir
        if (!tipo && ongObj) tipo = 'ong';

        if (!tipo) {
            console.error('Resposta de login sem "tipo":', data);
            alert('Resposta inválida do servidor. Veja console.');
            return;
        }

        // Extrai id e nome nos possíveis campos
        const id = ongObj?.ong_id ?? ongObj?.id ?? ongObj?.membro_id ?? null;
        const nome = ongObj?.nome ?? ongObj?.nomeOng ?? null;

        // Salva no localStorage no formato que seus scripts esperam (chave "usuario")
        const usuarioLocal = { tipo, id, nome };
        localStorage.setItem('usuario', JSON.stringify(usuarioLocal));

        // também salva ongLogada minimal se for ONG (compatibilidade com código antigo)
        if (tipo === 'ong') {
            localStorage.setItem('ongLogada', JSON.stringify({ id, nome }));
        }

        // mostra mensagem do servidor se tiver
        if (data.message) alert(data.message);

        // redireciona conforme tipo
        if (tipo === 'ong') {
            window.location.href = '/src/pages/user/ong.html';
            return;
        }
        if (tipo === 'adotante') {
            window.location.href = '/index.html';
            return;
        }

        // caso algum outro tipo apareça
        console.warn('Tipo de usuário inesperado:', tipo);
        alert('Login realizado, mas tipo de usuário inesperado. Verifique.');
    } catch (error) {
        console.error('Erro ao fazer login:', error.response?.data || error);
        alert(error.response?.data?.message || 'Erro ao conectar com o servidor.');
    }
}
