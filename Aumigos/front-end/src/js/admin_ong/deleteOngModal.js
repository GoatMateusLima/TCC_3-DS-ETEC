// deleteOngModal.js - VERSÃO COM DEBUG
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ deleteOngModal.js carregado');

    // Criar o modal dinamicamente
    const modalHTML = `
        <div id="modal-excluir-ong" class="modal-ong hidden">
            <div class="modal-content-ong"> 
                <h3 style="color: black;">Confirmar Exclusão da ONG</h3>
                <p style="color: #e74c3c; margin-bottom: 15px;">
                    ⚠️ <strong>Atenção:</strong> Esta ação é irreversível! Todos os dados da ONG, 
                    animais cadastrados e adoções serão permanentemente excluídos.
                </p>
                <p style="color: black;">Para confirmar, digite <strong>"ApagarOng"</strong> no campo abaixo:</p>
                <input type="text" id="confirmacao-texto" placeholder="Digite ApagarOng aqui..." 
                       style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;">
                <div id="mensagem-erro" style="color: #e74c3c; font-size: 14px; margin-bottom: 15px; display: none;">
                    Texto incorreto. Digite exatamente "ApagarOng".
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 10px;">
                    <button id="btn-cancelar-exclusao" class="btn btn-cinza">Cancelar</button>
                    <button id="btn-confirmar-exclusao" class="btn btn-danger" disabled>Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar o modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal HTML adicionado ao DOM');

    // Adicionar estilos CSS
    const styles = `
        .modal-ong {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-ong:not(.hidden) {
            display: block;
        }
        .modal-content-ong {
            background-color: white;
            margin: 15% auto;
            padding: 25px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .btn-danger {
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        .btn-danger:disabled {
            background-color: #b80000ff;
            cursor: not-allowed;
        }
        .btn-cinza {
            background-color: #353030ff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    console.log('✅ Estilos CSS adicionados');

    // Elementos do DOM
    const btnExcluirOng = document.getElementById('btn-excluir-ong');
    const modalExcluirOng = document.getElementById('modal-excluir-ong');
    const confirmacaoTexto = document.getElementById('confirmacao-texto');
    const btnCancelar = document.getElementById('btn-cancelar-exclusao');
    const btnConfirmar = document.getElementById('btn-confirmar-exclusao');
    const mensagemErro = document.getElementById('mensagem-erro');

    console.log('🔍 Elementos DOM:', {
        btnExcluirOng: !!btnExcluirOng,
        modalExcluirOng: !!modalExcluirOng,
        confirmacaoTexto: !!confirmacaoTexto,
        btnCancelar: !!btnCancelar,
        btnConfirmar: !!btnConfirmar,
        mensagemErro: !!mensagemErro
    });

    // Função para abrir o modal
    function abrirModalExclusao() {
        console.log('🎯 abrirModalExclusao chamado');
        modalExcluirOng.style.display = 'block';
        modalExcluirOng.classList.remove('hidden');
        confirmacaoTexto.value = '';
        btnConfirmar.disabled = true;
        mensagemErro.style.display = 'none';
        confirmacaoTexto.focus();
        console.log('✅ Modal aberto');
    }

    // Função para fechar o modal
    function fecharModalExclusao() {
        console.log('🎯 fecharModalExclusao chamado');
        modalExcluirOng.style.display = 'none';
        modalExcluirOng.classList.add('hidden');
        console.log('✅ Modal fechado');
    }

    // Validar texto digitado
    function validarTexto() {
        const texto = confirmacaoTexto.value.trim();
        const textoCorreto = texto === 'ApagarOng';
        
        console.log('📝 Validando texto:', { texto, textoCorreto });
        
        btnConfirmar.disabled = !textoCorreto;
        mensagemErro.style.display = texto && !textoCorreto ? 'block' : 'none';
    }

    // Função para excluir a ONG
    async function excluirOng() {
        console.log('🎯 excluirOng chamado');
        
        const ong = JSON.parse(localStorage.getItem("ongLogada") || "{}");
        console.log('📋 ONG do localStorage:', ong);
        
        if (!ong.id) {
            alert('Erro: ONG não encontrada.');
            return;
        }

        if (!confirm('Tem CERTEZA ABSOLUTA que deseja excluir permanentemente esta ONG e todos os seus dados?')) {
            console.log('❌ Usuário cancelou no confirm');
            return;
        }

        try {
            console.log('🚀 Iniciando exclusão da ONG:', ong.id);
            
            // Fazer a requisição DELETE para a API
            const response = await axios.delete(`/ong/${ong.id}`);
            console.log('✅ Resposta da API:', response);
            
            if (response.status === 200 || response.status === 204) {
                // Sucesso - limpar localStorage e redirecionar
                localStorage.removeItem('ongLogada');
                localStorage.removeItem('token');
                
                console.log('✅ ONG excluída com sucesso');
                alert('ONG excluída com sucesso!');
                window.location.href = '/'; // Redirecionar para home
            }
        } catch (error) {
            console.error('❌ Erro ao excluir ONG:', error);
            
            const mensagemErro = error.response?.data?.error || 
                                error.response?.data?.message || 
                                'Erro ao excluir ONG. Tente novamente.';
            
            alert('Erro: ' + mensagemErro);
        }
    }

    // Event Listeners
    if (btnExcluirOng) {
        btnExcluirOng.addEventListener('click', abrirModalExclusao);
        console.log('✅ Event listener adicionado ao btnExcluirOng');
    } else {
        console.error('❌ btnExcluirOng não encontrado!');
        console.log('🔍 Procurando botão no DOM...');
        console.log('Todos os botões:', document.querySelectorAll('button'));
    }

    if (confirmacaoTexto) {
        confirmacaoTexto.addEventListener('input', validarTexto);
        
        // Permitir confirmar com Enter quando o botão estiver habilitado
        confirmacaoTexto.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !btnConfirmar.disabled) {
                console.log('↵ Enter pressionado, confirmando...');
                btnConfirmar.click();
            }
        });
        console.log('✅ Event listeners adicionados ao confirmacaoTexto');
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharModalExclusao);
        console.log('✅ Event listener adicionado ao btnCancelar');
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function() {
            console.log('🎯 btnConfirmar clicado, disabled:', btnConfirmar.disabled);
            if (!btnConfirmar.disabled) {
                excluirOng();
            } else {
                console.log('❌ btnConfirmar está disabled');
            }
        });
        console.log('✅ Event listener adicionado ao btnConfirmar');
    }

    // Fechar modal clicando fora dele
    if (modalExcluirOng) {
        modalExcluirOng.addEventListener('click', function(e) {
            if (e.target === modalExcluirOng) {
                console.log('🖱️ Clicou fora do modal, fechando...');
                fecharModalExclusao();
            }
        });
    }

    console.log('✅ deleteOngModal.js inicializado com sucesso');
});