// adotante.js
import { limparMascara } from './masks.js';
import { mostrarMensagem, tratarRespostaErro } from './utils.js';
import { setUserAndRedirect } from './navigation.js';

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
      const res = await axios.post('/adotante', {
        nome, cpf, email, senha, whatsapp, data_nascimento: dataNascimento
      });
      mostrarMensagem('sucesso', res.data.message || 'Adotante cadastrado.');
      setUserAndRedirect({ tipo: 'adotante', info: res.data });
    } catch (err) {
      console.error('Erro cadastrar adotante', err);
      mostrarMensagem('erro', tratarRespostaErro(err));
    }
  });
}
