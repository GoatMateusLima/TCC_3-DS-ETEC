// /src/js/global/verificacao_login.js

/**
 * Lê o usuário do localStorage de forma tolerante (suporta chaves antigas/novas).
 * Retorna null se não existir ou JSON inválido.
 */
function getUsuario() {
    try {
        const raw1 = localStorage.getItem('usuario');
        if (raw1) return JSON.parse(raw1);

        const raw2 = localStorage.getItem('usuarioAtual');
        if (raw2) return JSON.parse(raw2);

        return null;
    } catch (e) {
        console.error('Erro ao parsear localStorage (usuario):', e);
        return null;
    }
}

/**
 * Função usada pelo botão "Conta" (comportamento original).
 * Se não houver usuário manda pra tela de login. Se houver, redireciona conforme tipo.
 */
function verificarConta() {
    const usuario = getUsuario();

    if (!usuario || !usuario.tipo) {
        window.location.href = "/src/pages/login/login.html";
        return;
    }

    switch (usuario.tipo) {
        case "adotante":
            window.location.href = "/src/pages/user/adotante.html";
            break;

        case "ong":
            window.location.href = "/src/pages/user/ong.html";
            break;

        case "membro":
            window.location.href = "/src/pages/user/membro_ong.html";
            break;

        default:
            window.location.href = "/src/pages/login/login.html";
            break;
    }
}

/**
 * Função que páginas (como ong.html) podem chamar para exigir autenticação
 * e tipos específicos ao carregar. Retorna o usuário se autorizado, ou redireciona.
 *
 * Exemplo de uso em ong.html:
 *   const usuario = requireAuth(['ong']);
 *   if (!usuario) return; // já redirecionou
 */
function requireAuth(allowedTypes = []) {
    const usuario = getUsuario();

    if (!usuario || !usuario.tipo) {
        window.location.href = "/src/pages/login/login.html";
        return null;
    }

    // se não foram passados tipos, apenas valida login
    if (!Array.isArray(allowedTypes) || allowedTypes.length === 0) {
        return usuario;
    }

    // se o tipo do usuário não é permitido -> redirect
    if (!allowedTypes.includes(usuario.tipo)) {
        window.location.href = "/src/pages/login/login.html";
        return null;
    }

    return usuario;
}

/**
 * Atacha os handlers do botão "Conta" (desktop + mobile) sem forçar redirects
 * em outras partes do site. Mantém o comportamento antigo que você queria.
 */
document.addEventListener("DOMContentLoaded", () => {
    try {
        const btnDesktop = document.getElementById("btn-conta-desktop");
        const btnMobile = document.getElementById("btn-conta-mobile");

        if (btnDesktop) btnDesktop.addEventListener("click", verificarConta);
        if (btnMobile) btnMobile.addEventListener("click", verificarConta);
    } catch (e) {
        console.error('Erro ao inicializar verificacao_login:', e);
    }
});

// expõe utilitários para outros scripts (ong.js etc.)
window.getUsuario = getUsuario;
window.requireAuth = requireAuth;
window.verificarConta = verificarConta;
