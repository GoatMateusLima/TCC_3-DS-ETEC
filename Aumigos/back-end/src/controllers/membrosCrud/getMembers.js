const db = require('../../config/dbClient');

async function getMembers(req, res) {
    try {
        const ongId = req.query.ong_id;
        if (!ongId) return res.status(400).json({ error: 'ONG não informada.' });

        const { data, error } = await db
            .from('membros_ong')
            .select('*')
            .eq('ong_id', ongId)
            .order('data_entrada', { ascending: false });

        if (error) {
            console.error('Erro ao buscar membros:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar membros.' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = getMembers;
