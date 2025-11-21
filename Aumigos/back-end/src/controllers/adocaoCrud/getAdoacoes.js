const supabase = require('../../config/dbClient');

async function getAdoacoes(req, res) {
    try {
        const ong_id = req.query.ong_id;

        // Busca adocaos com os relacionamentos de animal e adotante
        const { data, error } = await supabase
            .from('adocao')
            .select('*, animal(*), adotante(*)')
            .order('data_adocao', { ascending: false });

        if (error) return res.status(500).json({ error: 'Erro ao buscar adoções.', details: error });

        // Se fornecer ong_id, filtra pela ong através do animal.ong_id
        let filtered = data;
        if (ong_id) {
            filtered = data.filter(a => a.animal && String(a.animal.ong_id) === String(ong_id));
        }

        res.status(200).json(filtered);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar adoções.' });
    }
}

module.exports = getAdoacoes;
