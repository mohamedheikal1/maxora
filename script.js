// ===== THEME TOGGLE SYSTEM =====

function toggleTheme() {
    const body = document.getElementById('body');
    const themeBtn = document.getElementById('themeToggle');
    const isLightMode = body.classList.contains('light-mode');
    
    if (isLightMode) {
        body.classList.remove('light-mode');
        localStorage.setItem('maxora-theme', 'dark');
        themeBtn.querySelector('.theme-toggle-text').textContent = '🌙';
    } else {
        body.classList.add('light-mode');
        localStorage.setItem('maxora-theme', 'light');
        themeBtn.querySelector('.theme-toggle-text').textContent = '☀️';
    }
}

// Initialize theme from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('maxora-theme') || 'dark';
    const body = document.getElementById('body');
    const themeBtn = document.getElementById('themeToggle');
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeBtn.querySelector('.theme-toggle-text').textContent = '☀️';
    }

    // Initialize existing functionality
    setLanguage(currentLang, false);
    renderServices();
    initChart();
    updatePromoContent('web');

    // ===== WHATSAPP & EMAIL BOOKING FORM HANDLER =====
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

// ===== UNIFIED WHATSAPP MESSAGE =====

const whatsappMessage = `Hello Maxora Team, I'm interested in your digital marketing services. Could you please provide more details?

Name: {fullName}
Email: {email}
Phone: {phone}
Company: {company}
Service: {service}`;

// ===== UNIFIED BOOKING HANDLER =====

async function handleBookingSubmit(e) {
    e.preventDefault();

    const fullName = document.querySelector('input[name="fullName"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = window.getFullPhone ? window.getFullPhone() : document.querySelector('input[name="phone"]').value.trim();
    const company = document.querySelector('input[name="company"]').value.trim();
    const service = document.querySelector('select[name="service"]').value;
    const meetingDate = document.querySelector('input[name="meetingDate"]').value;
    const projectDescription = document.querySelector('textarea[name="projectDescription"]').value.trim();

    if (!fullName || !email || !phone || !company || !service || !meetingDate || !projectDescription) {
        showErrorMessage('⚠️ Please fill all fields!');
        return;
    }

    if (!validateEmail(email)) {
        showErrorMessage('⚠️ Please enter a valid email address!');
        return;
    }

    const bookingData = {
        fullName,
        email,
        phone,
        company,
        service,
        meetingDate,
        projectDescription,
        bookingTime: new Date().toLocaleString('ar-EG'),
        currentLanguage: currentLang,
        bookingId: generateBookingId()
    };

    localStorage.setItem('lastBooking', JSON.stringify(bookingData));
    localStorage.setItem('bookingHistory', 
        JSON.stringify([
            ...JSON.parse(localStorage.getItem('bookingHistory') || '[]'),
            bookingData
        ])
    );

    const loadingDiv = showLoadingMessage('📤 Sending to Email & WhatsApp...');

    try {
        await sendEmailViaFormspree(bookingData);
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Email error:', error);
    }

    sendToWhatsApp(bookingData);

    if (loadingDiv) loadingDiv.remove();
    
    setTimeout(() => {
        showSuccessMessage();
        document.getElementById('bookingForm').reset();
    }, 1500);
}

// ===== SEND TO WHATSAPP WITH SIMPLE MESSAGE =====

function sendToWhatsApp(data) {
    const serviceLabels = {
        'web': 'Web Development',
        'mobile': 'Mobile App Development',
        'ui-ux': 'UI/UX Design',
        'marketing': 'Digital Marketing',
        'branding': 'Branding & Identity',
        'consultation': 'Business Consultation'
    };

    let message = whatsappMessage
        .replace(/{fullName}/g, data.fullName)
        .replace(/{email}/g, data.email)
        .replace(/{phone}/g, data.phone)
        .replace(/{company}/g, data.company)
        .replace(/{service}/g, serviceLabels[data.service] || data.service);

    const whatsappPhone = '201055707007';
    const whatsappURL = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');
}

// ===== FORMSPREE EMAIL INTEGRATION =====

async function sendEmailViaFormspree(data) {
    const formspreeURL = 'https://formspree.io/f/xqewzggo';
    
    const serviceLabels = {
        'web': 'Web Development',
        'mobile': 'Mobile App',
        'ui-ux': 'UI/UX Design',
        'marketing': 'Digital Marketing',
        'branding': 'Branding',
        'consultation': 'Consultation'
    };

    const emailData = {
        name: `${data.fullName} [MAXORA Booking]`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service: serviceLabels[data.service],
        meetingDate: data.meetingDate,
        projectDescription: data.projectDescription,
        bookingId: data.bookingId,
        bookingTime: data.bookingTime,
        _subject: `🎯 New Booking - ${data.fullName} - MAXORA`,
        _replyto: data.email,
        _captcha: false
    };

    const response = await fetch(formspreeURL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return true;
}

// ===== DYNAMIC PROMO SYSTEM =====

function updatePromoContent(service) {
    document.querySelectorAll('.promo-content').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.stats-content').forEach(el => {
        el.style.display = 'none';
    });

    const promoElement = document.getElementById(`promo-${service}`);
    const statsElement = document.getElementById(`stats-${service}`);

    if (promoElement) {
        promoElement.style.display = 'block';
    }

    if (statsElement) {
        statsElement.style.display = 'block';
    }
}

