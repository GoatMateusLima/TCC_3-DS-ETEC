const BASE_URL = "https://tcc-3-ds-etec.onrender.com/member";

document.getElementById('form-membro').addEventListener('submit', salvarMembro);

/**
 * Carrega a lista de membros do backend.
 */
async function carregarMembros() {
    // Busca o ID da ONG logada para filtrar os membros
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-membros tbody");
    if (!tbody || !ong.id) return;

    tbody.innerHTML = '<tr><td colspan="7">Carregando membros...</td></tr>';

    try {
        // GET para /members com filtro por ong_id (seu backend espera ong_id no query)
        const response = await axios.get(`${BASE_URL}/members?ong_id=${ong.id}`);
        const membros = response.data;

        tbody.innerHTML = membros.map(m => `
            <tr>
                <td>${m.membro_id}</td>
                <td>${m.nome}</td>
                <td>${m.cpf}</td>
                <td>${m.email}</td>
                <td>${m.whatsapp}</td>
                <td>${m.funcao}</td>
                <td>
                    <button class="btn btn-edit" onclick="abrirModalMembroParaEdicao(${m.membro_id})">Editar</button>
                    <button class="btn btn-delete" onclick="excluirMembro(${m.membro_id})">Excluir</button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar membros:", error);
        tbody.innerHTML = '<tr><td colspan="7">Nenhum membro encontrado ou erro de conexão.</td></tr>';
    }
}

/**
 * Salva (cria ou edita) um membro via Axios.
 * @param {Event} e - Evento de submissão do formulário.
 */
async function salvarMembro(e) {
    e.preventDefault();
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const membroId = document.getElementById("membro-id").value;
    
    const dadosMembro = {
        nome: document.getElementById("membro-nome").value,
        cpf: document.getElementById("membro-cpf").value,
        email: document.getElementById("membro-email").value,
        whatsapp: document.getElementById("membro-whatsapp").value,
        funcao: document.getElementById("membro-funcao").value,
        senha: document.getElementById("membro-senha").value, 
        ong_id: ong.id, // Envia o ID da ONG
    };
    
    // Na EDIÇÃO, se a senha estiver vazia, não a enviamos para não sobrescrever o hash
    if (membroId && !dadosMembro.senha) {
        delete dadosMembro.senha;
    }
    
    // Na CRIAÇÃO, a data de entrada será definida no backend
    
    try {
        if (membroId) {
            // Edição: PUT para /members/:id
            await axios.put(`${BASE_URL}/members/${membroId}`, dadosMembro);
            alert("Membro atualizado com sucesso!");
        } else {
            // Criação: POST para /members
            if (!dadosMembro.senha) {
                alert("A senha é obrigatória para cadastrar um novo membro.");
                return;
            }
            await axios.post(`${BASE_URL}/members`, dadosMembro);
            alert("Membro criado com sucesso!");
        }

        fecharModal("modal-membro");
        carregarMembros(); // Recarrega a lista

    } catch (error) {
        console.error("Erro ao salvar membro:", error.response || error);
        const msg = error.response?.data?.error || "Erro desconhecido ao salvar membro.";
        alert(`Falha ao salvar membro: ${msg}`);
    }
}

/**
 * Abre o modal de membro para criação.
 */
function abrirModalMembro() {
    // Limpa o formulário e configura para criação
    document.getElementById("membro-id").value = "";
    document.getElementById("membro-senha").required = true; 
    document.getElementById("membro-senha").style.display = 'block'; 
    document.getElementById("membro-senha-label").textContent = "Senha *"; // Exibe o asterisco
    fecharModal('modal-membro'); // Garante que campos limpos antes de abrir
    abrirModal("modal-membro");
}

/**
 * Abre o modal de membro e preenche os campos para edição.
 * @param {number} id - ID do membro para edição.
 */
async function abrirModalMembroParaEdicao(id) {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    try {
        // GET para /members/:id?ong_id=...
        const response = await axios.get(`${BASE_URL}/members/${id}?ong_id=${ong.id}`);
        const membro = response.data;
        
        document.getElementById("membro-id").value = membro.membro_id;
        document.getElementById("membro-nome").value = membro.nome;
        document.getElementById("membro-cpf").value = membro.cpf;
        document.getElementById("membro-email").value = membro.email;
        document.getElementById("membro-whatsapp").value = membro.whatsapp;
        document.getElementById("membro-funcao").value = membro.funcao;
        
        // Configura o campo senha para edição (opcional e vazio)
        document.getElementById("membro-senha").value = ""; 
        document.getElementById("membro-senha").required = false; 
        document.getElementById("membro-senha-label").textContent = "Nova Senha (Opcional)";
        
        abrirModal("modal-membro");
    } catch (error) {
        console.error("Erro ao carregar dados do membro:", error);
        alert(`Não foi possível carregar os dados do membro ID ${id}.`);
    }
}


/**
 * Exclui um membro via Axios.
 * @param {number} id - ID do membro a ser excluído.
 */
async function excluirMembro(id) {
    if (confirm("Tem certeza que quer excluir este membro?")) {
        try {
            // DELETE para /members/:id
            await axios.delete(`${BASE_URL}/members/${id}`);
            alert("Membro excluído!");
            carregarMembros(); 
        } catch (error) {
            console.error("Erro ao excluir membro:", error.response || error);
            alert(`Erro ao excluir membro. Status: ${error.response?.status}`);
        }
    }
}