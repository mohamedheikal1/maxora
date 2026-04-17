// ===== MAXORA — script.js (fixed & production-ready) =====
// Theme: strictly Dark Mode
localStorage.setItem('maxora-theme', 'dark');

// ===== VERCEL ANALYTICS — CUSTOM EVENTS =====
// Safe wrapper: fires only when Vercel's script is loaded (window.va)
function trackEvent(eventName, props) {
    try {
        if (typeof window.va === 'function') {
            window.va('event', Object.assign({ name: eventName }, props || {}));
        }
    } catch(err) {
        console.warn('[Maxora Analytics] trackEvent failed:', err);
    }
}


// Theme: strictly Dark Mode
localStorage.setItem('maxora-theme', 'dark');

// ===== LANGUAGE SYSTEM =====

let currentLang = localStorage.getItem('language') || 'ar';

function toggleLanguage() {
    // Track language switch
    trackEvent("language_switch", { from: currentLang, to: currentLang === "ar" ? "en" : "ar" });
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    const btn = document.getElementById('langToggle');
    if (btn) btn.classList.add('flip');
    setTimeout(() => { if (btn) btn.classList.remove('flip'); }, 600);
    document.body.classList.add('fade-out');
    setTimeout(() => {
        setLanguage(newLang, true);
        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');
    }, 300);
    setTimeout(() => { document.body.classList.remove('fade-in'); }, 800);
}

function setLanguage(lang, updateChartData = false) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    const html = document.getElementById('htmlElement');
    const body = document.body;
    if (lang === 'ar') {
        html.lang = 'ar'; html.dir = 'rtl';
        body.classList.remove('lang-en');
    } else {
        html.lang = 'en'; html.dir = 'ltr';
        body.classList.add('lang-en');
    }
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    const langText = document.getElementById('langText');
    if (langText) langText.textContent = lang === 'ar' ? 'EN' : 'ع';
    const searchInput = document.getElementById('countrySearch');
    if (searchInput) searchInput.placeholder = lang === 'ar' ? 'ابحث عن دولة...' : 'Search country...';
    const nameInput = document.querySelector('input[name="fullName"]');
    if (nameInput) nameInput.placeholder = lang === 'ar' ? 'اسمك الكامل' : 'Your name';
    const compInput = document.querySelector('input[name="company"]');
    if (compInput) compInput.placeholder = lang === 'ar' ? 'اسم شركتك' : 'Your company';
    const descTA = document.querySelector('textarea[name="projectDescription"]');
    if (descTA) descTA.placeholder = lang === 'ar' ? 'أخبرنا عن مشروعك...' : 'Tell us about your project...';
    if (updateChartData && chartInstance) updateChartLabels(lang);
    renderServices();
}

// ===== SERVICES =====

const servicesData = [
    { id:1, title_ar:"تطوير مواقع ويب", title_en:"Website Development", category:"tech", desc_ar:"تطوير مواقع ويب متكاملة وسريعة تعكس قوة علامتك التجارية وتضمن أفضل أداء.", desc_en:"Integrated and fast website development that reflects your brand's power and ensures optimal performance.", iconChar:"💻" },
    { id:2, title_ar:"تطبيقات موبايل", title_en:"Mobile Apps", category:"tech", desc_ar:"تطبيقات موبايل (iOS & Android) مصممة لتسهيل وصول عملائك لخدماتك بأعلى كفاءة.", desc_en:"Mobile applications (iOS & Android) designed to maximize customer access to your services with efficiency.", iconChar:"📱" },
    { id:3, title_ar:"تصميم UI/UX", title_en:"UI/UX Design", category:"tech", desc_ar:"تصميم تجربة مستخدم جذابة وفعالة تضمن بقاء الزائر وتحويله إلى عميل دائم.", desc_en:"Attractive and effective UX design that ensures visitor retention and conversion to loyal customers.", iconChar:"✨" },
    { id:4, title_ar:"إدارة السوشيال ميديا", title_en:"Social Media Management", category:"marketing", desc_ar:"إدارة المحتوى والمنصات بشكل احترافي يخلق تفاعلاً حقيقياً ويبني ولاء العملاء.", desc_en:"Professional content and platform management that creates real engagement and builds customer loyalty.", iconChar:"🌐" },
    { id:5, title_ar:"الإعلانات الممولة", title_en:"Paid Ads", category:"marketing", desc_ar:"إعلانات ممولة مستهدفة بدقة (فيسبوك، انستجرام، جوجل) لضمان أعلى عائد استثمار.", desc_en:"Precisely targeted paid ads (Facebook, Instagram, Google) to ensure the highest return on investment.", iconChar:"📈" },
    { id:6, title_ar:"الهوية التجارية والمحتوى", title_en:"Branding & Content Creation", category:"marketing", desc_ar:"تصميم هوية بصرية قوية ومحتوى إبداعي يصنع الـ Aura الخاصة بشركتك في السوق.", desc_en:"Strong visual identity and creative content that builds your company's unique aura in the market.", iconChar:"🎨" }
];

