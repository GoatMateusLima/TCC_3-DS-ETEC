/**
 * Carrega a lista de adoções do backend.
 */
async function carregarAdocoes() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    const tbody = document.querySelector("#tabela-adocoes tbody");
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6">Carregando adoções...</td></tr>';

    try {
        // Chama rota backend correta e espera estrutura: { adocao_id, data_adocao, status, animal: {...}, adotante: {...} }
        const response = await axios.get(`/adocao?ong_id=${ong.id}`);
        const adocoes = response.data;

        tbody.innerHTML = adocoes.map(a => `
            <tr>
                <td>${a.adocao_id}</td>
                <td>${a.animal ? (a.animal.nome || a.animal.nome_animal || a.animal.nomeAnimal || a.animal.name || a.animal.title || a.animal.tipo) : '—'}</td>
                <td>${a.adotante ? (a.adotante.nome || a.adotante.nome_completo || a.adotante.name) : '—'}</td>
                <td>${a.data_adocao ? new Date(a.data_adocao).toLocaleDateString('pt-BR') : ''}</td>
                <td><span style="color:${a.status === 'em análise' ? '#f1c40f' : a.status === 'aprovado' || a.status === 'Finalizada' ? '#27ae60' : '#e74c3c'}">${a.status}</span></td>
                <td>
                    ${a.status === 'em análise' ? `<button class="btn btn-finalizar" onclick="finalizarAdocao(${a.adocao_id})">Finalizar</button>` : 'Finalizada'}
                    <button class="btn" onclick="detalhesAdocao(${a.adocao_id})">Detalhes</button>
                </td>
            </tr>
        `).join("");

        if (!adocoes || adocoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma adoção encontrada.</td></tr>';
        }

    } catch (error) {
        console.error("Erro ao carregar adoções:", error);
        tbody.innerHTML = '<tr><td colspan="6">Erro ao carregar adoções.</td></tr>';
    }
}

async function finalizarAdocao(id) {
    if (confirm(`Tem certeza que deseja finalizar a adoção ID ${id}?`)) {
        try {
            // Envia status compatível com backend
            await axios.put(`/adocao/${id}`, { status: 'aprovado' });
            alert("Adoção finalizada com sucesso!");
            carregarAdocoes();
        } catch (error) {
            console.error("Erro:", error.response || error);
            alert("Erro ao finalizar adoção: " + (error.response?.data?.message || error.message));
        }
    }
}

function detalhesAdocao(id) {
    alert(`Detalhes da adoção ${id} — em breve com modal completo!`);
}

