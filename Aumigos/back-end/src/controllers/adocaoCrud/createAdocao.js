const supabase = require('../../config/dbClient');

async function createAdocao(req, res) {
    try {
        // Validação básica
        const animal_id = Number(req.body.animal_id);
        const adotante_id = Number(req.body.adotante_id);
        const ong_id = Number(req.body.ong_id); // ← ADICIONAR ESTA LINHA

        console.debug('[DEBUG createAdocao] req.body keys:', Object.keys(req.body));
        console.debug('[DEBUG createAdocao] valores:', { ong_id, animal_id, adotante_id }); // ← DEBUG

        if (!ong_id || !animal_id || !adotante_id) { // ← ADICIONAR ong_id NA VALIDAÇÃO
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando: ong_id, animal_id e adotante_id.' 
            });
        }

        // 0. Verifica existência do animal (evita FK violation surpreendente)
        const { data: animalExists, error: animalErr } = await supabase
            .from('animal')
            .select('animal_id, status, ong_id') // ← PEGAR ong_id DO ANIMAL TAMBÉM
            .eq('animal_id', animal_id)
            .limit(1);

        if (animalErr) {
            console.error('[ERRO createAdocao - check animal]', animalErr);
            return res.status(500).json({ error: 'Erro ao verificar animal.', details: animalErr.message });
        }
        if (!animalExists || animalExists.length === 0) {
            return res.status(404).json({ error: 'Animal não encontrado.' });
        }

        // VERIFICAR SE O ANIMAL PERTENCE À ONG
        if (animalExists[0].ong_id !== ong_id) {
            return res.status(403).json({ error: 'Animal não pertence a esta ONG.' });
        }

        // 1. Verifica se já existe adoção para este animal
        const { data: existing, error: checkError } = await supabase
            .from('adocao')
            .select('adocao_id, status')
            .eq('animal_id', animal_id)
            .limit(1);

        if (checkError) {
            console.error('[ERRO createAdocao - check existing]', checkError);
            return res.status(500).json({ error: 'Erro ao verificar adoção existente.', details: checkError.message });
        }
        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Este animal já possui uma adoção registrada.', status: existing[0].status });
        }

        // 2. Cria registro de adoção - AGORA COM ong_id
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const { data: insertData, error: insertError } = await supabase
            .from('adocao')
            .insert([{
                ong_id: ong_id, // ← ADICIONAR AQUI
                animal_id,
                adotante_id,
                data_adocao: today,
                status: 'em análise'
            }])
            .select();

        if (insertError) {
            console.error('[ERRO createAdocao - insert]', insertError);
            return res.status(500).json({ error: 'Erro ao criar adoção.', details: insertError.message });
        }

        const created = Array.isArray(insertData) ? insertData[0] : insertData;

        // 3. Atualiza status do animal
        const { error: updateError } = await supabase
            .from('animal')
            .update({ status: 'em análise' })
            .eq('animal_id', animal_id);

        if (updateError) {
            // rollback simples: remove a adoção criada
            console.error('[ERRO createAdocao - update animal]', updateError);
            try {
                await supabase.from('adocao').delete().eq('adocao_id', created.adocao_id);
                console.warn('[ROLLBACK] adocao removida após falha ao atualizar animal:', created.adocao_id);
            } catch (rbErr) {
                console.error('[ROLLBACK FAILED] não foi possível remover adocao criada:', rbErr);
            }
            return res.status(500).json({ error: 'Erro ao atualizar status do animal.', details: updateError.message });
        }

        return res.status(201).json({ message: 'Adoção criada com sucesso!', adocao: created });
    } catch (err) {
        console.error('[ERRO createAdocao - unexpected]', err);
        return res.status(500).json({ error: 'Erro interno ao criar adoção.', details: err.message });
    }
}

module.exports = createAdocao;