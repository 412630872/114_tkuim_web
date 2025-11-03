document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const submissionMessage = document.getElementById('submission-message');
    const interestContainer = document.querySelector('.interest-tags-container');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthMeter = document.getElementById('password-strength-meter');
    
    const termsCheckbox = document.getElementById('terms'); 
    

    function setCustomValidity(input, message) {
        input.setCustomValidity(message);

        const errorElement = document.getElementById(`${input.id}-error`);
        
        if (input.validity.valid) {
            if (errorElement) errorElement.textContent = '';
            input.removeAttribute('aria-describedby');
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            if (errorElement) errorElement.textContent = message;
            input.setAttribute('aria-describedby', `${input.id}-error`);
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
    }

    function validateField(input) {
        input.setCustomValidity(''); 

        let errorMessage = '';

        if (input.validity.valueMissing) {
            errorMessage = '此欄位為必填。';
        } else if (input.id === 'email' && input.validity.typeMismatch) {
            errorMessage = '請輸入有效的 Email 格式。';
        } else if (input.id === 'phone' && input.validity.patternMismatch) {
            errorMessage = '手機號碼必須是 10 碼數字。';
        } else if (input.id === 'password' && input.validity.tooShort) {
            errorMessage = `密碼長度至少需要 ${input.minLength} 碼。`;
        } else if (input.id === 'password' && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(input.value)) {
            errorMessage = '密碼必須包含英文字母和數字。';
        } else if (input.id === 'confirmPassword' && input.value !== passwordInput.value) {
            errorMessage = '確認密碼與密碼不一致。';
        } 
        
        else if (input.id === 'terms' && !input.checked) {
             errorMessage = '您必須同意服務條款。';
        }

        setCustomValidity(input, errorMessage);
        
        if (input.id === 'password') {
             validateField(confirmPasswordInput);
        }
        
        saveToLocalStorage(input.id, input.value);
    }
    
    function updatePasswordStrength(password) {
        let strength = 0;
        let labelText = '請輸入密碼';
        let strengthClass = '';
        
        if (password.length >= 8) strength += 1; 
        if (/(?=.*[A-Z])/.test(password)) strength += 1; 
        if (/(?=.*[a-z])/.test(password)) strength += 1; 
        if (/(?=.*\d)/.test(password)) strength += 1; 
        if (/(?=.*[!@#$%^&*])/.test(password)) strength += 1; 

        let width = '0%';
        
        if (password.length === 0) {
            strengthClass = '';
            width = '0%';
        } else if (strength <= 2) {
            labelText = '弱';
            strengthClass = 'weak';
            width = '33%';
        } else if (strength <= 4) {
            labelText = '中';
            strengthClass = 'medium';
            width = '66%';
        } else {
            labelText = '強';
            strengthClass = 'strong';
            width = '100%';
        }

        strengthMeter.className = `strength-meter ${strengthClass}`;
        strengthMeter.querySelector('.bar').style.width = width;
        strengthMeter.querySelector('.label').textContent = labelText;
    }

    function validateInterests() {
        const selectedTags = interestContainer.querySelectorAll('.tag.selected');
        const errorElement = document.getElementById('interest-error');
        const isValid = selectedTags.length >= 1;
        
        if (isValid) {
            errorElement.textContent = '';
            errorElement.parentElement.classList.remove('invalid');
        } else {
            errorElement.textContent = '請至少選擇一個興趣標籤。';
            errorElement.parentElement.classList.add('invalid');
        }
    }

    interestContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('tag')) {
            const isSelected = target.classList.toggle('selected');
            target.setAttribute('aria-checked', isSelected ? 'true' : 'false');
            validateInterests(); 
            
            const selectedTags = Array.from(interestContainer.querySelectorAll('.tag.selected')).map(t => t.dataset.interest);
            saveToLocalStorage('interests', selectedTags.join(','));
        }
    });
    
    function saveToLocalStorage(key, value) {
        try {
            localStorage.setItem(`form_data_${key}`, value);
        } catch (e) {

        }
    }

    function restoreFromLocalStorage() {
        form.querySelectorAll('input:not([type="checkbox"])').forEach(element => {
            const storedValue = localStorage.getItem(`form_data_${element.id}`);
            if (storedValue) {
                element.value = storedValue;
            }
        });
        
        const termsStored = localStorage.getItem(`form_data_terms`);
        if (termsStored) {
            termsCheckbox.checked = termsStored === 'true';
            if (termsCheckbox.checked) setCustomValidity(termsCheckbox, ''); 
        }
        
        const interestsStored = localStorage.getItem('form_data_interests');
        if (interestsStored) {
             const interests = interestsStored.split(',');
             interestContainer.querySelectorAll('.tag').forEach(tag => {
                 const isSelected = interests.includes(tag.dataset.interest);
                 tag.classList.toggle('selected', isSelected);
                 tag.setAttribute('aria-checked', isSelected ? 'true' : 'false');
             });
        }

        updatePasswordStrength(passwordInput.value);
        validateInterests();
    }


    form.querySelectorAll('input:not([type="checkbox"])').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
             setCustomValidity(input, '');
             
             if (input.id === 'password') {
                 updatePasswordStrength(input.value);
                 validateField(confirmPasswordInput);
             }
             
             saveToLocalStorage(input.id, input.value);
        });
    });
    
    termsCheckbox.addEventListener('change', (e) => { 
        const isChecked = e.target.checked;

        if (isChecked) {
            const termsContent = `
                這是服務條款的詳細內容。
                
                點擊「確定」即表示您已閱讀並同意本條款。
            `;

            if (confirm(termsContent)) {
                setCustomValidity(e.target, ''); 
                saveToLocalStorage('terms', true);
            } else {
                e.target.checked = false; 
                setCustomValidity(e.target, '您必須同意服務條款。');
                saveToLocalStorage('terms', false);
            }
        } else {
            setCustomValidity(e.target, '您必須同意服務條款。');
            saveToLocalStorage('terms', false);
        }
    });

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        let isFormValid = true;
        let firstInvalidInput = null;

        form.querySelectorAll('input').forEach(input => {
            validateField(input);
            if (!input.validity.valid && !firstInvalidInput) {
                firstInvalidInput = input;
                isFormValid = false;
            }
        });

        validateInterests();
        const interestErrorEl = document.getElementById('interest-error');
        const isInterestValid = interestErrorEl ? interestErrorEl.textContent.trim() === '' : true;
        if (!isInterestValid && !firstInvalidInput) {
            const firstTag = interestContainer.querySelector('.tag');
            if (firstTag) firstTag.focus();
            firstInvalidInput = firstTag || firstInvalidInput;
            isFormValid = false;
        }

        if (!isFormValid) {
            if (firstInvalidInput) {
                try { firstInvalidInput.focus(); } catch (err) {}
                submissionMessage.style.display = 'block';
                submissionMessage.className = 'submission-message error';
                submissionMessage.textContent = '表單存在錯誤，請修正後重新送出。';
            }
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '送出中... (Loading)';
        submissionMessage.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 1000));

        alert('註冊成功！');

        submissionMessage.style.display = 'block';
        submissionMessage.className = 'submission-message success';
        submissionMessage.textContent = '註冊成功！感謝您的加入。';

        clearLocalStorage();
        form.reset();
        resetFormStyles();

    } catch (error) {
        console.error('submit handler error:', error);
        submissionMessage.style.display = 'block';
        submissionMessage.className = 'submission-message error';
        submissionMessage.textContent = '註冊失敗，請稍後再試。';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '立即註冊';
    }
});

    
    function clearLocalStorage() {
        form.querySelectorAll('input').forEach(input => {
            localStorage.removeItem(`form_data_${input.id}`);
        });
        localStorage.removeItem('form_data_interests');
    }

    function resetFormStyles() {
        form.querySelectorAll('.error-text').forEach(p => p.textContent = '');
        form.querySelectorAll('input, .form-group').forEach(el => {
            el.classList.remove('valid', 'invalid');
            el.removeAttribute('aria-describedby');
        });
        
        interestContainer.querySelectorAll('.tag').forEach(tag => {
            tag.classList.remove('selected');
            tag.setAttribute('aria-checked', 'false');
        });
        
        updatePasswordStrength('');

        submissionMessage.style.display = 'none';
    }

    resetBtn.addEventListener('click', () => {
        form.reset();
        resetFormStyles();
        clearLocalStorage();
    });
    
    restoreFromLocalStorage();
});