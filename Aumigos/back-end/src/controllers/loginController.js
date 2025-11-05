// src/controllers/loginController.js
const supabase = require('../config/dbClient');
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { email, senha } = req.body;
  console.log('Tentativa de login:', req.body);

  try {
    // Verifica se é ONG (ONGs podem não ter senha criptografada, então comparamos direto)
    const { data: ongData, error: ongError } = await supabase
      .from('ong')
      .select('*')
      .eq('email', email)
      .single();

    if (ongError && ongError.code !== 'PGRST116') {
      console.error('Erro ONG:', ongError);
      return res.status(500).json({ erro: 'Erro no banco de dados (ONG)' });
    }

    if (ongData) {
      // Supondo que a senha da ONG não esteja criptografada
      if (ongData.senha !== senha) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
      console.log('ONG encontrada:', ongData);
      return res.json({ tipo: 'ong', dados: ongData });
    }

    // Verifica se é Adotante
    const { data: adotanteData, error: adotanteError } = await supabase
      .from('adotante')
      .select('*')
      .eq('email', email)
      .single();

    if (adotanteError && adotanteError.code !== 'PGRST116') {
      console.error('Erro Adotante:', adotanteError);
      return res.status(500).json({ erro: 'Erro no banco de dados (Adotante)' });
    }

    if (adotanteData) {
      const senhaValida = await bcrypt.compare(senha, adotanteData.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
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