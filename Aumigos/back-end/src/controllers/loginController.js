// src/controllers/loginController.js
const supabase = require('../config/dbClient');

async function login(req, res) {
  const { email, senha } = req.body;

  console.log('Tentativa de login:', req.body);

  try {
    // Verifica se é ONG
    const { data: ongData, error: ongError } = await supabase
      .from('ong')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (ongError && ongError.code !== 'PGRST116') {
      console.error('Erro ONG:', ongError);
      return res.status(500).json({ erro: 'Erro no banco de dados (ONG)' });
    }

    if (ongData) {
      console.log('ONG encontrada:', ongData);
      return res.json({ tipo: 'ong', dados: ongData });
    }

    // Verifica se é Adotante
    const { data: adotanteData, error: adotanteError } = await supabase
      .from('adotante')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (adotanteError && adotanteError.code !== 'PGRST116') {
      console.error('Erro Adotante:', adotanteError);
      return res.status(500).json({ erro: 'Erro no banco de dados (Adotante)' });
    }

    if (adotanteData) {
      console.log('Adotante encontrado:', adotanteData);
      return res.json({ tipo: 'adotante', dados: adotanteData });
    }

    // Nenhum encontrado
    return res.status(401).json({ erro: 'Email ou senha incorretos' });

  } catch (err) {
    console.error('Erro no loginController:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

module.exports = { login };
