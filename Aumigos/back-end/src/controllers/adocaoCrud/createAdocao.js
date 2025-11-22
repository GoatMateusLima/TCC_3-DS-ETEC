const supabase = require('../../config/dbClient');

async function createAdocao(req, res) {
    try {
        // Espera campos conforme schema Supabase: animal_id e adotante_id
        const { animal_id, adotante_id } = req.body;

        console.debug('[DEBUG createAdocao] req.body keys:', Object.keys(req.body));

        if (!animal_id || !adotante_id) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando: animal_id e adotante_id.' });
        }

        // 1. Verifica se o pet já está em adoção
        // Seleciona tanto status_adocao quanto status para lidar com variações de schema
        const { data: pet, error: petError } = await supabase
            .from('animal')
            .select('animal_id, status_adocao, status')
            .eq('animal_id', animal_id)
            .single();

        if (petError) return res.status(400).json({ error: 'Erro ao buscar pet.' });

        const currentStatus = pet.status_adocao || pet.status || null;
        if (currentStatus === 'adotado' || currentStatus === 'em análise') {
            return res.status(400).json({ error: 'Pet já está em processo de adoção ou adotado.' });
        }

        // 2. Cria registro de adoção
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const { data, error } = await supabase
            .from('adocao')
            .insert([{
                animal_id,
                adotante_id,
                data_adocao: today,
                status: 'em análise'
            }])
            .select();

        if (error) return res.status(500).json({ error: 'Erro ao criar adoção.', details: error });

        // 3. Atualiza status do animal — atualiza a coluna existente (status_adocao ou status)
        if ('status_adocao' in pet) {
            await supabase.from('animal').update({ status_adocao: 'em análise' }).eq('animal_id', animal_id);
        } else {
            await supabase.from('animal').update({ status: 'em análise' }).eq('animal_id', animal_id);
        }

        res.status(201).json({ message: 'Adoção criada com sucesso!', adocao: data[0] });
    } catch (err) {
        console.error('[ERRO createAdocao]', err);
        res.status(500).json({ error: 'Erro interno ao criar adoção.' });
    }
}

module.exports = createAdocao;
