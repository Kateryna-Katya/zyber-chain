/**
 * ZYBER-CHAIN.BLOG — FINAL OPTIMIZED JS
 * Содержит: Lenis, GSAP, SplitType, SimpleParallax, Swiper
 */

// 1. Конфигурация библиотек
const libs = [
    'https://unpkg.com/split-type',
    'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.5.1/dist/simpleParallax.min.js',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
];

// 2. Асинхронная загрузка и запуск
Promise.all(libs.map(src => {
    return new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = resolve;
        document.head.appendChild(s);
    });
})).then(() => {
    initApp();
});

function initApp() {
    initLenis();            // Плавный скролл
    initMobileMenu();       // Бургер и мобильная навигация
    initHeroAnimation();    // Анимация текста (SplitType + GSAP)
    initParallax();         // Параллакс для фото
    initInnovations();      // Анимация в секции Инноваций
    initBlogSlider();       // Слайдер Swiper
    initContactForm();      // Форма, валидация и капча
    initCookiePopup();      // Cookie Consent
}

/* --- МОДУЛИ --- */

// Плавный скролл
function initLenis() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Плавная навигация по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target);
                // Закрываем меню, если кликнули по ссылке на мобилке
                closeMobileMenu();
            }
        });
    });
}

// Мобильное меню
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.header__menu');
    
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
        const isActive = burger.classList.toggle('active');
        menu.classList.toggle('active');
        // Блокируем скролл страницы при открытом меню
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.header__menu');
    if (burger && menu) {
        burger.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Анимация Hero заголовка
function initHeroAnimation() {
    const title = document.querySelector('#hero-title');
    if (!title) return;

    // SplitType делит текст на слова (words), чтобы избежать разрывов букв
    const text = new SplitType(title, { types: 'words' });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero__badge', { opacity: 1, y: 0, duration: 1, delay: 0.3 })
      .from(text.words, { y: 50, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.7")
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
      .to('.hero__actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8");
}

// Параллакс изображений
function initParallax() {
    const images = document.querySelectorAll('.parallax-img');
    if (images.length > 0) {
        new simpleParallax(images, {
            delay: 0.6,
            scale: 1.3,
            transition: 'cubic-bezier(0,0,0,1)'
        });
    }
}

// Анимация в Innovations (ScrollTrigger)
function initInnovations() {
    if (!document.querySelector('.step-item')) return;

    gsap.to('.step-item', {
        scrollTrigger: {
            trigger: '.innovations__steps',
            start: 'top 80%'
        },
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out"
    });
}

// Слайдер блога
function initBlogSlider() {
    const sliderElem = document.querySelector('.blog-slider');
    if (!sliderElem) return;

    new Swiper(sliderElem, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 }
        }
    });
}

// Контактная форма
let captchaAnswer;
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const captchaLabel = document.getElementById('captcha-question');
    
    // Генерация капчи
    const refreshCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = n1 + n2;
        if (captchaLabel) captchaLabel.innerText = `${n1} + ${n2}`;
    };
    
    refreshCaptcha();

    // Валидация только цифр в телефоне
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userCaptcha = parseInt(document.getElementById('captcha-input').value);
        const successBox = document.getElementById('form-success');
        const errorBox = document.getElementById('form-error');

        if (userCaptcha !== captchaAnswer) {
            errorBox.style.display = 'block';
            successBox.style.display = 'none';
            refreshCaptcha();
            return;
        }

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Отправка...';
        btn.disabled = true;

        // Имитация AJAX
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            successBox.style.display = 'block';
            errorBox.style.display = 'none';
            form.reset();
            refreshCaptcha();
            
            setTimeout(() => { successBox.style.display = 'none'; }, 5000);
        }, 1500);
    });
}

// Cookie Popup
function initCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    const btn = document.getElementById('cookie-accept');
    
    if (!popup || !btn) return;

    // Проверяем localStorage
    if (!localStorage.getItem('cookies_accepted_zyber')) {
        setTimeout(() => {
            popup.classList.add('active');
        }, 3000);
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('cookies_accepted_zyber', 'true');
        popup.classList.remove('active');
    });
}