// membro.js - Painel do Membro da ONG (VERSÃO CORRIGIDA)
let ongIdGlobal = null;
let membroIdGlobal = null;

async function initMembro() {
    // Verificar se o membro está logado
    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual') || '{}');
    
    if (!usuarioAtual.tipo || usuarioAtual.tipo !== 'membro' || !usuarioAtual.info?.id) {
        console.warn('Membro não logado. Redirecionando para login.');
        window.location.href = '/src/pages/login/login.html';
        return;
    }

    membroIdGlobal = usuarioAtual.info.id;
    ongIdGlobal = usuarioAtual.info.ong_id;
    
    console.log('Membro logado:', membroIdGlobal);
    console.log('ONG do membro:', ongIdGlobal);

    if (!ongIdGlobal) {
        alert('Erro: Membro não está associado a uma ONG.');
        window.location.href = '/src/pages/login/login.html';
        return;
    }

    // Salvar ong_id no localStorage para compatibilidade com scripts existentes
    localStorage.setItem('ongLogada', JSON.stringify({ id: ongIdGlobal }));

    // Carregar dados da ONG para mostrar o nome
    await carregarDadosOng();
    
    // Configurar navegação entre abas
    configurarNavegacao();
    
    // Carregar animais da ONG
    await carregarAnimais();
    
    // Carregar adoções da ONG
    await carregarAdocoes();
    
    // Configurar eventos dos modais
    configurarModais();

    // Configurar eventos de busca
    configurarBuscas();
}

// Função para carregar dados da ONG (apenas para mostrar o nome)
async function carregarDadosOng() {
    try {
        const response = await axios.get(`/ong/${ongIdGlobal}`);
        const ong = response.data;
        
        document.querySelector('.ong-name').textContent = ong.nome || 'ONG';
        
    } catch (error) {
        console.error('Erro ao carregar dados da ONG:', error);
        document.querySelector('.ong-name').textContent = 'Membro da ONG';
    }
}

// Função para configurar navegação entre abas
function configurarNavegacao() {
    const links = document.querySelectorAll('.faq-link');
    const sections = document.querySelectorAll('.container-info-faq > section');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover classe active de todos os links
            links.forEach(l => l.classList.remove('active'));
            // Esconder todas as seções
            sections.forEach(s => s.style.display = 'none');
            
            // Adicionar classe active ao link clicado
            link.classList.add('active');
            
            // Mostrar seção correspondente
            const target = link.getAttribute('data-target');
            const section = document.getElementById(target);
            if (section) {
                section.style.display = 'block';
            }
        });
    });
    
    // Mostrar a seção ativa inicialmente (Animais)
    document.getElementById('Animais').style.display = 'block';
    document.querySelector('[data-target="Animais"]').classList.add('active');
}

// --- FUNÇÕES PARA ANIMAIS (Adaptadas do animais.js da ONG) ---

