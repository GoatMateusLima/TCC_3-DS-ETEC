// cadastro/adotante.js
import { limparMascara, mostrarMensagem } from './utils.js';
import { setUserAndRedirect } from './navigation.js';

export function initAdotanteForm() {
  const form = document.querySelector('#formAdotante');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      senha: form.senha.dataset.realValue || form.senha.value.trim(),
      cpf: limparMascara(form.cpf.value),
      telefone: limparMascara(form.telefone.value)
    };

    try {
      const res = await fetch('/api/adotante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar');
      mostrarMensagem('sucesso', 'Cadastro de adotante realizado!');
      setUserAndRedirect({ tipo: 'adotante', info: data });
    } catch (err) {
      mostrarMensagem('erro', err.message);
    }
  });
}
