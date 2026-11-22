document.addEventListener("DOMContentLoaded", function () {
    const CART_STORAGE_KEY = "kidspaceCart";
    const ADDED_FEEDBACK_MS = 1000;

    const productGrid = document.getElementById("productGrid");
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");
    const categoryInputs = Array.from(document.querySelectorAll('input[name="category"]'));
    const productsCount = document.getElementById("productsCount");
    const noProducts = document.getElementById("noProducts");
    const resetFilters = document.getElementById("resetFilters");
    const cartCount = document.getElementById("cartCount");
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    const sortControl = document.getElementById("sortControl");
    const sortTrigger = document.getElementById("sortTrigger");
    const sortCurrent = document.getElementById("sortCurrent");
    const sortMenu = document.getElementById("sortMenu");
    const sortOptions = sortMenu ? Array.from(sortMenu.querySelectorAll(".sort-option")) : [];

    if (!productGrid) {
        return;
    }

    const products = Array.from(productGrid.querySelectorAll(".product-card"));
    let currentSort = sortControl ? (sortControl.dataset.value || "default") : "default";
    let focusedOptionIndex = -1;

    function normalizeText(value) {
        return String(value || "")
            .replace(/[’ʼ`´]/g, "'")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    }

    function getCart() {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch {
            //Ігноруємо помилки доступу до localStorage
        }
    }

    function updateCartCount() {
        if (!cartCount) {
            return;
        }

        const cart = getCart();
        const total = cart.reduce(function (sum, item) {
            const qty = Number(item && item.quantity);
            return sum + (Number.isFinite(qty) && qty > 0 ? qty : 0);
        }, 0);

        cartCount.textContent = String(total);
    }

    function addToCart(product) {
        const cart = getCart();
        const existingItem = cart.find(function (item) {
            return String(item.id) === String(product.id);
        });

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity || 0) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                emoji: product.emoji,
                quantity: 1
            });
        }

        saveCart(cart);
        updateCartCount();
    }

    function formatProductsCount(count) {
        const mod10 = count % 10;
        const mod100 = count % 100;

        if (mod10 === 1 && mod100 !== 11) {
            return count + " товар";
        }
        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
            return count + " товари";
        }
        return count + " товарів";
    }

    function getSelectedCategory() {
        const checked = categoryInputs.find(function (input) {
            return input.checked;
        });
        return checked ? normalizeText(checked.value) : "all";
    }

    function setCategoryValue(categoryValue) {
        const normalizedTarget = normalizeText(categoryValue);
        const matchedInput = categoryInputs.find(function (input) {
            return normalizeText(input.value) === normalizedTarget;
        });

        if (matchedInput) {
            matchedInput.checked = true;
            return true;
        }

        const allInput = categoryInputs.find(function (input) {
            return normalizeText(input.value) === "all";
        });
        if (allInput) {
            allInput.checked = true;
        }
        return false;
    }

    function applyCategoryFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const rawCategory = params.get("category");
        if (!rawCategory) {
            return;
        }
        setCategoryValue(rawCategory);
    }

    function compareProducts(a, b, sortType) {
        const priceA = Number(a.dataset.price) || 0;
        const priceB = Number(b.dataset.price) || 0;
        const nameA = (a.dataset.name || "").trim();
        const nameB = (b.dataset.name || "").trim();

        if (sortType === "low") {
            return priceA - priceB || nameA.localeCompare(nameB, "uk");
        }
        if (sortType === "high") {
            return priceB - priceA || nameA.localeCompare(nameB, "uk");
        }
        if (sortType === "name") {
            return nameA.localeCompare(nameB, "uk");
        }

        return Number(a.dataset.id || 0) - Number(b.dataset.id || 0);
    }

    function syncSearchClearButton() {
        if (!searchInput || !searchClear) {
            return;
        }
        searchClear.hidden = searchInput.value.length === 0;
    }

    function filterProducts() {
        const searchText = searchInput ? normalizeText(searchInput.value) : "";
        const selectedCategory = getSelectedCategory();

        syncSearchClearButton();

        const visibleProducts = products.filter(function (product) {
            const name = normalizeText(product.dataset.name);
            const category = normalizeText(product.dataset.category);

            const matchesSearch = !searchText || name.includes(searchText);
            const matchesCategory = selectedCategory === "all" || category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        visibleProducts.sort(function (a, b) {
            return compareProducts(a, b, currentSort);
        });

        const visibleSet = new Set(visibleProducts);

        products.forEach(function (product) {
            const isVisible = visibleSet.has(product);
            product.hidden = !isVisible;
            product.style.display = isVisible ? "" : "none";
        });

        visibleProducts.forEach(function (product) {
            productGrid.appendChild(product);
        });

        if (productsCount) {
            productsCount.textContent = formatProductsCount(visibleProducts.length);
        }

        const hasResults = visibleProducts.length > 0;
        productGrid.hidden = !hasResults;
        productGrid.style.display = hasResults ? "" : "none";

        if (noProducts) {
            noProducts.hidden = hasResults;
        }
    }

    function updateFocusedOption(index) {
        sortOptions.forEach(function (opt, idx) {
            opt.classList.toggle("is-focused", idx === index);
        });
        focusedOptionIndex = index;
    }

    function openSortMenu() {
        if (!sortControl || !sortTrigger || !sortMenu) {
            return;
        }
        sortControl.classList.add("is-open");
        sortTrigger.setAttribute("aria-expanded", "true");
        sortMenu.hidden = false;

        const selectedIdx = sortOptions.findIndex(function (opt) {
            return opt.dataset.value === currentSort;
        });
        updateFocusedOption(selectedIdx >= 0 ? selectedIdx : 0);
    }

    function closeSortMenu(restoreFocus) {
        if (!sortControl || !sortTrigger || !sortMenu) {
            return;
        }
        sortControl.classList.remove("is-open");
        sortTrigger.setAttribute("aria-expanded", "false");
        sortMenu.hidden = true;
        updateFocusedOption(-1);

        if (restoreFocus) {
            sortTrigger.focus();
        }
    }

    function setSortValue(value, shouldFilter) {
        const matchedOption = sortOptions.find(function (opt) {
            return opt.dataset.value === value;
        }) || sortOptions[0];

        if (!matchedOption) {
            return;
        }

        currentSort = matchedOption.dataset.value;

        if (sortControl) {
            sortControl.dataset.value = currentSort;
        }
        if (sortCurrent) {
            sortCurrent.textContent = matchedOption.textContent.trim();
        }

        sortOptions.forEach(function (opt) {
            const isSelected = opt === matchedOption;
            opt.classList.toggle("is-selected", isSelected);
            opt.setAttribute("aria-selected", String(isSelected));
        });

        if (shouldFilter) {
            filterProducts();
        }
    }

    function initSortDropdown() {
        if (!sortControl || !sortTrigger || !sortMenu) {
            return;
        }

        sortTrigger.addEventListener("click", function (event) {
            event.stopPropagation();
            if (sortControl.classList.contains("is-open")) {
                closeSortMenu(false);
            } else {
                openSortMenu();
            }
        });

        sortTrigger.addEventListener("keydown", function (event) {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (!sortControl.classList.contains("is-open")) {
                    openSortMenu();
                } else {
                    const step = event.key === "ArrowDown" ? 1 : -1;
                    const nextIdx = (focusedOptionIndex + step + sortOptions.length) % sortOptions.length;
                    updateFocusedOption(nextIdx);
                }
            } else if (event.key === "Enter" || event.key === " ") {
                if (sortControl.classList.contains("is-open") && focusedOptionIndex >= 0) {
                    event.preventDefault();
                    setSortValue(sortOptions[focusedOptionIndex].dataset.value, true);
                    closeSortMenu(true);
                }
            } else if (event.key === "Escape") {
                closeSortMenu(true);
            }
        });

        sortOptions.forEach(function (option, index) {
            option.addEventListener("mousemove", function () {
                updateFocusedOption(index);
            });

            option.addEventListener("click", function (event) {
                event.stopPropagation();
                setSortValue(option.dataset.value, true);
                closeSortMenu(true);
            });
        });

        document.addEventListener("click", function (event) {
            if (sortControl.classList.contains("is-open") && !sortControl.contains(event.target)) {
                closeSortMenu(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && sortControl.classList.contains("is-open")) {
                closeSortMenu(true);
            }
        });
    }

    function initAddButtons() {
        products.forEach(function (card) {
            const button = card.querySelector(".product-add");
            if (!button) {
                return;
            }

            let resetTimer = null;

            button.addEventListener("click", function () {
                const product = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    category: card.dataset.category,
                    price: Number(card.dataset.price) || 0,
                    emoji: card.dataset.emoji || ""
                };

                addToCart(product);

                button.textContent = "Додано ✓";
                button.classList.add("added");

                if (resetTimer) {
                    clearTimeout(resetTimer);
                }

                resetTimer = setTimeout(function () {
                    button.textContent = "До кошика";
                    button.classList.remove("added");
                }, ADDED_FEEDBACK_MS);
            });
        });
    }

    function initFilters() {
        if (searchInput) {
            searchInput.addEventListener("input", filterProducts);
        }

        if (searchClear && searchInput) {
            searchClear.addEventListener("click", function () {
                searchInput.value = "";
                filterProducts();
                searchInput.focus();
            });
        }

        categoryInputs.forEach(function (input) {
            input.addEventListener("change", filterProducts);
        });

        if (resetFilters) {
            resetFilters.addEventListener("click", function () {
                if (searchInput) {
                    searchInput.value = "";
                }
                setSortValue("default", false);
                setCategoryValue("all");
                filterProducts();
            });
        }
    }

    function setMenuState(isOpen) {
        if (!navigation || !menuToggle) {
            return;
        }

        navigation.classList.toggle("show", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
        menuToggle.textContent = isOpen ? "✕" : "☰";
    }

    function initMobileMenu() {
        if (!menuToggle || !navigation) {
            return;
        }

        menuToggle.addEventListener("click", function () {
            const willOpen = !navigation.classList.contains("show");
            setMenuState(willOpen);
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenuState(false);
            });
        });

        document.addEventListener("click", function (event) {
            if (!navigation.classList.contains("show")) {
                return;
            }
            const clickedInsideNav = navigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);
            if (!clickedInsideNav && !clickedToggle) {
                setMenuState(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && navigation.classList.contains("show")) {
                setMenuState(false);
                menuToggle.focus();
            }
        });
    }

    window.addEventListener("storage", function (event) {
        if (event.key === CART_STORAGE_KEY) {
            updateCartCount();
        }
    });

    initSortDropdown();
    initAddButtons();
    initFilters();
    initMobileMenu();
    applyCategoryFromUrl();
    setSortValue(currentSort, false);
    updateCartCount();
    filterProducts();
});