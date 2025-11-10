export function inicializarSenhaVisual() {
  const camposSenha = document.querySelectorAll('input[type="password"]');
  if (!camposSenha.length) return;

  camposSenha.forEach((campoSenha) => {
    // Evita aplicar duas vezes
    if (campoSenha.dataset.patinhasAtivado) return;
    campoSenha.dataset.patinhasAtivado = 'true';

    // Cria wrapper
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.width = '100%';

    campoSenha.type = 'text';
    campoSenha.dataset.realValue = '';
    campoSenha.value = '';

    Object.assign(campoSenha.style, {
      fontFamily: 'monospace',
      letterSpacing: '2px',
      fontSize: '18px',
      paddingRight: '35px',
    });

    campoSenha.placeholder = 'Digite sua senha 🐾';

    // Cadeado
    const cadeado = document.createElement('span');
    cadeado.textContent = '🔒';
    cadeado.style.position = 'absolute';
    cadeado.style.right = '10px';
    cadeado.style.cursor = 'pointer';
    cadeado.style.fontSize = '20px';

    // Evento de digitação
    campoSenha.addEventListener('input', (e) => {
      const realValue = campoSenha.dataset.realValue || '';
      const inputValue = e.data || '';

      if (e.inputType === 'deleteContentBackward') {
        campoSenha.dataset.realValue = realValue.slice(0, -1);
      } else if (inputValue) {
        campoSenha.dataset.realValue = realValue + inputValue;
      }

      const tamanho = campoSenha.dataset.realValue.length;
      campoSenha.value = '🐾'.repeat(tamanho);
    });

    // Alternar visibilidade
    let visivel = false;
    cadeado.addEventListener('click', () => {
      visivel = !visivel;
      if (visivel) {
        cadeado.textContent = '🔓';
        campoSenha.value = campoSenha.dataset.realValue;
      } else {
        cadeado.textContent = '🔒';
        campoSenha.value = '🐾'.repeat(campoSenha.dataset.realValue.length);
      }
    });

    // Montagem final
    campoSenha.parentNode.insertBefore(wrapper, campoSenha);
    wrapper.appendChild(campoSenha);
    wrapper.appendChild(cadeado);
  });
}
