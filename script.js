/* ═══════════════════════════════════════════════════
   SAMPLE RESTAURANT — script.js
═══════════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Hamburger / Mobile nav ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── Theme Toggle ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if (theme === 'light') {
    themeIcon.className = 'fa-solid fa-moon';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    themeIcon.className = 'fa-solid fa-sun';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  }
  localStorage.setItem('restaurant-theme', theme);
}

// Restore saved preference or detect system preference on first visit
(function initTheme() {
  const saved = localStorage.getItem('restaurant-theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
  // else stays dark (set by data-theme="dark" in HTML)
})();

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── Menu Tabs ── */
const tabs   = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const targetPanel = document.getElementById(target);
    if (targetPanel) targetPanel.classList.add('active');

    // Smooth scroll to menu section on mobile
    if (window.innerWidth < 768) {
      document.querySelector('.menu-tabs').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

/* ── Gallery Lightbox ── */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox      = document.getElementById('lightbox');
const lbImg         = document.getElementById('lightbox-img');
const lbCaption     = document.getElementById('lightbox-caption');
const lbClose       = document.getElementById('lightbox-close');
const lbPrev        = document.getElementById('lightbox-prev');
const lbNext        = document.getElementById('lightbox-next');

let currentIndex = 0;

const galleryData = Array.from(galleryItems).map(item => ({
  src:     item.querySelector('img').src,
  caption: item.querySelector('.gallery-caption').textContent.trim()
}));

function openLightbox(index) {
  currentIndex = index;
  lbImg.src            = galleryData[currentIndex].src;
  lbCaption.textContent = galleryData[currentIndex].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  lbImg.src            = galleryData[currentIndex].src;
  lbCaption.textContent = galleryData[currentIndex].caption;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryData.length;
  lbImg.src            = galleryData[currentIndex].src;
  lbCaption.textContent = galleryData[currentIndex].caption;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

/* ── Touch Swipe — Lightbox ── */
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // Only trigger if horizontal swipe is dominant and far enough
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < 0) showNext();
    else        showPrev();
  }
}, { passive: true });

/* ── Wrap card images for fancy overlay ── */
document.querySelectorAll('.menu-card img').forEach(img => {
  const wrap = document.createElement('div');
  wrap.className = 'menu-card-img-wrap';
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  const overlay = document.createElement('div');
  overlay.className = 'menu-card-img-overlay';
  overlay.innerHTML = '<i class="fa-regular fa-eye"></i><span>View Details</span>';
  wrap.appendChild(overlay);
});

/* ── Menu Item Modal ── */
const itemModal      = document.getElementById('item-modal');
const itemModalClose = document.getElementById('item-modal-close');
const itemModalBack  = document.getElementById('item-modal-back');
const itemBackdrop   = document.getElementById('item-modal-backdrop');
const iModalImgZone  = document.getElementById('item-modal-img-zone');
const iModalIconZone = document.getElementById('item-modal-icon-zone');
const iModalImg      = document.getElementById('item-modal-img');
const iModalBadge    = document.getElementById('item-modal-badge-wrap');
const iModalName     = document.getElementById('item-modal-name');
const iModalPrice    = document.getElementById('item-modal-price');
const iModalDesc     = document.getElementById('item-modal-desc');
const iModalIcon     = document.getElementById('item-modal-icon');

const PANEL_ICONS = {
  cocktails: 'fa-solid fa-martini-glass-citrus',
  pizza:     'fa-solid fa-pizza-slice',
  paella:    'fa-solid fa-bowl-food',
  entree:    'fa-solid fa-bowl-food',
  pasta:     'fa-solid fa-stroopwafel',
  soup:      'fa-solid fa-mug-hot',
  salad:     'fa-solid fa-leaf',
  dessert:   'fa-solid fa-cake-candles',
  drinks:    'fa-solid fa-wine-glass',
  addons:    'fa-solid fa-plus',
};