// ===== UTILITY FUNCTIONS =====

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateBookingId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `BK-${timestamp}-${random}`;
}

function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.classList.add('show');

    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}

function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>${message}</span>
    `;
    
    const form = document.getElementById('bookingForm');
    form.insertBefore(loadingDiv, form.firstChild);

    return loadingDiv;
}

function showErrorMessage(message) {
    const form = document.getElementById('bookingForm');
    
    const existingError = form.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    form.insertBefore(errorDiv, form.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

// ===== LANGUAGE SYSTEM =====

const TRANSLATIONS = {
    ar: {
        home: 'الرئيسية',
        vision: 'رؤيتنا',
        services: 'الخدمات',
        impact: 'تأثيرنا'
    },
    en: {
        home: 'Home',
        vision: 'Vision',
        services: 'Services',
        impact: 'Impact'
    }
};

let currentLang = localStorage.getItem('language') || 'ar';

function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    const btn = document.getElementById('langToggle');
    
    btn.classList.add('flip');
    setTimeout(() => {
        btn.classList.remove('flip');
    }, 600);

    document.body.classList.add('fade-out');
    
    setTimeout(() => {
        setLanguage(newLang, true);
        document.body.classList.remove('fade-out');
        document.body.classList.add('fade-in');
    }, 300);

    setTimeout(() => {
        document.body.classList.remove('fade-in');
    }, 800);
}

function setLanguage(lang, updateChartData = false) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    const html = document.getElementById('htmlElement');
    const body = document.getElementById('body');

    if (lang === 'ar') {
        html.lang = 'ar';
        html.dir = 'rtl';
        body.classList.remove('lang-en');
    } else {
        html.lang = 'en';
        html.dir = 'ltr';
        body.classList.add('lang-en');
    }

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
    });

    const langToggle = document.getElementById('langToggle');
    const langText = langToggle.querySelector('.lang-toggle-text');
    langText.textContent = lang === 'ar' ? 'EN' : 'ع';

    if (updateChartData && window.chartInstance) {
        updateChartLabels(lang);
    }
}

// ===== SERVICES SYSTEM =====

const servicesData = [
    {
        id: 1,
        title: "Website Development",
        category: "tech",
        desc_ar: "تطوير مواقع ويب متكاملة وسريعة تعكس قوة علامتك التجارية وتضمن أفضل أداء.",
        desc_en: "Integrated and fast website development that reflects your brand's power and ensures optimal performance.",
        iconChar: "💻"
    },
    {
        id: 2,
        title: "Mobile Apps",
        category: "tech",
        desc_ar: "تطبيقات موبايل (iOS & Android) مصممة لتسهيل وصول عملائك لخدماتك بأعلى كفاءة.",
        desc_en: "Mobile applications (iOS & Android) designed to make it easier for your customers to access your services with maximum efficiency.",
        iconChar: "📱"
    },
    {
        id: 3,
        title: "UI/UX Design",
        category: "tech",
        desc_ar: "تصميم تجربة مستخدم جذابة وفعالة تضمن بقاء الزائر وتحويله إلى عميل دائم.",
        desc_en: "Attractive and effective user experience design that ensures visitor retention and conversion to a permanent customer.",
        iconChar: "✨"
    },
    {
        id: 4,
        title: "Social Media Management",
        category: "marketing",
        desc_ar: "إدارة المحتوى والمنصات بشكل احترافي يخلق تفاعلاً حقيقياً ويبني ولاء العملاء.",
        desc_en: "Professional content and platform management that creates real engagement and builds customer loyalty.",
        iconChar: "🌐"
    },
    {
        id: 5,
        title: "Paid Ads",
        category: "marketing",
        desc_ar: "إعلانات ممولة مستهدفة بدقة (فيسبوك، انستجرام، جوجل) لضمان أعلى عائد استثمار (ROI).",
        desc_en: "Precisely targeted paid ads (Facebook, Instagram, Google) to ensure the highest return on investment (ROI).",
        iconChar: "📈"
    },
    {
        id: 6,
        title: "Branding & Content Creation",
        category: "marketing",
        desc_ar: "تصميم هوية بصرية قوية ومحتوى إبداعي يصنع الـ Aura الخاصة بشركتك في السوق.",
        desc_en: "Strong visual identity design and creative content that creates your company's unique Aura in the market.",
        iconChar: "🎨"
    }
];

function renderServices(filter = 'all') {
    const container = document.getElementById('services-grid');
    container.innerHTML = '';
    
    const filtered = servicesData.filter(s => filter === 'all' || s.category === filter);
    
    filtered.forEach((service, index) => {
        const isTech = service.category === 'tech';
        const tagColor = isTech ? 'bg-blue-900/50 text-blue-300 border-blue-500/30' : 'bg-purple-900/50 text-purple-300 border-purple-500/30';
        const tagText = isTech ? 'Tech' : 'Marketing';
        const desc = currentLang === 'ar' ? service.desc_ar : service.desc_en;

        const card = document.createElement('div');
        card.className = `service-card glass-panel p-8 rounded-2xl border border-gray-800 flex flex-col h-full opacity-0 animate-slideUp`;
        card.style.animationDelay = `${0.1 + index * 0.1}s`;
        
        card.innerHTML = `
            <div class="text-4xl mb-6 bg-gray-900 w-16 h-16 flex items-center justify-center rounded-xl border border-gray-700 shadow-inner">
                ${service.iconChar}
            </div>
            <div class="mb-auto">
                <h3 class="text-xl font-bold font-english text-white mb-3">${service.title}</h3>
                <p class="text-gray-400 leading-relaxed text-sm">${desc}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-gray-800">
                <span class="text-xs font-english px-3 py-1 rounded-full border ${tagColor}">
                    ${tagText}
                </span>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function filterServices(category) {
    ['all', 'tech', 'marketing'].forEach(cat => {
        const btn = document.getElementById(`btn-${cat}`);
        if (cat === category) {
            btn.className = 'px-6 py-2 rounded-md font-semibold bg-brand-electricBlue text-white transition-all shadow-md';
        } else {
            btn.className = 'px-6 py-2 rounded-md font-semibold text-gray-400 hover:text-white transition-all';
        }
    });
    
    renderServices(category);
}

