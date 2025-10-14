const db = require('../../config/dbClient');

async function updatePet(req, res) {
    try {
        const { id } = req.params;
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

        if (!id_ong) return res.status(400).json({ error: 'ID da ONG é obrigatório.' });

        // Verifica se o pet pertence à ONG
        const { data: pet } = await db.from('animal').select('id_ong').eq('id', id).single();

        if (!pet || pet.id_ong !== id_ong)
            return res.status(403).json({ error: 'Acesso negado. Este pet não pertence à sua ONG.' });

        const { data, error } = await db
            .from('animal')
            .update({
                nome,
                especie,
                raca,
                idade,
                genero,
                descricao,
                status_adocao,
                imagem_url
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Pet atualizado com sucesso.', pet: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao atualizar pet.' });
    }
}

module.exports = updatePet;