function renderServices(filter = 'all') {
    const container = document.getElementById('services-grid');
    if (!container) return;
    container.innerHTML = '';
    const filtered = servicesData.filter(s => filter === 'all' || s.category === filter);
    filtered.forEach((service, index) => {
        const isTech = service.category === 'tech';
        const tagClass = isTech ? 'service-tag tag-tech' : 'service-tag tag-marketing';
        const tagText = isTech ? (currentLang === 'ar' ? 'تقنية' : 'Tech') : (currentLang === 'ar' ? 'تسويق' : 'Marketing');
        const title = currentLang === 'ar' ? service.title_ar : service.title_en;
        const desc  = currentLang === 'ar' ? service.desc_ar  : service.desc_en;
        const card = document.createElement('div');
        card.className = 'service-card reveal';
        card.style.transitionDelay = `${0.05 * index}s`;
        card.innerHTML = `<div class="service-icon">${service.iconChar}</div><h3 class="service-h3">${title}</h3><p class="service-p">${desc}</p><div class="${tagClass}">${tagText}</div>`;
        container.appendChild(card);
        if (typeof revealObserver !== 'undefined') revealObserver.observe(card);
    });
}

function filterServices(category) {
    // Track service filter click
    trackEvent("service_filter", { category: category });
    document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + category);
    if (activeBtn) activeBtn.classList.add('active');
    renderServices(category);
}

// ===== WHATSAPP / EMAIL =====

async function handleBookingSubmit(e) {
    e.preventDefault();
    const fullName = document.querySelector('input[name="fullName"]')?.value.trim() || '';
    const email    = document.querySelector('input[name="email"]')?.value.trim() || '';
    const phone    = window.getFullPhone ? window.getFullPhone() : (document.querySelector('input[name="phone"]')?.value.trim() || '');
    const company  = document.querySelector('input[name="company"]')?.value.trim() || '';
    const service  = document.querySelector('select[name="service"]')?.value || '';
    const meetingDate = document.querySelector('input[name="meetingDate"]')?.value || '';
    const projectDescription = document.querySelector('textarea[name="projectDescription"]')?.value.trim() || '';

    if (!fullName || !email || !phone || !company || !service || !meetingDate || !projectDescription) {
        trackEvent('booking_validation_error', { reason: 'missing_fields' });
        showFormError(currentLang === 'ar' ? '⚠️ يرجى ملء جميع الحقول!' : '⚠️ Please fill all fields!'); return;
    }
    if (!validateEmail(email)) {
        trackEvent('booking_validation_error', { reason: 'invalid_email' });
        showFormError(currentLang === 'ar' ? '⚠️ يرجى إدخال بريد إلكتروني صحيح!' : '⚠️ Please enter a valid email!'); return;
    }

    const bookingData = { fullName, email, phone, company, service, meetingDate, projectDescription, bookingTime: new Date().toLocaleString(), bookingId: generateBookingId() };

    try {
        localStorage.setItem('lastBooking', JSON.stringify(bookingData));
        const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        history.push(bookingData);
        localStorage.setItem('bookingHistory', JSON.stringify(history));
    } catch(err) {}

    showFormLoading(true);
    try { await sendEmailViaFormspree(bookingData); } catch(err) { console.warn('Email err:', err); }
    sendToWhatsApp(bookingData);
    // Track successful booking submission
    trackEvent('booking_submitted', { service: bookingData.service, bookingId: bookingData.bookingId });
    showFormLoading(false);
    showFormSuccess();
    document.getElementById('bookingForm').reset();
}

function sendToWhatsApp(data) {
    // Track WhatsApp CTA click
    trackEvent('whatsapp_cta_click', { service: data.service });
    const labels = { web:'Web Development', mobile:'Mobile App Development', 'ui-ux':'UI/UX Design', marketing:'Digital Marketing', branding:'Branding & Identity', consultation:'Business Consultation' };
    const msg = `Hello Maxora Team, I'm interested in your services.\n\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nCompany: ${data.company}\nService: ${labels[data.service]||data.service}\nDate: ${data.meetingDate}\nDetails: ${data.projectDescription}`;
    window.open('https://wa.me/201055707007?text=' + encodeURIComponent(msg), '_blank');
}

async function sendEmailViaFormspree(data) {
    const labels = { web:'Web Development', mobile:'Mobile App', 'ui-ux':'UI/UX Design', marketing:'Digital Marketing', branding:'Branding', consultation:'Consultation' };
    const res = await fetch('https://formspree.io/f/xqewzggo', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name:`${data.fullName} [MAXORA Booking]`, email:data.email, phone:data.phone, company:data.company, service:labels[data.service]||data.service, meetingDate:data.meetingDate, projectDescription:data.projectDescription, bookingId:data.bookingId, bookingTime:data.bookingTime, _subject:`🎯 New Booking — ${data.fullName} — MAXORA`, _replyto:data.email, _captcha:false })
    });
    if (!res.ok) throw new Error('Formspree error');
}

