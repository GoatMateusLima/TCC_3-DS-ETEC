// Carrossel de comentários
function iniciarCarrossel(carrosselId, velocidade = 1) {
    const carrossel = document.getElementById(carrosselId);
    if (!carrossel) return;

    const itensOriginais = Array.from(carrossel.children);
    itensOriginais.forEach(item => {
        carrossel.appendChild(item.cloneNode(true)); // duplica para loop infinito
    });

    let posicao = 0;
    const larguraOriginal = itensOriginais.reduce((total, el) => total + el.offsetWidth, 0);

    function rolar() {
        posicao -= velocidade;
        carrossel.style.transform = `translateX(${posicao}px)`;

        if (Math.abs(posicao) >= larguraOriginal) posicao = 0;

        requestAnimationFrame(rolar);
    }

    rolar();
}

iniciarCarrossel('img-comentriocarrossel', 1);