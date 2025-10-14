const db = require('../../config/dbClient');

async function getAdotantes(req, res) {
    try {
        const { id } = req.params;

        if (id) {
            const { data, error } = await db.from('adotante').select('*').eq('id', id).single();
            if (error || !data) return res.status(404).json({ error: 'Adotante não encontrado.' });
            return res.status(200).json(data);
        }

        const { data, error } = await db.from('adotante').select('*');
        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar adotantes.' });
    }
}

module.exports = getAdotantes;
