const express = require('express');
const cors = require('cors');



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


const path = require('path');
app.use(express.static(path.join(__dirname, '../../front-end/src')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front-end/src/index.html'));
});


app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);
app.use('/login', loginRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


