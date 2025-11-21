const db = require('../../config/dbClient');
const { uploadPetImage } = require('../../services/supabaseService'); // CAMINHO CORRIGIDO

async function createPet(req, res) {
    console.log('[INFO] Requisição recebida para criação de Pet com Imagem');

    // Assumimos que o Multer processou o arquivo e está em req.file
    const file = req.file; 

    // Mapeamento dos campos do frontend para o SQL
    let { 
        id_ong, nome, especie, raca, idade, genero, descricao, status_adocao 
    } = req.body;
    
    // Nomes alinhados ao SQL
    const ong_id = id_ong; 
    const sexo = genero;
    const data_entrada = new Date();
    
    let petCriado = null;
    let urlImagem = null; 

    try {
        // 1. Validação de Campos
        if (!ong_id || !nome || !especie || !descricao || !sexo || !file) {
            console.error('[ERRO] Campos obrigatórios faltando.');
            return res.status(400).json({ error: 'Campos obrigatórios faltando, incluindo a imagem.' });
        }

        // 2. Verifica se ONG existe e está validada
        const { data: ong, error: ongError } = await db
            .from('ong')
            .select('ong_id, status_validacao')
            .eq('ong_id', ong_id)
            .single();

        if (ongError || !ong) {
            return res.status(400).json({ error: 'ONG não encontrada.' });
        }
        if (ong.status_validacao !== 'aprovado') {
             return res.status(403).json({ error: 'ONG ainda não validada para cadastrar pets.' });
        }

        // 3. Cria o Pet no Banco de Dados SEM A IMAGEM (para obter o animal_id)
        const petData = {
            ong_id, nome, especie, raca, idade, sexo, descricao, data_entrada,
            status_adocao: status_adocao || 'disponivel', 
        };
        
        const { data: dataInsert, error: insertError } = await db
            .from('animal')
            .insert([petData])
            .select('animal_id');

        if (insertError) throw insertError;

        petCriado = dataInsert[0];
        const animal_id = petCriado.animal_id;
        console.log(`[DEBUG] Pet criado temporariamente com animal_id: ${animal_id}`);


        // 4. Upload da Imagem para o Supabase Storage (com resize)
        urlImagem = await uploadPetImage(file.buffer, file.originalname, animal_id);

        if (!urlImagem) {
            throw new Error("Falha ao obter URL da imagem após o upload.");
        }
        console.log(`[DEBUG] URL da Imagem obtida: ${urlImagem}`);


        // 5. Atualiza o Pet no Banco com o Link da Imagem (link_img)
        const { data: dataUpdate, error: updateError } = await db
            .from('animal')
            .update({ link_img: urlImagem }) // Alinhado ao SQL: link_img
            .eq('animal_id', animal_id)
            .select();

        if (updateError) throw updateError;


        console.log('[SUCESSO] Pet cadastrado e imagem salva:', dataUpdate[0]);
        res.status(201).json({
            message: 'Pet cadastrado com sucesso!',
            pet: dataUpdate[0]
        });

    } catch (err) {
        console.error('[ERRO FATAL] Falha no fluxo de criação:', err.message);
        
        // ROLLBACK
        if (petCriado && petCriado.animal_id) {
            console.warn(`[ROLLBACK] Deletando pet ID ${petCriado.animal_id} devido a erro.`);
            await db.from('animal').delete().eq('animal_id', petCriado.animal_id);
        }
        
        res.status(500).json({ 
            error: 'Erro interno ao cadastrar pet. Falha no banco ou upload da imagem.', 
            details: err.message 
        });
    }
}

module.exports = createPet;