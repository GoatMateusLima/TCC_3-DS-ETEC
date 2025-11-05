// src/controllers/adotante/createAdotante.js
const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');

async function createAdotante(req, res) {
    try {
        const { nome, email, senha, cpf, whatsapp, data_nascimento } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !email || !cpf || !whatsapp) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        // Verifica se o e-mail já existe
        const { data: emailExistente, error: emailError } = await db
            .from('adotante')
            .select('*')
            .eq('email', email);

        if (emailError) throw emailError;

        if (emailExistente && emailExistente.length > 0) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Criptografa a senha se enviada
        let senhaHash = null;
        if (senha) {
            senhaHash = await bcrypt.hash(senha, 10);
        }

        // Insere no banco
        const { data, error: insertError } = await db
            .from('adotante')
            .insert([
                {
                    nome,
                    email,
                    senha: senhaHash,
                    cpf,
                    whatsapp,
                    data_nascimento: data_nascimento || null,
                    data_cadastro: new Date()
                }
            ])
            .select();

        if (insertError) throw insertError;

        res.status(201).json({
            message: 'Adotante criado com sucesso.',
            adotante: data[0]
        });
    } catch (err) {
        console.error('Erro ao criar adotante:', err);
        res.status(500).json({ error: 'Erro interno ao criar adotante.' });
    }
}

module.exports = createAdotante;
