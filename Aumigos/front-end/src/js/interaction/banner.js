const slideshow = document.getElementById('slideshow');
let slides = Array.from(slideshow.children);
let slideWidth = slides[0].offsetWidth;
let currentIndex = 0;

// Duplica os slides para loop infinito
slides.forEach(slide => {
    let clone = slide.cloneNode(true);
    slideshow.appendChild(clone);
});
slides = Array.from(slideshow.children);

function render() {
    slideshow.style.transition = 'transform 0.5s ease-in-out';
    slideshow.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
}

function nextSlide() {
    if (currentIndex >= slides.length / 2) {
        currentIndex++;
        render();

        setTimeout(() => {
            slideshow.style.transition = 'none';
            currentIndex = 0;
            slideshow.style.transform = 'translateX(0)';
        }, 500);
    } else {
        currentIndex++;
        render();
    }
}

function prevSlide() {
    if (currentIndex <= 0) {
        slideshow.style.transition = 'none';
        currentIndex = slides.length / 2;
        slideshow.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

        setTimeout(() => {
            slideshow.style.transition = 'transform 0.5s ease-in-out';
            currentIndex--;
            render();
        }, 20);
    } else {
        currentIndex--;
        render();
    }
}

// Autoplay
let autoplay = setInterval(nextSlide, 2000);

// Pausar autoplay ao passar mouse
slideshow.addEventListener('mouseenter', () => clearInterval(autoplay));
slideshow.addEventListener('mouseleave', () => autoplay = setInterval(nextSlide, 3000));
