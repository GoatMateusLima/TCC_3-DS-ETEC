const imgCarrossel = document.getElementById('img-carrossel');
let inicial = 0;

function girarBanner() {
    inicial -= 1;
    imgCarrossel.style.transform = `translateX(${inicial}px)`;

    if (Math.abs(inicial) >= imgCarrossel.scrollWidth / 1) {
        inicial = 0;
    }
    requestAnimationFrame(girarBanner);
}

girarBanner();