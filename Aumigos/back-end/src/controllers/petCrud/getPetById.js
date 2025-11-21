const db = require('../../config/dbClient');

async function getPetById(req, res) {
    console.log('[INFO] Requisição recebida para buscar Pet por ID');
    try {
        const petId = req.params.id;
        const { ong_id } = req.query; 

        if (!petId || !ong_id) {
            return res.status(400).json({ error: 'ID do pet e ID da ONG são obrigatórios.' });
        }

        // Busca o pet vinculado à ONG
        const { data, error } = await db
            .from('animal')
            .select('*')
            .eq('animal_id', petId) 
            .eq('ong_id', ong_id)   
            .single();

        if (error && error.code !== 'PGRST116') { 
            return res.status(500).json({ error: 'Erro ao buscar pet no banco de dados.' });
        }

        if (!data) {
            return res.status(404).json({ error: 'Pet não encontrado ou não pertence à ONG.' });
        }

        console.log('[SUCESSO] Pet encontrado:', data);
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