async function carregarAnimais() {
    const tbody = document.querySelector("#tabela-animais tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="9">Carregando animais...</td></tr>';
    
    try {
        const res = await axios.get(`/pets?ong_id=${ongIdGlobal}`);
        const animais = res.data;

        if (!animais || !animais.length) {
            tbody.innerHTML = '<tr><td colspan="9">Nenhum animal cadastrado.</td></tr>';
            return;
        }

        tbody.innerHTML = animais.map(a => `
            <tr>
                <td>${a.link_img ? `<img src="${a.link_img}" alt="${a.nome}" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 6px;">` : '-'}</td>
                <td>${a.animal_id}</td>
                <td>${a.nome}</td>
                <td>${a.especie}</td>
                <td>${a.raca || '-'}</td>
                <td>${a.idade || '-'}</td>
                <td>${a.sexo}</td>
                <td>${a.status || '-'}</td>
                <td>${a.descricao ? a.descricao.substring(0, 100) + (a.descricao.length > 100 ? '...' : '') : '-'}</td>
                <td>
                    <button class="btn btn-edit" onclick="editarAnimalMembro(${a.animal_id})">Editar</button>
                    <button class="btn btn-delete" onclick="excluirAnimalMembro(${a.animal_id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Erro ao carregar animais:", err);
        tbody.innerHTML = '<tr><td colspan="9">Erro ao carregar animais.</td></tr>';
    }
}

// --- Abrir modal para cadastro ---
window.abrirModalAnimalMembro = () => {
    const modal = document.getElementById("modal-animal");
    if (modal) {
        // Limpar formulário
        document.getElementById("form-animal").reset();
        document.getElementById("animal-id").value = '';
        document.getElementById("animal-imagem").required = true;
        const label = document.getElementById("animal-imagem-label");
        if (label) label.textContent = "Imagem *";
        const urlDisplay = document.getElementById("animal-imagem-url-display");
        if (urlDisplay) urlDisplay.style.display = 'none';
        
        modal.style.display = "flex";
    }
};

// --- Abrir modal para edição ---
window.editarAnimalMembro = async (animalId) => {
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

// --- Excluir animal ---
window.excluirAnimalMembro = async (id) => {
    if (!confirm("Deseja realmente excluir este animal?")) return;
    try {
        await axios.delete(`/pets/${id}`, { data: { ong_id: ongIdGlobal } });
        alert("Animal removido!");
        carregarAnimais();
    } catch (err) {
        console.error(err);
        alert("Erro ao excluir animal.");
    }
};

// --- FUNÇÕES PARA ADOÇÕES (Adaptadas do adocao.js da ONG) ---

async function carregarAdocoes() {
    const tbody = document.getElementById("adocao-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "<tr><td colspan='7'>Carregando adoções...</td></tr>";
    
    try {
        const resp = await axios.get(`/adocao?ong_id=${ongIdGlobal}`);
        const adocoes = resp.data.adocoes || [];
        
        console.log("Adoções carregadas:", adocoes);
        
        if (!adocoes.length) {
            tbody.innerHTML = "<tr><td colspan='7'>Nenhuma adoção encontrada.</td></tr>";
            return;
        }
        
        // Função para gerar URL da imagem
        function gerarUrlImagemSupabase(caminho) {
            if (!caminho) return "/src/img/pet-default.png";
            if (caminho.startsWith("http")) return caminho;
            const PROJECT_ID = "***************";
            const BUCKET = "pets";
            return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${caminho}`;
        }
        
        tbody.innerHTML = adocoes.map(a => `
            <tr>
                <td>${a.adocao_id}</td>
                <td>${a.animal?.link_img ? `<img src="${gerarUrlImagemSupabase(a.animal.link_img)}" alt="${a.animal?.nome || ''}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">` : '-'}</td>
                <td>${a.animal?.nome || '-'}</td>
                <td>${a.adotante?.nome || '-'}</td>
                <td>${a.data_adocao ? new Date(a.data_adocao).toLocaleDateString("pt-BR") : '-'}</td>
                <td>
                    <select onchange="atualizarStatusMembro(${a.adocao_id}, this.value)">
                        <option value="em análise" ${a.status === "em análise" ? "selected" : ""}>Em análise</option>
                        <option value="cancelado" ${a.status === "cancelado" ? "selected" : ""}>Cancelado</option>
                        <option value="concluido" ${a.status === "concluido" ? "selected" : ""}>Concluído</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-small" onclick="detalhesAdocaoMembro(${a.adocao_id})">Detalhes</button>
                    <button class="btn btn-small" onclick="editarAdocaoMembro(${a.adocao_id})">Editar</button>
                    <button class="btn btn-small" onclick="excluirAdocaoMembro(${a.adocao_id})" style="background:#e74c3c; color:white;">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("Erro ao carregar adoções:", error);
        tbody.innerHTML = "<tr><td colspan='7'>Erro ao carregar adoções</td></tr>";
    }
}

// --- Configurar modais e eventos ---
function configurarModais() {
    // Botão adicionar animal
    const btnAdicionarAnimal = document.getElementById('btn-adicionar-animal');
    if (btnAdicionarAnimal) {
        btnAdicionarAnimal.addEventListener('click', window.abrirModalAnimalMembro);
    }

    // Formulário animal
    const formAnimal = document.getElementById("form-animal");
    if (formAnimal) {
        formAnimal.addEventListener("submit", salvarAnimalMembro);
    }

    // Botão nova adoção
    const btnNovaAdocao = document.getElementById('btn-nova-adocao');
    if (btnNovaAdocao) {
        btnNovaAdocao.addEventListener('click', abrirModalNovaAdocaoMembro);
    }

    // Botão fechar modal nova adoção
    const closeNova = document.getElementById("modal-nova-close-btn");
    if (closeNova) {
        closeNova.addEventListener('click', () => {
            const modalNova = document.getElementById("modal-nova-adocao");
            if (modalNova) modalNova.classList.add("hidden");
        });
    }

    // Botão criar adoção
    const btnCriarAdocao = document.getElementById("btn-criar-adocao");
    if (btnCriarAdocao) {
        btnCriarAdocao.addEventListener("click", criarAdocaoMembro);
    }
}

// --- Configurar eventos de busca ---
function configurarBuscas() {
    // Busca de animais no modal
    const buscarAnimalModal = document.getElementById("buscar-animal-modal");
    if (buscarAnimalModal) {
        buscarAnimalModal.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = listaAnimaisCache.filter(a => 
                a.nome.toLowerCase().includes(termo) || 
                a.especie.toLowerCase().includes(termo)
            );
            mostrarAnimaisParaAdocao(filtrados);
        });
    }

    // Busca de adotantes no modal
    const buscarAdotanteModal = document.getElementById("buscar-adotante-modal");
    if (buscarAdotanteModal) {
        buscarAdotanteModal.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = listaAdotantesCache.filter(a => 
                a.nome.toLowerCase().includes(termo) || 
                (a.email && a.email.toLowerCase().includes(termo))
            );
            mostrarAdotantesParaAdocao(filtrados);
        });
    }
}

