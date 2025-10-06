const pool = require('../../config/dbClient');

async function getPetById( req, res ) {
    const { id } = req.params;

    try { 
        const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);

        if (result.rows.lenght === 0) {

            return res.status(404).json({ error: 'Pet nao encontrado' });

        }

        res.json(result.rows[0]);

    }   catch (err) {
        console.error('Erro ao buscar pet:', err.message);
        res.status(500).json({ error: 'Erro ao buscar pet' });
    }
}

module.exports = { getPetById };