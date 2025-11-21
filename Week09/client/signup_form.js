const form = document.querySelector('#signup-form');
const resultEl = document.querySelector('#result');

const SIGNUP_URL =
  (form && form.dataset && form.dataset.api) ||
  window.SIGNUP_API_URL ||
  'http://localhost:3001/api/signup';

function ensureListUI() {
  let listBtn = document.querySelector('#view-signups-btn');
  if (!listBtn) {
    listBtn = document.createElement('button');
    listBtn.type = 'button';
    listBtn.id = 'view-signups-btn';
    listBtn.textContent = '查看報名清單';
    if (form && form.parentNode) {
      form.parentNode.insertBefore(listBtn, form.nextSibling);
    } else {
      document.body.appendChild(listBtn);
    }
    listBtn.style.margin = '8px 0';
    listBtn.style.padding = '6px 10px';
  }

  let listPre = document.querySelector('#signup-list-pre');
  if (!listPre) {
    listPre = document.createElement('pre');
    listPre.id = 'signup-list-pre';
    if (resultEl && resultEl.parentNode) {
      resultEl.parentNode.insertBefore(listPre, resultEl.nextSibling);
    } else {
      document.body.appendChild(listPre);
    }
    listPre.style.whiteSpace = 'pre-wrap';
    listPre.style.background = '#f7f7f7';
    listPre.style.padding = '8px';
    listPre.style.border = '1px solid #ddd';
    listPre.style.maxHeight = '300px';
    listPre.style.overflow = 'auto';
  }

  return { listBtn, listPre };
}

const { listBtn, listPre } = ensureListUI();

listBtn.addEventListener('click', async () => {
  try {
    listBtn.disabled = true;
    const prevText = listBtn.textContent;
    listBtn.textContent = '讀取中...';

    const res = await fetch(SIGNUP_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.error || data.message || `HTTP ${res.status}`;
      throw new Error(errMsg);
    }

    listPre.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    listPre.textContent = `錯誤：${err.message}`;
  } finally {
    listBtn.disabled = false;
    listBtn.textContent = '查看報名清單';
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (form.dataset.loading === 'true') return;

  try {
    form.dataset.loading = 'true';
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '送出中...';
    submitBtn.disabled = true;
    form.classList.add('loading');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const interestsAll = formData.getAll('interests');
    payload.interests = interestsAll && interestsAll.length ? interestsAll : ['後端入門'];

    const termsRaw = formData.get('terms');
    payload.terms = termsRaw === 'on' || termsRaw === 'true' || termsRaw === '1' || payload.terms === true;

    payload.password = payload.confirmPassword = 'demoPass88';

    resultEl.textContent = '送出中...';

    const res = await fetch(SIGNUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errMsg = data.error || data.message || `HTTP ${res.status}`;
      throw new Error(errMsg);
    }

    resultEl.textContent = JSON.stringify(data, null, 2);
    form.reset();
  } catch (error) {
    resultEl.textContent = `錯誤：${error.message}`;
  } finally {
    form.dataset.loading = 'false';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = '送出';
    submitBtn.disabled = false;
    form.classList.remove('loading');
  }
});
