const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// ============= CAMINHO CORRETO PARA O FRONT-END =============
const frontEndPath = path.join(__dirname, '..', '..', 'front-end');

// 1. SERVIR ARQUIVOS ESTÁTICOS (CSS, JS, IMG, etc)
app.use('/src', express.static(path.join(frontEndPath, 'src')));

// 2. PÁGINA INICIAL
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

// 3. ROTAS DINÂMICAS PARA PÁGINAS (faq, dashboard, etc)
app.get('/:page', (req, res) => {
    const page = req.params.page;

    // Bloqueia nomes que são rotas da API
    const blocked = ['login', 'adotante', 'adocao', 'cnpj', 'pets', 'ongs', 'members'];
    if (blocked.includes(page)) {
        return res.status(404).send('Rota da API');
    }

    const filePath = path.join(frontEndPath, 'src', 'pages', `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    // Se a página não existir → volta pro index.html (SPA behavior)
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

// ============= ROTAS DA API (DEPOIS de tudo) =============
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

// ============= FALLBACK FINAL (NUNCA MAIS USAREMOS app.get('*') =============
// Em vez de app.get('*'), usamos app.use() no final
app.use((req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});