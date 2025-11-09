// cadastro/password-visual.js
export function inicializarCamposDeSenha() {
  document.querySelectorAll('input[type="password"]').forEach(input => {
    // Exibir a senha diretamente, mas com 🐾 no lugar dos caracteres
    input.type = 'text';
    const substituirPorPatinhas = e => {
      const valor = e.target.value;
      e.target.dataset.realValue = valor;
      e.target.value = '🐾'.repeat(valor.length);
    };
    input.addEventListener('input', substituirPorPatinhas);
    input.addEventListener('focus', substituirPorPatinhas);
    input.addEventListener('blur', substituirPorPatinhas);
  });
}
