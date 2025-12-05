const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// ============= CAMINHO CORRETO PARA O FRONT-END =============
const frontEndPath = path.join(__dirname, '..', '..', 'front-end');

app.use(express.static(frontEndPath));
app.use('/src', express.static(path.join(frontEndPath, 'src')));

//rotas
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


app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(frontEndPath, 'src', 'pages', `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    return next();
});

// ============= FALLBACK SEGURO PARA SPA =============

app.use((req, res, next) => {
   
    try {
        if (req.method === 'GET' && req.accepts && req.accepts('html')) {
            return res.sendFile(path.join(frontEndPath, 'index.html'));
        }
    } catch (err) {
        console.error('Erro no fallback do SPA:', err);
    }
    return next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});