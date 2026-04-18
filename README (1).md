# MAXORA — موقع الوكالة الرسمي

> **Where Growth Meets Technology**  
> موقع وكالة Maxora للنمو الرقمي وحلول التكنولوجيا المتكاملة

---

## 📁 هيكل المشروع

```
maxora-main/
├── index.html          ← الصفحة الرئيسية (كل الـ HTML + CSS المدمج)
├── styles.css          ← ملف الـ CSS الخارجي
├── script.js           ← JavaScript رئيسي (اللغة، الخدمات، الـ Chart، إلخ)
├── phone.js            ← مكون اختيار كود الدولة للفورم
├── app.html            ← صفحة مساعدة داخلية (غير منشورة للعملاء)
├── maxora-logo.webp    ← اللوجو المحسّن (WebP — 9 KB)
├── MAXORA png white.png← اللوجو الأصلي PNG (احتياطي للمتصفحات القديمة)
├── vercel.json         ← إعدادات النشر والـ Cache والـ Security Headers
├── sitemap.xml         ← خريطة الموقع للـ SEO
├── robots.txt          ← إعدادات الـ crawlers
├── site.webmanifest    ← PWA manifest
└── .github/
    └── workflows/
        └── npm-publish.yml
```

---

## 🚀 النشر على Vercel

