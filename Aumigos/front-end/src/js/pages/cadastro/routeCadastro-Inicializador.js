// index-cadastro.js
// Este arquivo centraliza todos os módulos JS do cadastro.
// Ele importa e inicializa cada módulo, servindo como ponto único de entrada para o front-end.

import './utils.js';
import './masks.js';
import './password-visual.js';
import './adotante.js';
import './ong.js';
import './main.js';
// cadastro/index-cadastro.js
import { inicializarCadastro } from './main.js';
document.addEventListener('DOMContentLoaded', inicializarCadastro);


// Log para confirmar que o bundle foi carregado
console.log('%c[Módulos de Cadastro]', 'color: #4CAF50; font-weight: bold;', 'Todos os módulos foram carregados com sucesso ✅');
