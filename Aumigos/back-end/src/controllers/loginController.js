// src/controllers/loginController.js (ATUALIZADO)
const supabase = require('../config/dbClient');
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { email, senha } = req.body;
  console.log('Tentativa de login para:', email);

  try {
    // Verifica se é ONG
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
      const ongSafe = { ...ongData };
      const stored = ongData.senha;
      delete ongSafe.senha;

      const isBcryptHash = typeof stored === 'string' && /^\$2[aby]\$/.test(stored);

      let valid = false;
      if (isBcryptHash) {
        valid = await bcrypt.compare(senha, stored);
      } else {
        valid = stored === senha;
      }

      if (!valid) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }

      console.log('ONG encontrada:', ongSafe);
      return res.json({ tipo: 'ong', dados: ongSafe });
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
      const senhaValida = await bcrypt.compare(senha, adotanteData.senha || '');
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
      const adotanteSafe = { ...adotanteData };
      delete adotanteSafe.senha;
      console.log('Adotante encontrado:', adotanteSafe);
      return res.json({ tipo: 'adotante', dados: adotanteSafe });
    }

    // 🔥 VERIFICA SE É MEMBRO (tabela membros_ong)
    const { data: membroData, error: membroError } = await supabase
      .from('membros_ong')
      .select('*')
      .eq('email', email)
      .single();

    if (membroError && membroError.code !== 'PGRST116') {
      console.error('Erro Membro:', membroError);
      return res.status(500).json({ erro: 'Erro no banco de dados (Membro)' });
    }

    if (membroData) {
      const senhaValida = await bcrypt.compare(senha, membroData.senha || '');
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha incorreta' });
      }
      const membroSafe = { ...membroData };
      delete membroSafe.senha;
      console.log('Membro encontrado:', membroSafe);
      return res.json({ tipo: 'membro', dados: membroSafe });
    }

    // Nenhum encontrado
    return res.status(401).json({ erro: 'Email ou senha incorretos' });

  } catch (err) {
    console.error('Erro no loginController:', err);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

module.exports = { login };