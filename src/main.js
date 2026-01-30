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

// Подключаем библиотеки
const libs = [
    'https://unpkg.com/split-type',
    'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.5.1/dist/simpleParallax.min.js'
];

// Загрузка всех либ
Promise.all(libs.map(src => {
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
    });
})).then(() => {
    initHeroAnimation();
    initParallax();
});

function initHeroAnimation() {
    // ИСПРАВЛЕНИЕ: разделяем по словам (words), чтобы не было разрывов
    const text = new SplitType('#hero-title', { types: 'words' });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero__badge', { opacity: 1, y: 0, duration: 1, delay: 0.5 })
    .from('.word', { // Анимируем слова
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1
    }, "-=0.8")
    .to('.hero__subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.6")
    .to('.hero__actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8");
}

function initParallax() {
    const images = document.querySelectorAll('.parallax-img');
    new simpleParallax(images, {
        delay: .6,
        transition: 'cubic-bezier(0,0,0,1)',
        scale: 1.3
    });
    // Внутри Promise.all(...).then(() => {
    initBenefitsAnimation();
// });

function initBenefitsAnimation() {
    gsap.from('.benefit-card', {
        scrollTrigger: {
            trigger: '.benefits__grid',
            start: 'top 80%', // Анимация начнется, когда верх сетки будет на 80% высоты экрана
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.2, // Карточки появляются по очереди
        ease: "power3.out"
    });
}
}