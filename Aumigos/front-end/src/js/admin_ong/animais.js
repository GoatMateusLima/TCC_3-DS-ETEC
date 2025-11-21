// animais.js — VERSÃO REVISADA

document.addEventListener('DOMContentLoaded', async () => {
    const formAnimal = document.getElementById('form-animal');
    const tabelaAnimaisBody = document.querySelector("#tabela-animais tbody");
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");

    if (!formAnimal) return console.error("Formulário de animal não encontrado!");
    if (!tabelaAnimaisBody) return console.error("Tabela de animais não encontrada!");
    if (!ong.id) return console.error("ONG logada não encontrada ou sem ID!");

    // --- Função para abrir modal ---
    function abrirModal(id) {
        const m = document.getElementById(id);
        if (m) m.style.display = 'flex';
    }
    function fecharModal(id) {
        const m = document.getElementById(id);
        if (m) m.style.display = 'none';
    }

    // --- Abrir modal ao clicar no botão "Adicionar Animal" ---
    const btnAdicionar = document.getElementById('btn-adicionar-animal');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            formAnimal.reset();
            document.getElementById("animal-id").value = '';
            document.getElementById("animal-status").value = 'disponivel';
            document.getElementById("animal-imagem-url-display").style.display = 'none';
            document.getElementById("animal-imagem-label").textContent = "Imagem *";
            document.getElementById("animal-imagem").required = true;
            abrirModal("modal-animal");
        });
    }

    // --- Carregar lista de animais ---
    async function carregarAnimais() {
        tabelaAnimaisBody.innerHTML = '<tr><td colspan="8">Carregando animais...</td></tr>';
        try {
            const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets?id_ong=${ong.id}`);
            const animais = response.data;
            if (!animais || animais.length === 0) {
                tabelaAnimaisBody.innerHTML = '<tr><td colspan="8">Nenhum animal cadastrado.</td></tr>';
                return;
            }

            tabelaAnimaisBody.innerHTML = animais.map(a => `
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
            tabelaAnimaisBody.innerHTML = '<tr><td colspan="8">Erro ao carregar animais.</td></tr>';
        }
    }

    // --- Salvar animal ---
    async function salvarAnimal(e) {
        e.preventDefault();
        const animalId = document.getElementById("animal-id").value;
        const formData = new FormData(formAnimal);
        formData.append('id_ong', ong.id);

        if (!animalId && !formData.get('imagem').name) {
            alert("A imagem do animal é obrigatória.");
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

    formAnimal.addEventListener('submit', salvarAnimal);

    // --- Editar animal ---
    window.abrirModalAnimalParaEdicao = async function(id) {
        try {
            const response = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets/${id}?ong_id=${ong.id}`);
            const animal = response.data.pet;

            formAnimal.reset();
            document.getElementById("animal-id").value = animal.animal_id;
            document.getElementById("animal-nome").value = animal.nome;
            document.getElementById("animal-especie").value = animal.especie;
            document.getElementById("animal-raca").value = animal.raca || '';
            document.getElementById("animal-idade").value = animal.idade;
            document.getElementById("animal-genero").value = animal.sexo;
            document.getElementById("animal-descricao").value = animal.descricao || '';
            document.getElementById("animal-status").value = animal.status_adocao;

            const linkImg = animal.link_img || 'Nenhuma imagem cadastrada.';
            const displayImg = document.getElementById("animal-imagem-url-display");
            displayImg.textContent = linkImg;
            displayImg.style.display = 'block';
            document.getElementById("animal-imagem-label").textContent = "Alterar Imagem";
            document.getElementById("animal-imagem").required = false;

            abrirModal("modal-animal");
        } catch (error) {
            console.error("Erro ao carregar animal:", error);
            alert(`Não foi possível carregar o animal ID ${id}.`);
        }
    };

    // --- Excluir animal ---
    window.excluirAnimal = async function(id) {
        if (!confirm("Excluir animal permanentemente?")) return;
        try {
            await axios.delete(`https://tcc-3-ds-etec.onrender.com/pets/${id}`, { data: { id_ong: ong.id } });
            alert("Animal removido com sucesso!");
            carregarAnimais();
        } catch (error) {
            console.error("Erro ao excluir:", error.response || error);
            alert("Erro ao excluir animal.");
        }
    };

    // --- Fechar modal ao clicar fora ---
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) fecharModal(modal.id);
        });
    });

    // --- Carrega a lista ao abrir ---
    carregarAnimais();
});
