function validarCnpj(cnpj) {
    const regex = /^\d{14}$/;
    return regex.test(cnpj);
}

module.exports = {validarCnpj};