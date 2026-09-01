/**
 * ACADEMIA DE TIRO WILDCAT - PRECISION TACTICAL MOTION & INTERACTIONS
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initSectionRouter();
  initSpotlightEffect();
  initGalleryLightbox();
});

/* --------------------------------------------------------------------------
   1. SECTION ROUTER & DYNAMIC MOTION ENTRANCES
   -------------------------------------------------------------------------- */
function initSectionRouter() {
  const sections = document.querySelectorAll('.site-section');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  function showSection(targetId, animate = true) {
    if (!targetId) targetId = 'inicio';
    targetId = targetId.replace('#', '');

    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Remove active state from all sections
    sections.forEach(sec => {
      sec.classList.remove('active-section');
      const items = sec.querySelectorAll('.reveal-item');
      items.forEach(item => item.classList.remove('is-visible'));
    });

    // Activate target section
    targetSection.classList.add('active-section');

    // Trigger staggered entrance animations for all elements in the section
    const revealItems = targetSection.querySelectorAll('.reveal-item');
    revealItems.forEach((item, index) => {
      item.classList.remove('is-visible');
      if (animate) {
        setTimeout(() => {
          item.classList.add('is-visible');
        }, index * 75 + 40);
      } else {
        item.classList.add('is-visible');
      }
    });

    // Toggle on-inicio class to show/hide navbar logo
    if (targetId === 'inicio') {
      document.body.classList.add('on-inicio');
    } else {
      document.body.classList.remove('on-inicio');
    }

    // Update navigation active pill
    let mainNavId = targetId;
    if (['capacitaciones', 'itb', 'entrenamientos', 'idoneidad', 'seguridad-privada'].includes(targetId)) {
      mainNavId = 'cursos';
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === mainNavId || (mainNavId === 'inicio' && href === 'inicio')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Immediate scroll to top of window
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  // Handle all hash links on the page
  document.body.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#' || !href) return;

    const targetId = href.substring(1);
    if (document.getElementById(targetId)) {
      e.preventDefault();
      showSection(targetId, true);
      history.pushState(null, null, `#${targetId}`);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash || '#inicio';
    showSection(hash, true);
  });

  // Initial load
  const initialHash = window.location.hash || '#inicio';
  showSection(initialHash, true);
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   4. SPOTLIGHT GLOW EFFECT (CURSOR REACTIVE)
   -------------------------------------------------------------------------- */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card, .tactical-box');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   5. GALLERY FULL LIGHTBOX
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const counterEl = lightbox.querySelector('#lightbox-counter');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let currentGalleryList = Array.from(galleryItems);
  let currentIndex = 0;

  function showLightbox(index) {
    if (!currentGalleryList.length) return;
    if (index < 0) index = currentGalleryList.length - 1;
    if (index >= currentGalleryList.length) index = 0;

    currentIndex = index;
    const targetItem = currentGalleryList[currentIndex];
    const imgUrl = targetItem.getAttribute('data-src') || targetItem.querySelector('img').src;

    lightboxImg.src = imgUrl;
    if (counterEl) {
      counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(currentGalleryList.length).padStart(2, '0')}`;
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showLightbox(idx);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => showLightbox(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showLightbox(currentIndex + 1));
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
  });
}
