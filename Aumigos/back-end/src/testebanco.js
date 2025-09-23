const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "gemini1",
  database: "aumigos",
  port: 5432
});

async function runCRUD() {
  try {
    await client.connect();
    console.log('✅ Conectado ao banco aumigos.');

    // --------------------
    // CREATE
    console.log('--- PASSO 1: Criando uma ONG ---');
    let resCreate = await client.query(
      `INSERT INTO ong 
      (nome, email, cnpj, rua, status_registro, whatsapp, data_criacao, cep, bairro, numero)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;`,
      ['ONG Teste', 'teste@ong.com', '12345678901234', 'Rua A', 1, '11999999999', '2024-09-20', '12345678', 'Centro', '100']
    );
    console.log('Criada:', resCreate.rows[0]);

    // --------------------
    // READ
    console.log('--- PASSO 2: Listando todas as ONGs ---');
    let resRead = await client.query('SELECT * FROM ong;');
    console.log(resRead.rows);

    // --------------------
    // UPDATE
    console.log('--- PASSO 3: Atualizando a ONG criada ---');
    let resUpdate = await client.query(
      `UPDATE ong SET nome=$1 WHERE id=$2 RETURNING *;`,
      ['ONG Atualizada', resCreate.rows[0].id]
    );
    console.log('Atualizada:', resUpdate.rows[0]);

    // --------------------
    // READ novamente
    console.log('--- PASSO 4: Listando todas as ONGs após atualização ---');
    resRead = await client.query('SELECT * FROM ong;');
    console.log(resRead.rows);

    // --------------------
    // DELETE
    console.log('--- PASSO 5: Deletando a ONG criada ---');
    let resDelete = await client.query(
      `DELETE FROM ong WHERE id=$1 RETURNING *;`,
      [resCreate.rows[0].id]
    );
    console.log('Deletada:', resDelete.rows[0]);

    // --------------------
    // READ final
    console.log('--- PASSO 6: Listando todas as ONGs após deleção ---');
    resRead = await client.query('SELECT * FROM ong;');
    console.log(resRead.rows);

    console.log('✅ CRUD completo finalizado.');
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await client.end();
    console.log('Conexão encerrada.');
  }
}

runCRUD();
