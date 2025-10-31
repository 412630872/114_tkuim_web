// example4_script.js
// 顯示錯誤後自動聚焦欄位，並透過 aria-live 提示助讀器

    const form = document.getElementById('access-form');
    const ageInput = document.getElementById('age');

    const fields = [
      { input: document.getElementById('name'), error: document.getElementById('name-error') },
      { input: ageInput, error: document.getElementById('age-error') }
    ];

    function isUnder18(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return false;
      return n < 18;
    }

    function validateField(field) {
      const { input, error } = field;
      let message = '';
      if (input.validity.valueMissing) {
        message = '此欄位為必填。';
      } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
        message = `請輸入 ${input.min} 到 ${input.max} 之間的數字。`;
      }
      if (!message && input.id === 'age') {
        const value = input.value.trim();
        if (value !== '' && isUnder18(value)) {
          message = '年齡需滿 18 歲。';
        }
      }
      input.setCustomValidity(message);
      error.textContent = message;
      return !message;
    }

    fields.forEach((field) => {
      field.input.addEventListener('input', () => {
        if (field.input.validationMessage) {
          validateField(field);
        }
      });
      field.input.addEventListener('blur', () => {
        validateField(field);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let firstInvalid = null;
      fields.forEach((field) => {
        const isValid = validateField(field);
        if (!isValid && !firstInvalid) {
          firstInvalid = field.input;
        }
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const ageVal = ageInput.value.trim();
      if (ageVal !== '' && isUnder18(ageVal)) {
        ageInput.setCustomValidity('年齡需滿 18 歲。');
        document.getElementById('age-error').textContent = '年齡需滿 18 歲。';
        ageInput.focus();
        alert('您未滿 18 歲，無法送出表單。');
        return;
      }

      alert('表單送出成功');
      form.reset();
      fields.forEach(({ error, input }) => {
        error.textContent = '';
        input.setCustomValidity('');
      });
    });
