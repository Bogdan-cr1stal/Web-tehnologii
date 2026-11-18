
const API_URL = "https://dummyjson.com/products";

const categoriesList = document.getElementById("categories-list");
const productsList = document.getElementById("products-list");
const productsCount = document.getElementById("products-count");
const sectionTitle = document.getElementById("section-title");
const allProductsButton = document.getElementById("all-products");

async function fetchProducts() {
    try {
        productsList.innerHTML = '<p class="loading">Завантаження товарів...</p>';

        const res = await fetch(`${API_URL}?limit=0`);

        if (!res.ok) {
            throw new Error("Не вдалося отримати товари");
        }

        const data = await res.json();

        console.log("Усі товари:", data);

        renderProducts(data.products);

        sectionTitle.textContent = "Усі товари";

    } catch (error) {
        console.error(error);

        productsList.innerHTML =
            '<p class="error-message">Помилка завантаження товарів</p>';
    }
}

async function fetchProductById(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);

        if (!res.ok) {
            throw new Error("Товар не знайдено");
        }

        const product = await res.json();

        console.log("Товар за ID:", product);

        return product;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`);

        if (!res.ok) {
            throw new Error("Не вдалося отримати категорії");
        }

        const categories = await res.json();

        console.log("Категорії:", categories);

        renderCategories(categories);

    } catch (error) {
        console.error(error);

        categoriesList.innerHTML =
            '<p class="error-message">Помилка завантаження категорій</p>';
    }
}

function renderCategories(categories) {
    categoriesList.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");

        button.className = "category-button";

        button.textContent = category.name;

        button.dataset.category = category.slug;

        button.addEventListener("click", function() {
            fetchProductsByCategory(category.slug, category.name);

            document.querySelectorAll(".category-button").forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
        });

        categoriesList.appendChild(button);
    });
}

async function fetchProductsByCategory(category, categoryName) {
    try {
        productsList.innerHTML =
            '<p class="loading">Завантаження товарів...</p>';

        const res = await fetch(`${API_URL}/category/${category}`);

        if (!res.ok) {
            throw new Error("Не вдалося отримати товари категорії");
        }

        const data = await res.json();

        console.log(`Товари категорії ${category}:`, data);

        renderProducts(data.products);

        sectionTitle.textContent = categoryName;

    } catch (error) {
        console.error(error);

        productsList.innerHTML =
            '<p class="error-message">Помилка завантаження товарів</p>';
    }
}

function renderProducts(products) {
    productsList.innerHTML = "";

    productsCount.textContent = `${products.length} товарів`;

    if (products.length === 0) {
        productsList.innerHTML =
            '<p class="empty-message">Товарів не знайдено</p>';

        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");

        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.thumbnail;
        image.alt = product.title;
        image.loading = "lazy";

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const title = document.createElement("h3");
        title.textContent = product.title;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = `$${product.price}`;

        const rating = document.createElement("span");
        rating.className = "product-rating";
        rating.textContent = `★ ${product.rating}`;

        bottom.append(price, rating);

        info.append(category, title, description, bottom);

        card.append(image, info);

        productsList.appendChild(card);
    });
}

allProductsButton.addEventListener("click", function() {

    fetchProducts();

    document.querySelectorAll(".category-button").forEach(button => {
        button.classList.remove("active");
    });

});

async function init() {
    await Promise.all([
        fetchCategories(),
        fetchProducts()
    ]);
}

init();
