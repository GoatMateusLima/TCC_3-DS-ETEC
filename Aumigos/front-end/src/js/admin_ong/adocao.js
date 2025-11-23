async function initAdocoes() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    if (!ong.id) {
        console.warn("ONG não logada. Redirecionando para login.");
        window.location.href = "/src/pages/login/login.html";
        return;
    }
    const ongId = ong.id;
    const tbody = document.getElementById("adocao-tbody");

    function gerarUrlImagemSupabase(caminho) {
        if (!caminho) return "/src/img/pet-default.png";
        if (caminho.startsWith("http")) return caminho;
        const PROJECT_ID = "***************";
        const BUCKET = "pets";
        return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${caminho}`;
    }

    // MODAL DETALHES
    const modalDetalhes = document.getElementById("modal-detalhes");
    document.getElementById("modal-close-btn").addEventListener("click", () => modalDetalhes.classList.add("hidden"));

    function abrirModal(adocao) {
        const pet = adocao.animal || {};
        const adotante = adocao.adotante || {};

        document.getElementById("modal-title").textContent = `Detalhes da Adoção #${adocao.adocao_id}`;
        document.getElementById("modal-img").src = gerarUrlImagemSupabase(pet.link_img);

        document.getElementById("animal-id").textContent = pet.animal_id || "-";
        document.getElementById("animal-nome").textContent = pet.nome || "-";
        document.getElementById("animal-especie").textContent = pet.especie || "-";
        document.getElementById("animal-raca").textContent = pet.raca || "-";
        document.getElementById("animal-sexo").textContent = pet.sexo || "-";
        document.getElementById("animal-status").textContent = pet.status || "-";

        document.getElementById("adotante-id").textContent = adotante.adotante_id || "-";
        document.getElementById("adotante-nome").textContent = adotante.nome || "-";
        document.getElementById("adotante-email").textContent = adotante.email || "-";
        document.getElementById("adotante-telefone").textContent = adotante.telefone || "-";

        document.getElementById("adocao-status").textContent = adocao.status || "-";
        document.getElementById("adocao-data").textContent = adocao.data_adocao
            ? new Date(adocao.data_adocao).toLocaleDateString("pt-BR")
            : "-";

        modalDetalhes.classList.remove("hidden");
    }

    window.detalhesAdocao = async (id) => {
        try {
            const resp = await axios.get(`/adocao/${id}`);
            abrirModal(resp.data.adocao);
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
            alert("Erro ao carregar detalhes da adoção");
        }
    };

    // MODAL NOVA ADOÇÃO
    const modalNova = document.getElementById("modal-nova-adocao");
    const btnNova = document.getElementById("btn-nova-adocao");
    const closeNova = document.getElementById("modal-nova-close-btn");

    let listaAnimaisCache = [];
    let listaAdotantesCache = [];
    let animalSelecionado = null;
    let adotanteSelecionado = null;

    // CARREGAR ANIMAIS
    async function carregarAnimais() {
        try {
            console.log("Carregando animais da ONG:", ongId);
            const res = await axios.get(`/pets?ong_id=${ongId}`);
            const animais = res.data;
            
            console.log("Animais carregados:", animais);
            listaAnimaisCache = animais || [];
            mostrarAnimais(listaAnimaisCache);
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            listaAnimaisCache = [];
            mostrarAnimais([]);
        }
    }

    function mostrarAnimais(lista) {
        const container = document.getElementById("lista-animais-modal");
        if (!container) {
            console.error("Container de animais não encontrado!");
            return;
        }
        
        console.log("Mostrando animais na lista:", lista);
        
        if (!lista || lista.length === 0) {
            container.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">Nenhum animal cadastrado</div>';
            return;
        }
        
        container.innerHTML = '';
        lista.forEach(a => {
            const div = document.createElement("div");
            div.textContent = `${a.nome} (${a.especie}) - ${a.status || 'disponível'}`;
            div.style.cursor = 'pointer';
            div.style.padding = '10px';
            div.style.borderBottom = '1px solid #eee';
            div.style.marginBottom = '4px';
            div.style.borderRadius = '4px';
            
            // Destacar se já foi adotado ou em análise
            if (a.status === 'adotado' || a.status === 'em análise') {
                div.style.background = '#f8d7da';
                div.style.color = '#721c24';
            }
            
            div.addEventListener("click", () => {
                if (a.status === 'adotado' || a.status === 'em análise') {
                    alert('Este animal já está em processo de adoção!');
                    return;
                }
                animalSelecionado = a;
                // Remover seleção anterior
                Array.from(container.children).forEach(c => {
                    c.style.background = '';
                    c.style.color = '';
                });
                div.style.background = '#27ae60';
                div.style.color = 'white';
                console.log("Animal selecionado:", a);
            });
            container.appendChild(div);
        });
    }

    // CARREGAR ADOTANTES
    async function carregarAdotantes() {
        try {
            console.log("Carregando adotantes");
            const res = await axios.get(`/adotante`);
            const adotantes = res.data;
            
            console.log("Adotantes carregados:", adotantes);
            listaAdotantesCache = adotantes || [];
            mostrarAdotantes(listaAdotantesCache);
        } catch (error) {
            console.error("Erro ao carregar adotantes:", error);
            listaAdotantesCache = [];
            mostrarAdotantes([]);
        }
    }

    function mostrarAdotantes(lista) {
        const container = document.getElementById("lista-adotantes-modal");
        if (!container) {
            console.error("Container de adotantes não encontrado!");
            return;
        }
        
        console.log("Mostrando adotantes na lista:", lista);
        
        if (!lista || lista.length === 0) {
            container.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">Nenhum adotante cadastrado</div>';
            return;
        }
        
        container.innerHTML = '';
        lista.forEach(a => {
            const div = document.createElement("div");
            div.textContent = `${a.nome} - ${a.email || 'Sem email'}`;
            div.style.cursor = 'pointer';
            div.style.padding = '10px';
            div.style.borderBottom = '1px solid #eee';
            div.style.marginBottom = '4px';
            div.style.borderRadius = '4px';
            
            div.addEventListener("click", () => {
                adotanteSelecionado = a;
                // Remover seleção anterior
                Array.from(container.children).forEach(c => {
                    c.style.background = '';
                    c.style.color = '';
                });
                div.style.background = '#27ae60';
                div.style.color = 'white';
                console.log("Adotante selecionado:", a);
            });
            container.appendChild(div);
        });
    }

    // ABRIR MODAL NOVA ADOÇÃO
    btnNova.addEventListener("click", async () => {
        try {
            console.log("Abrindo modal nova adoção");
            await carregarAnimais();
            await carregarAdotantes();
            animalSelecionado = null;
            adotanteSelecionado = null;
            modalNova.classList.remove("hidden");
        } catch (error) {
            console.error("Erro ao abrir modal:", error);
            alert("Erro ao carregar dados");
        }
    });

    closeNova.addEventListener("click", () => modalNova.classList.add("hidden"));

    // FILTRAR LISTAS
    document.getElementById("buscar-animal-modal")?.addEventListener("input", e => {
        const termo = e.target.value.toLowerCase();
        const filtrados = listaAnimaisCache.filter(a => 
            a.nome.toLowerCase().includes(termo) || 
            a.especie.toLowerCase().includes(termo)
        );
        mostrarAnimais(filtrados);
    });

    document.getElementById("buscar-adotante-modal")?.addEventListener("input", e => {
        const termo = e.target.value.toLowerCase();
        const filtrados = listaAdotantesCache.filter(a => 
            a.nome.toLowerCase().includes(termo) || 
            (a.email && a.email.toLowerCase().includes(termo))
        );
        mostrarAdotantes(filtrados);
    });

    // CRIAR ADOÇÃO - CORRIGIDO PARA COMPATIBILIDADE COM BACKEND
    document.getElementById("btn-criar-adocao")?.addEventListener("click", async () => {
        if (!animalSelecionado || !adotanteSelecionado) {
            alert("Selecione um animal e um adotante!");
            return;
        }

        if (animalSelecionado.status === 'adotado' || animalSelecionado.status === 'em análise') {
            alert("Este animal já está em processo de adoção!");
            return;
        }

        try {
            // CORREÇÕES PARA COMPATIBILIDADE COM BACKEND:
            const novaAdocao = {
                ong_id: parseInt(ongId), // GARANTIR que é número
                animal_id: parseInt(animalSelecionado.animal_id), // GARANTIR que é número
                adotante_id: parseInt(adotanteSelecionado.adotante_id), // GARANTIR que é número
                status: "em análise", // USAR "em análise" em vez de "em andamento"
                data_adocao: new Date().toISOString().slice(0, 10) // FORMATO YYYY-MM-DD
            };

            console.log("Enviando para API:", novaAdocao);

            // Criar a adoção
            const response = await axios.post("/adocao", novaAdocao);
            console.log("Resposta da API:", response.data);

            // O backend já atualiza o status do animal para "em análise"
            // então não precisamos fazer outra chamada aqui

            // Fechar modal e recarregar adoções
            modalNova.classList.add("hidden");
            await carregarAdocoes();
            alert("Adoção criada com sucesso!");
        } catch (err) {
            console.error("Erro ao criar adoção:", err);
            console.error("Detalhes do erro:", err.response?.data);
            alert("Erro ao criar adoção: " + (err.response?.data?.error || err.message));
        }
    });

    // EDITAR ADOÇÃO
    window.editarAdocao = async (id) => {
        try {
            const resp = await axios.get(`/adocao/${id}`);
            const adocao = resp.data.adocao;
            
            await carregarAnimais();
            await carregarAdotantes();
            
            // Selecionar o animal e adotante atual
            animalSelecionado = adocao.animal;
            adotanteSelecionado = adocao.adotante;
            
            modalNova.classList.remove("hidden");
        } catch (error) {
            console.error("Erro ao editar adoção:", error);
            alert("Erro ao carregar dados para edição");
        }
    };

    // EXCLUIR ADOÇÃO
    window.excluirAdocao = async (id) => {
        if (!confirm("Tem certeza que deseja excluir esta adoção?")) return;
        
        try {
            await axios.delete(`/adocao/${id}`);
            await carregarAdocoes();
            alert("Adoção excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir adoção:", error);
            alert("Erro ao excluir adoção");
        }
    };

    // CARREGAR ADOÇÕES
    async function carregarAdocoes() {
        if (!tbody) {
            console.error("Tbody não encontrado");
            return;
        }
        
        tbody.innerHTML = "<tr><td colspan='7'>Carregando...</td></tr>";
        try {
            const resp = await axios.get(`/adocao?ong_id=${ongId}`);
            const adocoes = resp.data.adocoes || [];
            
            console.log("Adoções carregadas:", adocoes);
            
            if (!adocoes.length) {
                tbody.innerHTML = "<tr><td colspan='7'>Nenhuma adoção encontrada.</td></tr>";
                return;
            }
            
            tbody.innerHTML = adocoes.map(a => `
                <tr>
                    <td>${a.adocao_id}</td>
                    <td>${a.animal?.link_img ? `<img src="${gerarUrlImagemSupabase(a.animal.link_img)}" alt="${a.animal?.nome || ''}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">` : '-'}</td>
                    <td>${a.animal?.nome || '-'}</td>
                    <td>${a.adotante?.nome || '-'}</td>
                    <td>${a.data_adocao ? new Date(a.data_adocao).toLocaleDateString("pt-BR") : '-'}</td>
                    <td>
                        <select onchange="atualizarStatus(${a.adocao_id}, this.value)">
                            <option value="em análise" ${a.status === "em análise" ? "selected" : ""}>Em análise</option>
                            <option value="cancelado" ${a.status === "cancelado" ? "selected" : ""}>Cancelado</option>
                            <option value="concluido" ${a.status === "concluido" ? "selected" : ""}>Concluído</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-small" onclick="detalhesAdocao(${a.adocao_id})">Detalhes</button>
                        <button class="btn btn-small" onclick="editarAdocao(${a.adocao_id})">Editar</button>
                        <button class="btn btn-small" onclick="excluirAdocao(${a.adocao_id})" style="background:#e74c3c; color:white;">Excluir</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Erro ao carregar adoções:", error);
            tbody.innerHTML = "<tr><td colspan='7'>Erro ao carregar adoções</td></tr>";
        }
    }

    window.atualizarStatus = async (id, status) => {
        try {
            await axios.put(`/adocao/${id}`, { status });
            await carregarAdocoes();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status");
        }
    };

    // INICIALIZAR
    carregarAdocoes();
}

document.addEventListener("DOMContentLoaded", initAdocoes);