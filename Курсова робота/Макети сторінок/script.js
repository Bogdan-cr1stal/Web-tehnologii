document.addEventListener("DOMContentLoaded", function () {
    const CART_STORAGE_KEY = "kidspaceCart";

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("show");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
            const total = Array.isArray(cart)
                ? cart.reduce(function (sum, item) {
                    const qty = Number(item && item.quantity);
                    return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
                }, 0)
                : 0;
            cartCount.textContent = String(total);
        } catch {
            cartCount.textContent = "0";
        }
    }

    //Якщо картинка логотипа (800x800) завантажилась — ховаємо текстовий fallback
    document.querySelectorAll(".home-brand-logo-slot img").forEach(function (img) {
        function handleLoaded() {
            if (img.naturalWidth > 0) {
                img.classList.add("is-loaded");
            }
        }

        function handleError() {
            img.hidden = true;
            img.classList.remove("is-loaded");
        }

        if (img.complete) {
            if (img.naturalWidth > 0) {
                handleLoaded();
            } else {
                handleError();
            }
        } else {
            img.addEventListener("load", handleLoaded, { once: true });
            img.addEventListener("error", handleError, { once: true });
        }
    });
});