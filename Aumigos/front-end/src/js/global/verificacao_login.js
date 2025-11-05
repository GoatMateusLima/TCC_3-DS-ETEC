function verificarLogin(tipoEsperado) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  // 🔒 Se o tipo não for o esperado, bloqueia
  if (tipoEsperado && usuario.tipo !== tipoEsperado) {
    alert('Acesso negado! Você não tem permissão para acessar esta página.');
    window.location.href = 'login.html';
    return;
  }

  console.log(`✅ Usuário logado como ${usuario.tipo}`);
  return usuario;
}

window.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario) {
    if (usuario.tipo === 'ong') {
      window.location.href = 'painel_ong.html';
    } else if (usuario.tipo === 'adotante') {
      window.location.href = 'localhost:3000/';
    }
  }
});