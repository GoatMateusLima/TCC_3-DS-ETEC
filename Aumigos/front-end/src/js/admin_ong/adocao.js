/**
 * Carrega a lista de adoções do backend.
 */
async function carregarAdocoes() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-adocoes tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6">Carregando adoções...</td></tr>';

    try {
        const response = await axios.get(`/adocao/adocao?ongId=${ong.id}`);
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

        if (adocoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma adoção encontrada.</td></tr>';
        }

    } catch (error) {
        console.error("Erro ao carregar adoções:", error);
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar adoções.</td></tr>';
    }
}

async function finalizarAdocao(id) {
    if (confirm(`Tem certeza que deseja finalizar a adoção ID ${id}?`)) {
        try {
            await axios.put(`/adocao/adocao/${id}`, { status: 'Finalizada' });
            alert("Adoção finalizada com sucesso!");
            carregarAdocoes();
        } catch (error) {
            console.error("Erro:", error.response || error);
            alert("Erro ao finalizar adoção: " + (error.response?.data?.message || error.message));
        }
    }
}

function detalhesAdocao(id) {
    alert(`Detalhes da adoção ${id} — em breve com modal completo!`);
}