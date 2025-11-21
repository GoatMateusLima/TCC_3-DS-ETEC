const db = require('../../config/dbClient');

async function getMembers(req, res) {
    try {
        // aceita variações: ong_id, id_ong, ongId
        const ongId = req.query.ong_id || req.query.id_ong || req.query.ongId;
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

        const safe = data.map(d => {
            const x = { ...d };
            delete x.senha;
            return x;
        });

        res.status(200).json(safe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = getMembers;
