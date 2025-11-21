const db = require('../../config/dbClient');
const bcrypt = require('bcrypt'); // Importa a biblioteca de criptografia

async function updateMember(req, res) {
    console.log('[INFO] Requisição recebida para atualização de Membro');

    try {
        const memberId = req.params.id;
        const { nome, cpf, email, whatsapp, funcao, senha } = req.body;
        
        const updateData = { nome, cpf, email, whatsapp, funcao };

        // 1. Se a senha for fornecida, ela deve ser criptografada antes do update
        if (senha) {
            console.log('[DEBUG] Senha nova detectada. Gerando hash...');
            updateData.senha = await bcrypt.hash(senha, 10);
        }

        // 2. Executa a atualização no banco
        const { data, error } = await db
            .from('membros_ong')
            .update(updateData)
            .eq('membro_id', memberId)
            .select();

        if (error) {
            console.error('Erro ao atualizar membro:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar membro.' });
        }
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Membro não encontrado para atualização.' });
        }

        const safe = { ...data[0] };
        delete safe.senha;
        console.log('[SUCESSO] Membro atualizado com sucesso:', safe);
        res.status(200).json(safe);

    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no updateMember:', err.message);
        res.status(500).json({ error: 'Erro interno inesperado no servidor.' });
    }
}

module.exports = updateMember;