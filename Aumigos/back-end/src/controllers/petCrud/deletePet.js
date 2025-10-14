const db = require('../../config/dbClient');

async function deletePet(req, res) {
    try {
        const { id } = req.params;
        const { id_ong } = req.body;

        if (!id_ong) return res.status(400).json({ error: 'ID da ONG é obrigatório.' });

        const { data: pet } = await db.from('animal').select('id_ong').eq('id', id).single();

        if (!pet || pet.id_ong !== id_ong)
            return res.status(403).json({ error: 'Acesso negado. Este pet não pertence à sua ONG.' });

        const { error } = await db.from('animal').delete().eq('id', id);
        if (error) throw error;

        res.status(200).json({ message: 'Pet deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao deletar pet.' });
    }
}

module.exports = deletePet;
