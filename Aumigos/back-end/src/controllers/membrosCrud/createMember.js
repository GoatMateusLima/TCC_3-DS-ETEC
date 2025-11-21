const db = require('../../config/dbClient');
const bcrypt = require('bcrypt'); // Importa a biblioteca de criptografia

async function createMember(req, res) {
    console.log('[INFO] Requisição recebida para criação de Membro');

    try {
        let { 
            nome, 
            cpf, 
            email, 
            whatsapp, 
            funcao, 
            ong_id, 
            senha // Senha clara enviada pelo frontend
        } = req.body;

        // 1. Validação de campos obrigatórios
        if (!ong_id || !senha || !nome || !cpf || !email || !funcao) {
            console.error('[ERRO] Campos obrigatórios faltando.');
            return res.status(400).json({ 
                error: 'Campos obrigatórios faltando: nome, cpf, email, função, ong_id e senha são necessários.' 
            });
        }
        
        // 2. Verifica se já existe membro com mesmo email ou CPF (Melhoria - igual ao CRUD ONG)
        try {
            const { data: existente } = await db
                .from('membros_ong')
                .select('membro_id')
                .or(`email.eq.${email},cpf.eq.${cpf}`);

            if (existente && existente.length > 0) {
                console.warn('[AVISO] Membro com este email ou CPF já cadastrado.');
                return res.status(409).json({ 
                    error: 'Já existe um membro cadastrado com este email ou CPF.' 
                });
            }
        } catch (err) {
            console.error('[ERRO] Falha ao verificar duplicidade:', err.message);
            return res.status(500).json({ 
                error: 'Erro ao verificar duplicidade no banco.' 
            });
        }

        // 3. Criação do hash da senha
        let hashSenha;
        try {
            hashSenha = await bcrypt.hash(senha, 10);
        } catch (err) {
            console.error('[ERRO] Falha ao gerar hash da senha:', err.message);
            return res.status(500).json({ 
                error: 'Erro ao criptografar senha.' 
            });
        }
        
        // 4. Inserir Membro no banco de dados
        const { data, error } = await db
            .from('membros_ong')
            .insert([{ 
                nome, 
                cpf, 
                email, 
                whatsapp, 
                funcao, 
                ong_id, 
                senha: hashSenha, // Insere o hash
                data_entrada: new Date() // Adiciona data de entrada automática
            }])
            .select();

        if (error) {
            console.error('Erro ao criar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao criar membro.' });
        }

        const safe = { ...data[0] };
        delete safe.senha;
        console.log('[SUCESSO] Membro cadastrado com sucesso:', safe);
        res.status(201).json(safe);

    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no createMember:', err.message);
        res.status(500).json({ error: 'Erro interno inesperado no servidor.' });
    }
}

module.exports = createMember;