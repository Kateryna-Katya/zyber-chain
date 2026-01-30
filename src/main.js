// Инициализация плавного скролла Lenis
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Эффект хедера при скролле
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Плавный скролл до якорей
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target);
        }
    });

});
// Добавьте в начало файла подключение SplitType
const script = document.createElement('script');
script.src = 'https://unpkg.com/split-type';
script.onload = () => {
    initHeroAnimation();
};
document.head.appendChild(script);

function initHeroAnimation() {
    // Разрезаем текст на символы
    const text = new SplitType('#hero-title', { types: 'chars' });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero__badge', {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.5
    })
    .to('.char', {
        y: 0,
        stagger: 0.02,
        duration: 1
    }, "-=0.8")
    .to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 1
    }, "-=0.6")
    .to('.hero__actions', {
        opacity: 1,
        y: 0,
        duration: 1
    }, "-=0.8");
}

// Плавный скролл и хедер остаются из предыдущего шага...