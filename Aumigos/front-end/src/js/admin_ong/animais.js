// /src/js/admin_ong/animais.js
document.addEventListener("DOMContentLoaded", async () => {
    

    // --- elementos da tabela e botão ---
    const tbody = document.querySelector("#tabela-animais tbody");
    const btnAdicionar = document.querySelector("#Animais .btn-verde");

    if (!tbody || !btnAdicionar) return;

    // --- função para abrir modal ---
    function abrirModalAnimal() {
        if (document.getElementById("modal-animal")) return; // não cria outro

        const modalHtml = `
        <div class="modal" id="modal-animal" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;">
            <div style="width:90%;max-width:500px;background:#fff;border-radius:8px;padding:20px;position:relative;">
                <h3 id="titulo-modal-animal">Adicionar Animal</h3>
                <form id="form-animal">
                    <input type="hidden" id="animal-id">
                    <label>Nome *</label>
                    <input type="text" id="animal-nome" required>
                    <label>Espécie *</label>
                    <input type="text" id="animal-especie" required>
                    <label>Raça</label>
                    <input type="text" id="animal-raca">
                    <label>Idade *</label>
                    <input type="number" id="animal-idade" required>
                    <label>Sexo *</label>
                    <select id="animal-genero" required>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                    <label>Status de Adoção *</label>
                    <select id="animal-status" required>
                        <option value="disponivel">Disponível</option>
                        <option value="em processo">Em processo</option>
                        <option value="concluido">Concluído</option>
                    </select>
                    <label>Descrição</label>
                    <textarea id="animal-descricao"></textarea>
                    <label id="animal-imagem-label">Imagem *</label>
                    <input type="file" id="animal-imagem" accept="image/*" required>
                    <div id="animal-imagem-url-display" style="display:none;margin-top:5px;color:#555;"></div>
                    <div style="display:flex;justify-content:flex-end;margin-top:15px;gap:10px;">
                        <button type="button" id="btn-cancelar-animal" style="padding:8px 12px;">Cancelar</button>
                        <button type="submit" style="padding:8px 12px;background:#27ae60;color:white;border:none;border-radius:4px;">Salvar</button>
                    </div>
                    <button type="button" id="fechar-modal-animal" style="position:absolute;top:8px;right:8px;font-size:20px;background:transparent;border:none;cursor:pointer;">×</button>
                </form>
            </div>
        </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        // --- pegar elementos do modal ---
        const form = document.getElementById("form-animal");
        const btnCancelar = document.getElementById("btn-cancelar-animal");
        const btnFechar = document.getElementById("fechar-modal-animal");

        // --- listeners ---
        form.addEventListener("submit", salvarAnimal);
        btnCancelar.addEventListener("click", fecharModalAnimal);
        btnFechar.addEventListener("click", fecharModalAnimal);
    }

    function fecharModalAnimal() {
        const modal = document.getElementById("modal-animal");
        if (modal) modal.remove();
    }

    // --- carregar animais ---
    async function carregarAnimais() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="8">Carregando animais...</td></tr>';
        try {
            const res = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets?id_ong=${ong.id}`);
            const animais = res.data || [];

            if (animais.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8">Nenhum animal cadastrado.</td></tr>';
                return;
            }

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
        } catch (err) {
            console.error("Erro ao carregar animais:", err);
            tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar animais.</td></tr>';
        }
    }

    // --- salvar animal ---
    async function salvarAnimal(e) {
        e.preventDefault();
        const form = e.target;
        const animalId = document.getElementById("animal-id").value;

        const formData = new FormData();
        formData.append("id_ong", ong.id);
        formData.append("nome", form.querySelector("#animal-nome").value);
        formData.append("especie", form.querySelector("#animal-especie").value);
        formData.append("raca", form.querySelector("#animal-raca").value);
        formData.append("idade", form.querySelector("#animal-idade").value);
        formData.append("genero", form.querySelector("#animal-genero").value);
        formData.append("descricao", form.querySelector("#animal-descricao").value);
        formData.append("status_adocao", form.querySelector("#animal-status").value);

        const imagemFile = form.querySelector("#animal-imagem").files[0];
        if (imagemFile) formData.append("imagem", imagemFile);
        else if (!animalId) {
            alert("A imagem do animal é obrigatória para cadastro.");
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
            fecharModalAnimal();
            carregarAnimais();
        } catch (err) {
            console.error("Erro ao salvar animal:", err.response || err);
            const msg = err.response?.data?.error || "Erro desconhecido ao salvar animal.";
            alert(`Falha ao salvar animal: ${msg}`);
        }
    }

    // --- abrir modal para edição ---
    window.abrirModalAnimalParaEdicao = async function(id) {
        try {
            const res = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets/${id}?ong_id=${ong.id}`);
            const animal = res.data.pet;

            abrirModalAnimal();

            document.getElementById("titulo-modal-animal").textContent = "Editar Animal";
            document.getElementById("animal-id").value = animal.animal_id;
            document.getElementById("animal-nome").value = animal.nome;
            document.getElementById("animal-especie").value = animal.especie;
            document.getElementById("animal-raca").value = animal.raca || "";
            document.getElementById("animal-idade").value = animal.idade;
            document.getElementById("animal-genero").value = animal.sexo;
            document.getElementById("animal-status").value = animal.status_adocao;
            document.getElementById("animal-descricao").value = animal.descricao || "";

            const linkImg = animal.link_img || "Nenhuma imagem cadastrada.";
            const imgDisplay = document.getElementById("animal-imagem-url-display");
            imgDisplay.textContent = linkImg;
            imgDisplay.style.display = "block";

            const imgLabel = document.getElementById("animal-imagem-label");
            imgLabel.textContent = "Alterar Imagem";
            document.getElementById("animal-imagem").required = false;
            document.getElementById("animal-imagem").value = "";
        } catch (err) {
            console.error("Erro ao carregar animal:", err);
            alert(`Não foi possível carregar o animal ID ${id}`);
        }
    };

    // --- excluir animal ---
    window.excluirAnimal = async function(id) {
        if (!confirm("Excluir animal permanentemente?")) return;
        try {
            await axios.delete(`https://tcc-3-ds-etec.onrender.com/pets/${id}`, { data: { id_ong: ong.id } });
            alert("Animal removido com sucesso!");
            carregarAnimais();
        } catch (err) {
            console.error("Erro ao excluir animal:", err.response || err);
            alert("Erro ao excluir animal.");
        }
    };

    // --- ligar botão de adicionar ---
    btnAdicionar.addEventListener("click", abrirModalAnimal);

    // --- carregar lista inicialmente ---
    carregarAnimais();
});
