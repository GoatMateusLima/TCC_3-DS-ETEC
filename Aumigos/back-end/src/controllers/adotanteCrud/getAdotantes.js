const db = require('../../config/dbClient');

async function getAdotantes(req, res) {
    try {
        const { id } = req.params;

        if (id) {
            const { data, error } = await db.from('adotante').select('*').eq('id', id).single();
            if (error || !data) return res.status(404).json({ error: 'Adotante não encontrado.' });
            const safe = { ...data };
            delete safe.senha;
            return res.status(200).json(safe);
        }

        const { data, error } = await db.from('adotante').select('*');
        if (error) throw error;

        const safeList = data.map(d => {
            const x = { ...d };
            delete x.senha;
            return x;
        });

        res.status(200).json(safeList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar adotantes.' });
    }
}

module.exports = getAdotantes;
