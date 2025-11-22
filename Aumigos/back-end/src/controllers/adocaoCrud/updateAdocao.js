const supabase = require('../../config/dbClient');

async function updateAdocao(req, res) {
    try {
        const idParam = req.params.id;
        const status = String(req.body.status || '').trim();

        if (!idParam || !status) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando: adocao_id (via rota) e status (no body).' });
        }

        const adocao_id = Number(idParam);

        // Atualiza a adoção (e pega a linha atualizada)
        const { data: adocaoRows, error: updateError } = await supabase
            .from('adocao')
            .update({ status })
            .eq('adocao_id', adocao_id)
            .select()
            .limit(1);

        if (updateError) {
            console.error('[ERRO updateAdocao - update]', updateError);
            return res.status(500).json({ error: 'Erro ao atualizar adoção.', details: updateError.message });
        }

        if (!adocaoRows || adocaoRows.length === 0) {
            return res.status(404).json({ error: 'Adoção não encontrada para atualizar.' });
        }

        const adocao = adocaoRows[0];

        // Atualiza o status do animal vinculado
        const { error: animalError } = await supabase
            .from('animal')
            .update({ status })
            .eq('animal_id', adocao.animal_id);

        if (animalError) {
            console.error('[ERRO updateAdocao - update animal]', animalError);
            return res.status(500).json({ error: 'Erro ao atualizar status do animal.', details: animalError.message });
        }

        return res.status(200).json({ message: 'Adoção atualizada com sucesso!', adocao });
    } catch (err) {
        console.error('[ERRO updateAdocao - unexpected]', err);
        return res.status(500).json({ error: 'Erro interno ao atualizar adoção.', details: err.message });
    }
}

module.exports = updateAdocao;
