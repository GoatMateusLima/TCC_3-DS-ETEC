const BASE_URL = "https://tcc-3-ds-etec.onrender.com/pets";

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
        // GET para /pets com filtro por id_ong (nome que o backend usa para o query param)
        const response = await axios.get(`${BASE_URL}/pets?id_ong=${ong.id}`); 
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

    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        tbody.innerHTML = '<tr><td colspan="8">Nenhum animal cadastrado ou erro de conexão.</td></tr>';
    }
}

/**
 * Salva (cria ou edita) um animal via Axios, usando FormData para o arquivo.
 * @param {Event} e - Evento de submissão do formulário.
 */
async function salvarAnimal(e) {
    e.preventDefault();
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const animalId = document.getElementById("animal-id").value;
    const form = e.target;
    
    // 1. Cria o objeto FormData
    const formData = new FormData();
    
    // 2. Anexa dados de texto (usando os nomes que o backend espera no req.body)
    formData.append('id_ong', ong.id);
    formData.append('nome', form.querySelector("#animal-nome").value);
    formData.append('especie', form.querySelector("#animal-especie").value);
    formData.append('raca', form.querySelector("#animal-raca").value);
    formData.append('idade', form.querySelector("#animal-idade").value);
    formData.append('genero', form.querySelector("#animal-genero").value); // Será mapeado para 'sexo' no backend
    formData.append('descricao', form.querySelector("#animal-descricao").value);
    formData.append('status_adocao', form.querySelector("#animal-status").value);

    // 3. Anexa o arquivo de imagem
    const imagemFile = form.querySelector("#animal-imagem").files[0];
    if (imagemFile) {
        // O nome do campo 'imagem' deve ser o nome esperado pelo Multer no backend (ex: 'imagem')
        formData.append('imagem', imagemFile); 
    } else if (!animalId) {
        // Se for criação e não houver arquivo, cancela (A imagem é obrigatória na criação)
        alert("A imagem do animal é obrigatória para o cadastro.");
        return;
    }

    try {
        if (animalId) {
            // Edição: PUT para /pets/:id. Headers Content-Type: multipart/form-data é automático com FormData
            await axios.put(`${BASE_URL}/pets/${animalId}`, formData);
            alert("Animal atualizado com sucesso!");
        } else {
            // Criação: POST para /pets
            await axios.post(`${BASE_URL}/pets`, formData);
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

/**
 * Abre o modal de animal para criação.
 */
function abrirModalAnimal() {
    document.getElementById("animal-id").value = "";
    document.getElementById("animal-status").value = 'disponivel';
    // Oculta a URL/input de arquivo e torna obrigatório para criação
    document.getElementById("animal-imagem-url-display").style.display = 'none';
    document.getElementById("animal-imagem-label").textContent = "Imagem *";
    document.getElementById("animal-imagem").required = true;

    abrirModal("modal-animal");
}

/**
 * Abre o modal de animal e preenche os campos para edição.
 * @param {number} id - ID do animal.
 */
async function abrirModalAnimalParaEdicao(id) {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    
    try {
        const response = await axios.get(`${BASE_URL}/pets/${id}?ong_id=${ong.id}`);
        const animal = response.data.pet; 

        document.getElementById("animal-id").value = animal.animal_id; 
        document.getElementById("animal-nome").value = animal.nome;
        document.getElementById("animal-especie").value = animal.especie;
        document.getElementById("animal-raca").value = animal.raca;
        document.getElementById("animal-idade").value = animal.idade;
        document.getElementById("animal-genero").value = animal.sexo; // Recebe o nome do SQL
        document.getElementById("animal-descricao").value = animal.descricao;
        document.getElementById("animal-status").value = animal.status_adocao;
        
        // Exibe o link da imagem atual
        const linkImg = animal.link_img || 'Nenhuma imagem cadastrada.';
        document.getElementById("animal-imagem-url-display").textContent = linkImg;
        document.getElementById("animal-imagem-url-display").style.display = 'block';
        
        // O campo de arquivo é opcional e limpo na edição
        document.getElementById("animal-imagem-label").textContent = "Alterar Imagem";
        document.getElementById("animal-imagem").required = false;
        document.getElementById("animal-imagem").value = ''; // Limpa o input file
        
        abrirModal("modal-animal");
    } catch (error) {
        console.error("Erro ao carregar dados do animal:", error);
        alert(`Não foi possível carregar os dados do animal ID ${id}.`);
    }
}

/**
 * Exclui um animal via Axios.
 * @param {number} id - ID do animal.
 */
async function excluirAnimal(id) {
    if (confirm("Excluir animal permanentemente? Isso também removerá a imagem do Storage.")) {
        const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
        try {
            await axios.delete(`${BASE_URL}/pets/${id}`, {
                data: { id_ong: ong.id } // Backend espera id_ong no body
            });
            alert("Animal removido com sucesso!");
            carregarAnimais(); 
        } catch (error) {
            console.error("Erro ao excluir animal:", error.response || error);
            alert(`Erro ao excluir animal. Status: ${error.response?.status}`);
        }
    }
}