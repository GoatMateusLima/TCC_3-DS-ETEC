// animais.js
document.addEventListener('DOMContentLoaded', async () => {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tabelaAnimais = document.querySelector("#tabela-animais tbody");

    // --- carregar animais ---
    async function carregarAnimais() {
        tabelaAnimais.innerHTML = '<tr><td colspan="8">Carregando animais...</td></tr>';
        try {
            const res = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets?id_ong=${ong.id}`);
            const animais = res.data;

            if (!animais.length) {
                tabelaAnimais.innerHTML = '<tr><td colspan="8">Nenhum animal cadastrado.</td></tr>';
                return;
            }

            tabelaAnimais.innerHTML = animais.map(a => `
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
            tabelaAnimais.innerHTML = '<tr><td colspan="8">Erro ao carregar animais.</td></tr>';
        }
    }

    // --- abrir modal ---
    function abrirModalAnimal() {
        criarModalAnimal();
        const modal = document.getElementById("modal-animal");
        if (modal) modal.style.display = "flex";

        // reset form
        document.getElementById("animal-form").reset();
        document.getElementById("animal-id").value = "";
        document.getElementById("animal-status").value = "disponivel";
        document.getElementById("animal-imagem-url-display").style.display = "none";
        document.getElementById("animal-imagem-label").textContent = "Imagem *";
        document.getElementById("animal-imagem").required = true;
    }

    // --- criar modal ---
    function criarModalAnimal() {
        if (document.getElementById("modal-animal")) return;

        const modalHtml = `
        <div class="modal" id="modal-animal" style="display:none;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;">
            <div style="width:90%;max-width:600px;background:#fff;border-radius:8px;padding:20px;position:relative;">
                <h3>Cadastro / Edição de Animal</h3>
                <form id="animal-form">
                    <input type="hidden" id="animal-id">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <input id="animal-nome" placeholder="Nome" required />
                        <input id="animal-especie" placeholder="Espécie" required />
                        <input id="animal-raca" placeholder="Raça" />
                        <input id="animal-idade" type="number" placeholder="Idade" required />
                        <select id="animal-genero" required>
                            <option value="">Selecione o sexo</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                        <select id="animal-status" required>
                            <option value="disponivel">Disponível</option>
                            <option value="em processo">Em processo</option>
                            <option value="adotado">Adotado</option>
                        </select>
                        <input type="file" id="animal-imagem">
                        <span id="animal-imagem-url-display" style="display:none;"></span>
                    </div>
                    <textarea id="animal-descricao" placeholder="Descrição"></textarea>
                    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:15px;">
                        <button type="button" onclick="fecharModal('modal-animal')" style="padding:10px 14px;">Cancelar</button>
                        <button type="submit" style="padding:10px 14px;background:#27ae60;color:#fff;border:none;">Salvar</button>
                    </div>
                </form>
                <button onclick="fecharModal('modal-animal')" style="position:absolute;top:8px;right:8px;font-size:20px;border:none;background:transparent;cursor:pointer;">×</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        // listener submit
        document.getElementById("animal-form").addEventListener("submit", salvarAnimal);
    }

    // --- abrir modal para edição ---
    async function abrirModalAnimalParaEdicao(id) {
        try {
            const res = await axios.get(`https://tcc-3-ds-etec.onrender.com/pets/${id}?ong_id=${ong.id}`);
            const animal = res.data.pet;

            abrirModalAnimal();

            document.getElementById("animal-id").value = animal.animal_id;
            document.getElementById("animal-nome").value = animal.nome;
            document.getElementById("animal-especie").value = animal.especie;
            document.getElementById("animal-raca").value = animal.raca || '';
            document.getElementById("animal-idade").value = animal.idade;
            document.getElementById("animal-genero").value = animal.sexo;
            document.getElementById("animal-descricao").value = animal.descricao || '';
            document.getElementById("animal-status").value = animal.status_adocao;
            document.getElementById("animal-imagem-label").textContent = "Alterar Imagem";
            document.getElementById("animal-imagem").required = false;

            const linkImg = animal.link_img || 'Nenhuma imagem cadastrada.';
            const displayImg = document.getElementById("animal-imagem-url-display");
            displayImg.textContent = linkImg;
            displayImg.style.display = "block";

        } catch (err) {
            console.error("Erro ao carregar animal:", err);
            alert("Não foi possível carregar o animal.");
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
            alert("A imagem é obrigatória para cadastro.");
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

        } catch (err) {
            console.error("Erro ao salvar animal:", err.response || err);
            const msg = err.response?.data?.error || "Erro desconhecido ao salvar.";
            alert(`Falha ao salvar animal: ${msg}`);
        }
    }

    // --- excluir animal ---
    async function excluirAnimal(id) {
        if (!confirm("Excluir animal permanentemente?")) return;
        try {
            await axios.delete(`https://tcc-3-ds-etec.onrender.com/pets/${id}`, {
                data: { id_ong: ong.id }
            });
            alert("Animal removido com sucesso!");
            carregarAnimais();
        } catch (err) {
            console.error("Erro ao excluir:", err.response || err);
            alert("Erro ao excluir animal.");
        }
    }

    // --- função genérica para fechar modal ---
    window.fecharModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = "none";
    };

    // --- expor função de abrir modal globalmente ---
    window.abrirModalAnimal = abrirModalAnimal;
    window.abrirModalAnimalParaEdicao = abrirModalAnimalParaEdicao;
    window.excluirAnimal = excluirAnimal;

    // --- inicializa lista ---
    carregarAnimais();
});
