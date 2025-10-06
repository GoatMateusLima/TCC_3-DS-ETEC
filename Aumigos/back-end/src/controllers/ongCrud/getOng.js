const supabaseDB = require('../../config/dbClient');


async function getOng( req, res ) {
    try {
        const { data, error } = await supabaseDB
            .from('ong')
            .select('*');

        
        if (error)  throw error;

        return res.status(200).json(data);

    } catch (err) {
        console.error(' Erro ao buscar ONGs:', err.message);
        return res.status(500).json({error: err.message});
    }
}

module.exports = getOng;