### خطوات الرفع:
1. اذهب إلى [vercel.com](https://vercel.com) وادخل على مشروعك
2. اسحب وأفلت مجلد `maxora-main` كاملاً
3. تأكد إن **كل الملفات** موجودة (خصوصاً `maxora-logo.webp`)
4. Vercel هيستخدم `vercel.json` تلقائياً للإعدادات

### إعدادات الـ Build:
- **Framework:** None (Static HTML)
- **Output Directory:** `./` (الجذر)
- **لا يحتاج Build Command**

---

## ⚙️ التقنيات المستخدمة

| التقنية | الاستخدام | طريقة التحميل |
|---|---|---|
| HTML5 / CSS3 | الهيكل والتصميم | مباشر |
| Vanilla JavaScript | التفاعلية والمنطق | `defer` |
| GSAP 3.12 | الـ Animations | `defer` — ديسكتوب فقط |
| Lenis | Smooth Scroll | `defer` — ديسكتوب فقط |
| Chart.js | مخطط النمو | **Lazy** (عند الظهور) |
| Supabase | قاعدة بيانات الـ bookings | **Lazy** (عند الظهور) |
| Formspree | إرسال Email | عند الـ submit |
| Cloudflare Turnstile | CAPTCHA للفورم | async/defer |
| Google Fonts | Cairo, Bebas Neue, Space Grotesk | Non-blocking preload |
| Vercel Analytics | تتبع الزوار | `defer` |
| Vercel Speed Insights | قياس الأداء | `defer` |

---

## 🌐 الميزات

### ثنائية اللغة (عربي / إنجليزي)
- كل النصوص بتتحكم فيها عبر `data-ar` و `data-en` attributes
- اللغة الافتراضية: **العربية** مع RTL
- التبديل لحظي بدون إعادة تحميل الصفحة
- تغيير font-family تلقائياً (Cairo للعربية — Space Grotesk للإنجليزية)

### الأقسام:
1. **Hero** — العنوان الرئيسي مع Canvas animation (ديسكتوب فقط)
2. **Marquee** — شريط خدمات متحرك
3. **Stats** — أرقام بـ counter animation
4. **Services** — كروت الخدمات مع filter tabs (ديناميكية من JS)
5. **Promo** — تبويبات تفاعلية (Web / Mobile / UI-UX / Marketing / Branding / Consultation)
6. **Vision** — رؤية الشركة (MAX + ORA)
7. **Impact** — مخطط النمو (Chart.js)
8. **CTA** — Call to Action section
9. **Booking** — فورم الحجز مع country picker وـ CAPTCHA
10. **Footer** — روابط ووسائل التواصل الاجتماعي

---

## 🔒 الأمان (Security)

### Security Headers (vercel.json):
- `X-Frame-Options: DENY` — منع الـ clickjacking
- `Strict-Transport-Security` — HSTS مع preload
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — حجب Camera، Microphone، Geolocation، Payment
- `Content-Security-Policy` — محدد بـ whitelist صارمة

### Form Security:
- **Cloudflare Turnstile CAPTCHA** — مع fallback تلقائي لو فشل التحميل
- **Rate Limiting** — 3 محاولات كحد أقصى في الساعة
- **Supabase RLS** — Row Level Security: INSERT فقط للـ anon role، USING=false لمنع القراءة
- **Triple Submission** — Supabase DB + Formspree Email + WhatsApp notification
- **Validation كاملة** — Email regex، Phone regex، past date blocking

---

## ⚡ تحسينات الأداء (Performance)

### ما اتعمل لرفع Lighthouse Score:

#### 🔴 إصلاح 1 — اللوجو (التوفير الأكبر)
```
قبل:  MAXORA png white.png  →  826 KB  |  2100×1500 px
بعد:  maxora-logo.webp      →    9 KB  |   200×143 px
التوفير: 99% (817 KB أقل)
```
- `fetchpriority="high"` + `<link rel="preload">` في الـ head (LCP critical)

#### 🔴 إصلاح 2 — الـ Preloader
```
قبل:  ~1.5s على الموبايل
بعد:  ~0.8s على الموبايل
```
- CSS auto-hide animation على موبايل بعد 0.7s
- Overflow unlock timeout: 1200ms (متزامن مع الـ animation)
- GSAP وـ Lenis مش بيتحملوا خالص على موبايل

#### 🟡 إصلاح 3 — Chart.js (Lazy Loading)
```
قبل:  يتحمل مع الصفحة دايماً (~200 KB)
بعد:  يتحمل فقط لما الـ chart تظهر في الشاشة
```
- IntersectionObserver مع rootMargin: 200px

#### 🟡 إصلاح 4 — Supabase SDK (Lazy Loading)
```
قبل:  يتحمل مع الصفحة دايماً
بعد:  يتحمل فقط لما الـ booking section يظهر في الشاشة
```

#### 🟡 إصلاح 5 — Cache Headers (vercel.json)
```
الصور/WebP:  max-age=31536000 (سنة كاملة) — immutable
JS/CSS:      max-age=86400    (يوم) — must-revalidate
HTML:        max-age=3600     (ساعة) — must-revalidate
```

#### ✅ إصلاحات ثابتة:
- GSAP ScrollTrigger محذوف (توفير ~40 KB)
- Font Awesome محذوف، SVGs مدمجة مباشرة (توفير ~200 KB)
- Canvas particles: 30 نقطة فقط (بدل 60)، مع pause عند tab hidden
- Preconnect لـ Google Fonts، CDNs، وـ Formspree
- Service card skeletons لمنع CLS قبل تحميل الـ JS

---

## ♿ Accessibility

- **hreflang** في الـ head للـ ar + en + x-default
- **focus-visible styles** لجميع العناصر التفاعلية (keyboard navigation)
- **aria-label** على كل الأزرار والـ inputs
- **sr-only class** للعناصر المخصصة للـ screen readers
- **Alt text** على كل الصور مع dimensions محددة
- **Semantic HTML** — nav، main، footer، section، h1-h3

---

## 📊 نتائج Lighthouse

| | موبايل | ديسكتوب |
|---|---|---|
| **Performance** | 85–90 🟢 | 95+ 🟢 |
| **Accessibility** | 90+ 🟢 | 90+ 🟢 |
| **Best Practices** | 100 🟢 | 100 🟢 |
| **SEO** | 100 🟢 | 100 🟢 |

### Core Web Vitals (Mobile):
| Metric | القيمة | الحالة |
|---|---|---|
| FCP | ~1.2s | 🟢 Good |
| LCP | ~2.5s | 🟡 Needs Improvement |
| TBT | 0ms | 🟢 Good |
| CLS | 0.016 | 🟢 Good |

---

## 🔍 SEO

- **Meta tags** كاملة: title، description، keywords، author، geo.region
- **Open Graph** + **Twitter Cards** مع image dimensions
- **Schema.org JSON-LD** — ProfessionalService schema
- **Canonical URL** + **robots meta**
- **sitemap.xml** مع hreflang ar + en
- **hreflang link tags** في الـ head (ar + en + x-default)
- **robots.txt** مع sitemap reference

---

## 📈 Analytics & Tracking

Events مُتتبَّعة تلقائياً في Vercel Analytics:
- `language_switch` — عند تغيير اللغة
- `service_filter` — عند تصفية الخدمات
- `promo_tab_view` — عند اختيار خدمة من الـ dropdown
- `booking_submitted` — عند إرسال الفورم بنجاح
- `booking_validation_error` — عند فشل الـ validation (مع السبب)
- `whatsapp_cta_click` — عند الضغط على WhatsApp

---

## 🛠️ تعديل المحتوى

### إضافة خدمة جديدة:
في `script.js`، ابحث عن `const servicesData` وأضف object جديد:
```js
{
    id: 7,
    title_ar: "اسم الخدمة",
    title_en: "Service Name",
    category: "tech", // أو "marketing"
    desc_ar: "وصف الخدمة بالعربي",
    desc_en: "Service description in English",
    iconChar: "🔧"
}
```

### تغيير رقم WhatsApp:
في `index.html` و `script.js`، ابحث عن `wa.me/201055707007` واستبدل الرقم.

### تغيير بريد Formspree:
في `script.js`، ابحث عن `formspree.io/f/xqewzggo` واستبدل الـ endpoint.

### تغيير الـ Counter أرقام:
في `index.html`، ابحث عن `data-count="..."` وغير الأرقام.

### تغيير الـ Chart data:
في `script.js`، ابحث عن `function initChart` وغير الـ `data` arrays في الـ datasets.

---

## 🔧 تطوير محلي

```bash
# مش محتاج build — افتح مباشرة
open index.html

# أو استخدم Live Server في VS Code
# أو
npx serve .
```

---

## 📋 تحسينات مستقبلية مقترحة

- [ ] **OG Image مخصصة** — صورة 1200×630px بدل اللوجو للشير على السوشيال
- [ ] **تحويل الصفحة لـ Next.js أو Astro** للـ SSG وتحسين LCP تلقائياً
- [ ] **ضغط JS/CSS** عبر Vite أو esbuild (توفير ~30%)
- [ ] **إضافة Service Worker** للـ offline caching
- [ ] **صفحات إضافية** — صفحة Portfolio، صفحة About منفصلة

---

## 📞 تواصل

- **WhatsApp:** [+20 105 570 7007](https://wa.me/201055707007)
- **Email:** [maxora.agency@gmail.com](mailto:maxora.agency@gmail.com)
- **Instagram:** [@maxora_agency](https://www.instagram.com/maxora_agency)
- **LinkedIn:** [maxora-agency](https://www.linkedin.com/company/maxora-agency/)
- **TikTok:** [@maxora_agency](https://www.tiktok.com/@maxora_agency)
- **الموقع:** [maxora-agency.vercel.app](https://maxora-agency.vercel.app)

---

*آخر تحديث: أبريل 2026 — Final Release v1.0*
