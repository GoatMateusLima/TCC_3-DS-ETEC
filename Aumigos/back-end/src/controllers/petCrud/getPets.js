const db = require('../../config/dbClient');

async function getPets(req, res) {
    console.log('[INFO] Requisição recebida para listagem de Pets');
    try {
        const { id_ong, especie, status } = req.query; 
        const ong_id = id_ong; 

        let query = db.from('animal').select('*');

        // Filtro por ONG
        if (ong_id) query = query.eq('ong_id', ong_id); 
        
        // Outros filtros
        if (especie) query = query.ilike('especie', `%${especie}%`);
        if (status) query = query.eq('status_adocao', status);

        const { data, error } = await query;
        if (error) {
            return res.status(500).json({ error: 'Erro interno ao listar pets.' });
        }

        console.log(`[SUCESSO] ${data.length} Pets listados.`);
        res.status(200).json(data);
    } catch (err) {
        console.error('[ERRO FATAL] Exceção não tratada no getPets:', err.message);
        res.status(500).json({ error: 'Erro interno ao listar pets.' });
    }
}

module.exports = getPets;