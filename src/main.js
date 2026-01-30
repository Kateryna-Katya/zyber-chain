/**
 * ZYBER-CHAIN.BLOG - FINAL OPTIMIZED SCRIPT
 */

// 1. Список необходимых библиотек
const libs = [
    'https://unpkg.com/split-type',
    'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.5.1/dist/simpleParallax.min.js',
    'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
];

// 2. Загрузка библиотек и инициализация
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
    initLenis();            // Плавный скролл
    initHeroAnimation();    // Анимация заголовка Hero
    initParallax();         // Параллакс для фото в About
    initInnovationsAnimation(); // Анимация шагов в Innovations
    initBlogSlider();       // Слайдер статей
    initMobileMenu();       // Бургер-меню
    initContactForm();      // Форма с капчей
    initCookiePopup();      // Куки-попап
}

// Плавный скролл (Lenis)
function initLenis() {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Плавный переход по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target);
                // Закрываем мобильное меню при клике
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
    
    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
        });
    }
}

// Анимация Hero (SplitType по словам)
function initHeroAnimation() {
    if (!document.querySelector('#hero-title')) return;
    
    const text = new SplitType('#hero-title', { types: 'words' });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to('.hero__badge', { opacity: 1, y: 0, duration: 1, delay: 0.5 })
      .from('.word', { y: 40, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.8")
      .to('.hero__subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.6")
      .to('.hero__actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8");
}

// Параллакс для изображений
function initParallax() {
    const images = document.querySelectorAll('.parallax-img');
    if (images.length > 0) {
        new simpleParallax(images, { delay: .6, scale: 1.3, transition: 'cubic-bezier(0,0,0,1)' });
    }
}

// Анимация шагов в секции Innovations
function initInnovationsAnimation() {
    if (!document.querySelector('.step-item')) return;
    
    gsap.to('.step-item', {
        scrollTrigger: {
            trigger: '.innovations__steps',
            start: 'top 75%',
        },
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out"
    });
}

// Инициализация Swiper (Блог)
function initBlogSlider() {
    if (!document.querySelector('.blog-slider')) return;
    
    new Swiper('.blog-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

// Контактная форма и капча
let captchaResult;
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const qField = document.getElementById('captcha-question');
    const gen = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        captchaResult = n1 + n2;
        qField.innerText = `${n1} + ${n2}`;
    };
    gen();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const userAns = parseInt(document.getElementById('captcha-input').value);
        const successMsg = document.getElementById('form-success');
        const errorMsg = document.getElementById('form-error');

        if (userAns !== captchaResult) {
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
            gen();
            return;
        }
        
        const btn = form.querySelector('button');
        btn.innerText = 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
            successMsg.style.display = 'block';
            errorMsg.style.display = 'none';
            form.reset();
            btn.innerText = 'Отправить запрос';
            btn.disabled = false;
            gen();
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
        }, 1500);
    });
}

// Cookie Popup
function initCookiePopup() {
    const popup = document.getElementById('cookie-popup');
    const acceptBtn = document.getElementById('cookie-accept');
    
    if (!popup) return;

    if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => { popup.classList.add('active'); }, 2000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        popup.classList.remove('active');
    });
}