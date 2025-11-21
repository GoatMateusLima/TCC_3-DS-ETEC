const db = require('../../config/dbClient');

async function deleteOng(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await db.from('ong').delete().eq('ong_id', id);

        if (error) return res.status(500).json({ error: 'Erro ao deletar ONG.', details: error });

        res.status(200).json({ message: 'ONG deletada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao deletar ONG.' });
    }
}

module.exports = deleteOng;
