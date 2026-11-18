
const store = new Store();

const productsList = document.getElementById("products-list");
const basketList = document.getElementById("basket-list");

const productCount = document.getElementById("product-count");
const basketCount = document.getElementById("basket-count");

const fileInput = document.getElementById("products-file");

let currentCategory = "all";

fileInput.addEventListener("change", async function(event) {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
            throw new Error("JSON повинен містити масив товарів");
        }

        store.fillStoreWithProducts(data);

        renderProducts();
        renderBasket();

        console.log("Товари успішно завантажені:", data);

    } catch (error) {
        console.error("Помилка завантаження:", error);
        alert("Не вдалося завантажити JSON-файл!");
    }
});

function renderProducts() {
    productsList.innerHTML = "";

    // Фільтрація товарів за категорією
    const filteredProducts = store.products
        .map((product, index) => ({
            product,
            index
        }))
        .filter(item =>
            currentCategory === "all" ||
            item.product.category === currentCategory
        );

    filteredProducts.forEach(({ product, index }) => {
        const card = document.createElement("div");

        card.className = "product-card";
        card.dataset.category = product.category;

        const categoryName =
            product.category === "shoe" ? "Взуття" : "Продукти";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">

                <span class="product-category">
                    ${categoryName}
                </span>

                <h3>${product.name}</h3>

                <p class="stock">
                    У наявності: ${product.amount} шт.
                </p>

                <button class="add-button">
                    ДОДАТИ ДО КОШИКА +
                </button>

            </div>
        `;

        const addButton = card.querySelector(".add-button");

        addButton.addEventListener("click", function() {
            addToBasket(index);
        });

        productsList.appendChild(card);
    });

    const totalAmount = store.products.reduce(
        (sum, product) => sum + product.amount,
        0
    );

    productCount.textContent = `${totalAmount} товарів`;
}

function addToBasket(index) {
    const addedProduct = store.addProductToBasket(index);

    if (!addedProduct) {
        return;
    }

    renderProducts();
    renderBasket();
}

function renderBasket() {
    basketList.innerHTML = "";

    const products = store.basket.products;

    basketCount.textContent = `${products.length} товарів`;

    if (products.length === 0) {
        basketList.innerHTML = `
            <div class="empty-basket">
                <span>🛒</span>
                <p>Ваш кошик поки порожній</p>
            </div>
        `;

        return;
    }

    products.forEach((product, index) => {
        const item = document.createElement("div");

        item.className = "basket-item";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="basket-info">

                <h3>${product.name}</h3>

                <p>
                    ${product.category === "shoe" ? "Взуття" : "Продукти"}
                </p>

            </div>

            <div class="basket-time">
                Додано:<br>
                ${product.addedAt}
            </div>

            <button class="remove-button">
                Видалити
            </button>
        `;

        const removeButton = item.querySelector(".remove-button");

        removeButton.addEventListener("click", function() {
            removeFromBasket(index);
        });

        basketList.appendChild(item);
    });
}

function removeFromBasket(index) {
    store.removeProductFromBasket(index);

    renderProducts();
    renderBasket();
}

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        currentCategory = button.dataset.category;
        renderProducts();
    });

});
