// ong.js
import { limparMascara } from './masks.js';
import { mostrarMensagem, tratarRespostaErro } from './utils.js';
import { setUserAndRedirect } from './navigation.js';

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
      const response = await axios.post('https://tcc-3-ds-etec.onrender.com/ongs', {
        nome, email, senha, cnpj, whatsapp
      });
      mostrarMensagem('sucesso', response.data.message || 'ONG cadastrada.');
      setUserAndRedirect({ tipo: 'ong', info: response.data });
    } catch (err) {
      console.error('Erro cadastrar ONG', err);
      mostrarMensagem('erro', tratarRespostaErro(err));
    }
  });
}
