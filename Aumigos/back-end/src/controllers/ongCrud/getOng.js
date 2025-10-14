const db = require('../../config/dbClient');

async function getOngs(req, res) {
    try {
        const { status_validacao } = req.query; // opcional, filtra por status
        let query = db.from('ong').select('*');
        if (status_validacao) query = query.eq('status_validacao', status_validacao);

        const { data, error } = await query;

        if (error) return res.status(500).json({ error: 'Erro ao buscar ONGs.', details: error });

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar ONGs.' });
    }
}

module.exports = getOngs;
