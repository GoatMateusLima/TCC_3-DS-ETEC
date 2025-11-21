const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// ============= CAMINHO CORRETO PARA O FRONT-END =============
const frontEndPath = path.join(__dirname, '..', '..', 'front-end');

// 1. SERVIR ARQUIVOS ESTÁTICOS (CSS, JS, IMG, etc)
// Serve a raiz do front-end (inclui index.html) e mantém /src para compatibilidade
app.use(express.static(frontEndPath));
app.use('/src', express.static(path.join(frontEndPath, 'src')));

// ============= ROTAS DA API (MONTAR ANTES DAS ROTAS DE PÁGINA) =============
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

// 2. PÁGINA INICIAL
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'index.html'));
});

// 3. ROTAS DINÂMICAS PARA PÁGINAS (faq, dashboard, etc)
// Esta rota vem depois das APIs para não conflitarem. Só responde a GETs.
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(frontEndPath, 'src', 'pages', `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    return next();
});

// ============= FALLBACK SEGURO PARA SPA =============
// Serve index.html apenas para GETs que aceitam HTML. Assim evitamos
// responder a POST/PUT/DELETE de APIs com o index.html (e reduzimos o risco
// de problemas em alguns provedores de deploy).
app.get('*', (req, res) => {
    if (req.method !== 'GET') return res.status(404).send('Not found');
    if (!req.accepts || !req.accepts('html')) return res.status(404).send('Not found');
    return res.sendFile(path.join(frontEndPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});