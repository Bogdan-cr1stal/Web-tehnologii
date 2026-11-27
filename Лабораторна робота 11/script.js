
$(document).ready(function () {

    // JSON-дані товарів
    const jsonData = `{
        "products": [
            {
                "id": 1,
                "name": "iPhone 15",
                "category": "Смартфони",
                "price": 32999,
                "description": "Сучасний смартфон Apple з потужним процесором."
            },
            {
                "id": 2,
                "name": "Samsung Galaxy S24",
                "category": "Смартфони",
                "price": 28999,
                "description": "Флагманський смартфон Samsung."
            },
            {
                "id": 3,
                "name": "Lenovo IdeaPad 5",
                "category": "Ноутбуки",
                "price": 25999,
                "description": "Універсальний ноутбук для роботи та навчання."
            },
            {
                "id": 4,
                "name": "ASUS TUF Gaming",
                "category": "Ноутбуки",
                "price": 42999,
                "description": "Потужний ноутбук для ігор та програмування."
            },
            {
                "id": 5,
                "name": "Logitech G102",
                "category": "Аксесуари",
                "price": 899,
                "description": "Ігрова мишка з налаштуванням чутливості."
            },
            {
                "id": 6,
                "name": "HyperX Cloud II",
                "category": "Аксесуари",
                "price": 2999,
                "description": "Навушники з якісним звуком та мікрофоном."
            },
            {
                "id": 7,
                "name": "Xiaomi Redmi Note 13",
                "category": "Смартфони",
                "price": 8999,
                "description": "Доступний смартфон із якісним дисплеєм."
            },
            {
                "id": 8,
                "name": "HP Pavilion 15",
                "category": "Ноутбуки",
                "price": 31999,
                "description": "Ноутбук для повсякденних завдань."
            },
            {
                "id": 9,
                "name": "Logitech K380",
                "category": "Аксесуари",
                "price": 1499,
                "description": "Компактна бездротова клавіатура."
            }
        ]
    }`;

    // Перетворення JSON-тексту в JavaScript-об'єкт
    const data = JSON.parse(jsonData);

    let products = data.products;

    // Відображення товарів
    function displayProducts(items) {

        $("#products").empty();

        $("#result-count").text(
            "Знайдено товарів: " + items.length
        );

        if (items.length === 0) {
            $("#products").html(
                '<p class="no-results">Товарів не знайдено.</p>'
            );
            return;
        }

        $.each(items, function (index, product) {

            let card = `
                <div class="product-card">
                    <span class="category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <p class="price">
                        ${product.price.toLocaleString("uk-UA")} грн
                    </p>
                </div>
            `;

            $("#products").append(card);
        });
    }

    // Пошук, фільтрація та сортування
    function filterProducts() {

        let searchValue = $("#search").val().toLowerCase();

        let categoryValue = $("#category").val();

        let sortValue = $("#sort").val();

        let filtered = products.filter(function (product) {

            let matchesSearch =
                product.name.toLowerCase().includes(searchValue) ||
                product.description.toLowerCase().includes(searchValue);

            let matchesCategory =
                categoryValue === "all" ||
                product.category === categoryValue;

            return matchesSearch && matchesCategory;
        });

        // Сортування за назвою
        if (sortValue === "name") {
            filtered.sort(function (a, b) {
                return a.name.localeCompare(b.name, "uk");
            });
        }

        // Від дешевих до дорогих
        if (sortValue === "priceAsc") {
            filtered.sort(function (a, b) {
                return a.price - b.price;
            });
        }

        // Від дорогих до дешевих
        if (sortValue === "priceDesc") {
            filtered.sort(function (a, b) {
                return b.price - a.price;
            });
        }

        displayProducts(filtered);
    }

    // Обробка подій пошуку
    $("#search").on("input", filterProducts);

    // Обробка зміни категорії
    $("#category").on("change", filterProducts);

    // Обробка сортування
    $("#sort").on("change", filterProducts);

    // Початкове відображення товарів
    displayProducts(products);

});
