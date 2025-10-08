const supabase = require('../../config/dbClient');

async function getPets(req, res) {
    try {
        console.log('📦 Buscando todos os pets...');

        const { data, error } = await supabase
            .from('animal')
            .select('*')
            .order('animal_id', { ascending: true });

        if (error) {
            console.error('Erro ao buscar pets:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar pets', details: error.message });
        }

        if (!data || data.length === 0) {
            console.log('Nenhum pet encontrado.');
            return res.status(404).json({ message: 'Nenhum pet encontrado' });
        }

        console.log(`✅ ${data.length} pets encontrados.`);
        res.status(200).json(data);

    } catch (err) {
        console.error('Erro inesperado ao buscar pets:', err.message, err.stack);
        res.status(500).json({ error: 'Erro inesperado ao buscar pets', details: err.message });
    }
}

module.exports = getPets;
