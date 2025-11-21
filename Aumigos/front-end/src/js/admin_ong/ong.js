const BASE_URL = "https://tcc-3-ds-etec.onrender.com/ongs";// Usando a porta 3000 do seu server.js

// 🚀 Inicializa a aplicação após o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
    // 1. Carrega os dados da ONG e preenche a interface
    carregarDadosONG();
    
    // 2. Associa a função de salvar ao formulário de edição da ONG
    const formOng = document.getElementById('form-ong');
    if (formOng) {
        formOng.addEventListener('submit', salvarDadosONG);
    }

    // 3. Chama o carregamento inicial das outras tabelas
    // Essas funções (carregarMembros, carregarAnimais, carregarAdocoes) 
    // estão definidas nos seus respectivos arquivos .js e dependem do ong.id
    if (typeof carregarMembros === 'function') carregarMembros();
    if (typeof carregarAnimais === 'function') carregarAnimais();
    if (typeof carregarAdocoes === 'function') carregarAdocoes();
});

/**
 * Carrega e exibe os dados da ONG logada na interface.
 * Também preenche os campos do modal de edição.
 */
function carregarDadosONG() {
    // Pega os dados da ONG do Local Storage (assumindo que o login armazena todos os dados)
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    // Prepara as variáveis de interface
    const nomeOng = ong.nome ? ong.nome.trim() : "ONG Desconhecida";
    document.title = `${nomeOng} - ADMIN`;
    
    // Preenche os elementos visíveis
    document.querySelectorAll(".ong-name").forEach(el => el.textContent = nomeOng);
    document.getElementById("ong-nome").textContent = ong.nome || "-";
    document.getElementById("ong-email").textContent = ong.email || "-";
    document.getElementById("ong-cnpj").textContent = ong.cnpj || "-";
    document.getElementById("ong-whatsapp").textContent = ong.whatsapp || "-";
    
    // Preenche o modal de edição (para o usuário editar)
    document.getElementById("edit-ong-nome").value = ong.nome || "";
    document.getElementById("edit-ong-email").value = ong.email || "";
    document.getElementById("edit-ong-cnpj").value = ong.cnpj || "";
    document.getElementById("edit-ong-whatsapp").value = ong.whatsapp || "";
}

/**
 * Salva (atualiza) os dados da ONG no backend via requisição PUT do Axios.
 * @param {Event} e - Evento de submissão do formulário.
 */
async function salvarDadosONG(e) {
    e.preventDefault();
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const ongId = ong.id; // Assume que 'id' é a chave primária da ONG logada

    if (!ongId) {
        alert("Erro: ID da ONG não encontrado no Local Storage.");
        return;
    }

    // Coleta os dados do formulário de edição
    const dadosAtualizados = {
        // Estes campos são usados no seu backend (updateOng.js)
        nome: document.getElementById("edit-ong-nome").value,
        email: document.getElementById("edit-ong-email").value,
        cnpj: document.getElementById("edit-ong-cnpj").value, // CNPJ deve ser incluído, mesmo que seu backend não o atualize, para validação futura.
        whatsapp: document.getElementById("edit-ong-whatsapp").value
        // Se houver campos de endereço no modal, adicione aqui (rua, numero, bairro, cep)
    };
    
    // **NOTA DE AJUSTE DE ROTA:** Rota: /ongs/:id
    try {
        const response = await axios.put(`${BASE_URL}/ongs/${ongId}`, dadosAtualizados); 
        
        // Atualiza o Local Storage com os novos dados (response.data deve ser a ONG atualizada)
        localStorage.setItem("ongLogada", JSON.stringify(response.data.ong || response.data));
        carregarDadosONG(); // Recarrega os dados na interface
        fecharModal('modal-ong');
        alert("Dados da ONG atualizados com sucesso!");

    } catch (error) {
        console.error("Erro ao salvar dados da ONG:", error);
        const msg = error.response?.data?.error || "Erro desconhecido ao atualizar dados.";
        alert(`Falha na atualização. ${msg}`);
    }
}

/**
 * Função global para abrir o modal da ONG.
 */
function abrirModalONG() {
    // Carrega os dados mais recentes do Local Storage para preencher o modal antes de abrir
    carregarDadosONG(); 
    abrirModal('modal-ong');
}

// Obs: A função 'logout' está em funcoes_gerais.js