const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');

async function updateOng(req, res) {
    try {
        const { id } = req.params;
        const { nome, email, senha, rua, numero, bairro, cep, whatsapp } = req.body;

        const updateData = { nome, email, rua, numero, bairro, cep, whatsapp };

        if (senha) updateData.senha = await bcrypt.hash(senha, 10);

        const { data, error } = await db.from('ong').update(updateData).eq('id', id);

        if (error) return res.status(500).json({ error: 'Erro ao atualizar ONG.', details: error });

        res.status(200).json({ message: 'ONG atualizada com sucesso.', ong: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao atualizar ONG.' });
    }
}

module.exports = updateOng;
