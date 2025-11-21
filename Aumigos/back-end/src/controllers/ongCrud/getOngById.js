// controllers/ongCrud/getOngById.js
const db = require('../../config/dbClient');

async function getOngById(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: 'ID da ONG é obrigatório.' });

        const { data, error } = await db.from('ong').select('*').eq('id', id).single();

        if (error) return res.status(500).json({ error: 'Erro ao buscar ONG.', details: error });
        if (!data) return res.status(404).json({ error: 'ONG não encontrada.' });

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar ONG.' });
    }
}

module.exports = getOngById;
