const db = require('../../config/dbClient');

async function createPet(req, res) {
    try {
        const {
            id_ong,
            nome,
            especie,
            raca,
            idade,
            genero,
            descricao,
            status_adocao,
            imagem_url
        } = req.body;

        if (!id_ong || !nome || !especie || !descricao) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        // 1️⃣ Verifica se ONG existe e está validada
        const { data: ong, error: ongError } = await db
            .from('ong')
            .select('id, cnpj_validado, status_validacao')
            .eq('id', id_ong)
            .single();

        if (ongError || !ong) {
            return res.status(400).json({ error: 'ONG não encontrada.' });
        }

        if (!ong.cnpj_validado || ong.status_validacao !== 'aprovado') {
            return res.status(403).json({ error: 'ONG ainda não validada para cadastrar pets.' });
        }

        // 2️⃣ Cria o pet vinculado à ONG
        const { data, error } = await db
            .from('animal')
            .insert([
                {
                    id_ong,
                    nome,
                    especie,
                    raca,
                    idade,
                    genero,
                    descricao,
                    status_adocao: status_adocao || 'disponivel',
                    imagem_url
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            message: 'Pet cadastrado com sucesso!',
            pet: data[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao cadastrar pet.' });
    }
}

module.exports = createPet;
