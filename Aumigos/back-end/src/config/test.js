const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexão bem-sucedida! Hora do servidor:', res.rows[0].now);
  } catch (err) {
    console.error('Erro ao conectar:', err);
  } finally {
    pool.end();
  }
}

testConnection();
