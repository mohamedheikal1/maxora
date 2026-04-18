# 🚀 Maxora — Setup Guide

## الخطوة 1: إنشاء Supabase Project

1. روح https://supabase.com واعمل account مجاني
2. اضغط **New Project**
3. اسم المشروع: `maxora`
4. اختار region: **West EU** (أقرب لمصر)
5. استنى دقيقتين لحد ما المشروع يتعمل

---

## الخطوة 2: إنشاء الـ Database Table

1. في Supabase Dashboard → اضغط **SQL Editor**
2. انسخ الكود ده والصقه واضغط **Run**:

```sql
-- إنشاء جدول الحجوزات
create table bookings (
  id           uuid default gen_random_uuid() primary key,
  full_name    text not null,
  email        text not null,
  phone        text not null,
  company      text not null,
  service      text not null,
  meeting_date date not null,
  description  text,
  status       text default 'pending',
  booking_id   text unique,
  created_at   timestamptz default now()
);

-- تفعيل الأمان
alter table bookings enable row level security;

-- بس الـ API Key يقدر يكتب (مش يقرأ من الـ frontend)
create policy "insert only"
on bookings for insert
with check (true);
```

---

## الخطوة 3: جيب الـ API Keys

1. في Supabase → اضغط **Project Settings** (أيقونة الترس)
2. اضغط **API**
3. انسخ:
   - **Project URL** (شكله: `https://xxxx.supabase.co`)
   - **anon public** key (السطر الطويل)

---

## الخطوة 4: حط الـ Keys في الكود

افتح ملف `script.js` — في الأول هتلاقي:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';
```

استبدلهم بقيمك الحقيقية:

```javascript
const SUPABASE_URL = 'https://abcdefgh.supabase.co';   // Project URL بتاعك
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5c...';  // anon key بتاعك
```

---

## الخطوة 5: ارفع الموقع على Vercel

1. ارفع الملفات على GitHub
2. روح vercel.com → Import Project من GitHub
3. اضغط Deploy

---

## الخطوة 6: ربط الدومين (اختياري)

1. Vercel Dashboard → Settings → Domains
2. أضف الدومين بتاعك
3. غير DNS Records عند مزود الدومين:
   ```
   A Record    →  76.76.21.21
   CNAME www   →  cname.vercel-dns.com
   ```

---

## الخطوة 7: Cloudflare Turnstile (CAPTCHA)

1. روح https://dash.cloudflare.com
2. Turnstile → Add Site
3. حط الدومين بتاعك
4. هياخد منك Site Key
5. في `index.html` غير:
   ```
   data-sitekey="0x4AAAAAAA_REPLACE_WITH_YOUR_SITEKEY"
   ```
   لـ Site Key بتاعك الحقيقي

---

## ✅ بعد كل ده — إزاي تشوف الـ Bookings؟

1. روح **Supabase → Table Editor → bookings**
2. هتلاقي كل الطلبات جدول كامل
3. تقدر تغير الـ status من `pending` → `confirmed` → `done`

---

## 📊 ملخص الـ Stack

| الخدمة | الاستخدام | التكلفة |
|---|---|---|
| Vercel | Hosting | مجاني |
| Supabase | Database + API | مجاني (500MB) |
| Formspree | Email notifications | مجاني (50/month) |
| Cloudflare Turnstile | CAPTCHA | مجاني |

**التكلفة الإجمالية = 0 جنيه! 🎉**
