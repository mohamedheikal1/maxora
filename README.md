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
├── vercel.json         ← إعدادات النشر والـ Cache
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
| GSAP 3.12 | الـ Animations | `defer` من CDN |
| Lenis | Smooth Scroll | `defer` — ديسكتوب فقط |
| Chart.js | مخطط النمو | **Lazy** (عند الظهور) |
| Google Fonts | Cairo, Bebas Neue, Space Grotesk | Non-blocking preload |
| Vercel Analytics | تتبع الزوار | `defer` |
| Vercel Speed Insights | قياس الأداء | `defer` |

---

## 🌐 الميزات

### ثنائية اللغة (عربي / إنجليزي)
- كل النصوص بتتحكم فيها عبر `data-ar` و `data-en` attributes
- اللغة الافتراضية: **العربية** مع RTL
- التبديل لحظي بدون إعادة تحميل

### الأقسام:
1. **Hero** — العنوان الرئيسي مع Canvas animation (ديسكتوب فقط)
2. **Marquee** — شريط خدمات متحرك
3. **Services** — كروت الخدمات (ديناميكية من JS)
4. **Stats** — أرقام بـ counter animation
5. **Promo** — تبويبات تفاعلية (Web / Mobile / Marketing)
6. **Vision** — رؤية الشركة
7. **Impact** — مخطط النمو (Chart.js)
8. **Booking** — فورم الحجز مع country picker
9. **Footer** — روابط ووسائل التواصل

---

## ⚡ تحسينات الأداء (Performance)

### ما اتعمل لرفع Lighthouse Score:

#### 🔴 إصلاح 1 — اللوجو (التوفير الأكبر)
```
قبل:  MAXORA png white.png  →  826 KB  |  2100×1500 px
بعد:  maxora-logo.webp      →    9 KB  |   200×143 px
التوفير: 99% (817 KB أقل)
```
- استخدام `<picture>` element مع PNG كـ fallback
- إضافة `<link rel="preload">` في الـ head

#### 🔴 إصلاح 2 — الـ Preloader
```
قبل:  ~1.5s على الموبايل
بعد:  ~0.8s على الموبايل
```
- تقليل مدة الـ animation على موبايل
- fallback timeout: من 1500ms → 600ms
- حذف GSAP hero animation على موبايل (CSS بتتولاها)

#### 🟡 إصلاح 3 — Chart.js (Lazy Loading)
```
قبل:  يتحمل مع الصفحة دايماً (~200 KB)
بعد:  يتحمل فقط لما الـ chart تظهر في الشاشة
```
- IntersectionObserver بيراقب الـ canvas
- rootMargin: 200px (يبدأ يحمّل قبل الظهور)

#### 🟡 إصلاح 4 — Cache Headers
```
الصور/WebP:  max-age=31536000 (سنة كاملة) — immutable
JS/CSS:      max-age=86400    (يوم)
HTML:        max-age=3600     (ساعة)
```

#### ✅ إصلاحات موجودة مسبقاً:
- GSAP ScrollTrigger محذوف (توفير ~40 KB)
- Font Awesome محذوف، SVGs مدمجة مباشرة (توفير ~200 KB)
- Canvas animation مخفي على موبايل
- Lenis Smooth Scroll على ديسكتوب فقط
- Fonts: non-blocking preload مع `onload`

---

## 📊 نتائج Lighthouse

| | قبل التحسين | بعد التحسين (متوقع) |
|---|---|---|
| **Mobile Performance** | 69 🟡 | 85–90 🟢 |
| **Desktop Performance** | 91 🟢 | 95+ 🟢 |
| **Accessibility** | 84 🟡 | 84 🟡 |
| **Best Practices** | 100 🟢 | 100 🟢 |
| **SEO** | 100 🟢 | 100 🟢 |

### Core Web Vitals (Mobile) — متوقع بعد التحسين:
| Metric | قبل | بعد |
|---|---|---|
| FCP | 2.7s 🟡 | ~1.2s 🟢 |
| LCP | 6.9s 🔴 | ~2.5s 🟡 |
| TBT | 0ms 🟢 | 0ms 🟢 |
| CLS | 0.016 🟢 | 0.016 🟢 |

---

## 🛠️ تعديل المحتوى

### إضافة خدمة جديدة:
في `script.js`، ابحث عن `const SERVICES` وأضف object جديد:
```js
{
    icon: `<svg>...</svg>`,
    ar: "اسم الخدمة",
    en: "Service Name",
    descAr: "وصف الخدمة بالعربي",
    descEn: "Service description in English"
}
```

### تغيير رقم WhatsApp:
في `index.html`، ابحث عن `wa.me/201055707007` واستبدل الرقم.

### تغيير بريد Formspree:
في `script.js`، ابحث عن `formspree.io` واستبدل الـ endpoint.

### تغيير الـ Counter أرقام:
في `index.html`، ابحث عن `data-count="..."` وغير الأرقام.

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

## 📋 باقي التحسينات المقترحة

اللي لسه ممكن تعمله مستقبلاً:

- [ ] **تحويل الصفحة لـ Next.js أو Astro** للـ SSG وتحسين LCP تلقائياً
- [ ] **ضغط JS/CSS** عبر Vite أو esbuild (توفير ~30%)
- [ ] **إضافة Service Worker** للـ offline caching
- [ ] **تحسين Accessibility** — رفع score من 84 لـ 95+
- [ ] **إضافة OG Tags** للمشاركة على السوشيال ميديا
- [ ] **Sitemap.xml** لتحسين الـ SEO الفني

---

## 📞 تواصل

- **WhatsApp:** [+20 105 570 7007](https://wa.me/201055707007)
- **Instagram:** [@maxora_agency](https://www.instagram.com/maxora_agency)
- **الموقع:** [maxora-agency.vercel.app](https://maxora-agency.vercel.app)

---

*آخر تحديث: أبريل 2026 — تحسينات الأداء*
