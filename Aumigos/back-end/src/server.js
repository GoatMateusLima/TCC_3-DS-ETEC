const express = require('express');
const cors = require('cors');

const cnpjRoutes = require('./routes/cnpjRoutes');
const petRoutes = require('./routes/petRoutes');
const ongRoutes = require('./routes/ongRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/cnpj', cnpjRoutes);
app.use('/pets', petRoutes);
app.use('/ongs', ongRoutes);

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


