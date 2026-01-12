document.addEventListener('DOMContentLoaded', () => {
    const memoGrid = document.getElementById('memo-grid');
    const addBtn = document.getElementById('add-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const memoForm = document.getElementById('memo-form');
    const modalTitle = document.getElementById('modal-title');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    let memos = JSON.parse(localStorage.getItem('memos')) || [];
    let currentEditId = null;

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    renderMemos();


    addBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    memoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('memo-title').value.trim();
        const content = document.getElementById('memo-content').value.trim();
        const isPinned = document.getElementById('memo-pinned').checked;
        const timestamp = new Date().toISOString();

        if (currentEditId) {
            memos = memos.map(memo =>
                memo.id === currentEditId
                    ? { ...memo, title, content, isPinned, updatedAt: timestamp }
                    : memo
            );
        } else {
            const newMemo = {
                id: Date.now().toString(),
                title,
                content,
                isPinned,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            memos.push(newMemo);
        }

        saveMemos();
        renderMemos();
        closeModal();
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderMemos(query);
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });


    function saveMemos() {
        localStorage.setItem('memos', JSON.stringify(memos));
    }

    function renderMemos(filterText = '') {
        memoGrid.innerHTML = '';

        let filteredMemos = memos;
        if (filterText) {
            filteredMemos = memos.filter(m =>
                m.title.toLowerCase().includes(filterText) ||
                m.content.toLowerCase().includes(filterText)
            );
        }

        filteredMemos.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
            return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        });

        if (filteredMemos.length === 0) {
            memoGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-color); opacity: 0.6; margin-top: 40px;">找不到備忘錄，新增一個吧！</div>';
            return;
        }

        filteredMemos.forEach(memo => {
            const card = document.createElement('article');
            card.className = `memo-card ${memo.isPinned ? 'pinned' : ''}`;
            card.setAttribute('data-id', memo.id);
            card.addEventListener('click', (e) => {
                if (e.target.closest('.action-btn')) return;
                openModal(memo.id);
            });

            const dateStr = new Date(memo.updatedAt || memo.createdAt).toLocaleDateString();

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${escapeHtml(memo.title)}</h3>
                    ${memo.isPinned ? `
                        <svg class="pin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
                        </svg>` : ''
                }
                </div>
                <div class="card-content">
                    ${escapeHtml(memo.content)}
                </div>
                <div class="card-footer">
                    <span class="date">${dateStr}</span>
                    <div class="card-actions">
                        <button class="action-btn delete" onclick="deleteMemo('${memo.id}', event)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>
            `;
            memoGrid.appendChild(card);
        });
    }

    function openModal(id = null) {
        modalOverlay.classList.add('open');
        if (id) {
            const memo = memos.find(m => m.id === id);
            if (!memo) return;
            currentEditId = id;
            modalTitle.innerText = '編輯備忘錄';
            document.getElementById('memo-title').value = memo.title;
            document.getElementById('memo-content').value = memo.content;
            document.getElementById('memo-pinned').checked = memo.isPinned;
        } else {
            currentEditId = null;
            modalTitle.innerText = '新增備忘錄';
            memoForm.reset();
        }
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
    }

    function removeMemo(id) {
        if (confirm('確定要刪除這則備忘錄嗎？')) {
            memos = memos.filter(m => m.id !== id);
            saveMemos();
            renderMemos();
        }
    }

    window.deleteMemo = (id, event) => {
        event.stopPropagation();
        removeMemo(id);
    };

    function updateThemeIcon(theme) {
        const sun = document.querySelector('.sun-icon');
        const moon = document.querySelector('.moon-icon');
        if (theme === 'dark') {
            sun.style.display = 'none';
            moon.style.display = 'block';
        } else {
            sun.style.display = 'block';
            moon.style.display = 'none';
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
