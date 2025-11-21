// animais.js
document.addEventListener('DOMContentLoaded', async () => {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    if (!ong.id) {
        alert("ONG não logada. Faça login primeiro.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }
    const ongId = ong.id;

    const tbody = document.querySelector("#tabela-animais tbody");

    // --- Carregar animais ---
    async function carregarAnimais() {
        tbody.innerHTML = '<tr><td colspan="8">Carregando animais...</td></tr>';
        try {
            const res = await axios.get(`/pets?ong_id=${ongId}`);
            const animais = res.data;

            if (!animais.length) {
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
                        <button class="btn btn-edit" onclick="editarAnimal(${a.animal_id})">Editar</button>
                        <button class="btn btn-delete" onclick="excluirAnimal(${a.animal_id})">Excluir</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error("Erro ao carregar animais:", err);
            tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar animais.</td></tr>';
        }
    }

    // --- Abrir modal para cadastro ---
    window.abrirModalAnimal = () => {
        resetModal();
        document.getElementById("modal-animal").style.display = "flex";
    };

    // liga botão + Adicionar Animal (presente no HTML)
    const btnAdicionarAnimal = document.getElementById('btn-adicionar-animal');
    if (btnAdicionarAnimal) btnAdicionarAnimal.addEventListener('click', () => window.abrirModalAnimal());

    // --- Abrir modal para edição ---
    window.editarAnimal = async (animalId) => {
        try {
            const res = await axios.get(`/pets/${animalId}?ong_id=${ongId}`);
            const a = res.data.pet;

            document.getElementById("animal-id").value = a.animal_id;
            document.getElementById("animal-nome").value = a.nome;
            document.getElementById("animal-especie").value = a.especie;
            document.getElementById("animal-raca").value = a.raca || '';
            document.getElementById("animal-idade").value = a.idade;
            document.getElementById("animal-genero").value = a.sexo;
            document.getElementById("animal-descricao").value = a.descricao || '';
            document.getElementById("animal-status").value = a.status_adocao;

            document.getElementById("animal-imagem-label").textContent = "Alterar Imagem";
            document.getElementById("animal-imagem").required = false;
            document.getElementById("animal-imagem-url-display").textContent = a.link_img || '';
            document.getElementById("animal-imagem-url-display").style.display = 'block';

            document.getElementById("modal-animal").style.display = "flex";
        } catch (err) {
            console.error("Erro ao carregar animal:", err);
            alert("Não foi possível carregar o animal.");
        }
    };

    // --- Salvar animal ---
    document.getElementById("form-animal").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const animalId = form.querySelector("#animal-id").value;

        const fd = new FormData();
        // Enviar ambos os nomes (id_ong e ong_id) por compatibilidade com o back-end
        fd.append("id_ong", ongId);
        fd.append("ong_id", ongId);
        fd.append("nome", form.querySelector("#animal-nome").value);
        fd.append("especie", form.querySelector("#animal-especie").value);
        fd.append("raca", form.querySelector("#animal-raca").value);
        fd.append("idade", form.querySelector("#animal-idade").value);
        // Envia tanto 'sexo' quanto 'genero' para cobrir ambos os nomes
        fd.append("sexo", form.querySelector("#animal-genero").value);
        fd.append("genero", form.querySelector("#animal-genero").value);
        fd.append("descricao", form.querySelector("#animal-descricao").value);
        fd.append("status_adocao", form.querySelector("#animal-status").value);

        const img = form.querySelector("#animal-imagem").files[0];
        if (img) fd.append("imagem", img);

        try {
            if (animalId) {
                await axios.put(`/pets/${animalId}`, fd);
                alert("Animal atualizado!");
            } else {
                await axios.post(`/pets`, fd);
                alert("Animal cadastrado!");
            }
            fecharModal("modal-animal");
            carregarAnimais();
        } catch (err) {
            console.error("Erro ao salvar animal:", err);
            alert("Falha ao salvar animal.");
        }
    });

    // --- Excluir ---
    window.excluirAnimal = async (id) => {
        if (!confirm("Deseja realmente excluir este animal?")) return;
        try {
            // Envia 'ong_id' no corpo para o delete, compatível com o backend
            await axios.delete(`/pets/${id}`, { data: { ong_id: ongId, id_ong: ongId } });
            alert("Animal removido!");
            carregarAnimais();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir animal.");
        }
    };

    // --- Inicializar ---
    // expõe para que outros scripts possam recarregar a lista (ex: adocao.js)
    window.carregarAnimais = carregarAnimais;
    carregarAnimais();
});
