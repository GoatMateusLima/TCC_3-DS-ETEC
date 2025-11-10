// navigation.js
export function setUserAndRedirect(userData) {
  localStorage.setItem('usuarioAtual', JSON.stringify(userData));
  if (userData.tipo === 'ong') {
    window.location.href = '/dashboard_ong.html';
  } else {
    window.location.href = '/dashboard.html';
  }
}

export function verificarLoginExistente() {
  const user = localStorage.getItem('usuarioAtual');
  if (user) {
    console.warn('Usuário já logado, redirecionando...');
    const u = JSON.parse(user);
    if (u.tipo === 'ong') window.location.href = '/dashboard_ong.html';
    else window.location.href = '/dashboard.html';
  }
}
