// adotante.js - Painel do Adotante
let adotanteIdGlobal = null; // Variável global para armazenar o ID

async function initAdotante() {
    // Verificar se o adotante está logado
    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual') || '{}');
    
    if (!usuarioAtual.tipo || usuarioAtual.tipo !== 'adotante' || !usuarioAtual.info?.id) {
        console.warn('Adotante não logado. Redirecionando para login.');
        window.location.href = '/src/pages/login/login.html';
        return;
    }

    adotanteIdGlobal = usuarioAtual.info.id;
    console.log('Adotante logado:', adotanteIdGlobal);

    // Carregar dados do adotante
    await carregarDadosAdotante(adotanteIdGlobal);
    
    // Configurar navegação entre abas
    configurarNavegacao();
    
    // Configurar botão de editar dados
    configurarEdicaoDados(adotanteIdGlobal);
    
    // Configurar botão de excluir adotante
    configurarExclusaoAdotante(adotanteIdGlobal);
    
    // Carregar adoções do adotante
    await carregarAdocoesAdotante(adotanteIdGlobal);
}

// Função para carregar dados do adotante
async function carregarDadosAdotante(adotanteId) {
    try {
        console.log('Carregando dados do adotante:', adotanteId);
        
        const response = await axios.get(`/adotante/${adotanteId}`);
        const adotante = response.data;
        
        console.log('Dados do adotante carregados:', adotante);
        
        // Atualizar interface
        document.querySelector('.adotante-name').textContent = adotante.nome || 'Adotante';
        document.getElementById('ong-nome').textContent = adotante.nome || '-';
        document.getElementById('ong-email').textContent = adotante.email || '-';
        document.getElementById('ong-cnpj').textContent = adotante.cpf || '-';
        document.getElementById('ong-whatsapp').textContent = adotante.whatsapp || '-';
        
    } catch (error) {
        console.error('Erro ao carregar dados do adotante:', error);
        alert('Erro ao carregar dados. Tente novamente.');
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
    
    // Mostrar a seção ativa inicialmente (Adoções)
    document.getElementById('adocao').style.display = 'block';
}

// Função para configurar edição de dados
function configurarEdicaoDados(adotanteId) {
    const btnEditar = document.querySelector('.btn-edit');
    const dadosOng = document.querySelector('.dados-ong');
    
    if (!btnEditar) {
        console.error('Botão editar não encontrado');
        return;
    }
    
    btnEditar.addEventListener('click', () => {
        console.log('Botão editar clicado');
        // Verificar se já está em modo de edição
        if (dadosOng.querySelector('input')) {
            salvarEdicaoDados(adotanteId);
        } else {
            entrarModoEdicao(adotanteId);
        }
    });
}

// Entrar no modo de edição
function entrarModoEdicao(adotanteId) {
    const dadosOng = document.querySelector('.dados-ong');
    
    if (!dadosOng) {
        console.error('Elemento dados-ong não encontrado');
        return;
    }
    
    // Salvar valores atuais
    const nome = document.getElementById('ong-nome').textContent;
    const email = document.getElementById('ong-email').textContent;
    const cpf = document.getElementById('ong-cnpj').textContent;
    const whatsapp = document.getElementById('ong-whatsapp').textContent;
    
    // Substituir por inputs
    dadosOng.innerHTML = `
        <div class="form-edicao">
            <div class="campo-edicao">
                <label for="edit-nome">Nome:</label>
                <input type="text" id="edit-nome" value="${nome}" class="input-edicao">
            </div>
            <div class="campo-edicao">
                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" value="${email}" class="input-edicao">
            </div>
            <div class="campo-edicao">
                <label for="edit-cpf">CPF:</label>
                <input type="text" id="edit-cpf" value="${cpf}" class="input-edicao" readonly style="background-color: #f5f5f5;">
            </div>
            <div class="campo-edicao">
                <label for="edit-whatsapp">WhatsApp:</label>
                <input type="text" id="edit-whatsapp" value="${whatsapp}" class="input-edicao">
            </div>
            <div class="campo-edicao">
                <label for="edit-senha">Nova Senha (opcional):</label>
                <input type="password" id="edit-senha" placeholder="Deixe em branco para manter" class="input-edicao">
            </div>
            <div class="botoes-edicao">
                <button type="button" class="btn btn-cancelar" onclick="cancelarEdicao()">Cancelar</button>
                <button type="button" class="btn btn-salvar" onclick="salvarEdicaoDados(${adotanteId})">Salvar</button>
            </div>
        </div>
    `;
    
    // Adicionar estilos para os inputs
    const styles = `
        .form-edicao {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .campo-edicao {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .campo-edicao label {
            font-weight: bold;
            color: #333;
        }
        .input-edicao {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        .botoes-edicao {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        .btn-cancelar {
            background-color: #95a5a6;
            color: white;
        }
        .btn-salvar {
            background-color: #27ae60;
            color: white;
        }
    `;
    
    if (!document.querySelector('#estilos-edicao')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'estilos-edicao';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    console.log('Modo edição ativado');
}

// Função para salvar edição de dados
async function salvarEdicaoDados(adotanteId) {
    try {
        const nome = document.getElementById('edit-nome').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const whatsapp = document.getElementById('edit-whatsapp').value.trim();
        const senha = document.getElementById('edit-senha').value.trim();
        
        // Validações básicas
        if (!nome) {
            alert('Nome é obrigatório');
            return;
        }
        if (!email) {
            alert('Email é obrigatório');
            return;
        }
        if (!whatsapp) {
            alert('WhatsApp é obrigatório');
            return;
        }
        
        const dadosAtualizacao = {
            nome,
            email,
            whatsapp
        };
        
        // Adicionar senha apenas se foi preenchida
        if (senha) {
            dadosAtualizacao.senha = senha;
        }
        
        console.log('Enviando atualização:', dadosAtualizacao);
        
        const response = await axios.put(`/adotante/${adotanteId}`, dadosAtualizacao);
        
        if (response.status === 200) {
            alert('Dados atualizados com sucesso!');
            // Recarregar dados
            await carregarDadosAdotante(adotanteId);
        }
        
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        const mensagemErro = error.response?.data?.error || 'Erro ao atualizar dados';
        alert('Erro: ' + mensagemErro);
    }
}

// Função para cancelar edição
window.cancelarEdicao = function() {
    // Recarregar a página para voltar ao estado original
    location.reload();
}

// Função para configurar exclusão do adotante
function configurarExclusaoAdotante(adotanteId) {
    const btnExcluir = document.getElementById('btn-excluir-adotante');
    
    if (btnExcluir) {
        btnExcluir.addEventListener('click', () => {
            abrirModalExclusaoAdotante(adotanteId);
        });
    } else {
        console.error('Botão excluir adotante não encontrado');
    }
}

// Função para abrir modal de exclusão
function abrirModalExclusaoAdotante(adotanteId) {
    const modalHTML = `
        <div id="modal-excluir-adotante" class="modal-adotante" style="
            display: flex; position: fixed; z-index: 10000; left: 0; top: 0; 
            width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div class="modal-content-adotante" style="
                background-color: white; margin: 15% auto; padding: 25px; 
                border-radius: 8px; width: 90%; max-width: 500px;">
                <h3>Confirmar Exclusão da Conta</h3>
                <p style="color: #e74c3c; margin-bottom: 15px;">
                    ⚠️ <strong>Atenção:</strong> Esta ação é irreversível! Todos os seus dados 
                    e histórico de adoções serão permanentemente excluídos.
                </p>
                <p>Para confirmar, digite <strong>"ExcluirConta"</strong> no campo abaixo:</p>
                <input type="text" id="confirmacao-exclusao-adotante" placeholder="Digite ExcluirConta aqui..." 
                       style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;">
                <div id="mensagem-erro-adotante" style="color: #e74c3c; font-size: 14px; margin-bottom: 15px; display: none;">
                    Texto incorreto. Digite exatamente "ExcluirConta".
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="btn-cancelar-exclusao-adotante" class="btn btn-cinza">Cancelar</button>
                    <button id="btn-confirmar-exclusao-adotante" class="btn btn-danger" disabled>Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos do modal
    const modal = document.getElementById('modal-excluir-adotante');
    const inputConfirmacao = document.getElementById('confirmacao-exclusao-adotante');
    const btnCancelar = document.getElementById('btn-cancelar-exclusao-adotante');
    const btnConfirmar = document.getElementById('btn-confirmar-exclusao-adotante');
    const mensagemErro = document.getElementById('mensagem-erro-adotante');
    
    if (!modal || !inputConfirmacao || !btnCancelar || !btnConfirmar) {
        console.error('Elementos do modal não encontrados');
        return;
    }
    
    // Validar texto digitado
    inputConfirmacao.addEventListener('input', function() {
        const texto = this.value.trim();
        const textoCorreto = texto === 'ExcluirConta';
        
        btnConfirmar.disabled = !textoCorreto;
        mensagemErro.style.display = texto && !textoCorreto ? 'block' : 'none';
    });
    
    // Fechar modal
    btnCancelar.addEventListener('click', () => {
        modal.remove();
    });
    
    // Confirmar exclusão
    btnConfirmar.addEventListener('click', async () => {
        if (!btnConfirmar.disabled) {
            await excluirAdotante(adotanteId);
            modal.remove();
        }
    });
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    // Focar no input
    inputConfirmacao.focus();
}

// Função para excluir adotante
async function excluirAdotante(adotanteId) {
    try {
        if (!confirm('Tem CERTEZA ABSOLUTA que deseja excluir permanentemente sua conta e todos os seus dados?')) {
            return;
        }
        
        console.log('Excluindo adotante:', adotanteId);
        const response = await axios.delete(`/adotante/${adotanteId}`);
        
        if (response.status === 200) {
            // Limpar localStorage e redirecionar
            localStorage.removeItem('usuarioAtual');
            localStorage.removeItem('ongLogada');
            
            alert('Conta excluída com sucesso!');
            window.location.href = '/';
        }
        
    } catch (error) {
        console.error('Erro ao excluir adotante:', error);
        const mensagemErro = error.response?.data?.error || 'Erro ao excluir conta';
        alert('Erro: ' + mensagemErro);
    }
}

// Função para carregar adoções do adotante - APENAS AS DELE
async function carregarAdocoesAdotante(adotanteId) {
    try {
        const tbody = document.getElementById('adocao-tbody');
        if (!tbody) {
            console.log('Tabela de adoções não encontrada');
            return;
        }
        
        tbody.innerHTML = '<tr><td colspan="7">Carregando suas adoções...</td></tr>';
        
        console.log('Buscando adoções do adotante:', adotanteId);
        
        // Buscar TODAS as adoções e filtrar apenas as do adotante logado
        const response = await axios.get(`/adocao`);
        const todasAdocoes = response.data.adocoes || [];
        
        // Filtrar apenas as adoções deste adotante
        const adocoes = todasAdocoes.filter(adocao => 
            adocao.adotante_id == adotanteId || 
            adocao.adotante?.adotante_id == adotanteId
        );
        
        console.log('Adoções do adotante:', adocoes);
        
        if (adocoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Você ainda não possui adoções.</td></tr>';
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
        
        // Preencher tabela - APENAS VISUALIZAÇÃO, SEM AÇÕES DE EDIÇÃO/EXCLUSÃO
        tbody.innerHTML = adocoes.map(adocao => `
            <tr>
                <td>${adocao.adocao_id || '-'}</td>
                <td>
                    ${adocao.animal?.link_img ? 
                        `<img src="${gerarUrlImagemSupabase(adocao.animal.link_img)}" 
                              alt="${adocao.animal?.nome || ''}" 
                              style="width:60px;height:60px;object-fit:cover;border-radius:6px;">` 
                        : '-'
                    }
                </td>
                <td>${adocao.animal?.nome || '-'}</td>
                <td>${adocao.adotante?.nome || 'Você'}</td>
                <td>${adocao.data_adocao ? new Date(adocao.data_adocao).toLocaleDateString("pt-BR") : '-'}</td>
                <td>
                    <span class="status-adocao status-${adocao.status || 'pendente'}">
                        ${getStatusText(adocao.status)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-small" onclick="detalhesAdocaoAdotante(${adocao.adocao_id})">
                        Ver Detalhes
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Adicionar estilos para os status
        adicionarEstilosStatus();
        
    } catch (error) {
        console.error('Erro ao carregar adoções:', error);
        const tbody = document.getElementById('adocao-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7">Erro ao carregar suas adoções</td></tr>';
        }
    }
}

// Função para traduzir os status
function getStatusText(status) {
    const statusMap = {
        'em análise': 'Em Análise',
        'em andamento': 'Em Andamento', 
        'cancelado': 'Cancelada',
        'concluido': 'Concluída',
        'pendente': 'Pendente'
    };
    return statusMap[status] || status || 'Pendente';
}

// Função para adicionar estilos aos status
function adicionarEstilosStatus() {
    const styles = `
        .status-adocao {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-em análise {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-em andamento {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        .status-concluido {
            background-color: #d4edda;
            color: #155724;
        }
        .status-cancelado {
            background-color: #f8d7da;
            color: #721c24;
        }
        .status-pendente {
            background-color: #e2e3e5;
            color: #383d41;
        }
    `;
    
    if (!document.querySelector('#estilos-status-adocao')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'estilos-status-adocao';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Função para ver detalhes da adoção (APENAS VISUALIZAÇÃO PARA ADOTANTE)
window.detalhesAdocaoAdotante = async (adocaoId) => {
    try {
        const response = await axios.get(`/adocao/${adocaoId}`);
        const adocao = response.data.adocao;
        
        // Criar modal de detalhes simplificado
        const modalHTML = `
            <div id="modal-detalhes-adocao" class="modal-adotante" style="
                display: flex; position: fixed; z-index: 10000; left: 0; top: 0; 
                width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
                <div class="modal-content-adotante" style="
                    background-color: white; margin: 5% auto; padding: 25px; 
                    border-radius: 8px; width: 90%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <h3>Detalhes da Sua Adoção #${adocao.adocao_id}</h3>
                    
                    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div style="flex: 1;">
                            <img src="${gerarUrlImagemSupabase(adocao.animal?.link_img)}" 
                                 alt="${adocao.animal?.nome}" 
                                 style="width: 100%; max-width: 200px; border-radius: 8px;">
                        </div>
                        <div style="flex: 2;">
                            <h4>Animal</h4>
                            <p><strong>Nome:</strong> ${adocao.animal?.nome || '-'}</p>
                            <p><strong>Espécie:</strong> ${adocao.animal?.especie || '-'}</p>
                            <p><strong>Raça:</strong> ${adocao.animal?.raca || '-'}</p>
                            <p><strong>Idade:</strong> ${adocao.animal?.idade || '-'}</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4>Status da Adoção</h4>
                        <p><strong>Status:</strong> 
                            <span class="status-adocao status-${adocao.status || 'pendente'}">
                                ${getStatusText(adocao.status)}
                            </span>
                        </p>
                        <p><strong>Data:</strong> ${adocao.data_adocao ? new Date(adocao.data_adocao).toLocaleDateString("pt-BR") : '-'}</p>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4>Informações da ONG</h4>
                        <p><strong>ONG:</strong> ${adocao.ong?.nome || 'Não informado'}</p>
                        <p><strong>Contato:</strong> ${adocao.ong?.whatsapp || adocao.ong?.email || 'Não informado'}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="fecharModalDetalhesAdocao()" class="btn btn-cinza">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da adoção:', error);
        alert('Erro ao carregar detalhes da adoção.');
    }
};

// Função auxiliar para gerar URL da imagem
function gerarUrlImagemSupabase(caminho) {
    if (!caminho) return "/src/img/pet-default.png";
    if (caminho.startsWith("http")) return caminho;
    const PROJECT_ID = "***************";
    const BUCKET = "pets";
    return `https://${PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET}/${caminho}`;
}

// Função para fechar modal de detalhes
window.fecharModalDetalhesAdocao = function() {
    const modal = document.getElementById('modal-detalhes-adocao');
    if (modal) {
        modal.remove();
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
    document.addEventListener('DOMContentLoaded', initAdotante);
} else {
    initAdotante();
}