function openItemModal(card) {
  // — Image or icon zone —
  const imgEl = card.querySelector('.menu-card-img-wrap img');
  if (imgEl) {
    iModalImg.src = imgEl.src;
    iModalImg.alt = imgEl.alt || '';
    iModalImgZone.style.display  = '';
    iModalIconZone.style.display = 'none';
  } else {
    iModalImgZone.style.display  = 'none';
    iModalIconZone.style.display = '';
    const panel   = card.closest('.menu-panel');
    const panelId = panel ? panel.id : '';
    iModalIcon.className = (PANEL_ICONS[panelId] || 'fa-solid fa-utensils') + ' item-modal-icon-bg';
  }

  // — Badge —
  iModalBadge.innerHTML = '';
  const chefBadgeEl    = card.querySelector('.chef-badge');
  const premiumBadgeEl = card.querySelector('.premium-badge');
  if (chefBadgeEl) {
    const b = document.createElement('span');
    b.className = 'modal-badge-chef';
    b.innerHTML = '<i class="fa-solid fa-hat-chef"></i> Chef\'s Pick';
    iModalBadge.appendChild(b);
  } else if (premiumBadgeEl) {
    const label = premiumBadgeEl.textContent.trim();
    const b = document.createElement('span');
    b.className = label.toLowerCase() === 'signature' ? 'modal-badge-signature' : 'modal-badge-premium';
    b.innerHTML = '<i class="fa-solid fa-star"></i> ' + label;
    iModalBadge.appendChild(b);
  }

  // — Name, Price, Description —
  iModalName.textContent  = card.querySelector('h3')?.textContent.trim() || '';
  iModalPrice.textContent = card.querySelector('.price')?.textContent.trim() || '';
  const descText = card.querySelector('.menu-card-desc')?.textContent.trim() || '';
  if (descText) {
    iModalDesc.textContent = descText;
    iModalDesc.classList.remove('is-placeholder');
  } else {
    iModalDesc.textContent = 'A carefully crafted dish prepared with the finest ingredients, served with our signature rustic touch.';
    iModalDesc.classList.add('is-placeholder');
  }

  itemModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeItemModal() {
  itemModal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('click', e => {
    // Don't trigger if user clicked a nested link or button
    if (e.target.closest('a, button')) return;
    openItemModal(card);
  });
});

itemModalClose.addEventListener('click', closeItemModal);
itemModalBack.addEventListener('click', closeItemModal);
itemBackdrop.addEventListener('click', closeItemModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && itemModal.classList.contains('open')) closeItemModal();
});

