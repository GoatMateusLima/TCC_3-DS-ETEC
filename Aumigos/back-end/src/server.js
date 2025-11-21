const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// ============= CORREÇÃO DE CAMINHO PARA DEPLOY/RENDER =============
// Usamos path.resolve(__dirname, '..') para obter o caminho absoluto do diretório-pai
// onde a pasta 'front-end' deve estar.
const ROOT_DIR = path.resolve(__dirname, '..'); 
const frontEndPath = path.join(ROOT_DIR, 'front-end');

// 1. SERVIR ARQUIVOS ESTÁTICOS (CSS, JS, IMG, etc.)
// 🛑 CORREÇÃO CRUCIAL: Servir a pasta 'src' através da URL '/src'
// Isto resolve os caminhos no seu HTML que usam <script src="/src/js/..."
app.use('/src', express.static(path.join(frontEndPath, 'src')));

// 2. Servir a raiz do front-end (onde está o index.html, se ele estiver em 'front-end/')
app.use(express.static(frontEndPath)); 

// ============= ROTAS DA API (MANTIDO) =============
const cnpjRoutes = require('./routes/cnpjRoutes');
const petRoutes = require('./routes/petRoutes');
const ongRoutes = require('./routes/ongRoutes');
const membersRoutes = require('./routes/membersRoutes');
const adocaoRoutes = require('./routes/adocaoRoutes');
const adotanteRoutes = require('./routes/adotanteRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use('/login', loginRoutes);
app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);


// ============= ROTAS PARA PÁGINAS (MANTIDO E OTIMIZADO) =============

// PÁGINA INICIAL
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

// ROTAS DINÂMICAS PARA PÁGINAS (faq, dashboard, etc)
app.get('/:page', (req, res) => {
    const page = req.params.page;

    // Bloqueia rotas da API e o próprio prefixo de estáticos
    const blocked = ['login', 'adotante', 'adocao', 'cnpj', 'pets', 'ongs', 'members', 'src'];
    if (blocked.includes(page)) {
        return res.status(404).send('Rota da API');
    }

    // Tenta encontrar a página dentro de src/pages/
    const filePath = path.join(frontEndPath, 'src', 'pages', `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    // Fallback: Se não for página, retorna o index (para roteamento via JS/SPA)
    res.sendFile(path.join(frontEndPath, 'index.html'));
});


// 🛑 FALLBACK FINAL: Qualquer rota não tratada (mesmo com método diferente de GET)
app.use((req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});