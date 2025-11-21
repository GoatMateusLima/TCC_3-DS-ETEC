const db = require('../../config/dbClient');
const { deletePetImage } = require('../../services/supabaseService'); // CAMINHO CORRIGIDO

async function deletePet(req, res) {
    console.log('[INFO] Requisição recebida para deleção de Pet');
    try {
        const petId = req.params.id; 
        const { id_ong } = req.body;
        const ong_id = id_ong; 

        if (!ong_id) {
            return res.status(400).json({ error: 'ID da ONG é obrigatório.' });
        }

        // 1. Verifica se o pet pertence à ONG e pega o link_img
        const { data: pet, error: petError } = await db
            .from('animal')
            .select('ong_id, link_img')
            .eq('animal_id', petId)
            .single();

        if (petError || !pet || pet.ong_id !== ong_id) {
            return res.status(403).json({ error: 'Acesso negado. Este pet não pertence à sua ONG ou não existe.' });
        }
        
        // 2. Deleta a imagem do Supabase Storage
        if (pet.link_img) {
            await deletePetImage(pet.link_img);
        }

        // 3. Executa a deleção no banco
        const { error: deleteError } = await db.from('animal').delete().eq('animal_id', petId); 
        if (deleteError) {
            console.error('[ERRO] Falha ao deletar Pet no banco:', deleteError.message);
            return res.status(500).json({ error: 'Erro ao deletar pet.' });
        }

        console.log('[SUCESSO] Pet deletado:', petId);
        res.status(200).json({ message: 'Pet deletado com sucesso.' });
    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no deletePet:', err.message);
        res.status(500).json({ error: 'Erro interno ao deletar pet.' });
    }
}

module.exports = deletePet;