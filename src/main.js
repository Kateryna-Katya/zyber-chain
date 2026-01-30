/**
 * ZYBER-CHAIN.BLOG — FINAL FULL JS
 * Включает: Lenis, GSAP, SplitType, SimpleParallax, Swiper
 */

// 1. Конфигурация внешних библиотек
const libs = [
  'https://unpkg.com/split-type',
  'https://cdn.jsdelivr.net/npm/simple-parallax-js@5.5.1/dist/simpleParallax.min.js',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js'
];

// 2. Асинхронная загрузка библиотек
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

// 3. Главная функция инициализации
function initApp() {
  initLenis();            // Плавный скролл
  initMobileMenu();       // Исправленное мобильное меню
  initHeroAnimation();    // Анимация текста в Hero
  initParallax();         // Параллакс для всех изображений с классом .parallax-img
  initInnovations();      // Анимация шагов в секции Инноваций
  initBlogSlider();       // Слайдер Swiper для блога
  initContactForm();      // Логика формы и капча
  initCookiePopup();      // Cookie Consent с сохранением в localStorage
}

/* --- МОДУЛЬ ПЛАВНОГО СКРОЛЛА --- */
function initLenis() {
  const lenis = new Lenis();
  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Плавный переход по якорям (#)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
              lenis.scrollTo(target);
          }
      });
  });
}

/* --- МОДУЛЬ МОБИЛЬНОГО МЕНЮ (ИСПРАВЛЕНО) --- */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.header__menu');
  const allLinks = document.querySelectorAll('.header__menu a, .nav-link');

  if (!burger || !menu) return;

  // Открытие/Закрытие по клику на бургер
  burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = burger.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
  });

  // ЗАКРЫТИЕ ПРИ КЛИКЕ НА ЛЮБУЮ ССЫЛКУ (Для одностраничной навигации)
  allLinks.forEach(link => {
      link.addEventListener('click', () => {
          burger.classList.remove('active');
          menu.classList.remove('active');
          document.body.style.overflow = '';
      });
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !burger.contains(e.target) && menu.classList.contains('active')) {
          burger.classList.remove('active');
          menu.classList.remove('active');
          document.body.style.overflow = '';
      }
  });
}

/* --- МОДУЛЬ АНИМАЦИИ HERO --- */
function initHeroAnimation() {
  const title = document.querySelector('#hero-title');
  if (!title) return;

  // SplitType делит текст на слова, чтобы не было разрывов
  const text = new SplitType(title, { types: 'words' });
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.to('.hero__badge', { opacity: 1, y: 0, duration: 1, delay: 0.5 })
    .from(text.words, { y: 60, opacity: 0, stagger: 0.1, duration: 1 }, "-=0.7")
    .to('.hero__subtitle', { opacity: 1, y: 0, duration: 1 }, "-=0.8")
    .to('.hero__actions', { opacity: 1, y: 0, duration: 1 }, "-=0.8");
}

/* --- МОДУЛЬ ПАРАЛЛАКСА --- */
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

/* --- МОДУЛЬ ИННОВАЦИЙ --- */
function initInnovations() {
  const steps = document.querySelectorAll('.step-item');
  if (steps.length === 0) return;

  gsap.to(steps, {
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

/* --- МОДУЛЬ СЛАЙДЕРА БЛОГА --- */
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

/* --- МОДУЛЬ ФОРМЫ И КАПЧИ --- */
let captchaSecret;
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const captchaLabel = document.getElementById('captcha-question');
  const refreshCaptcha = () => {
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      captchaSecret = n1 + n2;
      if (captchaLabel) captchaLabel.innerText = `${n1} + ${n2}`;
  };

  refreshCaptcha();

  // Ограничение ввода в телефон
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });
  }

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const userAns = parseInt(document.getElementById('captcha-input').value);
      const success = document.getElementById('form-success');
      const error = document.getElementById('form-error');

      if (userAns !== captchaSecret) {
          if (error) error.style.display = 'block';
          refreshCaptcha();
          return;
      }

      const btn = form.querySelector('button');
      btn.innerText = 'Отправка...';
      btn.disabled = true;

      setTimeout(() => {
          if (success) success.style.display = 'block';
          if (error) error.style.display = 'none';
          form.reset();
          btn.innerText = 'Отправить запрос';
          btn.disabled = false;
          refreshCaptcha();
          setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
      }, 1500);
  });
}

/* --- МОДУЛЬ COOKIE POPUP --- */
function initCookiePopup() {
  const popup = document.getElementById('cookie-popup');
  const btn = document.getElementById('cookie-accept');
  if (!popup || !btn) return;

  if (!localStorage.getItem('zyber_cookie_consent')) {
      setTimeout(() => { popup.classList.add('active'); }, 2500);
  }

  btn.addEventListener('click', () => {
      localStorage.setItem('zyber_cookie_consent', 'true');
      popup.classList.remove('active');
  });
}