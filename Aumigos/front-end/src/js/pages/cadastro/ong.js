// cadastro/ong.js


export function initOngForm() {
  const form = document.querySelector('#formOng');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const dados = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      senha: form.senha.dataset.realValue || form.senha.value.trim(),
      cnpj: limparMascara(form.cnpj.value),
      whatsapp: limparMascara(form.whatsapp.value)
    };

    try {
      const response = await axios.post('/api/ong', dados);
      const data = response.data;

      mostrarMensagem('sucesso', 'Cadastro de ONG realizado!');
      setUserAndRedirect({ tipo: 'ong', info: data });

    } catch (err) {
      mostrarMensagem('erro', err.response?.data?.message || 'Erro ao cadastrar ONG.');
    }
  });
}
