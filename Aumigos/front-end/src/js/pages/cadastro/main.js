// cadastro/main.js
import { inicializarCamposDeSenha } from './password-visual.js';
import { aplicarMascaraCNPJ, aplicarMascaraCPF, aplicarMascaraTelefone } from './masks.js';
import { guardCadastroPage } from './navigation.js';
import { initAdotanteForm } from './adotante.js';
import { initOngForm } from './ong.js';

export function inicializarCadastro() {
  guardCadastroPage();
  inicializarCamposDeSenha();

  // Aplica máscaras visuais
  document.querySelectorAll('input[name="cpf"]').forEach(inp =>
    inp.addEventListener('input', e => e.target.value = aplicarMascaraCPF(e.target.value))
  );
  document.querySelectorAll('input[name="cnpj"]').forEach(inp =>
    inp.addEventListener('input', e => e.target.value = aplicarMascaraCNPJ(e.target.value))
  );
  document.querySelectorAll('input[name="telefone"], input[name="whatsapp"]').forEach(inp =>
    inp.addEventListener('input', e => e.target.value = aplicarMascaraTelefone(e.target.value))
  );

  // Inicializa cada formulário
  initAdotanteForm();
  initOngForm();
}