// --- Salvar animal (membro) ---
async function salvarAnimalMembro(e) {
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
        
        // Fechar modal
        document.getElementById('modal-animal').style.display = 'none';
        // Recarregar lista
        carregarAnimais();
        
    } catch (err) {
        console.error("Erro ao salvar animal:", err);
        const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        alert("Falha ao salvar animal: " + serverMsg);
    }
}

// --- Funções para adoções (membro) ---

let listaAnimaisCache = [];
let listaAdotantesCache = [];
let animalSelecionado = null;
let adotanteSelecionado = null;

async function abrirModalNovaAdocaoMembro() {
    try {
        await carregarAnimaisParaAdocao();
        await carregarAdotantesParaAdocao();
        animalSelecionado = null;
        adotanteSelecionado = null;
        
        const modalNova = document.getElementById("modal-nova-adocao");
        if (modalNova) modalNova.classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao abrir modal:", error);
        alert("Erro ao carregar dados");
    }
}

async function carregarAnimaisParaAdocao() {
    try {
        const res = await axios.get(`/pets?ong_id=${ongIdGlobal}`);
        listaAnimaisCache = res.data || [];
        mostrarAnimaisParaAdocao(listaAnimaisCache);
    } catch (error) {
        console.error("Erro ao carregar animais:", error);
        listaAnimaisCache = [];
        mostrarAnimaisParaAdocao([]);
    }
}

