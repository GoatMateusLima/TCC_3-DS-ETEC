const supabase = require('../supabaseClient');


async function testConnection() {
    try {
        const {data, error } = await supabase.storage.listBuckets();

        if (error) throw error;

        console.log('Conexao bem sucedida ao supabase')
        console.log('Bucketis encontrados:', data);
    } catch (err) {
        console.error('Erro na conexao com supabase:', err.message);
    }
}

testConnection();