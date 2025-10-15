// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================
const CONFIG = {
  typingSpeed: 100,
  typingDelay: 2000,
  scrollOffset: 80,
  scrollTopThreshold: 300,
  animationDuration: 1000
};

const TYPED_TEXTS = [
  'Desarrollador Web',
  'Estudiante de IA',
  'Creador de Experiencias',
  'Apasionado por el Código'
];

// ============================================
// UTILIDADES
// ============================================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ============================================
// THEME MANAGER
// ============================================
class ThemeManager {
  constructor() {
    this.themeToggle = $('#theme-toggle');
    this.body = document.body;
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupEventListeners();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      this.body.classList.add('light-mode');
      this.updateIcon(true);
    }
  }

  setupEventListeners() {
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
  }

  toggleTheme() {
    this.body.classList.toggle('light-mode');
    const isLight = this.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    this.updateIcon(isLight);
    this.animateToggle();
  }

  updateIcon(isLight) {
    if (this.themeToggle) {
      this.themeToggle.innerHTML = isLight 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    }
  }

  animateToggle() {
    this.body.style.transition = 'background 0.3s ease';
  }
}

// ============================================
// NAVBAR MANAGER
// ============================================
class NavbarManager {
  constructor() {
    this.navbar = $('.navbar');
    this.hamburger = $('#hamburger');
    this.navMenu = $('#nav-menu');
    this.navLinks = $$('.nav-link');
    this.lastScroll = 0;
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setActiveLink();
  }