// ===== CHART SYSTEM =====

let chartInstance = null;

function updateChartLabels(lang) {
    if (!chartInstance) return;

    const newLabels = lang === 'ar' 
        ? ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر 4', 'الشهر 5', 'الشهر 6']
        : ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

    const newDatasets = lang === 'ar'
        ? [
            { label: 'تكنولوجيا فقط' },
            { label: 'تسويق فقط' },
            { label: 'MAXORA (الدمج المتكامل)' }
        ]
        : [
            { label: 'Technology Only' },
            { label: 'Marketing Only' },
            { label: 'MAXORA (Integrated)' }
        ];

    chartInstance.data.labels = newLabels;
    chartInstance.data.datasets.forEach((dataset, i) => {
        dataset.label = newDatasets[i].label;
    });

    chartInstance.options.plugins.tooltip.rtl = lang === 'ar';
    chartInstance.update();
}

function initChart() {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;
    
    const chartCtx = ctx.getContext('2d');
    
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = currentLang === 'ar' ? 'Cairo' : 'Montserrat';

    const labels = currentLang === 'ar'
        ? ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر 4', 'الشهر 5', 'الشهر 6']
        : ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

    const datasets = currentLang === 'ar'
        ? [
            {
                label: 'تكنولوجيا فقط',
                data: [10, 15, 22, 28, 35, 42],
                borderColor: '#64748b',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'تسويق فقط',
                data: [10, 20, 28, 36, 45, 50],
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'MAXORA (الدمج المتكامل)',
                data: [10, 25, 45, 75, 120, 180],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#d4af37',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }
        ]
        : [
            {
                label: 'Technology Only',
                data: [10, 15, 22, 28, 35, 42],
                borderColor: '#64748b',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'Marketing Only',
                data: [10, 20, 28, 36, 45, 50],
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0
            },
            {
                label: 'MAXORA (Integrated)',
                data: [10, 25, 45, 75, 120, 180],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 4,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#d4af37',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }
        ];

    chartInstance = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { size: 13, family: currentLang === 'ar' ? 'Cairo' : 'Montserrat' },
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 34, 68, 0.95)',
                    titleFont: { size: 14, family: currentLang === 'ar' ? 'Cairo' : 'Montserrat', weight: 'bold' },
                    bodyFont: { size: 13, family: currentLang === 'ar' ? 'Cairo' : 'Montserrat' },
                    padding: 12,
                    borderColor: 'rgba(212, 175, 55, 0.5)',
                    borderWidth: 2,
                    rtl: currentLang === 'ar',
                    displayColors: true,
                    boxPadding: 10
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                    },
                    ticks: { display: false }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ===== SMOOTH SCROLL FUNCTION =====

function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== NAVBAR ACTIVE LINK ON SCROLL =====

window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
        nav.classList.add('bg-[#050a14]/90', 'shadow-lg');
    } else {
        nav.classList.remove('bg-[#050a14]/90', 'shadow-lg');
    }
});

// ===== BOOKING ANALYTICS =====

function getBookingAnalytics() {
    const bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    console.log('📊 MAXORA Bookings:', bookings);
    return bookings;
}

window.addEventListener('load', () => {
    console.log('%c✅ MAXORA Website Active', 'font-size: 16px; color: #d4af37;');
});