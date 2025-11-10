// masks.js
export function aplicarMascaras() {
  const cpf = document.getElementById('cpfAdotante');
  const cnpj = document.getElementById('cnpjOng');
  const whatsappAdotante = document.getElementById('whatsappAdotante');
  const whatsappOng = document.getElementById('whatsappOng');

  if (window.IMask) {
    if (cpf) IMask(cpf, { mask: '000.000.000-00' });
    if (cnpj) IMask(cnpj, { mask: '00.000.000/0000-00' });
    if (whatsappAdotante) IMask(whatsappAdotante, { mask: '(00) 00000-0000' });
    if (whatsappOng) IMask(whatsappOng, { mask: '(00) 00000-0000' });
  }
}

export function limparMascara(valor) {
  return valor.replace(/\D/g, '');
}
