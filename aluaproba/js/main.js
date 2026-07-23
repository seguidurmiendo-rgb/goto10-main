/**
 * ALUAPROBA - LÓGICA DE INTERACCIÓN WEB MODERNIZADA
 * 
 * Incluye:
 * - Scrollspy & Navbar Sticky
 * - Menú Móvil Desplegable
 * - Decálogo LLUU: Filtro por Categorías + Buscador en Tiempo Real
 * - Accordion FAQ Desplegable
 * - Validaciones de Formulario & Sistema de Toast Notifications
 * - Animations on Scroll (Intersection Observer)
 * - Contadores de Estadísticas Animados
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de componentes
  initNavbar();
  initDecalogo();
  initFaqAccordion();
  initContactForm();
  initScrollAnimations();
  initStatCounters();
});

/* ==========================================================================
   1. NAVBAR STICKY & SCROLLSPY & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const headerNav = document.getElementById('headerNav');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Handler para añadir sombra al header al scrollear
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }

    // Scrollspy: Actualiza el enlace activo según la sección en pantalla
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle Handler
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggleBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      });
    });
  }

  // Smooth scroll para todos los enlaces internos '#'
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   2. MANUAL INTERACTIVO DEL DECÁLOGO LLUU (TABS + SEARCH)
   ========================================================================== */
function initDecalogo() {
  const tabButtons = document.querySelectorAll('.decalogo-tab-btn');
  const searchInput = document.getElementById('decalogoSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const decalogoItems = document.querySelectorAll('.decalogo-item');
  const noResultsMsg = document.getElementById('noResultsMsg');

  let activeCategory = 'all';
  let searchQuery = '';

  // Función para normalizar texto (elimina acentos y convierte a minúsculas)
  function normalizeText(str) {
    return (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Filtrar ítems según categoría y búsqueda
  function filterItems() {
    let visibleCount = 0;
    const normalizedQuery = normalizeText(searchQuery);

    decalogoItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const itemTextNormalized = normalizeText(item.textContent);
      
      const matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);
      const matchesSearch = (normalizedQuery === '' || itemTextNormalized.includes(normalizedQuery));

      if (matchesCategory && matchesSearch) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    // Mostrar u ocultar mensaje de "Sin Resultados"
    if (visibleCount === 0) {
      noResultsMsg.style.display = 'block';
    } else {
      noResultsMsg.style.display = 'none';
    }
  }

  // Manejo de Clics en Pestañas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.getAttribute('data-category');
      filterItems();
    });
  });

  // Manejo de Entrada en el Buscador
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery.trim().length > 0 ? 'block' : 'none';
      }
      
      filterItems();
    });
  }

  // Limpiar Búsqueda
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      filterItems();
    });
  }
}

/* ==========================================================================
   3. ACCORDION FAQ DESPLEGABLE
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Cerrar otros acordeones si se desea comportamiento único
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Alternar estado actual
      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   4. FORMULARIO DE CONTACTO & VALIDACIÓN & TOAST NOTIFICATIONS
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Resetear errores previos
    let isValid = true;
    const formGroups = contactForm.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));

    // Validar Nombre
    const nameInput = document.getElementById('contactName');
    if (!nameInput.value.trim()) {
      showFieldError(nameInput);
      isValid = false;
    }

    // Validar Email
    const emailInput = document.getElementById('contactEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput);
      isValid = false;
    }

    // Validar Motivo
    const reasonSelect = document.getElementById('contactReason');
    if (!reasonSelect.value) {
      showFieldError(reasonSelect);
      isValid = false;
    }

    // Validar Mensaje
    const messageInput = document.getElementById('contactMessage');
    if (!messageInput.value.trim()) {
      showFieldError(messageInput);
      isValid = false;
    }

    if (!isValid) return;

    // Simulación de Envío con Estado de Carga
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      <span>Enviando mensaje...</span>
    `;

    setTimeout(() => {
      // Éxito en el envío
      showToast('¡Gracias! Tu mensaje ha sido recibido por la Comisión Directiva de ALUAPROBA.', 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }, 1200);
  });
}

function showFieldError(inputElement) {
  const formGroup = inputElement.closest('.form-group');
  if (formGroup) {
    formGroup.classList.add('has-error');
  }
}

// Sistema de Notificaciones Toast
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastNotification');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   5. INTERSECTION OBSERVER PARA REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-item');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   6. CONTADORES DE ESTADÍSTICAS ANIMADOS
   ========================================================================== */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetNumber = parseInt(entry.target.getAttribute('data-target'), 10);
        animateCounter(entry.target, targetNumber);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => counterObserver.observe(stat));
}

function animateCounter(element, target) {
  let current = 0;
  const duration = 1500;
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target === 19 ? `+${target}` : target;
      clearInterval(timer);
    } else {
      element.textContent = target === 19 ? `+${Math.floor(current)}` : Math.floor(current);
    }
  }, stepTime);
}
