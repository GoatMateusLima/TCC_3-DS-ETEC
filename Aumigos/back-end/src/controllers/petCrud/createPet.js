const db = require('../../config/dbClient');
const { uploadPetImage } = require('../../services/supabaseService');

async function createPet(req, res) {
    console.log('[INFO] Requisição recebida para criação de Pet com Imagem');

    const file = req.file;
    let { id_ong, ong_id: body_ong_id, nome, especie, raca, sexo, descricao, status, idade} = req.body;

    const ong_id = body_ong_id || id_ong || req.body.ongId || null;
    const data_entrada = new Date();

    console.debug('[DEBUG createPet] req.body keys:', Object.keys(req.body));
    console.debug('[DEBUG createPet] parsed values:', { ong_id, nome, especie, raca, sexo, descricao, status, idade });
    if (file) console.debug('[DEBUG createPet] req.file info:', { originalname: file.originalname, mimetype: file.mimetype, size: file.size });

    let petCriado = null;

    try {
        // 1. Validação
        if (!ong_id || !nome || !especie || !raca || !sexo || !file) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando: ong_id, nome, especie, raca, sexo e imagem.' });
        }

        // 2. Verifica ONG
        const { data: ong, error: ongError } = await db
            .from('ong')
            .select('ong_id, status_registro')
            .eq('ong_id', ong_id)
            .single();

        if (ongError || !ong) {
            return res.status(400).json({ error: 'ONG não encontrada.' });
        }
        if (ong.status_registro !== true) {
            return res.status(403).json({ error: 'ONG ainda não validada para cadastrar pets.' });
        }

        // 3. Cria Pet sem imagem
        const petData = { ong_id, nome, especie, raca, sexo, descricao, data_entrada, link_img: null };
        const { data: dataInsert, error: insertError } = await db
            .from('animal')
            .insert([petData])
            .select('animal_id');

        if (insertError) throw insertError;

        petCriado = dataInsert[0];
        const animal_id = petCriado.animal_id;

        // 4. Upload da imagem
        const urlImagem = await uploadPetImage(file.buffer, file.originalname, animal_id);
        if (!urlImagem) throw new Error("Falha ao obter URL da imagem após o upload.");

        // 5. Atualiza Pet com link da imagem
        const { data: dataUpdate, error: updateError } = await db
            .from('animal')
            .update({ link_img: urlImagem })
            .eq('animal_id', animal_id)
            .select();

        if (updateError) throw updateError;

        res.status(201).json({ message: 'Pet cadastrado com sucesso!', pet: dataUpdate[0] });

    } catch (err) {
        console.error('[ERRO FATAL] Falha no fluxo de criação:', err.message);

        if (petCriado && petCriado.animal_id) {
            await db.from('animal').delete().eq('animal_id', petCriado.animal_id);
        }

        res.status(500).json({ error: 'Erro interno ao cadastrar pet.', details: err.message });
    }
}

module.exports = createPet;
