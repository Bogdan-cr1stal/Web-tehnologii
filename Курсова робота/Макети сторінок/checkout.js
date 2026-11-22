document.addEventListener("DOMContentLoaded", function () {
    const CART_STORAGE_KEY = "kidspaceCart";
    const ORDERS_STORAGE_KEY = "kidspaceOrders";
    const FREE_SHIPPING_THRESHOLD = 1500;

    const checkoutEmpty = document.getElementById("checkoutEmpty");
    const checkoutLayout = document.getElementById("checkoutLayout");
    const checkoutForm = document.getElementById("checkoutForm");
    const checkoutMessage = document.getElementById("checkoutMessage");

    const checkoutItems = document.getElementById("checkoutItems");
    const summaryCount = document.getElementById("summaryCount");
    const summarySubtotal = document.getElementById("summarySubtotal");
    const summaryShipping = document.getElementById("summaryShipping");
    const summaryTotal = document.getElementById("summaryTotal");
    const freeShippingNote = document.getElementById("freeShippingNote");

    const fullNameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const cityInput = document.getElementById("city");
    const branchInput = document.getElementById("branch");
    const commentInput = document.getElementById("comment");

    const orderSuccessModal = document.getElementById("orderSuccessModal");
    const closeOrderModalBtn = document.getElementById("closeOrderModalBtn");
    const modalOrderNumber = document.getElementById("modalOrderNumber");
    const modalOrderDetails = document.getElementById("modalOrderDetails");

    function getCart() {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function clearCart() {
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch {
            // Ігноруємо помилки localStorage
        }
    }

    function saveOrderHistory(order) {
        try {
            const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
            const list = raw ? JSON.parse(raw) : [];
            const orders = Array.isArray(list) ? list : [];
            orders.unshift(order);
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } catch {
            // Ігноруємо помилки localStorage
        }
    }

    function formatPrice(value) {
        return Math.round(value) + " грн";
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function getSelectedDeliveryService() {
        const checked = document.querySelector('input[name="deliveryService"]:checked');
        return checked ? checked.value : "Нова Пошта";
    }

    function updateBranchPlaceholder() {
        if (!branchInput) {
            return;
        }
        const service = getSelectedDeliveryService();
        if (service === "Укрпошта") {
            branchInput.placeholder = "Наприклад: Індекс 40000 або вул. Соборна, 15";
        } else if (service === "Meest ПОШТА") {
            branchInput.placeholder = "Наприклад: Відділення Meest №4 або поштомат";
        } else {
            branchInput.placeholder = "Наприклад: Відділення №12 або Поштомат №345";
        }
    }

    function renderSummary(cart) {
        if (!checkoutItems) {
            return;
        }

        let totalQty = 0;
        let subtotal = 0;

        checkoutItems.innerHTML = cart.map(function (item) {
            const qty = Math.max(1, Number(item.quantity) || 1);
            const price = Math.max(0, Number(item.price) || 0);
            const rowSum = qty * price;

            totalQty += qty;
            subtotal += rowSum;

            return (
                '<div class="checkout-item">' +
                    '<div class="checkout-item-left">' +
                        '<span class="checkout-item-emoji">' + escapeHtml(item.emoji || "🎁") + "</span>" +
                        '<div class="checkout-item-info">' +
                            "<strong>" + escapeHtml(item.name) + "</strong>" +
                            "<small>" + qty + " шт. × " + formatPrice(price) + "</small>" +
                        "</div>" +
                    "</div>" +
                    '<span class="checkout-item-price">' + formatPrice(rowSum) + "</span>" +
                "</div>"
            );
        }).join("");

        const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

        if (summaryCount) {
            summaryCount.textContent = totalQty + " шт.";
        }
        if (summarySubtotal) {
            summarySubtotal.textContent = formatPrice(subtotal);
        }
        if (summaryShipping) {
            summaryShipping.textContent = isFreeShipping ? "Безкоштовно" : "За тарифами перевізника";
        }
        if (summaryTotal) {
            summaryTotal.textContent = formatPrice(subtotal);
        }
        if (freeShippingNote) {
            if (isFreeShipping) {
                freeShippingNote.textContent = "✓ Для вашого замовлення діє безкоштовна доставка!";
                freeShippingNote.classList.add("is-free");
            } else {
                const diff = FREE_SHIPPING_THRESHOLD - subtotal;
                freeShippingNote.textContent = "Додайте товарів ще на " + formatPrice(diff) + " для безкоштовної доставки.";
                freeShippingNote.classList.remove("is-free");
            }
        }
    }

    function clearFieldErrors() {
        [fullNameInput, phoneInput, emailInput, cityInput, branchInput].forEach(function (el) {
            if (el) {
                el.classList.remove("is-invalid");
            }
        });
        if (checkoutMessage) {
            checkoutMessage.textContent = "";
        }
    }

    function showValidationError(input, text) {
        if (input) {
            input.classList.add("is-invalid");
            input.focus();
        }
        if (checkoutMessage) {
            checkoutMessage.textContent = text;
        }
    }

    function isValidUkrainianPhone(rawPhone) {
        const digits = rawPhone.replace(/\D/g, "");
        return /^(380\d{9}|0\d{9})$/.test(digits);
    }

    function openSuccessModal(order) {
        if (modalOrderNumber) {
            modalOrderNumber.textContent = order.number;
        }

        if (modalOrderDetails) {
            const rows = [
                ["Отримувач:", order.fullName],
                ["Телефон:", order.phone],
                ["Email:", order.email],
                ["Місто:", order.city],
                ["Пошта:", order.deliveryService],
                ["Відділення:", order.branch],
                ["До сплати:", formatPrice(order.total)]
            ];

            modalOrderDetails.innerHTML = rows.map(function (pair) {
                return (
                    '<div class="order-modal-row">' +
                        "<span>" + escapeHtml(pair[0]) + "</span>" +
                        "<strong>" + escapeHtml(pair[1]) + "</strong>" +
                    "</div>"
                );
            }).join("");
        }

        if (orderSuccessModal) {
            orderSuccessModal.hidden = false;
            if (closeOrderModalBtn) {
                closeOrderModalBtn.focus();
            }
        }
    }

    function closeSuccessModal() {
        if (orderSuccessModal) {
            orderSuccessModal.hidden = true;
        }
        if (checkoutLayout) {
            checkoutLayout.hidden = true;
        }
        if (checkoutEmpty) {
            checkoutEmpty.hidden = false;
        }
    }

    if (closeOrderModalBtn) {
        closeOrderModalBtn.addEventListener("click", closeSuccessModal);
    }

    if (orderSuccessModal) {
        orderSuccessModal.addEventListener("click", function (event) {
            if (event.target === orderSuccessModal) {
                closeSuccessModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && orderSuccessModal && !orderSuccessModal.hidden) {
            closeSuccessModal();
        }
    });

    const initialCart = getCart();
    if (initialCart.length === 0) {
        if (checkoutLayout) {
            checkoutLayout.hidden = true;
        }
        if (checkoutEmpty) {
            checkoutEmpty.hidden = false;
        }
        return;
    }

    renderSummary(initialCart);
    updateBranchPlaceholder();

    document.querySelectorAll('input[name="deliveryService"]').forEach(function (radio) {
        radio.addEventListener("change", updateBranchPlaceholder);
    });

    [fullNameInput, phoneInput, emailInput, cityInput, branchInput].forEach(function (el) {
        if (el) {
            el.addEventListener("input", function () {
                el.classList.remove("is-invalid");
                if (checkoutMessage) {
                    checkoutMessage.textContent = "";
                }
            });
        }
    });

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();
            clearFieldErrors();

            const cart = getCart();
            if (cart.length === 0) {
                return;
            }

            const fullName = fullNameInput ? fullNameInput.value.trim() : "";
            const phone = phoneInput ? phoneInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const city = cityInput ? cityInput.value.trim() : "";
            const deliveryService = getSelectedDeliveryService();
            const branch = branchInput ? branchInput.value.trim() : "";
            const comment = commentInput ? commentInput.value.trim() : "";

            const nameParts = fullName.split(/\s+/).filter(Boolean);
            if (nameParts.length < 2 || fullName.length < 5) {
                showValidationError(fullNameInput, "Вкажіть коректне ПІБ отримувача (щонайменше прізвище та ім'я).");
                return;
            }

            if (!isValidUkrainianPhone(phone)) {
                showValidationError(phoneInput, "Введіть коректний номер телефону у форматі +380XXXXXXXXX або 0XXXXXXXXX.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showValidationError(emailInput, "Введіть коректну електронну адресу.");
                return;
            }

            if (city.length < 2) {
                showValidationError(cityInput, "Вкажіть місто або населений пункт доставки.");
                return;
            }

            if (branch.length < 2) {
                showValidationError(branchInput, "Вкажіть номер або адресу відділення чи поштомату.");
                return;
            }

            const total = cart.reduce(function (sum, item) {
                return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
            }, 0);

            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const order = {
                number: "#KS-" + randomCode,
                createdAt: new Date().toISOString(),
                fullName: fullName,
                phone: phone,
                email: email,
                city: city,
                deliveryService: deliveryService,
                branch: branch,
                comment: comment,
                items: cart,
                total: total
            };

            saveOrderHistory(order);
            clearCart();
            openSuccessModal(order);
        });
    }
});