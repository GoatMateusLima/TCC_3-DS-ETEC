const supabase = require('../../config/dbClient');

async function deleteAdocao(req, res) {
    try {
        const { id } = req.params;

        // 1. Busca adoção para atualizar status do pet
        const { data: adocao, error: fetchError } = await supabase
            .from('adocao')
            .select('animal_id')
            .eq('adocao_id', id)
            .single();

        if (fetchError || !adocao) return res.status(404).json({ error: 'Adoção não encontrada.' });

        // 2. Deleta adoção
        const { error } = await supabase
            .from('adocao')
            .delete()
            .eq('adocao_id', id);

        if (error) return res.status(500).json({ error: 'Erro ao deletar adoção.' });

        // 3. Atualiza status do pet
        await supabase.from('animal').update({ status: 'disponível' }).eq('animal_id', adocao.animal_id);

        res.status(200).json({ message: 'Adoção deletada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao deletar adoção.' });
    }
}

module.exports = deleteAdocao;
