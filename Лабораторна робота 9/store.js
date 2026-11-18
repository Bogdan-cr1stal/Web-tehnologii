
class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }

    addToBasket() {
        console.log(`Product ${this.name} has been added to the basket`);
    }
}

class Shoe extends Product {
    constructor(name, amount, image) {
        super(name, "shoe", amount, image);
    }
}

class Grocerie extends Product {
    constructor(name, amount, image) {
        super(name, "grocerie", amount, image);
    }
}

function productFactory(product) {
    if (product.category === "shoe") {
        return new Shoe(
            product.name,
            product.amount,
            product.image
        );
    }

    if (product.category === "grocerie") {
        return new Grocerie(
            product.name,
            product.amount,
            product.image
        );
    }

    throw new Error("Unknown product category");
}

class Basket {
    constructor() {
        this.products = [];
    }

    add(product) {
        const basketProduct = {
            ...product,
            amount: 1,
            addedAt: new Date().toLocaleString("uk-UA")
        };

        this.products.push(basketProduct);

        product.addToBasket();

        return basketProduct;
    }

    remove(index) {
        if (index < 0 || index >= this.products.length) {
            return null;
        }

        return this.products.splice(index, 1)[0];
    }
}

class Store {
    constructor() {
        this.products = [];
        this.basket = new Basket();
    }

    fillStoreWithProducts(data) {
        this.products = data.map(product => productFactory(product));
    }

    addProductToBasket(index) {
        const product = this.products[index];

        if (!product || product.amount <= 0) {
            return null;
        }

        product.amount--;

        if (product.amount === 0) {
            this.products.splice(index, 1);
        }

        return this.basket.add(product);
    }

    removeProductFromBasket(index) {
        const product = this.basket.remove(index);

        if (!product) {
            return;
        }

        const existingProduct = this.products.find(item =>
            item.name === product.name &&
            item.category === product.category
        );

        if (existingProduct) {
            // Збільшуємо кількість на складі
            existingProduct.amount++;
        } else {
            // Повертаємо товар до магазину
            this.products.push(
                productFactory({
                    name: product.name,
                    category: product.category,
                    amount: 1,
                    image: product.image
                })
            );
        }

        return product;
    }
}
