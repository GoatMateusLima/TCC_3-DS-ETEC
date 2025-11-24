// main.js
import { aplicarMascaras } from './masks.js';
import { initAdotanteForm } from './adotante.js';
import { initOngForm } from './ong.js';
import { inicializarSenhaVisual } from './password-visual.js';

export function inicializarCadastro() {
  aplicarMascaras();
  inicializarSenhaVisual();
  initAdotanteForm();
  initOngForm();
}
