const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');
const { buscarCnpj } = require('../../services/brasilApi');
const { validarCnpj } = require('../../utils/validarCnpj');

async function createOng(req, res) {
    try {
        const {
            nome,
            email,
            senha,
            cnpj,
            rua,
            numero,
            bairro,
            cep,
            whatsapp,
            data_criacao
        } = req.body;

        // 1. Validação básica
        if (!nome || !email || !senha || !cnpj) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
        }

        // 2. Validar CNPJ via arquivo de validação
        const cnpjValido = await validarCnpj(cnpj);
        if (!cnpjValido) {
            return res.status(400).json({ error: 'CNPJ não corresponde a uma ONG válida.' });
        }

        // 3. Buscar dados do CNPJ (opcional, para preencher campos)
        let dadosCnpj = {};
        try {
            dadosCnpj = await buscarCnpj(cnpj);
        } catch (err) {
            console.warn('Não foi possível buscar dados do CNPJ, cadastro continuará sem preenchimento automático.', err.message);
        }

        // 4. Verificar se email ou CNPJ já existem
        const checkExist = await db.from('ong').select('*').eq('email', email).or(`cnpj.eq.${cnpj}`);
        if (checkExist.data.length > 0) {
            return res.status(400).json({ error: 'Email ou CNPJ já cadastrado.' });
        }

        // 5. Criar hash da senha
        const hashSenha = await bcrypt.hash(senha, 10);

        // 6. Inserir ONG no banco
        const { data, error } = await db.from('ong').insert([{
            nome,
            email,
            senha: hashSenha,
            cnpj,
            rua: rua || (dadosCnpj.matriz ? dadosCnpj.matriz.logradouro : null),
            numero: numero || (dadosCnpj.matriz ? dadosCnpj.matriz.numero : null),
            bairro: bairro || (dadosCnpj.matriz ? dadosCnpj.matriz.bairro : null),
            cep: cep || (dadosCnpj.matriz ? dadosCnpj.matriz.cep : null),
            whatsapp,
            data_criacao,
            status_validacao: 'pendente',
            cnpj_validado: false
        }]);

        if (error) {
            return res.status(500).json({ error: 'Erro ao criar ONG.', details: error });
        }

        res.status(201).json({ message: 'ONG cadastrada com sucesso! Aguardando validação.', ong: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao criar ONG.' });
    }
}

module.exports = createOng;
