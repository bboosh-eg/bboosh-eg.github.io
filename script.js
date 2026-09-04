const productsContainer = document.getElementById("productsContainer");

const featuredProducts = products.slice(0, 3);

featuredProducts.forEach(function(product) {

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
    ${product.price} EGP
        </p>

        <button
            class="view-product-btn"
            onclick="viewProduct(${product.id})"
        >
            <span>View Product</span>
            <span class="button-arrow">→</span>
        </button>

    </div>

    <div class="product-image-wrap">
        <div class="product-image-blob">
            <img
                src="${product.image}"
                alt="${product.name}"
            >
        </div>

        <span class="product-doodle">♡</span>
    </div>
`;
productsContainer.appendChild(productCard);
});
function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {

        const totalQuantity = cart.reduce(function(total, item) {
            return total + (item.quantity || 1);
        }, 0);

        cartCount.textContent = totalQuantity;
    }
}

updateCartCount();
/* =========================
   FAVORITES COUNT
========================= */

function updateFavoriteCount() {

    const favoriteCount =
        document.getElementById("favoriteCount");

    if (!favoriteCount) {
        return;
    }

    const favorites =
        JSON.parse(
            localStorage.getItem("bbooshFavorites")
        ) || [];

    favoriteCount.textContent =
        favorites.length;
}


updateFavoriteCount();