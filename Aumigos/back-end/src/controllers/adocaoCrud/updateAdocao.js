const supabase = require('../../config/dbClient');

async function updateAdocao(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'aprovado' ou 'recusado'

        if (!status || !['aprovado', 'recusado'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido.' });
        }

        // 1. Busca registro de adoção
        const { data: adocao, error: fetchError } = await supabase
            .from('adocao')
            .select('animal_id')
            .eq('adocao_id', id)
            .single();

        if (fetchError || !adocao) return res.status(404).json({ error: 'Adoção não encontrada.' });

        // 2. Atualiza status da adoção
        const { error: updateError } = await supabase
            .from('adocao')
            .update({ status })
            .eq('adocao_id', id);

        if (updateError) return res.status(500).json({ error: 'Erro ao atualizar adoção.' });

        // 3. Atualiza status do pet
        const novoStatus = status === 'aprovado' ? 'adotado' : 'disponível';
        await supabase.from('animal').update({ status: novoStatus }).eq('animal_id', adocao.animal_id);

        res.status(200).json({ message: 'Adoção atualizada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao atualizar adoção.' });
    }
}

module.exports = updateAdocao;
