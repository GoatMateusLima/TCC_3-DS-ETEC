const { uploadPetImage } = require('../../services/supabaseService');
const supabase = require('../../config/dbClient');

async function createPet(req, res) {
    try {
        const { nome, especie, raca, sexo, descricao, data_entrada, ong_id } = req.body;
        const file = req.file;

        console.log('req.body:', req.body);
        console.log('req.file:', req.file);

        // Validação: imagem é obrigatória
        if (!file) {
            console.log('Erro: Nenhum arquivo enviado');
            return res.status(400).json({ error: 'Imagem do pet obrigatória' });
        }

        // Validação dos campos obrigatórios
        const missingFields = [];
        if (!nome) missingFields.push('nome');
        if (!especie) missingFields.push('especie');
        if (!raca) missingFields.push('raca');
        if (!sexo) missingFields.push('sexo');
        if (!descricao) missingFields.push('descricao');
        if (!data_entrada) missingFields.push('data_entrada');
        if (!ong_id) missingFields.push('ong_id');

        if (missingFields.length > 0) {
            console.log('Campos faltando:', missingFields);
            return res.status(400).json({ error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` });
        }

        // Upload da imagem
        console.log('Iniciando upload da imagem:', file.originalname);
        const imageUrl = await uploadPetImage(file.buffer, file.originalname, Date.now());
        console.log('Imagem enviada:', imageUrl);
        if (!imageUrl) {
            console.log('Erro: Falha ao obter URL da imagem');
            return res.status(500).json({ error: 'Falha ao enviar imagem do pet' });
        }

        // Inserir no Supabase
        console.log('Inserindo pet no Supabase com dados:', { nome, especie, raca, sexo, descricao, data_entrada, ong_id, link_img: imageUrl });
        const { data, error } = await supabase
            .from('animal')
            .insert([
                {
                    nome,
                    especie,
                    raca,
                    sexo,
                    descricao,
                    data_entrada,
                    ong_id,
                    link_img: imageUrl,
                },
            ])
            .select();

        if (error) {
            console.error('Erro ao inserir pet no Supabase:', error.message);
            throw error;
        }

        console.log('Pet inserido com sucesso:', data[0]);
        res.status(201).json(data[0]);

    } catch (err) {
        console.error('Erro ao criar pet:', err.message, err.stack);
        res.status(500).json({ error: 'Erro ao criar pet', details: err.message });
    }
}

module.exports = createPet;