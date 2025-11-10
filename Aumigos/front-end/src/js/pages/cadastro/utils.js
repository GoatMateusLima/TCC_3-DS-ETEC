// utils.js
export function mostrarMensagem(tipo, texto) {
  let box = document.querySelector('.msg-flutuante');
  if (!box) {
    box = document.createElement('div');
    box.className = 'msg-flutuante';
    document.body.appendChild(box);

    // CSS direto via JS
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      padding: '12px 18px',
      borderRadius: '12px',
      color: '#fff',
      fontWeight: '600',
      zIndex: '9999',
      transition: 'opacity 0.4s ease',
      opacity: '0',
      pointerEvents: 'none'
    });
  }

  box.textContent = texto;
  box.style.background = tipo === 'sucesso' ? '#28a745' : '#d9534f';
  box.style.opacity = '1';

  setTimeout(() => { box.style.opacity = '0'; }, 3000);
}

export function tratarRespostaErro(err) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  return 'Erro inesperado. Tente novamente.';
}
