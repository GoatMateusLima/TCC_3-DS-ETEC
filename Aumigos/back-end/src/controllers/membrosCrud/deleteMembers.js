const db = require('../../config/dbClient');

async function deleteMember(req, res) {
    try {
        const memberId = req.params.id;

        const { data, error } = await db
            .from('membros_ong')
            .delete()
            .eq('membro_id', memberId);

        if (error) {
            console.error('Erro ao deletar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao deletar membro.' });
        }

        res.status(200).json({ message: 'Membro deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = deleteMember;
