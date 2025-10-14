const db = require('../../config/dbClient');

async function getPetById(req, res) {
    try {
        const petId = req.params.id;
        const ongId = req.query.ong_id; // ID da ONG logada

        // 1️⃣ Verificações básicas
        if (!petId) {
            return res.status(400).json({ error: 'ID do pet não informado.' });
        }

        if (!ongId) {
            return res.status(400).json({ error: 'ID da ONG não informado.' });
        }

        // 2️⃣ Busca o pet vinculado à ONG
        const { data, error } = await db
            .from('animal')
            .select('*')
            .eq('animal_id', petId)
            .eq('ong_id', ongId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 é "no rows returned"
            console.error('❌ Erro ao buscar pet:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar pet no banco de dados.' });
        }

        // 3️⃣ Caso o pet não exista ou não pertença à ONG
        if (!data) {
            return res.status(404).json({ error: 'Pet não encontrado ou não pertence à ONG.' });
        }

        // 4️⃣ Retorna o pet encontrado
        return res.status(200).json({
            message: 'Pet encontrado com sucesso.',
            pet: data
        });
    } catch (err) {
        console.error('⚠️ Erro inesperado:', err);
        return res.status(500).json({ error: 'Erro interno ao buscar pet.' });
    }
}

module.exports = { getPetById };