function showFormSuccess() {
    const el = document.getElementById('successMessage');
    if (el) { el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 6000); }
}
function showFormError(msg) {
    const errEl = document.getElementById('errorMsg');
    const errText = document.getElementById('errorText');
    if (errEl && errText) { errText.textContent = msg; errEl.classList.add('show'); setTimeout(() => errEl.classList.remove('show'), 4000); }
}
function showFormLoading(on) {
    const el = document.getElementById('loadingMsg');
    if (el) el.classList.toggle('show', on);
}
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function generateBookingId() { return 'BK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2,7).toUpperCase(); }

// ===== PROMO =====

function updatePromoContent(service) {
    // Track which service promo the user browses
    trackEvent('promo_tab_view', { service: service });
    document.querySelectorAll('.promo-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.stats-content').forEach(el => el.style.display = 'none');
    const p = document.getElementById('promo-' + service);
    const s = document.getElementById('stats-' + service);
    if (p) p.style.display = 'block';
    if (s) s.style.display = 'block';
}

// ===== CHART =====

let chartInstance = null;

function updateChartLabels(lang) {
    if (!chartInstance) return;
    chartInstance.data.labels = lang === 'ar' ? ['الشهر 1','الشهر 2','الشهر 3','الشهر 4','الشهر 5','الشهر 6'] : ['Month 1','Month 2','Month 3','Month 4','Month 5','Month 6'];
    chartInstance.data.datasets[0].label = lang === 'ar' ? 'تكنولوجيا فقط' : 'Technology Only';
    chartInstance.data.datasets[1].label = lang === 'ar' ? 'تسويق فقط' : 'Marketing Only';
    chartInstance.data.datasets[2].label = lang === 'ar' ? 'MAXORA (الدمج المتكامل)' : 'MAXORA (Integrated)';
    chartInstance.options.plugins.tooltip.rtl = lang === 'ar';
    chartInstance.update();
}

function initChart() {
    const canvas = document.getElementById('growthChart');
    if (!canvas || typeof Chart === 'undefined') return;
    Chart.defaults.color = '#94a3b8';
    chartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: currentLang === 'ar' ? ['الشهر 1','الشهر 2','الشهر 3','الشهر 4','الشهر 5','الشهر 6'] : ['Month 1','Month 2','Month 3','Month 4','Month 5','Month 6'],
            datasets: [
                { label: currentLang==='ar'?'تكنولوجيا فقط':'Technology Only', data:[10,15,22,28,35,42], borderColor:'#64748b', backgroundColor:'transparent', borderWidth:2, borderDash:[5,5], tension:0.4, pointRadius:0 },
                { label: currentLang==='ar'?'تسويق فقط':'Marketing Only', data:[10,20,28,36,45,50], borderColor:'#3b82f6', backgroundColor:'transparent', borderWidth:2, borderDash:[5,5], tension:0.4, pointRadius:0 },
                { label: currentLang==='ar'?'MAXORA (الدمج المتكامل)':'MAXORA (Integrated)', data:[10,25,45,75,120,180], borderColor:'#d4af37', backgroundColor:'rgba(212,175,55,0.1)', borderWidth:3, fill:true, tension:0.4, pointBackgroundColor:'#fff', pointBorderColor:'#d4af37', pointBorderWidth:2, pointRadius:5, pointHoverRadius:8 }
            ]
        },
        options: {
            responsive:true, maintainAspectRatio:false,
            interaction:{ mode:'index', intersect:false },
            plugins:{
                legend:{ position:'bottom', labels:{ padding:20, font:{size:13}, usePointStyle:true } },
                tooltip:{ backgroundColor:'rgba(6,12,24,0.95)', padding:12, borderColor:'rgba(212,175,55,0.3)', borderWidth:1, rtl:currentLang==='ar', displayColors:true, boxPadding:8 }
            },
            scales:{
                y:{ beginAtZero:true, grid:{ color:'rgba(255,255,255,0.04)', drawBorder:false }, ticks:{ display:false } },
                x:{ grid:{ display:false } }
            }
        }
    });
}

// ===== DOM READY =====

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang, false);
    renderServices();
    initChart();
    updatePromoContent('web');
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    if (typeof initReveal === 'function') initReveal();
    const statsEl = document.querySelector('.stats-grid');
    if (statsEl && typeof counterObserver !== 'undefined') counterObserver.observe(statsEl);
});

window.addEventListener('load', () => {
    console.log('%c✅ MAXORA — Where Growth Meets Technology', 'font-size:14px;color:#d4af37;font-weight:bold');
});
