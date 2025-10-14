// Aumigos/back-end/src/services/brasilApi.js
const axios = require("axios");

async function buscarCnpj(cnpj) {
  try {
    const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);

    // Se a BrasilAPI não achar o CNPJ, ela ainda retorna 200, mas com status "ERROR" — então verificamos
    if (!response.data || response.data.status === "ERROR") {
      throw new Error("CNPJ não encontrado ou inválido.");
    }

    const data = response.data;

    return {
      cnpj: data.cnpj,
      razao_social: data.razao_social,
      nome_fantasia: data.nome_fantasia,
      descricao_tipo_de_logradouro: data.descricao_tipo_de_logradouro,
      logradouro: data.logradouro,
      numero: data.numero,
      bairro: data.bairro,
      municipio: data.municipio,
      uf: data.uf,
      cep: data.cep,
      natureza_juridica: data.natureza_juridica,
      situacao_cadastral: data.situacao_cadastral,
      data_abertura: data.data_inicio_atividade,
      tipo: data.cnae_fiscal_descricao, // aqui conseguimos identificar se é ONG, loja, etc
    };
  } catch (error) {
    console.error("❌ Erro ao consultar BrasilAPI:", error.response?.data || error.message);
    throw new Error("Erro ao consultar a BrasilAPI. Verifique o CNPJ e tente novamente.");
  }
}

module.exports = { buscarCnpj };
