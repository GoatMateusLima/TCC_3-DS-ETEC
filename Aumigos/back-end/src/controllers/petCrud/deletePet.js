const pool = require('../../config/dbClient');
const { deletePetImage } = require('../../services/supabaseService');

async function deletePet(req, res) {
    const { id } = req.params; 

    try {

        const petResult = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);

        if (petResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pet nao encontrado' });

        }

        const existingPet = petResult.rows[0];

        if ( existingPet.linkimagem ) {
            await deletePetImage( existingPet.linkimagem );
        }

        await pool.query('DELETE FROM pets WHERE id = $1', [id]);

        res.json({ message: ' pet deletado com sucesso'});

    }  catch (err) {
        console.error( 'Erro ao deletar pet:', err.message);
        res.status(500).json({ error: 'Erro ao deletar pet' });
    }
}

module.exports = { deletePet };