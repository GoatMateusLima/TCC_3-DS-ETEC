const db = require('../../config/dbClient');

async function getMemberById(req, res) {
    try {
        const memberId = req.params.id;
        const ongId = req.query.ong_id || req.query.id_ong || req.query.ongId; // do login

        if (!ongId) return res.status(400).json({ error: 'ONG não informada.' });

        // Supabase não suporta joins complexos em SQL puro, mas podemos filtrar pelo ong_id
        const { data, error } = await db
            .from('membros_ong')
            .select('*')
            .eq('membro_id', memberId)
            .eq('ong_id', ongId);

        if (error) {
            console.error('Erro ao buscar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar membro.' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Membro não encontrado ou não pertence à ONG.' });
        }

        const safe = { ...data[0] };
        delete safe.senha;
        res.status(200).json(safe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro inesperado.' });
    }
}

module.exports = { getMemberById };
