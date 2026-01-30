/**
 * ZYBER-CHAIN.BLOG - ФИНАЛЬНЫЙ СКРИПТ
 */

// 1. Загрузка библиотек
const libs = [
    'https://unpkg.com/split-type',
    'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.5.1/dist/simpleParallax.min.js',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
];

Promise.all(libs.map(src => {
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        document.head.appendChild(s);
    });
})).then(() => {
    initAll();
});

function initAll() {
    initLenis();
    initHeroAnimation();
    initParallax();
    initBenefitsAnimation();
    initInnovationsAnimation();
    initBlogSlider();
    initMobileMenu();
    initContactForm();
    initCookiePopup();
}

// Плавный скролл Lenis
function initLenis() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Скролл по клику на ссылки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target);
                // Закрыть мобильное меню если открыто
                document.querySelector('.header__menu').classList.remove('active');
                document.querySelector('.burger').classList.remove('active');
            }
        });
    });
}

// Мобильное меню
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.header__menu');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

// Hero Анимация (SplitType по словам)
function initHeroAnimation() {
    const text = new SplitType('#hero-title', { types: 'words' });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero__badge', { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .from('.word', { y: 40, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.8")
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .to('.hero__actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8");
}

// Параллакс
function initParallax() {
    const images = document.querySelectorAll('.parallax-img');
    new simpleParallax(images, { delay: .6, scale: 1.3 });
}

// Анимация преимуществ
function initBenefitsAnimation() {
    gsap.from('.benefit-card', {
        scrollTrigger: { trigger: '.benefits__grid', start: 'top 80%' },
        y: 60, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
    });
}

// Анимация инноваций
function initInnovationsAnimation() {
    gsap.to('.step-item', {
        scrollTrigger: { trigger: '.innovations__steps', start: 'top 70%' },
        opacity: 1, x: 0, duration: 1, stagger: 0.3
    });
}

// Слайдер блога
function initBlogSlider() {
    new Swiper('.blog-slider', {
        slidesPerView: 1, spaceBetween: 30, loop: true,
        navigation: { nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

// Контактная форма
let captchaResult;
function initContactForm() {
    const form = document.getElementById('contactForm');
    const qField = document.getElementById('captcha-question');
    
    const gen = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaResult = n1 + n2;
        if(qField) qField.innerText = `${n1} + ${n2}`;
    };
    gen();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userAns = parseInt(document.getElementById('captcha-input').value);
        if(userAns !== captchaResult) {
            document.getElementById('form-error').style.display = 'block';
            gen();
            return;
        }
        
        const btn = form.querySelector('button');
        btn.innerText = 'Отправка...';
        setTimeout(() => {
            document.getElementById('form-success').style.display = 'block';
            document.getElementById('form-error').style.display = 'none';
            form.reset();
            btn.innerText = 'Отправить запрос';
            gen();
        }, 1500);
    });
}

// Cookie Popup
function initCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    const acceptBtn = document.getElementById('cookie-accept');
    
    if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => { popup.classList.add('active'); }, 2000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        popup.classList.remove('active');
    });
}