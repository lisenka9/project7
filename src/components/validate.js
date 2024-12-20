// Отображения ошибок
export function showError(inputElement, errorElement, settings) {
    if (!inputElement.validity.valid || inputElement.value.trim() === '') {
        errorElement.textContent = inputElement.validationMessage || 'Поле не может быть пустым';
        inputElement.classList.add(settings.inputErrorClass);
    } else {
        errorElement.textContent = '';
        inputElement.classList.remove(settings.inputErrorClass);
    }
}

// Управление кнопкой
export function toggleButtonState(form, button, settings) {
    button.disabled = !form.checkValidity();
    if (form.checkValidity()) {
        button.classList.remove(settings.inactiveButtonClass);
    } else {
        button.classList.add(settings.inactiveButtonClass);
    }
}

// Добавление обработчиков событий
export function setEventListeners(formElement, settings) {
    const inputs = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const submitButton = formElement.querySelector(settings.submitButtonSelector);
    inputs.forEach(input => {
        const errorElement = formElement.querySelector(`.${input.id}-error`);
        if (!input.validity.valid) {
            showError(input, errorElement, settings);
        }
        input.addEventListener('input', () => {
            showError(input, errorElement, settings);
            toggleButtonState(formElement, submitButton, settings);
        });
    });
    toggleButtonState(formElement, submitButton, settings);
}

// Включение валидации
export function Validation(settings) {
    const forms = Array.from(document.querySelectorAll(settings.formSelector));

    forms.forEach(form => {
        setEventListeners(form, settings);
    });
}