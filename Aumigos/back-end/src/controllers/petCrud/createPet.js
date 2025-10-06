const {uploadPetImage} = require('../../services/supabaseService');
const pool = require('../../config/dbClient');

async function createPet( req, res ) {
    try {
        const { nome, tipo, raca, sexo, descricao } = req.body;

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadPetImage( req.file.buffer, req.file.originalname, nome);

        }

        const query = 'INSERT INTO pets (nome, tipo, raca, sexo, descricao, image_url, data_entrada) VALUES ($1, $2, $3,  $4, $5, $6, now()) RETURNING *';

        const values = [nome, tipo, raca, sexo, descricao, imageUrl];

        const result = await pool.query(query, values);

        res.status(201).json({ 
            message: 'Pet cadastrado com sucesso!',
            pet: result.rows[0]

        });

    }  catch (err) {
            console.log.error('Erro ao cadastrar pet:', err.message);
            res.status(500).json({ error: 'Erro ao cadastrar pet' });
        }
}

module.exports = { createPet };