  setupScrollEffect() {
    window.addEventListener('scroll', throttle(() => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        this.navbar?.classList.add('scrolled');
      } else {
        this.navbar?.classList.remove('scrolled');
      }

      this.lastScroll = currentScroll;
    }, 100));
  }

  setupMobileMenu() {
    this.hamburger?.addEventListener('click', () => {
      this.hamburger.classList.toggle('active');
      this.navMenu?.classList.toggle('active');
      this.hamburger.setAttribute(
        'aria-expanded',
        this.hamburger.classList.contains('active')
      );
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
      }
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - CONFIG.scrollOffset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          e.preventDefault();
          const target = $(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  setActiveLink() {
    const sections = $$('section[id]');
    
    window.addEventListener('scroll', throttle(() => {
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, 100));
  }
}

// ============================================
// TYPING EFFECT
// ============================================
class TypingEffect {
  constructor(element, texts) {
    this.element = element;
    this.texts = texts;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    if (this.element) {
      this.type();
    }
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.isDeleting ? 50 : CONFIG.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = CONFIG.typingDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
  constructor() {
    this.counters = $$('.stat-number');
    this.hasAnimated = false;
    this.init();
  }

  init() {
    if (this.counters.length > 0) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
class SkillBarsAnimation {
  constructor() {
    this.skillBars = $$('.skill-progress');
    this.hasAnimated = false;
    this.init();
  }

  init() {
    if (this.skillBars.length > 0) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const progress = bar.getAttribute('data-progress');
          bar.style.width = `${progress}%`;
        }
      });
    }, { threshold: 0.5 });

    this.skillBars.forEach(bar => observer.observe(bar));
  }
}

// ============================================
// SCROLL ANIMATIONS (AOS Alternative)
// ============================================
class ScrollAnimations {
  constructor() {
    this.elements = $$('[data-aos]');
    this.init();
  }

  init() {
    if (this.elements.length > 0) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(element => observer.observe(element));
  }
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
class ScrollToTop {
  constructor() {
    this.button = $('#scroll-top');
    this.init();
  }

  init() {
    if (this.button) {
      this.setupScrollListener();
      this.setupClickListener();
    }
  }

  setupScrollListener() {
    window.addEventListener('scroll', throttle(() => {
      if (window.pageYOffset > CONFIG.scrollTopThreshold) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    }, 100));
  }

  setupClickListener() {
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ============================================
// FORM HANDLER CON EMAILJS ✨
// ============================================
class FormHandler {
  constructor() {
    this.form = $('#contact-form');
    // ✅ TUS CREDENCIALES DE EMAILJS CONFIGURADAS
    this.emailjsConfig = {
      serviceID: 'service_7495evf',
      templateID: 'template_qyht7hg',
      publicKey: 'IHVBATkYWGe77IBoy'
    };
    this.init();
  }

  init() {
    // Inicializar EmailJS
    emailjs.init(this.emailjsConfig.publicKey);
    
    if (this.form) {
      this.setupFormSubmit();
      this.setupRealTimeValidation();
    }
  }

  setupFormSubmit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        from_name: $('#name')?.value,
        reply_to: $('#email')?.value,
        message: $('#message')?.value
      };

      if (this.validateForm(formData)) {
        this.submitForm(formData);
      }
    });
  }

  setupRealTimeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (!value) {
      isValid = false;
      errorMessage = 'Este campo es requerido';
    } else if (field.type === 'email' && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Email no válido';
    }

    this.showFieldError(field, isValid, errorMessage);
    return isValid;
  }

  validateForm(data) {
    let isValid = true;

    if (!data.from_name || data.from_name.trim().length < 2) {
      this.showError('El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    if (!data.reply_to || !this.isValidEmail(data.reply_to)) {
      this.showError('Por favor ingresa un email válido');
      isValid = false;
    }

    if (!data.message || data.message.trim().length < 10) {
      this.showError('El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  showFieldError(field, isValid, message) {
    const formGroup = field.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!isValid) {
      field.classList.add('error');
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--primary-dark)';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        formGroup.appendChild(errorElement);
      }
      errorElement.textContent = message;
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  async submitForm(formData) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    try {
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      // ✨ Enviar email con EmailJS
      const response = await emailjs.send(
        this.emailjsConfig.serviceID,
        this.emailjsConfig.templateID,
        formData
      );

      console.log('✅ Email enviado correctamente:', response);
      this.showSuccess('¡Mensaje enviado con éxito! 🎉 Te responderé pronto.');
      this.form.reset();

    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      this.showError('Hubo un error al enviar el mensaje. Por favor intenta de nuevo o contáctame directamente por email.');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      padding: '1rem 1.5rem',
      background: type === 'success' ? 'var(--secondary)' : 'var(--primary-dark)',
      color: 'white',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'slideInRight 0.3s ease-out',
      maxWidth: '400px'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================
class InteractiveElements {
  constructor() {
    this.init();
  }

  init() {
    this.setupProjectCardHovers();
  }

  setupProjectCardHovers() {
    const projectCards = $$('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// ============================================
// PERFORMANCE MONITOR
// ============================================
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.logLoadTime();
    this.setupLazyLoading();
  }

  logLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`⚡ Página cargada en ${loadTime}ms`);
    });
  }

  setupLazyLoading() {
    const images = $$('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// ============================================
// EASTER EGGS
// ============================================
class EasterEggs {
  constructor() {
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;
    this.init();
  }

  init() {
    this.setupKonamiCode();
    this.setupConsoleMessage();
  }

  setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      if (e.key === this.konamiCode[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.activateKonami();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  activateKonami() {
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.style.animation = '';
      style.remove();
    }, 5000);

    console.log('🎮 ¡Código Konami activado!');
  }

  setupConsoleMessage() {
    console.log('%c¡Hola Developer! 👋', 'font-size: 20px; font-weight: bold; color: #f4a261;');
    console.log('%c¿Curioseando el código? ¡Me gusta! 🔍', 'font-size: 14px; color: #2a9d8f;');
    console.log('%cSi tienes sugerencias, contáctame: cardenasjairo006@gmail.com', 'font-size: 12px; color: #8892b0;');
  }
}

// ============================================
// STARS GENERATOR (Generador de Estrellas)
// ============================================
class StarsGenerator {
  constructor() {
    this.container = $('#stars-container');
    this.starCount = 50;
    this.init();
  }

  init() {
    if (this.container && window.innerWidth > 768) {
      this.generateStars();
    }
  }

  generateStars() {
    for (let i = 0; i < this.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      
      const size = Math.random() * 2 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      
      star.style.animationDelay = Math.random() * 4 + 's';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      
      this.container.appendChild(star);
    }
  }
}

// ============================================
// PARTICLES INTERACTION (Interacción con Mouse)
// ============================================
class ParticlesInteraction {
  constructor() {
    this.particles = $$('.particle');
    this.init();
  }

  init() {
    if (this.particles.length > 0 && window.innerWidth > 768) {
      this.setupMouseInteraction();
    }
  }

  setupMouseInteraction() {
    document.addEventListener('mousemove', throttle((e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      this.particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;

        const deltaX = mouseX - particleX;
        const deltaY = mouseY - particleY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < 200) {
          const force = (200 - distance) / 200;
          const moveX = deltaX * force * 0.3;
          const moveY = deltaY * force * 0.3;

          particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          particle.style.transform = 'translate(0, 0)';
        }
      });
    }, 50));
  }
}

// ============================================
// INICIALIZACIÓN DE LA APP
// ============================================
class App {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Inicializar todos los componentes
      new ThemeManager();
      new NavbarManager();
      new ScrollToTop();
      new FormHandler(); // ✅ FormHandler con EmailJS configurado
      new InteractiveElements();
      new PerformanceMonitor();
      new EasterEggs();

      // Componentes con animaciones
      new CounterAnimation();
      new SkillBarsAnimation();
      new ScrollAnimations();

      // Efecto de escritura en el hero
      const typedElement = $('.typed-text');
      if (typedElement) {
        new TypingEffect(typedElement, TYPED_TEXTS);
      }

      // Sistema de partículas
      new StarsGenerator();
      new ParticlesInteraction();

      // Agregar animaciones CSS dinámicas
      this.addDynamicStyles();

      console.log('✅ Aplicación inicializada correctamente');
      console.log('📧 EmailJS configurado y listo para recibir mensajes');
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error);
    }
  }

  addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes scaleIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================
// INICIAR APLICACIÓN
// ============================================
const app = new App();

// Exportar para uso en consola (debugging)
window.app = app;