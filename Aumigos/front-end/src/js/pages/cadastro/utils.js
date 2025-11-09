// cadastro/utils.js
export function limparMascara(valor) {
  return valor.replace(/\D/g, '');
}

export function mostrarMensagem(tipo, texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  div.className = tipo === 'erro' ? 'alert-erro' : 'alert-sucesso';
  div.style.cssText = `
    padding: 10px; margin: 10px 0;
    border-radius: 5px; font-weight: bold;
    color: #fff;
    background: ${tipo === 'erro' ? '#e74c3c' : '#27ae60'};
  `;
  document.body.prepend(div);
  setTimeout(() => div.remove(), 3000);
}
