// ong.js
import { limparMascara } from './masks.js';
import { mostrarMensagem, tratarRespostaErro } from './utils.js';

export function initOngForm() {
  const form = document.querySelector('#formOng');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeOng').value.trim();
    const email = document.getElementById('emailOng').value.trim();
    const senha = document.getElementById('senhaOng').dataset.realValue || '';
    const cnpj = limparMascara(document.getElementById('cnpjOng').value);
    const whatsapp = limparMascara(document.getElementById('whatsappOng').value);

    if (!nome || !email || !senha || !cnpj) {
      mostrarMensagem('erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // 1. CHAMA API DE CADASTRO
      const res = await axios.post('/ongs', {
        nome, email, senha, cnpj, whatsapp
      });

      mostrarMensagem('sucesso', res.data.message || 'ONG cadastrada. Iniciando sessão...');

      // 2. LOGIN AUTOMÁTICO PÓS-CADASTRO
      await loginAutomaticoOng(email, senha);

    } catch (err) {
      console.error('Erro ao cadastrar ONG:', err);
      mostrarMensagem('erro', tratarRespostaErro(err));
    }
  });
}

// FUNÇÃO DE LOGIN AUTOMÁTICO PÓS-CADASTRO
async function loginAutomaticoOng(email, senha) {
  try {
    const response = await axios.post('/login', { email, senha });
    const data = response.data;

    if (!data || !data.tipo || !data.dados) {
      throw new Error("Resposta inválida do backend ao tentar login automático.");
    }

    const rawInfo = data.dados || {};
    const info = { ...rawInfo };
    delete info.senha;

    // garante id canônico
    info.id = info.id || info.ong_id || null;
    if (!info.id) throw new Error("ID do usuário ausente no retorno do backend.");

    // Salva no localStorage seguindo o padrão do login
    const usuarioStorage = {
      tipo: 'ong',
      info
    };

    localStorage.setItem('usuarioAtual', JSON.stringify(usuarioStorage));
    localStorage.setItem('ongLogada', JSON.stringify({ id: info.id, nome: info.nome || '' }));

    console.log('[INFO] Login automático ONG pós-cadastro OK:', usuarioStorage);

    // Redireciona para a página da ONG
    window.location.href = '/src/pages/user/ong.html';

  } catch (err) {
    console.error('Erro no login automático ONG pós-cadastro:', err);
    alert('Falha ao logar automaticamente após cadastro.');
    window.location.href = '/src/pages/login/login.html';
  }
}
