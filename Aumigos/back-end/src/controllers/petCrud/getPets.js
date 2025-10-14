const db = require('../../config/dbClient');

async function getPets(req, res) {
    try {
        const { id } = req.params;
        const { id_ong, especie, status } = req.query;

        if (id) {
            const { data, error } = await db.from('animal').select('*').eq('id', id).single();
            if (error || !data) return res.status(404).json({ error: 'Pet não encontrado.' });
            return res.status(200).json(data);
        }

        let query = db.from('animal').select('*');

        if (id_ong) query = query.eq('id_ong', id_ong);
        if (especie) query = query.ilike('especie', `%${especie}%`);
        if (status) query = query.eq('status_adocao', status);

        const { data, error } = await query;
        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao listar pets.' });
    }
}

module.exports = getPets;
