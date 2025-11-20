const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONFIGURAÇÃO CORRETA DO FRONT-END ======
const buildPath = path.join(__dirname, '..', '..', 'front-end'); // ajusta conforme sua estrutura real

// SERVIR TODOS OS ARQUIVOS ESTÁTICOS (CSS, JS, IMG) DA PASTA src
app.use('/src', express.static(path.join(buildPath, 'src')));

// SERVIR A RAIZ DO SITE (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// ROTA DINÂMICA PARA PÁGINAS HTML DENTRO DE src/pages/
app.get('/:page', (req, res, next) => {
    const page = req.params.page;

    // Evita que rotas da API sejam tratadas como páginas
    const apiRoutes = ['login', 'adotante', 'adocao', 'cnpj', 'pets', 'ongs', 'members'];
    if (apiRoutes.includes(page)) return next();

    const filePath = path.join(buildPath, 'src', 'pages', `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    // Se não existir, cai no fallback (index.html)
    next();
});

// ====== ROTAS DA API (devem vir DEPOIS das rotas de página) ======
const cnpjRoutes = require('./routes/cnpjRoutes');
const petRoutes = require('./routes/petRoutes');
const ongRoutes = require('./routes/ongRoutes');
const membersRoutes = require('./routes/membersRoutes');
const adocaoRoutes = require('./routes/adocaoRoutes');
const adotanteRoutes = require('./routes/adotanteRoutes');
const loginRoutes = require('./routes/loginRoutes');

app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);
app.use('/login', loginRoutes);

// FALLBACK: qualquer rota não encontrada → volta pro index.html (ótimo pra SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: https://seusite.onrender.com`);
});