// ===== MAXORA - COUNTRY CODE PHONE PICKER =====

const COUNTRIES = [
    { name: "مصر", nameEn: "Egypt", flag: "🇪🇬", dial: "+20", code: "EG" },
    { name: "السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦", dial: "+966", code: "SA" },
    { name: "الإمارات", nameEn: "UAE", flag: "🇦🇪", dial: "+971", code: "AE" },
    { name: "الكويت", nameEn: "Kuwait", flag: "🇰🇼", dial: "+965", code: "KW" },
    { name: "قطر", nameEn: "Qatar", flag: "🇶🇦", dial: "+974", code: "QA" },
    { name: "البحرين", nameEn: "Bahrain", flag: "🇧🇭", dial: "+973", code: "BH" },
    { name: "عُمان", nameEn: "Oman", flag: "🇴🇲", dial: "+968", code: "OM" },
    { name: "الأردن", nameEn: "Jordan", flag: "🇯🇴", dial: "+962", code: "JO" },
    { name: "لبنان", nameEn: "Lebanon", flag: "🇱🇧", dial: "+961", code: "LB" },
    { name: "العراق", nameEn: "Iraq", flag: "🇮🇶", dial: "+964", code: "IQ" },
    { name: "سوريا", nameEn: "Syria", flag: "🇸🇾", dial: "+963", code: "SY" },
    { name: "تونس", nameEn: "Tunisia", flag: "🇹🇳", dial: "+216", code: "TN" },
    { name: "المغرب", nameEn: "Morocco", flag: "🇲🇦", dial: "+212", code: "MA" },
    { name: "الجزائر", nameEn: "Algeria", flag: "🇩🇿", dial: "+213", code: "DZ" },
    { name: "ليبيا", nameEn: "Libya", flag: "🇱🇾", dial: "+218", code: "LY" },
    { name: "السودان", nameEn: "Sudan", flag: "🇸🇩", dial: "+249", code: "SD" },
    { name: "اليمن", nameEn: "Yemen", flag: "🇾🇪", dial: "+967", code: "YE" },
    { name: "فلسطين", nameEn: "Palestine", flag: "🇵🇸", dial: "+970", code: "PS" },
    { name: "المملكة المتحدة", nameEn: "United Kingdom", flag: "🇬🇧", dial: "+44", code: "GB" },
    { name: "الولايات المتحدة", nameEn: "United States", flag: "🇺🇸", dial: "+1", code: "US" },
    { name: "ألمانيا", nameEn: "Germany", flag: "🇩🇪", dial: "+49", code: "DE" },
    { name: "فرنسا", nameEn: "France", flag: "🇫🇷", dial: "+33", code: "FR" },
    { name: "تركيا", nameEn: "Turkey", flag: "🇹🇷", dial: "+90", code: "TR" },
    { name: "باكستان", nameEn: "Pakistan", flag: "🇵🇰", dial: "+92", code: "PK" },
    { name: "الهند", nameEn: "India", flag: "🇮🇳", dial: "+91", code: "IN" },
    { name: "كندا", nameEn: "Canada", flag: "🇨🇦", dial: "+1", code: "CA" },
    { name: "أستراليا", nameEn: "Australia", flag: "🇦🇺", dial: "+61", code: "AU" },
    { name: "هولندا", nameEn: "Netherlands", flag: "🇳🇱", dial: "+31", code: "NL" },
    { name: "إيطاليا", nameEn: "Italy", flag: "🇮🇹", dial: "+39", code: "IT" },
    { name: "إسبانيا", nameEn: "Spain", flag: "🇪🇸", dial: "+34", code: "ES" },
];

let selectedCountry = COUNTRIES[0]; // Egypt default
let filteredCountries = [...COUNTRIES];

function renderCountryList(list) {
    const container = document.getElementById('countryList');
    if (!container) return;
    container.innerHTML = '';
    
    list.forEach(country => {
        const option = document.createElement('div');
        option.className = 'country-option' + (country.code === selectedCountry.code ? ' active' : '');
        option.innerHTML = `
            <span class="country-option-flag">${country.flag}</span>
            <span class="country-option-name" id="country-name-${country.code}">${country.name}</span>
            <span class="country-option-dial">${country.dial}</span>
        `;
        option.addEventListener('click', () => selectCountry(country));
        container.appendChild(option);
    });
    
    if (list.length === 0) {
        container.innerHTML = '<div style="padding:20px;text-align:center;color:#64748b;font-size:0.85rem;">لا توجد نتائج</div>';
    }
}

function selectCountry(country) {
    selectedCountry = country;
    
    const flagEl = document.getElementById('selectedFlag');
    const codeEl = document.getElementById('selectedCode');
    
    if (flagEl) flagEl.textContent = country.flag;
    if (codeEl) codeEl.textContent = country.dial;
    
    closeCountryDropdown();
    
    // Focus phone input after selection
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) phoneInput.focus();
}

function toggleCountryDropdown() {
    const dropdown = document.getElementById('countryDropdown');
    const chevron = document.getElementById('countryChevron');
    const searchInput = document.getElementById('countrySearch');
    
    if (!dropdown) return;
    
    const isOpen = dropdown.classList.contains('open');
    
    if (isOpen) {
        closeCountryDropdown();
    } else {
        dropdown.classList.add('open');
        if (chevron) chevron.classList.add('open');
        if (searchInput) {
            searchInput.value = '';
            filterCountries('');
            setTimeout(() => searchInput.focus(), 100);
        }
        renderCountryList(COUNTRIES);
    }
}

function closeCountryDropdown() {
    const dropdown = document.getElementById('countryDropdown');
    const chevron = document.getElementById('countryChevron');
    if (dropdown) dropdown.classList.remove('open');
    if (chevron) chevron.classList.remove('open');
}

function filterCountries(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
        renderCountryList(COUNTRIES);
        return;
    }
    
    const filtered = COUNTRIES.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
    
    renderCountryList(filtered);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const wrapper = document.querySelector('.phone-input-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        closeCountryDropdown();
    }
});

// Override phone data in booking form to include country code
document.addEventListener('DOMContentLoaded', () => {
    renderCountryList(COUNTRIES);
    
    // Update phone search placeholder based on language
    const updateSearchPlaceholder = () => {
        const lang = localStorage.getItem('language') || 'ar';
        const searchInput = document.getElementById('countrySearch');
        if (searchInput) {
            searchInput.placeholder = lang === 'ar' ? 'ابحث عن دولة...' : 'Search country...';
        }
    };
    
    updateSearchPlaceholder();
    
    // Patch getPhone to include country code in form submission
    const originalHandleBookingSubmit = window.handleBookingSubmitOriginal;
});

// Expose function for script.js to get full phone with country code
window.getFullPhone = function() {
    const phoneInput = document.getElementById('phoneInput');
    const number = phoneInput ? phoneInput.value.trim() : '';
    return selectedCountry.dial + number;
};
