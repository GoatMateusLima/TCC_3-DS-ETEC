const db = require('../../config/dbClient');

async function deleteAdotante(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await db.from('adotante').delete().eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Conta do adotante deletada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao deletar adotante.' });
    }
}

module.exports = deleteAdotante;
