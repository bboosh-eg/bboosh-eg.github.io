
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
                $${product.price}
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

    shopProductsContainer.appendChild(productCard);
});

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}