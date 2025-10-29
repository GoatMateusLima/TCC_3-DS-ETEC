// Banner principal
function iniciarBanner(bannerId, velocidade = 1) {
    const banner = document.getElementById(bannerId);
    if (!banner) return;

    const imgs = Array.from(banner.querySelectorAll('img'));
    imgs.forEach(img => {
        banner.appendChild(img.cloneNode(true)); // duplica imagens para loop infinito
    });

    let posicao = 0;
    const larguraOriginal = imgs.reduce((total, img) => total + img.offsetWidth, 0);

    function rolar() {
        posicao -= velocidade;
        banner.style.transform = `translateX(${posicao}px)`;

        if (Math.abs(posicao) >= larguraOriginal) posicao = 0;

        requestAnimationFrame(rolar);
    }

    rolar();
}

// Inicia os dois carrosseis

iniciarBanner('img-carrossel', 2);