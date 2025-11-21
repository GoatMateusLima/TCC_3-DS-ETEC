const db = require('../../config/dbClient');
const { uploadPetImage, deletePetImage } = require('../../services/supabaseService'); // CAMINHO CORRIGIDO

async function updatePet(req, res) {
    console.log('[INFO] Requisição recebida para atualização de Pet com Imagem');
    
    const file = req.file; 

    try {
        const petId = req.params.id;
        
        const { id_ong, nome, especie, raca, idade, genero, descricao, status_adocao } = req.body;
        const ong_id = id_ong; 

        if (!ong_id) {
            return res.status(400).json({ error: 'ID da ONG é obrigatório.' });
        }

        // 1. Busca o Pet e Verifica a Permissão
        const { data: petExistente, error: petError } = await db
            .from('animal')
            .select('ong_id, link_img') 
            .eq('animal_id', petId)
            .single();

        if (petError || !petExistente || petExistente.ong_id !== ong_id) {
            return res.status(403).json({ error: 'Acesso negado. Este pet não pertence à sua ONG ou não existe.' });
        }

        // 2. Prepara os dados para atualização (Mapeando para o SQL)
        const updateData = { nome, especie, raca, idade, descricao, status_adocao };

        if (genero) updateData.sexo = genero;
        
        let novoLinkImagem = petExistente.link_img;

        // 3. Lógica de Atualização da Imagem
        if (file) {
            console.log('[DEBUG] Nova imagem detectada. Processando upload...');
            
            // a. Deleta a Imagem Antiga
            if (petExistente.link_img) {
                await deletePetImage(petExistente.link_img);
            }

            // b. Faz o Upload da Nova Imagem
            novoLinkImagem = await uploadPetImage(file.buffer, file.originalname, petId);

            if (!novoLinkImagem) {
                throw new Error("Falha ao obter URL da nova imagem após o upload.");
            }
            
            // c. Adiciona o novo link aos dados de atualização
            updateData.link_img = novoLinkImagem;
        }


        // 4. Executa a Atualização no Banco
        const { data, error } = await db
            .from('animal')
            .update(updateData)
            .eq('animal_id', petId)
            .select();

        if (error) throw error;

        console.log('[SUCESSO] Pet atualizado:', data[0]);
        res.status(200).json({ message: 'Pet atualizado com sucesso.', pet: data[0] });

    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no updatePet:', err.message);
        res.status(500).json({ error: 'Erro interno ao atualizar pet.', details: err.message });
    }
}

module.exports = updatePet;