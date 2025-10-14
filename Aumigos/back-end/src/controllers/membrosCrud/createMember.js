const db = require('../../config/dbClient');

async function createMember(req, res) {
    try {
        const { nome, cpf, email, whatsapp, data_entrada, funcao, ong_id } = req.body;

        if (!ong_id) return res.status(400).json({ error: 'ONG não informada.' });

        const { data, error } = await db
            .from('membros_ong')
            .insert([{ nome, cpf, email, whatsapp, data_entrada, funcao, ong_id }])
            .select();

        if (error) {
            console.error('Erro ao criar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao criar membro.' });
        }

        res.status(201).json(data[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = createMember;
