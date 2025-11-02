const express = require('express');
const cors = require('cors');
const path = require('path');
const fallback = require('express-history-api-fallback')



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

app.use('/adotante', adotanteRoutes);
app.use('/adocao', adocaoRoutes);
app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);
app.use('/members', membersRoutes);
app.use('/login', loginRoutes); 


const root = path.join(__dirname, '../../front-end/src');
app.use(express.static(root));
app.use(fallback('index.html', { root }));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


