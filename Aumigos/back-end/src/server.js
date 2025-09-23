const express = require('express');
const cnpjRoutes = require('./routes/cnpjRoutes');

const app = express();

app.use(express.json());

app.use('/cnpj', cnpjRoutes);

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


