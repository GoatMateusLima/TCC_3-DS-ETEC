const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');

async function updateAdotante(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, senha, rua, numero, bairro, cep, whatsapp } = req.body;

        const updateData = { nome, email, rua, numero, bairro, cep, whatsapp };

        if (senha) updateData.senha = await bcrypt.hash(senha, 10);

        const { data, error } = await db
            .from('adotante')
            .update(updateData)
            .eq('adotante_id', id)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Adotante atualizado com sucesso.', adotante: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao atualizar adotante.' });
    }
}

module.exports = updateAdotante;