function mostrarAnimaisParaAdocao(lista) {
    const container = document.getElementById("lista-animais-modal");
    if (!container) return;
    
    container.innerHTML = '';
    lista.forEach(a => {
        const div = document.createElement("div");
        div.textContent = `${a.nome} (${a.especie}) - ${a.status || 'disponível'}`;
        div.style.cursor = 'pointer';
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #eee';
        div.style.marginBottom = '4px';
        div.style.borderRadius = '4px';
        
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
            Array.from(container.children).forEach(c => {
                c.style.background = '';
                c.style.color = '';
            });
            div.style.background = '#27ae60';
            div.style.color = 'white';
        });
        container.appendChild(div);
    });
}

async function carregarAdotantesParaAdocao() {
    try {
        const res = await axios.get(`/adotante`);
        listaAdotantesCache = res.data || [];
        mostrarAdotantesParaAdocao(listaAdotantesCache);
    } catch (error) {
        console.error("Erro ao carregar adotantes:", error);
        listaAdotantesCache = [];
        mostrarAdotantesParaAdocao([]);
    }
}

function mostrarAdotantesParaAdocao(lista) {
    const container = document.getElementById("lista-adotantes-modal");
    if (!container) return;
    
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
            Array.from(container.children).forEach(c => {
                c.style.background = '';
                c.style.color = '';
            });
            div.style.background = '#27ae60';
            div.style.color = 'white';
        });
        container.appendChild(div);
    });
}

// Criar adoção
async function criarAdocaoMembro() {
    if (!animalSelecionado || !adotanteSelecionado) {
        alert("Selecione um animal e um adotante!");
        return;
    }

    if (animalSelecionado.status === 'adotado' || animalSelecionado.status === 'em análise') {
        alert("Este animal já está em processo de adoção!");
        return;
    }

    try {
        const novaAdocao = {
            ong_id: parseInt(ongIdGlobal),
            animal_id: parseInt(animalSelecionado.animal_id),
            adotante_id: parseInt(adotanteSelecionado.adotante_id),
            status: "em análise",
            data_adocao: new Date().toISOString().slice(0, 10)
        };

        console.log("Enviando para API:", novaAdocao);

        const response = await axios.post("/adocao", novaAdocao);
        console.log("Resposta da API:", response.data);

        // Fechar modal e recarregar adoções
        const modalNova = document.getElementById("modal-nova-adocao");
        if (modalNova) modalNova.classList.add("hidden");
        
        await carregarAdocoes();
        alert("Adoção criada com sucesso!");
    } catch (err) {
        console.error("Erro ao criar adoção:", err);
        console.error("Detalhes do erro:", err.response?.data);
        alert("Erro ao criar adoção: " + (err.response?.data?.error || err.message));
    }
}

// --- Outras funções para adoções ---
window.detalhesAdocaoMembro = async (id) => {
    try {
        const resp = await axios.get(`/adocao/${id}`);
        const adocao = resp.data.adocao;
        
        // Usar a mesma função de modal da ONG
        abrirModalDetalhesAdocao(adocao);
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        alert("Erro ao carregar detalhes da adoção");
    }
};

window.editarAdocaoMembro = async (id) => {
    try {
        const resp = await axios.get(`/adocao/${id}`);
        const adocao = resp.data.adocao;
        
        await carregarAnimaisParaAdocao();
        await carregarAdotantesParaAdocao();
        
        animalSelecionado = adocao.animal;
        adotanteSelecionado = adocao.adotante;
        
        const modalNova = document.getElementById("modal-nova-adocao");
        if (modalNova) modalNova.classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao editar adoção:", error);
        alert("Erro ao carregar dados para edição");
    }
};

window.excluirAdocaoMembro = async (id) => {
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

window.atualizarStatusMembro = async (id, status) => {
    try {
        await axios.put(`/adocao/${id}`, { status });
        await carregarAdocoes();
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Erro ao atualizar status");
    }
};

// Função de logout
window.logout = function() {
    if (confirm('Deseja sair da sua conta?')) {
        localStorage.removeItem('usuarioAtual');
        localStorage.removeItem('ongLogada');
        window.location.href = '/src/pages/login/login.html';
    }
};

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMembro);
} else {
    initMembro();
}