// ===== MAXORA AGENCY — script.js =====

// ─────────────────────────────────────────
// LANGUAGE SYSTEM
// ─────────────────────────────────────────
let currentLang = localStorage.getItem('maxora-lang') || 'ar';
const htmlRoot  = document.getElementById('html-root');
const langToggle = document.getElementById('langToggle');
const langLabel  = document.getElementById('langLabel');
const langInner  = document.getElementById('langInner');

function applyLang(lang, animate) {
  const isAr = lang === 'ar';

  // Update html attributes
  htmlRoot.setAttribute('lang', lang);
  htmlRoot.setAttribute('dir', isAr ? 'rtl' : 'ltr');

  // Update toggle button label
  langLabel.textContent = isAr ? 'EN' : 'ع';

  // Update WhatsApp message
  const waLink = document.querySelector('.whatsapp-float');
  if (waLink) waLink.href = isAr
    ? 'https://wa.me/201055707007?text=مرحبا، أريد حجز استشارة مجانية مع Maxora'
    : 'https://wa.me/201055707007?text=Hello, I would like to book a free consultation with Maxora';

  // Translate all [data-ar] / [data-en] elements
  document.querySelectorAll('[data-ar],[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt !== null) el.textContent = txt;
  });

  // card-line transform-origin flips with dir
  document.querySelectorAll('.card-line, .service-card::before').forEach(el => {
    el.style.transformOrigin = isAr ? 'right' : 'left';
  });

  localStorage.setItem('maxora-lang', lang);
}

function toggleLang() {
  const next = currentLang === 'ar' ? 'en' : 'ar';

  // Flip animation on button
  langInner.style.transform = 'rotateY(90deg)';

  // Fade page out
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.2s ease';

  setTimeout(() => {
    currentLang = next;
    applyLang(next, true);

    // Fade page back in
    document.body.style.opacity = '1';

    // Reset button
    langInner.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)';
    langInner.style.transform = 'rotateY(0deg)';
    setTimeout(() => { langInner.style.transition = ''; }, 400);
  }, 220);
}

langToggle.addEventListener('click', toggleLang);

// Init on load
applyLang(currentLang, false);


// ─────────────────────────────────────────
// NAVBAR SCROLL SHADOW
// ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});


// ─────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});


// ─────────────────────────────────────────
// STATS COUNTER
// ─────────────────────────────────────────
let statsAnimated = false;
function animateCounter(el, target) {
  let cur = 0;
  const step = Math.ceil(target / 70);
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(timer);
  }, 20);
}

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-num').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);


// ─────────────────────────────────────────
// SERVICE CARDS STAGGERED REVEAL
// ─────────────────────────────────────────
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = i * 120;
      entry.target.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card').forEach(c => cardObserver.observe(c));


// ─────────────────────────────────────────
// WHY CARDS SLIDE IN
// ─────────────────────────────────────────
const whyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.why-card').forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        }, i * 130);
      });
      whyObserver.disconnect();
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.why-card').forEach(c => {
  c.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});
const whySec = document.querySelector('.why');
if (whySec) whyObserver.observe(whySec);


// ─────────────────────────────────────────
// WHY POINTS STAGGER
// ─────────────────────────────────────────
const pointObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.why-point').forEach((pt, i) => {
      setTimeout(() => { pt.style.opacity = '1'; pt.style.transform = 'translateX(0)'; }, i * 140);
    });
    pointObserver.disconnect();
  }
}, { threshold: 0.2 });

document.querySelectorAll('.why-point').forEach(pt => {
  pt.style.opacity = '0';
  pt.style.transform = 'translateX(20px)';
  pt.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
if (whySec) pointObserver.observe(whySec);


// ─────────────────────────────────────────
// MEETING CARD REVEAL
// ─────────────────────────────────────────
const meetObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    entries[0].target.classList.add('visible');
    meetObs.disconnect();
  }
}, { threshold: 0.2 });

const meetCard = document.querySelector('.meeting-card');
if (meetCard) meetObs.observe(meetCard);
