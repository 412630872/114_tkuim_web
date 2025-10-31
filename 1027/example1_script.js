// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    return;
  }
  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `
    ${value}
    <div class="btn-group">
      <button class="btn btn-sm btn-outline-success" data-action="done">完成</button>
      <button class="btn btn-sm btn-outline-danger" data-action="remove">刪除</button>
    </div>
  `;
  list.appendChild(item);
  input.value = '';
  input.focus();
});

input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    form.dispatchEvent(new Event('submit'));
  }
});

list.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (!action) return;

  const item = event.target.closest('li');
  if (!item) return;

  if (action === 'remove') {
    item.remove();
  } else if (action === 'done') {
    item.classList.toggle('list-group-item-success');
  }
});