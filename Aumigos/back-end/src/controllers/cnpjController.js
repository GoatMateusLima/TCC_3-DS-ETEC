const {buscarCnpj} = require("../services/brasilApi");
const {validarCnpj} = require("../utils/validarCnpj");

async function getCnpj( req, res) {
    const {cnpj} = req.params;

    if (!validarCnpj(cnpj)) {
        return res.status(400).json({error: "CNPJ invalido"});
    }
    try{
        const dados = await buscarCnpj(cnpj);
        return res.json(dados);
    } catch (error) {
        return res.status(500).json({error: "Erro ao bucar dados do CNPJ"});
    }
}

module.exports = {getCnpj};