/* ── Intersection Observer – fade-in non-card elements ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Menu cards use CSS cardIn animation; only apply fade-target to other elements
document.querySelectorAll('.info-card, .gallery-item, .about-img').forEach(el => {
  el.classList.add('fade-target');
  observer.observe(el);
});

/* Inject CSS for fade-in animation */
const style = document.createElement('style');
style.textContent = `
  .fade-target {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-target.visible {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(style);

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--clr-gold)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ════════════════════════════════════════
   SPECIALS BAR DISMISS
════════════════════════════════════════ */
(function () {
  const bar = document.getElementById('specials-bar');
  const closeBtn = document.getElementById('specials-bar-close');
  if (!bar || !closeBtn) return;
  if (localStorage.getItem('restaurant-specials-dismissed') === '1') {
    bar.classList.add('dismissed');
  }
  closeBtn.addEventListener('click', () => {
    bar.classList.add('dismissed');
    localStorage.setItem('restaurant-specials-dismissed', '1');
  });
})();

/* ════════════════════════════════════════
   STATS COUNTER ANIMATION
════════════════════════════════════════ */
(function () {
  const statItems = document.querySelectorAll('.stat-item[data-target]');
  if (!statItems.length) return;

  function animateCount(el) {
    const target    = parseFloat(el.dataset.target);
    const decimals  = parseInt(el.dataset.decimals || '0', 10);
    const numEl     = el.querySelector('.stat-number');
    const duration  = 1800;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = ease * target;
      numEl.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => statsObserver.observe(el));
})();

/* ════════════════════════════════════════
   REVIEWS CAROUSEL
════════════════════════════════════════ */
(function () {
  const track      = document.getElementById('reviews-track');
  const prevBtn    = document.getElementById('reviews-prev');
  const nextBtn    = document.getElementById('reviews-next');
  const dotsWrap   = document.getElementById('reviews-dots');
  if (!track) return;

  const cards     = Array.from(track.querySelectorAll('.review-card'));
  const total     = cards.length;
  let current     = 0;
  let autoTimer;

  // Work out visible count based on CSS columns
  function visibleCount() {
    const w = track.parentElement.offsetWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function maxIndex() { return Math.max(0, total - visibleCount()); }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const steps = maxIndex() + 1;
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.reviews-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardW  = cards[0].offsetWidth;
    const gap    = parseInt(getComputedStyle(track).gap) || 16;
    track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
    updateDots();
  }

  function next() { goTo(current < maxIndex() ? current + 1 : 0); }
  function prev() { goTo(current > 0 ? current - 1 : maxIndex()); }

  function startAuto() { autoTimer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(autoTimer); }

  prevBtn && prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  // Touch / swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); stopAuto(); startAuto(); }
  });

  // Init
  buildDots();
  startAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(current); });
})();

/* ════════════════════════════════════════
   RESERVATION FORM MODAL
════════════════════════════════════════ */
function openResModal() {
  const modal = document.getElementById('res-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeResModal() {
  const modal = document.getElementById('res-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Reset form & success state after animation
  setTimeout(() => {
    const success = document.getElementById('res-success');
    const form    = document.getElementById('res-form');
    if (success) success.style.display = 'none';
    if (form)    form.style.display    = '';
  }, 300);
}

function handleReservation(event) {
  event.preventDefault();
  const name     = (document.getElementById('res-name')?.value     || '').trim();
  const phone    = (document.getElementById('res-phone')?.value    || '').trim();
  const date     = (document.getElementById('res-date')?.value     || '');
  const time     = (document.getElementById('res-time')?.value     || '');
  const guests   = (document.getElementById('res-guests')?.value   || '');
  const occasion = (document.getElementById('res-occasion')?.value || '');
  const notes    = (document.getElementById('res-notes')?.value    || '').trim();

  let msg = `Hi Sample Restaurant! 🍽️ I'd like to make a reservation.\n\n`;
  msg    += `👤 Name: ${name}\n`;
  msg    += `📞 Phone: ${phone}\n`;
  msg    += `📅 Date: ${date}\n`;
  msg    += `🕐 Time: ${time}\n`;
  msg    += `👥 Party size: ${guests}\n`;
  if (occasion) msg += `🎉 Occasion: ${occasion}\n`;
  if (notes)    msg += `📝 Notes: ${notes}\n`;
  msg    += `\nThank you! 😊`;

  const waLink = document.getElementById('res-whatsapp-link');
  if (waLink) waLink.href = `https://wa.me/639299666175?text=${encodeURIComponent(msg)}`;

  const form    = document.getElementById('res-form');
  const success = document.getElementById('res-success');
  if (form)    form.style.display    = 'none';
  if (success) success.style.display = 'flex';
}

(function () {
  const openBtn   = document.getElementById('open-reservation-form');
  const backdrop  = document.getElementById('res-modal-backdrop');
  const closeBtn  = document.getElementById('res-modal-close');

  openBtn  && openBtn.addEventListener('click', openResModal);
  backdrop && backdrop.addEventListener('click', closeResModal);
  closeBtn && closeBtn.addEventListener('click', closeResModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('res-modal')?.classList.contains('open')) {
      closeResModal();
    }
  });
})();

/* ════════════════════════════════════════
   SCROLL-TO-TOP BUTTON
════════════════════════════════════════ */
(function () {
  const topBtn = document.getElementById('scroll-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
