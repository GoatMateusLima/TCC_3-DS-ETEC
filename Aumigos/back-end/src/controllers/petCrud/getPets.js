const pool = require('../../config/dbClient');

async function getPets(req, res) {
    try {
        const result = await pool.query('SELECT * FROM pets ORDER BY ID ASC');
        res.json(result.rows);
        
    }   catch (err) {
        console.error(' Erro ao listar pets:', err.message);
        res.status(500).json({ error: 'Erro ao listar pets' });
    }
}

module.exports = { getPets };

