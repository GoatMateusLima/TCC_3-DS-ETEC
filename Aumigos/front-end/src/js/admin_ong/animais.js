// animais.js — VERSÃO FINAL FUNCIONANDO (igual ao login)

document.getElementById('form-animal').addEventListener('submit', salvarAnimal);

/**
 * Carrega a lista de animais do backend.
 */
async function carregarAnimais() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-animais tbody");
    if (!tbody || !ong.id) return;
    
    tbody.innerHTML = '<tr><td colspan="8">Carregando animais...</td></tr>';

    try {
        const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets?id_ong=${ong.id}`); 
        const animais = response.data;

        tbody.innerHTML = animais.map(a => `
            <tr>
                <td>${a.animal_id}</td>
                <td>${a.nome}</td>
                <td>${a.especie}</td>
                <td>${a.raca || '-'}</td>
                <td>${a.idade}</td>
                <td>${a.sexo}</td>
                <td><span class="status-${a.status_adocao}">${a.status_adocao}</span></td>
                <td>
                    <button class="btn btn-edit" onclick="abrirModalAnimalParaEdicao(${a.animal_id})">Editar</button>
                    <button class="btn btn-delete" onclick="excluirAnimal(${a.animal_id})">Excluir</button>
                </td>
            </tr>
        `).join("");

        if (animais.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nenhum animal cadastrado.</td></tr>';
        }

    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar animais.</td></tr>';
    }
}

/**
 * Salva (cria ou edita) um animal via Axios
 */
async function salvarAnimal(e) {
    e.preventDefault();
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const animalId = document.getElementById("animal-id").value;
    const form = e.target;
    
    const formData = new FormData();
    
    formData.append('id_ong', ong.id);
    formData.append('nome', form.querySelector("#animal-nome").value);
    formData.append('especie', form.querySelector("#animal-especie").value);
    formData.append('raca', form.querySelector("#animal-raca").value);
    formData.append('idade', form.querySelector("#animal-idade").value);
    formData.append('genero', form.querySelector("#animal-genero").value);
    formData.append('descricao', form.querySelector("#animal-descricao").value);
    formData.append('status_adocao', form.querySelector("#animal-status").value);

    const imagemFile = form.querySelector("#animal-imagem").files[0];
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    } else if (!animalId) {
        alert("A imagem do animal é obrigatória para o cadastro.");
        return;
    }

    try {
        if (animalId) {
            await axios.put(`https://tcc-3-ds-etec.onrender.com/pets/${animalId}`, formData);
            alert("Animal atualizado com sucesso!");
        } else {
            await axios.post(`https://tcc-3-ds-etec.onrender.com/pets`, formData);
            alert("Animal cadastrado com sucesso!");
        }

        fecharModal("modal-animal");
        carregarAnimais(); 

    } catch (error) {
        console.error("Erro ao salvar animal:", error.response || error);
        const msg = error.response?.data?.error || "Erro desconhecido ao salvar animal.";
        alert(`Falha ao salvar animal: ${msg}`);
    }
}

function abrirModalAnimal() {
    document.getElementById("animal-id").value = "";
    document.getElementById("animal-status").value = 'disponivel';
    document.getElementById("animal-imagem-url-display").style.display = 'none';
    document.getElementById("animal-imagem-label").textContent = "Imagem *";
    document.getElementById("animal-imagem").required = true;

    abrirModal("modal-animal");
}

async function abrirModalAnimalParaEdicao(id) {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    try {
        const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets/${id}?ong_id=${ong.id}`);
        const animal = response.data.pet; 

        document.getElementById("animal-id").value = animal.animal_id; 
        document.getElementById("animal-nome").value = animal.nome;
        document.getElementById("animal-especie").value = animal.especie;
        document.getElementById("animal-raca").value = animal.raca || '';
        document.getElementById("animal-idade").value = animal.idade;
        document.getElementById("animal-genero").value = animal.sexo;
        document.getElementById("animal-descricao").value = animal.descricao || '';
        document.getElementById("animal-status").value = animal.status_adocao;
        
        const linkImg = animal.link_img || 'Nenhuma imagem cadastrada.';
        document.getElementById("animal-imagem-url-display").textContent = linkImg;
        document.getElementById("animal-imagem-url-display").style.display = 'block';
        
        document.getElementById("animal-imagem-label").textContent = "Alterar Imagem";
        document.getElementById("animal-imagem").required = false;
        document.getElementById("animal-imagem").value = '';
        
        abrirModal("modal-animal");
    } catch (error) {
        console.error("Erro ao carregar animal:", error);
        alert(`Não foi possível carregar o animal ID ${id}.`);
    }
}

async function excluirAnimal(id) {
    if (confirm("Excluir animal permanentemente? Isso também removerá a imagem do Storage.")) {
        const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
        try {
            await axios.delete(`https://tcc-3-ds-etec.onrender.com/pets/${id}`, {
                data: { id_ong: ong.id }
            });
            alert("Animal removido com sucesso!");
            carregarAnimais(); 
        } catch (error) {
            console.error("Erro ao excluir:", error.response || error);
            alert("Erro ao excluir animal.");
        }
    }
}