// cadastro/navigation.js
const STORAGE_KEY = 'usuario';

export function setUserAndRedirect(usuarioObj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioObj));
  if (usuarioObj.tipo === 'ong') window.location.replace('../../pages/user/Ong.html');
  else window.location.replace('../../index.html');
}

export function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function logout(redirectTo = '../../index.html') {
  localStorage.removeItem(STORAGE_KEY);
  window.location.replace(redirectTo);
}

export function guardCadastroPage() {
  const user = getLoggedUser();
  if (!user) return;
  document.querySelectorAll('form input, form button').forEach(el => el.disabled = true);
  const aviso = document.createElement('div');
  aviso.textContent = 'Você já está logado. Para criar outra conta, saia primeiro.';
  aviso.style.cssText = `
    background:#ffefc1;
    padding:8px;
    border-left:4px solid orange;
    margin-bottom:10px;
    font-weight:bold;
  `;
  document.body.prepend(aviso);
  setTimeout(() => {
    if (user.tipo === 'ong') window.location.replace('../../pages/user/Ong.html');
    else window.location.replace('../../index.html');
  }, 1500);
}
