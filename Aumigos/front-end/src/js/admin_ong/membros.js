
async function carregarMembros() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-membros tbody");
    if (!tbody || !ong.id) return;

    tbody.innerHTML = '<tr><td colspan="7">Carregando membros...</td></tr>';

    try {
        const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/members?ong_id=${ong.id}`);
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

        if (membros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhum membro cadastrado.</td></tr>';
        }

    } catch (error) {
        console.error("Erro ao carregar membros:", error);
        tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar membros.</td></tr>';
    }
}

/**
 * Salva (cria ou edita) um membro via Axios.
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
        ong_id: ong.id
    };
    
    // Na edição, se a senha estiver vazia, remove do objeto
    if (membroId && !dadosMembro.senha) {
        delete dadosMembro.senha;
    }
    
    try {
        if (membroId) {
            await axios.put(`https://tcc-3-ds-etec.onrender.com/members/${membroId}`, dadosMembro);
            alert("Membro atualizado com sucesso!");
        } else {
            if (!dadosMembro.senha) {
                alert("A senha é obrigatória para cadastrar um novo membro.");
                return;
            }
            await axios.post(`https://tcc-3-ds-etec.onrender.com/members`, dadosMembro);
            alert("Membro criado com sucesso!");
        }

        fecharModal("modal-membro");
        carregarMembros();

    } catch (error) {
        console.error("Erro ao salvar membro:", error.response || error);
        const msg = error.response?.data?.error || "Erro desconhecido ao salvar membro.";
        alert(`Falha ao salvar membro: ${msg}`);
    }
}

function abrirModalMembro() {
    document.getElementById("membro-id").value = "";
    document.getElementById("membro-senha").required = true;
    document.getElementById("membro-senha").style.display = 'block';
    document.getElementById("membro-senha-label").textContent = "Senha *";
    
    // Limpa todos os campos
    document.querySelectorAll("#modal-membro input, #modal-membro textarea").forEach(i => i.value = "");
    
    abrirModal("modal-membro");
}

async function abrirModalMembroParaEdicao(id) {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    try {
        const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/members/${id}?ong_id=${ong.id}`);
        const membro = response.data;
        
        document.getElementById("membro-id").value = membro.membro_id;
        document.getElementById("membro-nome").value = membro.nome;
        document.getElementById("membro-cpf").value = membro.cpf;
        document.getElementById("membro-email").value = membro.email;
        document.getElementById("membro-whatsapp").value = membro.whatsapp;
        document.getElementById("membro-funcao").value = membro.funcao;
        
        document.getElementById("membro-senha").value = "";
        document.getElementById("membro-senha").required = false;
        document.getElementById("membro-senha-label").textContent = "Nova Senha (Opcional)";
        
        abrirModal("modal-membro");
    } catch (error) {
        console.error("Erro ao carregar membro:", error);
        alert(`Não foi possível carregar o membro ID ${id}.`);
    }
}

async function excluirMembro(id) {
    if (confirm("Tem certeza que quer excluir este membro permanentemente?")) {
        try {
            await axios.delete(`https://tcc-3-ds-etec.onrender.com/members/${id}`);
            alert("Membro excluído com sucesso!");
            carregarMembros();
        } catch (error) {
            console.error("Erro ao excluir:", error.response || error);
            alert("Erro ao excluir membro.");
        }
    }
}