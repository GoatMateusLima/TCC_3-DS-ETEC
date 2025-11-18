const express = require('express');
const cors = require('cors');
const path = require('path');




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

const StaticPath = path.join(__dirname, '../../front-end', 'src');
app.use(express.static(StaticPath));

const pagesPath = path.join(StaticPath, 'pages');

app.get('/login', (req, res) => {
    res.sendFile(path.join(pagesPath, 'login.html'));
});




app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);
app.use('/login', loginRoutes);



app.get('/', (req, res) => {
    res.sendFile(path.join(StaticPath, 'index.html'));
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


