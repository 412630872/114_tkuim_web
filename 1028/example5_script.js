// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程

    const form = document.getElementById('full-form');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const agree = document.getElementById('agree');

    function validateAllInputs(formElement) {
      let firstInvalid = null;
      const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
      controls.forEach((control) => {
        control.classList.remove('is-invalid');
        if (!control.checkValidity()) {
          control.classList.add('is-invalid');
          if (!firstInvalid) {
            firstInvalid = control;
          }
        }
      });
      return firstInvalid;
    }


    agree.addEventListener('change', (e) => {
      if (agree.checked) {
        const confirmed = confirm('這是隱私權條款\n\n請閱讀後按「確定」以同意。');
        if (!confirmed) {
          agree.checked = false;
          agree.setCustomValidity('須同意條款才能送出。');
          agree.classList.add('is-invalid');
          const feedback = document.getElementById('agree-feedback');
          if (feedback) feedback.textContent = '須同意條款才能送出。';
          agree.focus();
        } else {
          agree.setCustomValidity('');
          agree.classList.remove('is-invalid');
        }
      } else {
        agree.setCustomValidity('');
      }
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = '送出中...';

      const firstInvalid = validateAllInputs(form);
      if (firstInvalid) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送出';
        firstInvalid.focus();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('資料已送出，感謝您的聯絡！');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = '送出';

      Array.from(form.elements).forEach((el) => {
        el.classList.remove('is-invalid');
        if (typeof el.setCustomValidity === 'function') el.setCustomValidity('');
      });
    });

    resetBtn.addEventListener('click', () => {
      form.reset();
      Array.from(form.elements).forEach((element) => {
        element.classList.remove('is-invalid');
        if (typeof element.setCustomValidity === 'function') element.setCustomValidity('');
      });
    });

    form.addEventListener('input', (event) => {
      const target = event.target;
      if (target.classList.contains('is-invalid') && target.checkValidity()) {
        target.classList.remove('is-invalid');
      }
    });
