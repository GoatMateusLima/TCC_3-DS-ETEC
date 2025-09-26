const imgCarrosselComentario = document.getElementById('img-comentriocarrossel');
let posicao = 0;

function rolarBanner() {
    posicao -= 1;
    imgCarrosselComentario.style.transform = `translateX(${posicao}px)`;

    if (Math.abs(posicao) >= imgCarrosselComentario.scrollWidth / 2) {
        posicao = 0;
    }
    requestAnimationFrame(rolarBanner);
}

rolarBanner();