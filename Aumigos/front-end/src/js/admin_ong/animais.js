async function initAnimais() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    if (!ong.id) {
        console.warn("ONG não logada. Redirecionando para login.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }
    const ongId = ong.id;

    const tbody = document.querySelector("#tabela-animais tbody");

    // --- Carregar animais ---

    
    async function carregarAnimais() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="6">Carregando animais...</td></tr>';
        try {
            const res = await axios.get(`/pets?ong_id=${ongId}`);
            const animais = res.data;

            if (!animais || !animais.length) {
                tbody.innerHTML = '<tr><td colspan="6">Nenhum animal cadastrado.</td></tr>';
                return;
            }

            tbody.innerHTML = animais.map(a => `
                <tr>
                    <td>${a.link_img ? `<img src="${a.link_img}" alt="${a.nome}" style="max-width: 100px; max-height: 100px;">` : '-'}</td>
                    <td>${a.animal_id}</td>
                    <td>${a.nome}</td>
                    <td>${a.especie}</td>
                    <td>${a.raca || '-'}</td>
                    <td>${a.idade || '-'}</td>
                    <td>${a.sexo}</td>
                    <td>${a.status || '-'}</td>
                    <td>${a.descricao ? a.descricao.substring(0, 100) + (a.descricao.length > 100 ? '...' : '') : '-'}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editarAnimal(${a.animal_id})">Editar</button>
                        <button class="btn btn-delete" onclick="excluirAnimal(${a.animal_id})">Excluir</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) {
            console.error("Erro ao carregar animais:", err);
            tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar animais.</td></tr>';
        }
    }

    // --- Abrir modal para cadastro ---
    window.abrirModalAnimal = () => {
        if (typeof resetModal === 'function') resetModal();
        const modal = document.getElementById("modal-animal");
        if (modal) modal.style.display = "flex";
    };

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
            document.getElementById("animal-genero").value = a.sexo;
            document.getElementById("animal-descricao").value = a.descricao || '';

            const label = document.getElementById("animal-imagem-label");
            if (label) label.textContent = "Alterar Imagem";
            const imgInput = document.getElementById("animal-imagem");
            if (imgInput) imgInput.required = false;
            const urlDisplay = document.getElementById("animal-imagem-url-display");
            if (urlDisplay) {
                urlDisplay.textContent = a.link_img || '';
                urlDisplay.style.display = 'block';
            }

            const modal = document.getElementById("modal-animal");
            if (modal) modal.style.display = "flex";
        } catch (err) {
            console.error("Erro ao carregar animal:", err);
            alert("Não foi possível carregar o animal.");
        }
    };

    // --- Salvar animal ---
    const formAnimal = document.getElementById("form-animal");
    if (formAnimal) formAnimal.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const animalId = form.querySelector("#animal-id").value;

        const nome = form.querySelector("#animal-nome").value.trim();
        const especie = form.querySelector("#animal-especie").value.trim();
        const raca = form.querySelector("#animal-raca").value.trim();
        const sexo = form.querySelector("#animal-genero").value;
        const descricao = form.querySelector("#animal-descricao").value;

        if (!nome || !especie || !raca || !sexo) {
            alert('Preencha todos os campos obrigatórios: nome, espécie, raça e sexo.');
            return;
        }

        const img = form.querySelector("#animal-imagem").files[0];
        if (!animalId && !img) {
            alert('Imagem é obrigatória ao cadastrar um novo animal.');
            return;
        }

        const fd = new FormData();
        fd.append("ong_id", ongId);
        fd.append("nome", nome);
        fd.append("especie", especie);
        fd.append("raca", raca);
        fd.append("sexo", sexo);
        fd.append("descricao", descricao);

        if (img) fd.append("imagem", img);

        try {
            for (const pair of fd.entries()) {
                if (pair[0] === 'imagem') {
                    console.debug('[DEBUG] FormData ->', pair[0], 'file=', pair[1]?.name || '(file)');
                } else {
                    console.debug('[DEBUG] FormData ->', pair[0], pair[1]);
                }
            }

            if (animalId) {
                const resp = await axios.put(`/pets/${animalId}`, fd);
                alert(resp.data?.message || "Animal atualizado!");
            } else {
                const resp = await axios.post(`/pets`, fd);
                alert(resp.data?.message || "Animal cadastrado!");
            }
            if (typeof fecharModal === 'function') fecharModal("modal-animal");
            carregarAnimais();
        } catch (err) {
            console.error("Erro ao salvar animal:", err);
            const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert("Falha ao salvar animal: " + serverMsg);
        }
    });

    // --- Excluir ---
    window.excluirAnimal = async (id) => {
        if (!confirm("Deseja realmente excluir este animal?")) return;
        try {
            await axios.delete(`/pets/${id}`, { data: { ong_id: ongId } });
            alert("Animal removido!");
            carregarAnimais();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir animal.");
        }
    };

    window.carregarAnimais = carregarAnimais;
    carregarAnimais();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimais);
} else {
    initAnimais();
}
