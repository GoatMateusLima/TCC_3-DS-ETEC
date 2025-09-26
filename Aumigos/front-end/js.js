const imgCarrossel = document.getElementById('img-carrossel');
let posicao = 0;

function rolarBanner() {
    posicao -= 1;
    imgCarrossel.style.transform = `translateX(${posicao}px)`;

    if (Math.abs(posicao) >= imgCarrossel.scrollWidth / 2) {
        posicao = 0;
    }
    requestAnimationFrame(rolarBanner);
}

rolarBanner();