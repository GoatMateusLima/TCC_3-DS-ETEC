// routeCadastro-Inicializador.js
import './utils.js';
import './masks.js';
import './password-visual.js';
import './adotante.js';
import './ong.js';
import { inicializarCadastro } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    inicializarCadastro();
    console.log('%c[Cadastro] Inicializado', 'color: #4CAF50; font-weight: bold;');
  } catch (err) {
    console.error('Erro ao inicializar cadastro:', err);
  }
});
