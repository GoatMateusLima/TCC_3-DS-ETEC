const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');

async function createAdotante(req, res) {
    try {
        const { nome, email, senha, cpf, rua, numero, bairro, cep, whatsapp } = req.body;

        if (!nome || !email || !senha || !cpf) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        // Verifica se já existe e-mail
        const { data: emailExistente } = await db.from('adotante').select('*').eq('email', email);
        if (emailExistente && emailExistente.length > 0)
            return res.status(400).json({ error: 'E-mail já cadastrado.' });

        // Criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10);

        const { data, error } = await db
            .from('adotante')
            .insert([
                { nome, email, senha: senhaHash, cpf, rua, numero, bairro, cep, whatsapp }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Adotante criado com sucesso.', adotante: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao criar adotante.' });
    }
}

module.exports = createAdotante;
