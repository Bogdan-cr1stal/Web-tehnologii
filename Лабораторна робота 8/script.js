
function showTab(index) {

    const tabs = document.querySelectorAll("td");

    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    panels.forEach(panel => {
        panel.classList.remove("active");
    });

    tabs[index].classList.add("active");
    panels[index].classList.add("active");
}
var slideIndex = 1;

showSlides(slideIndex);

function plusSlide() {
    showSlides(slideIndex += 1);
}

function minusSlide() {
    showSlides(slideIndex -= 1);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {

    let i;

    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("slider-dots_item");

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].style.display = "block";

    dots[slideIndex - 1].classList.add("active");
}

// Завдання 3. Слайдер за варіантом

var variantIndex = 1;

function variantPlus() {
    variantShow(variantIndex += 1);
}

function variantMinus() {
    variantShow(variantIndex -= 1);
}

function variantCurrent(n) {
    variantShow(variantIndex = n);
}

function variantShow(n) {

    let slides = document.querySelectorAll(".variant-slide");
    let dots = document.querySelectorAll(".variant-dots span");

    if (n > slides.length) {
        variantIndex = 1;
    }

    if (n < 1) {
        variantIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[variantIndex - 1].style.display = "block";
    dots[variantIndex - 1].classList.add("active");
}

variantShow(variantIndex);


// Завдання 4. Валідація форми

function validateField(field) {

    let value = document.getElementById(field).value.trim();
    let error = document.getElementById(field + "Error");

    error.innerHTML = "";

    if (field === "surname" || field === "firstname") {

        if (value.length === 0) {
            error.innerHTML = "* Поле обов'язкове для заповнення";
            return false;
        }

        if (!/^[А-Яа-яІіЇїЄєҐґA-Za-z'-]+$/.test(value)) {
            error.innerHTML = "* Введіть коректне ім'я або прізвище";
            return false;
        }
    }

    if (field === "email") {

        let at = value.indexOf("@");
        let dot = value.lastIndexOf(".");

        if (value.length === 0) {
            error.innerHTML = "* Введіть Email";
            return false;
        }

        if (at < 1 || dot < at + 2 || dot === value.length - 1) {
            error.innerHTML = "* Email введено невірно";
            return false;
        }
    }

    if (field === "phone") {

        if (!/^(\+380\d{9}|0\d{9})$/.test(value)) {
            error.innerHTML = "* Введіть номер у форматі +380501234567";
            return false;
        }
    }

    if (field === "address") {

        if (value.length === 0) {
            error.innerHTML = "* Введіть адресу";
            return false;
        }

        if (value.length < 5) {
            error.innerHTML = "* Адреса занадто коротка";
            return false;
        }
    }

    return true;
}


function validateHousing() {

    let housing = document.querySelector(
        'input[name="housing"]:checked'
    );

    let error = document.getElementById("housingError");

    if (!housing) {
        error.innerHTML = "* Оберіть тип житла";
        return false;
    }

    error.innerHTML = "";
    return true;
}


function validateHousingForm() {

    let fields = [
        "surname",
        "firstname",
        "email",
        "phone",
        "address"
    ];

    let valid = true;

    for (let i = 0; i < fields.length; i++) {

        if (!validateField(fields[i])) {
            valid = false;
        }
    }

    if (!validateHousing()) {
        valid = false;
    }

    let message = document.getElementById("formMessage");

    if (valid) {
        message.style.color = "green";
        message.innerHTML = "Форму успішно заповнено!";
    } else {
        message.style.color = "red";
        message.innerHTML = "Перевірте правильність заповнення полів!";
    }

    return false;
}


document.getElementById("price").addEventListener("input", function() {

    document.getElementById("priceValue").innerHTML =
        this.value + "$";

});


// Завдання 5. Валідація реєстрації та авторизації

// Функція перевірки реєстрації
function validateRegister() {

    let name = document.getElementById("regName").value.trim();
    let email = document.getElementById("regEmail").value.trim();
    let phone = document.getElementById("regPhone").value.trim();
    let password = document.getElementById("regPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegex = /^(\+380\d{9}|0\d{9})$/;

    let message = document.getElementById("authMessage");

    // Перевірка імені
    if (name === "") {
        alert("Введіть ім'я та прізвище");
        return false;
    }

    // Перевірка Email
    if (email === "") {
        alert("Поле Email повинно бути заповнене");
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("Введіть коректну адресу Email");
        return false;
    }

    // Перевірка телефону
    if (!phoneRegex.test(phone)) {
        alert("Введіть правильний номер телефону");
        return false;
    }

    // Перевірка пароля
    if (password === "") {
        alert("Введіть пароль");
        return false;
    }

    if (password.length < 8) {
        alert("Пароль повинен містити не менше 8 символів");
        return false;
    }

    // Перевірка повторного пароля
    if (confirmPassword === "") {
        alert("Підтвердіть пароль");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Паролі не збігаються");
        return false;
    }

    message.style.color = "green";
    message.innerHTML = "Реєстрація пройшла успішно!";

    return false;
}


// Функція перевірки авторизації
function validateLogin() {

    let email = document.getElementById("loginEmail").value.trim();
    let password = document.getElementById("loginPassword").value;

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let message = document.getElementById("authMessage");

    // Перевірка Email
    if (email === "") {
        alert("Введіть Email");
        return false;
    }

    if (!emailRegex.test(email)) {
        alert("Email введено неправильно");
        return false;
    }

    // Перевірка пароля
    if (password === "") {
        alert("Введіть пароль");
        return false;
    }

    if (password.length < 8) {
        alert("Пароль повинен містити не менше 8 символів");
        return false;
    }

    message.style.color = "green";
    message.innerHTML = "Дані авторизації введено правильно!";

    return false;
}


