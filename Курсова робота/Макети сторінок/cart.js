
document.addEventListener("DOMContentLoaded", function () {

    const cartContent = document.getElementById("cartContent");

    function getCart() {
        return JSON.parse(localStorage.getItem("kidspaceCart")) || [];
    }

    function saveCart(cart) {
        localStorage.setItem("kidspaceCart", JSON.stringify(cart));
        renderCart();
    }

    //Відображення кошика
    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>                    <h2>Ваш кошик поки порожній</h2>
                    <p>Саме час знайти щось цікаве!</p>
                    <br>
                    <a href="/Catalog" class="primary-button">
                        Перейти до каталогу
                    </a>
                </div>
            `;

            return;
        }

        let total = 0;

        const rows = cart.map((item, index) => {
            total += item.price * item.quantity;

            return `
                <tr>
                    <td>
                        <div class="cart-product">
                            <div class="cart-emoji">${item.emoji}</div>
                            <span>${item.name}</span>
                        </div>
                    </td>

                    <td>${item.price} грн</td>

                    <td>
                        <div class="quantity-controls">
                            <button data-action="decrease" data-index="${index}">−</button>
                            ${item.quantity}
                            <button data-action="increase" data-index="${index}">+</button>
                        </div>
                    </td>

                    <td>${item.price * item.quantity} грн</td>

                    <td>
                        <button class="remove-button" data-action="remove" data-index="${index}">
                            ✕
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        cartContent.innerHTML = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Ціна</th>
                        <th>Кількість</th>
                        <th>Сума</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>${rows}</tbody>
            </table>

            <div class="cart-summary">
                <div>
                    <span>Товарів у кошику:</span>
                    <strong>${totalQuantity}</strong>
                </div>

                <div class="cart-total">
                    <span>Разом:</span>
                    <span>${total} грн</span>
                </div>

                <button class="checkout-button" id="checkoutButton">
                    Оформити замовлення
                </button>
            </div>
        `;
    }

    //Обробка кнопок кошика
    cartContent.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;
        const cart = getCart();

        if (action === "increase") {
            cart[index].quantity++;
        }

        if (action === "decrease") {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        if (action === "remove") {
            cart.splice(index, 1);
        }

        saveCart(cart);
    });

// Перехід на сторінку оформлення замовлення
    cartContent.addEventListener("click", function (event) {
        const button = event.target.closest("#checkoutButton");
        if (!button) return;

        const cart = getCart();
        if (cart.length === 0) return;

        window.location.href = "/Checkout";
    });

    renderCart();
});