// --- Novo fluxo: criar adoção (modal + busca de adotante e animal) ---
window.abrirModalNovaAdocao = async function() {
    const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
    if (!ong.id) { alert('Faça login como ONG para criar adoções.'); return; }

    // build modal HTML
    const modalHtml = `
    <div class="modal" id="modal-nova-adocao" style="display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;">
      <div style="width:95%;max-width:900px;background:#fff;border-radius:8px;padding:18px;">
        <h3 style="margin-top:0;">Nova Adoção</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <div style="flex:1;min-width:280px;">
            <label>Pesquisar Adotante (nome, email, cpf ou id)</label>
            <input id="search-adotante" placeholder="Digite para buscar..." style="width:100%;padding:8px;margin-top:6px;" />
            <div id="result-adotante" style="max-height:220px;overflow:auto;margin-top:8px;border:1px solid #eee;padding:8px;"></div>
          </div>
          <div style="flex:1;min-width:280px;">
            <label>Pesquisar Animal (nome ou id)</label>
            <input id="search-animal" placeholder="Digite para buscar..." style="width:100%;padding:8px;margin-top:6px;" />
            <div id="result-animal" style="max-height:220px;overflow:auto;margin-top:8px;border:1px solid #eee;padding:8px;"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
          <button id="btn-cancel-adocao" class="btn">Cancelar</button>
          <button id="btn-create-adocao" class="btn btn-verde" disabled>Criar Adoção</button>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('modal-nova-adocao');
    const inputAdotante = document.getElementById('search-adotante');
    const resultAdotante = document.getElementById('result-adotante');
    const inputAnimal = document.getElementById('search-animal');
    const resultAnimal = document.getElementById('result-animal');
    const btnCancel = document.getElementById('btn-cancel-adocao');
    const btnCreate = document.getElementById('btn-create-adocao');

    // carregar dados iniciais
    let adotantes = [];
    let animais = [];
    try {
        const [respAdot, respPets] = await Promise.all([
            axios.get('/adotante'),
            axios.get(`/pets?ong_id=${ong.id}`)
        ]);
        adotantes = respAdot.data || [];
        animais = respPets.data || [];
    } catch (err) {
        console.error('Erro ao buscar dados para nova adoção:', err);
    }

    let escolhaAdotante = null;
    let escolhaAnimal = null;

    function renderAdotantes(list) {
        resultAdotante.innerHTML = list.map(a => `
            <div class="item-adotante" data-id="${a.adotante_id || a.id || ''}" style="padding:6px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <div>${a.adotante_id || a.id} — ${a.nome || a.email || a.cpf}</div>
                <button class="btn btn-pequeno" data-id="${a.adotante_id || a.id || ''}">Selecionar</button>
            </div>
        `).join('');
        resultAdotante.querySelectorAll('.item-adotante .btn').forEach(btn => btn.addEventListener('click', (ev) => {
            const id = btn.getAttribute('data-id');
            escolhaAdotante = adotantes.find(x => String(x.adotante_id) === String(id) || String(x.id) === String(id));
            Array.from(resultAdotante.querySelectorAll('.item-adotante')).forEach(c => c.style.background='');
            btn.closest('.item-adotante').style.background = '#eef';
            // mostrar resumo
            const resumo = document.getElementById('resumo-adotante');
            if (resumo) resumo.textContent = `${escolhaAdotante.adotante_id || escolhaAdotante.id} — ${escolhaAdotante.nome || escolhaAdotante.email || escolhaAdotante.cpf}`;
            checkEnableCreate();
        }));
    }

    function renderAnimais(list) {
        resultAnimal.innerHTML = list.map(a => `
            <div class="item-animal" data-id="${a.animal_id || a.id || ''}" style="padding:6px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <div>${a.animal_id || a.id} — ${a.nome || a.title || a.nome_animal}</div>
                <button class="btn btn-pequeno" data-id="${a.animal_id || a.id || ''}">Selecionar</button>
            </div>
        `).join('');
        resultAnimal.querySelectorAll('.item-animal .btn').forEach(btn => btn.addEventListener('click', (ev) => {
            const id = btn.getAttribute('data-id');
            escolhaAnimal = animais.find(x => String(x.animal_id) === String(id) || String(x.id) === String(id));
            Array.from(resultAnimal.querySelectorAll('.item-animal')).forEach(c => c.style.background='');
            btn.closest('.item-animal').style.background = '#eef';
            const resumoA = document.getElementById('resumo-animal');
            if (resumoA) resumoA.textContent = `${escolhaAnimal.animal_id || escolhaAnimal.id} — ${escolhaAnimal.nome || ''}`;
            checkEnableCreate();
        }));
    }

    function checkEnableCreate() {
        btnCreate.disabled = !(escolhaAdotante && escolhaAnimal);
    }

    inputAdotante.addEventListener('input', () => {
        const q = inputAdotante.value.trim().toLowerCase();
        if (!q) return renderAdotantes(adotantes.slice(0,50));
        const filtered = adotantes.filter(a => ((a.nome||'') + ' ' + (a.email||'') + ' ' + (a.cpf||'') + ' ' + (a.adotante_id||a.id||'')).toLowerCase().includes(q));
        renderAdotantes(filtered.slice(0,50));
    });

    inputAnimal.addEventListener('input', () => {
        const q = inputAnimal.value.trim().toLowerCase();
        if (!q) return renderAnimais(animais.slice(0,50));
        const filtered = animais.filter(a => ((a.nome||'') + ' ' + (a.animal_id||a.id||'')).toLowerCase().includes(q));
        renderAnimais(filtered.slice(0,50));
    });

    // inserir area de resumo acima dos resultados
    resultAdotante.insertAdjacentHTML('beforebegin', '<div style="margin-bottom:6px;font-size:0.95rem;color:#333;"><strong>Adotante selecionado:</strong> <span id="resumo-adotante">nenhum</span></div>');
    resultAnimal.insertAdjacentHTML('beforebegin', '<div style="margin-bottom:6px;font-size:0.95rem;color:#333;"><strong>Animal selecionado:</strong> <span id="resumo-animal">nenhum</span></div>');

    // render inicial
    renderAdotantes(adotantes.slice(0,50));
    renderAnimais(animais.slice(0,50));

    btnCancel.addEventListener('click', () => { modal.remove(); });

    btnCreate.addEventListener('click', async () => {
        if (!escolhaAdotante || !escolhaAnimal) return alert('Selecione um adotante e um animal.');
        try {
            const payload = { animal_id: escolhaAnimal.animal_id || escolhaAnimal.id, adotante_id: escolhaAdotante.adotante_id || escolhaAdotante.id };
            console.debug('[DEBUG] Payload adocao ->', payload);
            await axios.post('/adocao', payload);
            alert('Adoção criada com sucesso.');
            modal.remove();
            carregarAdocoes();
            // atualizar lista de animais na tela principal se função existir
            if (window.carregarAnimais) window.carregarAnimais();
        } catch (err) {
            console.error('Erro ao criar adoção:', err);
            alert('Falha ao criar adoção. ' + (err.response?.data?.error || err.message));
        }
    });
}

// liga botão de nova adoção se existir
document.addEventListener('DOMContentLoaded', () => {
    const sec = document.getElementById('Adocao');
    if (sec) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-verde';
        btn.style.marginBottom = '10px';
        btn.textContent = '+ Nova Adoção';
        btn.addEventListener('click', window.abrirModalNovaAdocao);
        sec.insertBefore(btn, sec.firstChild.nextSibling);
    }
});