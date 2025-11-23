// animal_membro_ong.js — versão unificada para ONG e Membro
let ongIdGlobal = null;

async function initAnimais() {

    // === VALIDAR USUÁRIO LOGADO ===
    const usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual") || "{}");

    if (!usuarioAtual.tipo || !usuarioAtual.info) {
        console.warn("Usuário não logado. Redirecionando...");
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    // ONG e Membro usam o mesmo sistema: ambos possuem ong_id
    // ONG → id da própria ONG
    // Membro → ong_id do membro
    if (usuarioAtual.tipo === "ong") {
        ongIdGlobal = usuarioAtual.info.id;
    } else if (usuarioAtual.tipo === "membro") {
        ongIdGlobal = usuarioAtual.info.ong_id;
    } else {
        alert("Erro: tipo de usuário desconhecido.");
        return;
    }

    if (!ongIdGlobal) {
        alert("Erro: ONG não encontrada para este usuário.");
        return;
    }

    const tbody = document.querySelector("#tabela-animais tbody");

    // === CARREGAR ANIMAIS ===
    async function carregarAnimais() {
        if (!tbody) return;
        tbody.innerHTML = '<tr><td colspan="10">Carregando animais...</td></tr>';

        try {
            const res = await axios.get(`/pets?ong_id=${ongIdGlobal}`);
            const animais = res.data;

            if (!animais || !animais.length) {
                tbody.innerHTML = '<tr><td colspan="10">Nenhum animal cadastrado.</td></tr>';
                return;
            }

            tbody.innerHTML = animais
                .map(a => `
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
            `)
                .join('');
        } catch (err) {
            console.error("Erro ao carregar animais:", err);
            tbody.innerHTML = '<tr><td colspan="10">Erro ao carregar animais.</td></tr>';
        }
    }

    // === ABRIR MODAL ===
    window.abrirModalAnimal = () => {
        if (typeof resetModal === 'function') resetModal();
        const modal = document.getElementById("modal-animal");
        if (modal) modal.style.display = "flex";
    };

    const btnAdicionarAnimal = document.getElementById("btn-adicionar-animal");
    if (btnAdicionarAnimal) btnAdicionarAnimal.addEventListener('click', () => window.abrirModalAnimal());

    // === EDITAR ANIMAL ===
    window.editarAnimal = async (animalId) => {
        try {
            const res = await axios.get(`/pets/${animalId}?ong_id=${ongIdGlobal}`);
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

    // === SALVAR ANIMAL (CRIAR/EDITAR) ===
    const formAnimal = document.getElementById("form-animal");

    if (formAnimal) {
        formAnimal.addEventListener("submit", async (e) => {
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
            fd.append("ong_id", ongIdGlobal);
            fd.append("nome", nome);
            fd.append("especie", especie);
            fd.append("raca", raca);
            fd.append("sexo", sexo);
            fd.append("descricao", descricao);

            if (img) fd.append("imagem", img);

            try {
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
                const msg = err.response?.data?.error || err.response?.data?.message || err.message;
                alert("Falha ao salvar animal: " + msg);
            }
        });
    }

    // === EXCLUIR ===
    window.excluirAnimal = async (id) => {
        if (!confirm("Deseja realmente excluir este animal?")) return;

        try {
            await axios.delete(`/pets/${id}`, {
                data: { ong_id: ongIdGlobal }
            });
            alert("Animal removido!");
            carregarAnimais();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir animal.");
        }
    };

    // Disponibiliza globalmente
    window.carregarAnimais = carregarAnimais;

    carregarAnimais();
}

// Inicialização
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimais);
} else {
    initAnimais();
}
