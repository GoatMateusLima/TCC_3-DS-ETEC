const supabase = require('../../config/dbClient');

async function deleteAdocao(req, res) {
    try {
        const idParam = req.params.id;
        if (!idParam) {
            return res.status(400).json({ error: 'Campo obrigatório faltando: adocao_id (via rota).' });
        }
        const adocao_id = Number(idParam);

        // Busca a adoção para saber qual animal está vinculado
        const { data: adocaoRows, error: fetchError } = await supabase
            .from('adocao')
            .select('adocao_id, animal_id')
            .eq('adocao_id', adocao_id)
            .limit(1);

        if (fetchError) {
            console.error('[ERRO deleteAdocao - fetch]', fetchError);
            return res.status(500).json({ error: 'Erro ao buscar adoção.', details: fetchError.message });
        }

        if (!adocaoRows || adocaoRows.length === 0) {
            return res.status(404).json({ error: 'Adoção não encontrada.' });
        }

        const { animal_id } = adocaoRows[0];

        // Remove a adoção
        const { error: deleteError } = await supabase
            .from('adocao')
            .delete()
            .eq('adocao_id', adocao_id);

        if (deleteError) {
            console.error('[ERRO deleteAdocao - delete]', deleteError);
            return res.status(500).json({ error: 'Erro ao excluir adoção.', details: deleteError.message });
        }

        // Atualiza o status do animal para "disponivel"
        const { error: updateError } = await supabase
            .from('animal')
            .update({ status: 'disponivel' })
            .eq('animal_id', animal_id);

        if (updateError) {
            console.error('[ERRO deleteAdocao - update animal]', updateError);
            return res.status(500).json({ error: 'Erro ao atualizar status do animal.', details: updateError.message });
        }

        return res.status(200).json({ message: 'Adoção excluída com sucesso e animal marcado como disponível.' });
    } catch (err) {
        console.error('[ERRO deleteAdocao - unexpected]', err);
        return res.status(500).json({ error: 'Erro interno ao excluir adoção.', details: err.message });
    }
}

module.exports = deleteAdocao;
