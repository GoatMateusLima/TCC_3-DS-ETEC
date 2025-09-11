const slideshow = document.getElementById('slideshow');
let slides = Array.from(slideshow.children);
let slideWidth = slides[0].offsetWidth;
let currentIndex = 0;

// Duplicar slides para loop infinito
slides.forEach(slide => {
    slideshow.appendChild(slide.cloneNode(true));
});
slides = Array.from(slideshow.children);

function nextSlide() {
    currentIndex++;
    slideshow.style.transition = 'transform 0.5s ease-in-out';
    slideshow.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

    // Quando chegar no clone, volta para o início sem transição
    if (currentIndex >= slides.length / 2) {
        setTimeout(() => {
            slideshow.style.transition = 'none';
            currentIndex = 0;
            slideshow.style.transform = `translateX(0)`;
        }, 500);
    }
}

// Autoplay suave
let autoplay = setInterval(nextSlide, 2000);

// Pausa ao passar mouse
slideshow.addEventListener('mouseenter', () => clearInterval(autoplay));
slideshow.addEventListener('mouseleave', () => autoplay = setInterval(nextSlide, 2000));

// Atualiza slideWidth ao redimensionar
window.addEventListener('resize', () => {
    slideWidth = slides[0].offsetWidth;
    slideshow.style.transition = 'none';
    slideshow.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
});