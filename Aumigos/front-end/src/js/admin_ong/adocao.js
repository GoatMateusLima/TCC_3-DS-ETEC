const BASE_URL = "https://tcc-3-ds-etec.onrender.com/adocao"; // Base URL para comunicação com o Express

/**
 * Carrega a lista de adoções do backend.
 */
async function carregarAdocoes() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-adocoes tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6">Carregando adoções...</td></tr>';

    try {
        // Rota: /adocao
        // O backend deve filtrar pela ongId no query param ou no token de auth
        const response = await axios.get(`${BASE_URL}/adocao?ongId=${ong.id}`);
        const adocoes = response.data;

        tbody.innerHTML = adocoes.map(a => `
            <tr>
                <td>${a.id}</td>
                <td>${a.nomeAnimal}</td>
                <td>${a.nomeAdotante}</td>
                <td>${new Date(a.dataSolicitacao).toLocaleDateString('pt-BR')}</td>
                <td><span style="color:${a.status === 'Pendente' ? '#f1c40f' : a.status === 'Finalizada' ? '#27ae60' : '#e74c3c'}">${a.status}</span></td>
                <td>
                    ${a.status === 'Pendente' ? `<button class="btn btn-finalizar" onclick="finalizarAdocao(${a.id})">Finalizar</button>` : 'Finalizada'}
                    <button class="btn" onclick="detalhesAdocao(${a.id})">Detalhes</button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar adoções:", error);
        tbody.innerHTML = '<tr><td colspan="6">Nenhuma adoção pendente ou erro de conexão.</td></tr>';
    }
}

/**
 * Finaliza uma adoção (ex: muda o status para 'Finalizada').
 * @param {number} id - ID da adoção a ser finalizada.
 */
async function finalizarAdocao(id) {
    if (confirm(`Tem certeza que deseja finalizar a adoção ID ${id}? Isso irá marcar o animal como 'Adotado'.`)) {
        try {
            // Rota: /adocao/:id (supondo que a rota de PUT/PATCH lida com a finalização)
            // Se houver uma rota específica: await axios.patch(`${BASE_URL}/adocao/${id}/finalizar`);
            
            // Usando a rota de PUT/PATCH padrão e enviando o status atualizado
            await axios.put(`${BASE_URL}/adocao/${id}`, { status: 'Finalizada' });

            alert("Adoção finalizada com sucesso!");
            carregarAdocoes(); // Recarrega a tabela
        } catch (error) {
            console.error("Erro ao finalizar adoção:", error.response || error);
            alert(`Erro ao finalizar adoção. Status: ${error.response?.status}`);
        }
    }
}

/**
 * Exibe os detalhes de uma adoção.
 * @param {number} id - ID da adoção.
 */
function detalhesAdocao(id) {
    alert(`Visualizar detalhes da adoção ID ${id}. Necessário modal de detalhes.`);
    // Lógica para abrir um modal de detalhes e carregar dados via GET
}