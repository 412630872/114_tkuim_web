const API_URL = 'http://localhost:3001';

const state = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const views = {
    auth: document.getElementById('auth-view'),
    dashboard: document.getElementById('dashboard-view'),
};

const forms = {
    auth: document.getElementById('auth-form'),
    add: document.getElementById('add-form'),
};

const inputs = {
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    roleGroup: document.getElementById('role-group'),
    // Add form inputs
    title: document.getElementById('note-title'),
    content: document.getElementById('note-content'),
    category: document.getElementById('note-category'),
    tags: document.getElementById('note-tags'),
    pinned: document.getElementById('note-pinned'),
    image: document.getElementById('note-image'),
    // Search inputs
    search: document.getElementById('search-input'),
    filterTag: document.getElementById('filter-tag'),
};

const buttons = {
    logout: document.getElementById('logout-btn'),
    authSubmit: document.getElementById('auth-submit-btn'),
    search: document.getElementById('search-btn'),
    themeToggle: document.getElementById('theme-toggle'),
};

const elements = {
    authTitle: document.getElementById('auth-title'),
    authSwitchText: document.getElementById('auth-switch-text'),
    authSwitchLink: document.getElementById('auth-switch-link'),
    authError: document.getElementById('auth-error'),
    dashboardError: document.getElementById('dashboard-error'),
    userInfo: document.getElementById('user-info'),
    dataList: document.getElementById('data-list'),
    pagination: document.getElementById('pagination'),
};

let isLoginMode = true;

function init() {
    initTheme();
    loadDraft();
    render();
    setupEventListeners();
    if (state.token) {
        fetchData();
    }
}

function setupEventListeners() {
    elements.authSwitchLink.addEventListener('click', toggleAuthMode);

    forms.auth.addEventListener('submit', handleAuthSubmit);
    forms.add.addEventListener('submit', handleAddSubmit);
    buttons.logout.addEventListener('click', logout);

    // New Listeners
    buttons.search.addEventListener('click', () => fetchData(1));
    buttons.themeToggle.addEventListener('click', toggleTheme);

    // Auto-save listeners
    inputs.title.addEventListener('input', saveDraft);
    inputs.content.addEventListener('input', saveDraft);
}

function setLoading(btn, isLoading, text = 'Loading...') {
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = text;
        btn.disabled = true;
    } else {
        btn.textContent = btn.dataset.originalText || btn.textContent;
        btn.disabled = false;
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    renderAuthView();
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    elements.authError.textContent = '';

    const email = inputs.email.value;
    const password = inputs.password.value;
    const role = document.querySelector('input[name="role"]:checked').value;

    const endpoint = isLoginMode ? '/auth/login' : '/auth/signup';
    const body = { email, password };
    if (!isLoginMode) body.role = role;

    setLoading(buttons.authSubmit, true);

    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Authentication failed');

        if (isLoginMode) {
            login(data);
        } else {
            alert('註冊成功，請登入');
            toggleAuthMode();
            inputs.email.value = email;
        }
    } catch (err) {
        elements.authError.textContent = err.message;
    } finally {
        setLoading(buttons.authSubmit, false);
    }
}

function login(data) {
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', state.token);
    localStorage.setItem('user', JSON.stringify(state.user));
    render();
    fetchData();
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    render();
}

async function handleAddSubmit(e) {
    e.preventDefault();

    const title = inputs.title.value;
    const content = inputs.content.value;
    const category = inputs.category.value;
    const tags = inputs.tags.value.split(',').map(t => t.trim()).filter(t => t);
    const isPinned = inputs.pinned.checked;
    const imageFile = inputs.image.files[0];

    const btn = forms.add.querySelector('button[type="submit"]');
    setLoading(btn, true, '新增中...');

    try {
        let imageUrl = null;
        if (imageFile) {
            imageUrl = await toBase64(imageFile);
        }

        const res = await fetch(`${API_URL}/api/memos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({
                title, content, category,
                tags, isPinned, imageUrl
            })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to add');

        forms.add.reset();
        clearDraft(); // Clear auto-save
        fetchData();
    } catch (err) {
        alert(err.message);
    } finally {
        setLoading(btn, false);
    }
}

async function deleteItem(id) {
    if (!confirm('確定要刪除嗎？')) return;

    try {
        const res = await fetch(`${API_URL}/api/memos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || '刪除失敗');
        }

        fetchData();
    } catch (err) {
        alert(err.message);
    }
}

