const supabase = require('../../config/dbClient');

async function getAdocao(req, res) {
    try {
        const idParam = req.params.id;

        // ========================
        // BUSCAR ADOÇÃO POR ID
        // ========================
        if (idParam) {
            const adocao_id = Number(idParam);

            const { data, error } = await supabase
                .from('adocao')
                .select(`
                    adocao_id,
                    data_adocao,
                    status,
                    ong_id,
                    animal:animal_id (
                        animal_id,
                        nome,
                        especie,
                        raca,
                        sexo,
                        link_img,
                        ong_id,
                        status
                    ),
                    adotante:adotante_id (
                        adotante_id,
                        nome,
                        email,
                        whatsapp
                    )
                `)
                .eq('adocao_id', adocao_id)
                .single();

            if (error || !data) {
                console.error('[ERRO getAdocao - fetch single]', error);
                return res.status(404).json({ error: 'Adoção não encontrada.' });
            }

            return res.status(200).json({ adocao: data });
        }

        // ========================
        // LISTAR ADOÇÕES
        // ========================

        const ong_id = req.query.ong_id ? Number(req.query.ong_id) : null;

        let query = supabase
            .from('adocao')
            .select(`
                adocao_id,
                data_adocao,
                status,
                ong_id,
                animal:animal_id (
                    animal_id,
                    nome,
                    especie,
                    raca,
                    sexo,
                    link_img,
                    ong_id
                ),
                adotante:adotante_id (
                    adotante_id,
                    nome,
                    email,
                    whatsapp
                )
            `);

        // AGORA FUNCIONA → porque ong_id existe na tabela adoção
        if (ong_id) {
            query = query.eq('ong_id', ong_id);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[ERRO getAdocao - list]', error);
            return res.status(500).json({
                error: 'Erro ao listar adoções.',
                details: error.message
            });
        }

        return res.status(200).json({ adocoes: data || [] });

    } catch (err) {
        console.error('[ERRO getAdocao - unexpected]', err);
        return res.status(500).json({
            error: 'Erro interno ao buscar adoções.',
            details: err.message
        });
    }
}

module.exports = getAdocao;
