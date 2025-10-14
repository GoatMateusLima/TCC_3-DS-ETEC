const supabase = require('../../config/dbClient');

async function getAdoacoes(req, res) {
    try {
        const ong_id = req.query.ong_id;
        if (!ong_id) return res.status(400).json({ error: 'ONG não informada.' });

        const { data, error } = await supabase
            .from('adocao')
            .select('*, animal(*), adotante(*)')
            .eq('ong_id', ong_id)
            .order('data_adocao', { ascending: false });

        if (error) return res.status(500).json({ error: 'Erro ao buscar adoções.', details: error });

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar adoções.' });
    }
}

module.exports = getAdoacoes;
