const db = require('../../config/dbClient');
const bcrypt = require('bcrypt');
const { buscarCnpj } = require('../../services/brasilApi');
const { validarCnpj } = require('../../utils/validarCnpj');

async function createOng(req, res) {
    console.log('[INFO] Requisição recebida para criação de ONG');

    try {
        let {
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

        console.log('[DEBUG] Dados recebidos do formulário:', req.body);

        // 🔹 Sanitiza o CNPJ para garantir apenas números
        if (cnpj) {
            cnpj = cnpj.replace(/\D/g, '');
        }

        // 1. Validação de campos obrigatórios
        if (!nome || !email || !senha || !cnpj) {
            console.error('[ERRO] Campos obrigatórios faltando.');
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando: nome, email, senha e cnpj são necessários.' 
            });
        }

        // 2. Validação do formato do CNPJ
        const regexCnpj = /^\d{14}$/;
        if (!regexCnpj.test(cnpj)) {
            console.error('[ERRO] CNPJ inválido. Deve conter 14 dígitos numéricos.');
            return res.status(400).json({ 
                error: 'CNPJ inválido. Deve conter 14 dígitos numéricos (somente números).' 
            });
        }

        // 3. Validação de CNPJ real (Brasil API)
        let cnpjValido = false;
        try {
            cnpjValido = await validarCnpj(cnpj);
            if (!cnpjValido) {
                console.error('[ERRO] O CNPJ não pertence a uma ONG válida segundo a Brasil API.');
                return res.status(400).json({ 
                    error: 'O CNPJ informado não pertence a uma ONG válida (associação ou sem fins lucrativos).' 
                });
            }
        } catch (err) {
            console.error('[ERRO] Falha ao validar CNPJ via Brasil API:', err.message);
            return res.status(502).json({ 
                error: 'Falha na validação do CNPJ via Brasil API. Tente novamente mais tarde.', 
                details: err.message 
            });
        }

        // 4. Buscar dados do CNPJ (para preencher endereço automaticamente, se possível)
        let dadosCnpj = {};
        try {
            dadosCnpj = await buscarCnpj(cnpj);
            console.log('[INFO] Dados retornados da Brasil API:', dadosCnpj);
        } catch (err) {
            console.warn('[AVISO] Não foi possível buscar dados do CNPJ:', err.message);
            dadosCnpj = {}; // garante que não seja undefined
        }

        // 5. Verificar se já existe ONG com mesmo email ou CNPJ
        try {
            const { data: existente, error: erroBusca } = await db
                .from('ong')
                .select('*')
                .or(`email.eq.${email},cnpj.eq.${cnpj}`);

            if (erroBusca) {
                console.error('[ERRO] Erro ao verificar existência de ONG:', erroBusca.message);
                return res.status(500).json({ 
                    error: 'Erro ao verificar duplicidade no banco.', 
                    details: erroBusca.message 
                });
            }

            if (existente && existente.length > 0) {
                console.warn('[AVISO] ONG com este email ou CNPJ já cadastrada.');
                return res.status(409).json({ 
                    error: 'Já existe uma ONG cadastrada com este email ou CNPJ.' 
                });
            }
        } catch (err) {
            console.error('[ERRO] Falha inesperada ao consultar duplicidade:', err.message);
            return res.status(500).json({ 
                error: 'Erro inesperado ao consultar duplicidade no banco.', 
                details: err.message 
            });
        }

        // 6. Criação do hash da senha
        let hashSenha;
        try {
            hashSenha = await bcrypt.hash(senha, 10);
        } catch (err) {
            console.error('[ERRO] Falha ao gerar hash da senha:', err.message);
            return res.status(500).json({ 
                error: 'Erro ao criptografar senha.', 
                details: err.message 
            });
        }

        // 7. Inserir ONG no banco de dados
        try {
            const { data, error } = await db
                .from('ong')
                .insert([{
                    nome,
                    email,
                    senha: hashSenha,
                    cnpj,
                    rua: rua || dadosCnpj.logradouro || null,
                    numero: numero || dadosCnpj.numero || null,
                    bairro: bairro || dadosCnpj.bairro || null,
                    cep: cep || dadosCnpj.cep || null,
                    whatsapp,
                    data_criacao: data_criacao || new Date(),
                    status_registro: true
                }])
                .select();

            if (error) {
                console.error('[ERRO] Falha ao inserir ONG no banco:', error.message);
                return res.status(500).json({ 
                    error: 'Erro ao salvar ONG no banco de dados.', 
                    details: error.message 
                });
            }

            console.log('[SUCESSO] ONG cadastrada com sucesso:', data);
            return res.status(201).json({ 
                message: 'ONG cadastrada com sucesso!', 
                ong: data[0] 
            });
        } catch (err) {
            console.error('[ERRO] Falha inesperada ao inserir ONG:', err.message);
            return res.status(500).json({ 
                error: 'Erro inesperado ao salvar ONG.', 
                details: err.message 
            });
        }

    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no createOng:', err.message);
        return res.status(500).json({ 
            error: 'Erro interno inesperado no servidor.', 
            details: err.message 
        });
    }
}

module.exports = createOng;
