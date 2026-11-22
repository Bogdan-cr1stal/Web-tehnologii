document.addEventListener("DOMContentLoaded", function () {
    const EYE_OPEN_SVG =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"></path>' +
        '<circle cx="12" cy="12" r="3"></circle>' +
        "</svg>";

    const EYE_CLOSED_SVG =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a18.2 18.2 0 0 1-3.2 4.3"></path>' +
        '<path d="M6.6 6.6A18.5 18.5 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"></path>' +
        '<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path>' +
        '<line x1="2" y1="2" x2="22" y2="22"></line>' +
        "</svg>";

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("formMessage");

    function renderEyeButtonState(btn, isShown) {
        const iconSlot = btn.querySelector(".login-eye-icon");
        if (iconSlot) {
            iconSlot.innerHTML = isShown ? EYE_CLOSED_SVG : EYE_OPEN_SVG;
        }
        btn.classList.toggle("is-shown", isShown);
        btn.setAttribute("aria-pressed", String(isShown));
        btn.setAttribute("aria-label", isShown ? "Приховати пароль" : "Показати пароль");
    }

    document.querySelectorAll(".login-eye-btn").forEach(function (btn) {
        const inputId = btn.getAttribute("data-target");
        const input = inputId ? document.getElementById(inputId) : null;
        if (!input) {
            return;
        }

        renderEyeButtonState(btn, input.type === "text");

        btn.addEventListener("click", function () {
            const nextShown = input.type === "password";
            input.type = nextShown ? "text" : "password";
            renderEyeButtonState(btn, nextShown);
        });
    });

    function setMessage(text, isSuccess) {
        if (!message) {
            return;
        }
        message.textContent = text;
        message.classList.toggle("success", Boolean(isSuccess));
    }

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        setMessage("", false);

        if (!email || !password) {
            setMessage("Заповніть усі поля.", false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage("Введіть правильну електронну пошту.", false);
            return;
        }

        if (password.length < 6) {
            setMessage("Пароль повинен містити щонайменше 6 символів.", false);
            return;
        }

        setMessage("Перевірку пройдено! Авторизація поки не підключена.", true);
    });
});