
const shopProductsContainer =
    document.getElementById("shopProductsContainer");

products.forEach(function(product) {

    const productCard = document.createElement("div");

    productCard.className = "product-card";

    productCard.innerHTML = `
        <div class="product-info">

            <span class="product-badge">
                ♡ Handmade
            </span>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <p class="product-description">
                ${product.description}
            </p>

            <p class="product-price">
${product.price} EGP            </p>

            <button
                class="view-product-btn"
                onclick="viewProduct(${product.id})"
            >
                <span>View Product</span>
                <span class="button-arrow">→</span>
            </button>

        </div>

        <div class="product-image-wrap">

    <button
        class="favorite-btn"
        data-id="${product.id}"
        onclick="toggleFavorite(${product.id}, this)"
        aria-label="Add to favorites"
    >
        ♡
    </button>

    <div class="product-image-blob">
        <img
            src="${product.image}"
            alt="${product.name}"
        >
    </div>

    <span class="product-doodle">♡</span>

</div>

        </div>
    `;

    shopProductsContainer.appendChild(productCard);
});

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}
/* =========================
   FAVORITES
========================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem("bbooshFavorites")
    ) || [];

}


function toggleFavorite(productId, button) {

    let favorites = getFavorites();

    const alreadyFavorite =
        favorites.includes(productId);


    if (alreadyFavorite) {

        favorites = favorites.filter(
            function(id) {
                return id !== productId;
            }
        );

        button.textContent = "♡";

        button.classList.remove("favorite-active");

    } else {

        favorites.push(productId);

        button.textContent = "♥";

        button.classList.add("favorite-active");

    }


    localStorage.setItem(
    "bbooshFavorites",
    JSON.stringify(favorites)
);

if (typeof updateFavoriteCount === "function") {
    updateFavoriteCount();
}

}


function loadFavoriteButtons() {

    const favorites = getFavorites();

    const favoriteButtons =
        document.querySelectorAll(".favorite-btn");


    favoriteButtons.forEach(function(button) {

        const productId =
            Number(button.dataset.id);


        if (favorites.includes(productId)) {

            button.textContent = "♥";

            button.classList.add("favorite-active");

        }

    });

}


loadFavoriteButtons();