const { buscarCnpj } = require('../services/brasilApi');
async function validarCnpj(cnpj) {
    // Validar formato básico
    const regex = /^\d{14}$/;
    if (!regex.test(cnpj)) return false;

    try {
        const dados = await buscarCnpj(cnpj);

        const natureza = (dados.natureza_juridica || '').toLowerCase();

        // Verifica se a natureza jurídica indica ONG
        if (natureza.includes('associação') || natureza.includes('ong') || natureza.includes('sem fins lucrativos')) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Erro ao consultar Brasil API:', err.message);
        return false; // não deixa passar se não conseguiu validar
    }
}

module.exports = { validarCnpj };
