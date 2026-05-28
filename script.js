// ===== LANGUAGE SYSTEM =====
let currentLang = 'ru';

function setLang(lang) {
  currentLang = lang;

  // Обновляем текстовые элементы
  document.querySelectorAll('[data-' + lang + ']').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.innerHTML = val;
    }
  });

  // Обновляем placeholder отдельно
  document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  // Активная кнопка языка
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

// ===== PHONE INPUT =====
function initPhoneInput() {
  const phoneInput = document.getElementById('formPhone');
  if (!phoneInput) return;

  const PREFIX = '+998';

  if (!phoneInput.value.startsWith(PREFIX)) {
    phoneInput.value = PREFIX;
  }

  phoneInput.addEventListener('input', function () {
    let val = this.value;
    let digits = val.replace(/\D/g, '');

    if (digits.startsWith('998')) {
      digits = digits.slice(3);
    }

    digits = digits.substring(0, 9);
    this.value = PREFIX + digits;
  });

  phoneInput.addEventListener('keydown', function (e) {
    const PREFIX_LEN = PREFIX.length;
    if (
      (e.key === 'Backspace' || e.key === 'Delete') &&
      this.selectionStart <= PREFIX_LEN &&
      this.selectionEnd <= PREFIX_LEN
    ) {
      e.preventDefault();
    }
  });

  phoneInput.addEventListener('click', function () {
    if (this.selectionStart < PREFIX.length) {
      this.setSelectionRange(this.value.length, this.value.length);
    }
  });

  phoneInput.addEventListener('focus', function () {
    if (!this.value.startsWith(PREFIX)) {
      this.value = PREFIX;
    }
    setTimeout(() => {
      this.setSelectionRange(this.value.length, this.value.length);
    }, 0);
  });
}

// ===== FAQ =====
function toggleFaq(el) {
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));

  if (!isOpen) {
    item.classList.add('open');
  }
}

// ===== FORM SUBMISSION via Telegram Bot =====
async function submitForm() {
  const nameEl    = document.getElementById('formName');
  const phoneEl   = document.getElementById('formPhone');
  const msgEl     = document.getElementById('formMsg');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  const name    = nameEl.value.trim();
  const phone   = phoneEl.value.trim();
  const message = msgEl.value.trim();

  if (!name) {
    alert(currentLang === 'uz' ? 'Исмингизни киритинг' : 'Введите ваше имя');
    return;
  }

  const PREFIX = '+998';
  if (!phone || phone === PREFIX || phone.length < PREFIX.length + 9) {
    alert(currentLang === 'uz' ? 'Телефон рақамини тўлиқ киритинг' : 'Введите полный номер телефона');
    return;
  }

  const text = `🔔 Новая заявка с сайта Business Law Consulting\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n💬 Сообщение: ${message || '—'}`;

  const TOKEN   = '8830532011:AAGJ6A7LZmmWT1c2Qi2YxZRJHpOd62FNN1w';
  const CHAT_ID = '-5102240344';

  submitBtn.disabled = true;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();

    if (data.ok) {
      nameEl.value  = '';
      phoneEl.value = PREFIX;
      msgEl.value   = '';

      // Показываем сообщение об успехе (уже есть в HTML)
      if (successEl) {
        successEl.style.display = 'flex';
        setTimeout(() => {
          successEl.style.display = 'none';
        }, 5000);
      }
    } else {
      alert('Ошибка отправки. Позвоните нам: +998 90 888-44-66');
    }
  } catch (e) {
    alert('Ошибка соединения. Позвоните нам: +998 90 888-44-66');
  } finally {
    submitBtn.disabled = false;
  }
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== GOOGLE TRANSLATE =====
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'ru',
    includedLanguages: 'en,uz,tr,ar,zh-CN,de,fr,ko,ja',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {
  initPhoneInput();
});