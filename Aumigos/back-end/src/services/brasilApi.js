const axios = require("axios");

async function buscarCnpj(cnpj) {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        return response.data;
    } catch (error) {
        throw new Error("Erro ao consultar a Brasil API: ");
    }
}

module.exports = { buscarCnpj};

