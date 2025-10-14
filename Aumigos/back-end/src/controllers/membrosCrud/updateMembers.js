const db = require('../../config/dbClient');

async function updateMember(req, res) {
    try {
        const memberId = req.params.id;
        const { nome, cpf, email, whatsapp, data_entrada, funcao } = req.body;

        const { data, error } = await db
            .from('membros_ong')
            .update({ nome, cpf, email, whatsapp, data_entrada, funcao })
            .eq('membro_id', memberId)
            .select();

        if (error) {
            console.error('Erro ao atualizar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar membro.' });
        }

        res.status(200).json(data[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = updateMember;