async function fetchData(page = 1) {
    try {
        const search = inputs.search.value;
        const tag = inputs.filterTag.value;

        let url = `${API_URL}/api/memos?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (tag) url += `&tag=${encodeURIComponent(tag)}`;

        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
            logout();
            return;
        }

        renderList(data);
    } catch (err) {
        elements.dashboardError.textContent = '無法取得資料';
    }
}

function render() {
    if (state.token) {
        views.auth.classList.remove('active');
        views.dashboard.classList.add('active');
        elements.userInfo.textContent = `Hi, ${state.user.role === 'admin' ? '管理員' : '使用者'} (${state.user.email})`;
    } else {
        views.dashboard.classList.remove('active');
        views.auth.classList.add('active');
        renderAuthView();
    }
}

function renderAuthView() {
    if (isLoginMode) {
        elements.authTitle.textContent = '登入';
        buttons.authSubmit.textContent = '登入';
        elements.authSwitchText.textContent = '還沒有帳號？';
        elements.authSwitchLink.textContent = '註冊';
        inputs.roleGroup.style.display = 'none';
        forms.auth.reset();
    } else {
        elements.authTitle.textContent = '註冊';
        buttons.authSubmit.textContent = '註冊';
        elements.authSwitchText.textContent = '已有帳號？';
        elements.authSwitchLink.textContent = '登入';
        inputs.roleGroup.style.display = 'block';
    }
}

function renderList(data) {
    const tbody = elements.dataList;
    tbody.innerHTML = '';

    if (!data.list || data.list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">目前沒有資料</td></tr>';
        return;
    }

    data.list.forEach(item => {
        const tr = document.createElement('tr');
        if (item.isCompleted) tr.classList.add('completed-row');
        if (item.isPinned) tr.classList.add('pinned-row');

        const canDelete = state.user.role === 'admin' || item.ownerId === state.user.id;

        // Tags display
        const tagsHtml = item.tags && item.tags.length > 0
            ? item.tags.map(t => `<span class="tag">${t}</span>`).join(' ')
            : '';

        // Image display
        const imageHtml = item.imageUrl
            ? `<img src="${item.imageUrl}" alt="img" class="thumb" onclick="showImage('${item.imageUrl}')">`
            : '';

        tr.innerHTML = `
            <td style="text-align: center;">
                <span style="cursor: pointer; ${item.isPinned ? 'color: #e74c3c;' : 'color: #ccc;'}" 
                      onclick="togglePin('${item._id}', ${!item.isPinned})">📌</span>
                <input type="checkbox" ${item.isCompleted ? 'checked' : ''} 
                       onchange="toggleComplete('${item._id}', this.checked)"
                       style="margin-left: 5px;">
            </td>
            <td class="${item.isCompleted ? 'completed-text' : ''}">${item.title}</td>
            <td style="white-space: pre-wrap;" class="${item.isCompleted ? 'completed-text' : ''}">${item.content}</td>
            <td>${imageHtml}</td>
            <td>
                <div>${item.category || '-'}</div>
                <div style="margin-top:2px;">${tagsHtml}</div>
            </td>
            <td>
                ${canDelete ? `<button class="danger btn-sm" onclick="deleteItem('${item._id}')">刪除</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    elements.pagination.innerHTML = '';
    for (let i = 1; i <= data.totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === data.page) btn.classList.add('secondary');
        btn.onclick = () => fetchData(i);
        elements.pagination.appendChild(btn);
    }
}

window.deleteItem = deleteItem;

init();

// Helper Functions

async function updateMemoStatus(id, patch) {
    try {
        const res = await fetch(`${API_URL}/api/memos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(patch)
        });
        if (!res.ok) throw new Error('Update failed');
        fetchData(); // Refresh list to revert UI if failed or update sort
    } catch (err) {
        alert(err.message);
    }
}

function togglePin(id, isPinned) {
    updateMemoStatus(id, { isPinned });
}

function toggleComplete(id, isCompleted) {
    updateMemoStatus(id, { isCompleted });
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showImage(url) {
    const w = window.open("");
    w.document.write(`<img src="${url}" style="max-width:100%">`);
}

// Dark Mode
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.dataset.theme = 'dark';
    }
}

function toggleTheme() {
    const isDark = document.body.dataset.theme === 'dark';
    if (isDark) {
        delete document.body.dataset.theme;
        localStorage.setItem('theme', 'light');
    } else {
        document.body.dataset.theme = 'dark';
        localStorage.setItem('theme', 'dark');
    }
}

// Auto Save (Draft)
function saveDraft() {
    localStorage.setItem('draft_title', inputs.title.value);
    localStorage.setItem('draft_content', inputs.content.value);
}

function loadDraft() {
    const t = localStorage.getItem('draft_title');
    const c = localStorage.getItem('draft_content');
    if (t) inputs.title.value = t;
    if (c) inputs.content.value = c;
}

function clearDraft() {
    localStorage.removeItem('draft_title');
    localStorage.removeItem('draft_content');
}

// Expose to window for onclick handlers
window.togglePin = togglePin;
window.toggleComplete = toggleComplete;
window.showImage = showImage;
