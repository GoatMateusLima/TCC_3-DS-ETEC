const express = require('express');
const cors = require('cors');
const cnpjRoutes = require('./routes/cnpjRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/cnpj', cnpjRoutes);

const PORT = 3000;
app.listen(PORT, () =>{
    console.log(`Server executando na ${PORT}`);
});


