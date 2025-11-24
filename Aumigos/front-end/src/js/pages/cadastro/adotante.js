// adotante.js
import { limparMascara } from './masks.js';
import { mostrarMensagem, tratarRespostaErro } from './utils.js';

export function initAdotanteForm() {
  const form = document.getElementById('formAdotante');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeAdotante').value.trim();
    const cpf = limparMascara(document.getElementById('cpfAdotante').value);
    const email = document.getElementById('emailAdotante').value.trim();
    const senha = document.getElementById('senhaAdotante').dataset.realValue || '';
    const whatsapp = limparMascara(document.getElementById('whatsappAdotante').value);
    const dataNascimento = document.getElementById('dataNascimentoAdotante').value || null;

    if (!nome || !cpf || !email || !senha) {
      mostrarMensagem('erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // 1. CHAMA API DE CADASTRO
      const res = await axios.post('/adotante', {
        nome,
        cpf,
        email,
        senha,
        whatsapp,
        data_nascimento: dataNascimento
      });

      // Mensagem de sucesso
      mostrarMensagem('sucesso', res.data.message || 'Adotante cadastrado. Iniciando sessão...');

      // 2. LOGIN AUTOMÁTICO PÓS-CADASTRO
      await loginAutomaticoAdotante(email, senha);

    } catch (err) {
      console.error('Erro ao cadastrar adotante:', err);
      mostrarMensagem('erro', tratarRespostaErro(err));
    }
  });
}

// FUNÇÃO DE LOGIN AUTOMÁTICO PÓS-CADASTRO
async function loginAutomaticoAdotante(email, senha) {
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
    info.id = info.id || info.adotante_id || null;
    if (!info.id) throw new Error("ID do usuário ausente no retorno do backend.");

    // Salva no localStorage seguindo o padrão do login
    const usuarioStorage = {
      tipo: 'adotante',
      info
    };

    localStorage.setItem('usuarioAtual', JSON.stringify(usuarioStorage));
    localStorage.setItem('adotanteLogado', JSON.stringify({ id: info.id, nome: info.nome || '' }));

    console.log('[INFO] Login automático pós-cadastro OK:', usuarioStorage);

    // Redireciona para a página do adotante
    window.location.href = '/index.html';

  } catch (err) {
    console.error('Erro no login automático pós-cadastro:', err);
    alert('Falha ao logar automaticamente após cadastro.');
    window.location.href = '/src/pages/login/login.html';
  }
}
