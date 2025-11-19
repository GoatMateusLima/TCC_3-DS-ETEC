const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const cnpjRoutes = require('./routes/cnpjRoutes');
const petRoutes = require('./routes/petRoutes');
const ongRoutes = require('./routes/ongRoutes');
const membersRoutes = require('./routes/membersRoutes');
const adocaoRoutes = require('./routes/adocaoRoutes');
const adotanteRoutes = require('./routes/adotanteRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();
app.use(cors());
app.use(express.json());


const frontendPath = path.join(__dirname, '../../front-end');
app.use(express.static(frontendPath));


const pagesPath = path.join(frontendPath, 'src', 'pages');


app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);
app.use('/login', loginRoutes); 


app.get('/:page', (req, res, next) => {
    const page = req.params.page;

   
    const apiNames = [
        'login', 'adotante', 'adocao', 'cnpj', 'pets', 'ongs', 'members'
    ];
    if (apiNames.includes(page)) return next();

    const filePath = path.join(pagesPath, `${page}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }

    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// fallback
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na porta ${PORT}`);
});
