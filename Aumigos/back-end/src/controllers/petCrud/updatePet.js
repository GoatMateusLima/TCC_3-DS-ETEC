const pool = require('../../config/dbClient');
const { uploadPetImage } = require('../../services/supabaseService');
const { resizeImage } = require('../../utils/imageResize');


async function updatePet( req, res ) {
    const { id } = req.params;
    const { nome, tipo, raca, sexo, descricao, data_entrada, data_saida } = req.body;
    const file = req.file;

    try {
        const petResult = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);

        if  (petResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pet nao encontrado'});

        }

        const existingPet = petResult.rows[0];

        let imageUrl = existingPet.linkimagem;

        if ( file ) {
            const resizeBuffer = await resizeImage(file.Buffer);

            if ( existingPet.linkimagem ) {
                await deletePetImage(existingPet.linkimagem);
            }

            imageUrl = await uploadPetImage( resizeBuffer, file.originalname, id);
        }

        const updateQuery = `
            UPDATE pets
            SET nome = $1, tipo = $2, raca = $3, sexo = $4, descricao = $5, data_entrada = $6, data_saida = $7, linkimagem = $8
            WHERE id = $9
            RETURNING *;
            `;

            const values = [nome, tipo, raca, sexo, descricao, data_entrada, data_saida, imageUrl, id ];

            const result = await pool.query(updateQuery, values);
            res.json(result.rows[0]);

    }   catch (err) {
        console.error( 'Erro ao atualizar pet:', err.message);
        res.status(500).json({ error: ' Erro ao atualizar pet' });
    }
}

module.exports = { updatePet };