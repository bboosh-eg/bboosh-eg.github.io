const wishlistContainer =
    document.getElementById("wishlistContainer");

const emptyWishlist =
    document.getElementById("emptyWishlist");


/* =========================
   GET FAVORITES
========================= */

function getFavorites() {

    const savedFavorites =
        JSON.parse(
            localStorage.getItem("bbooshFavorites")
        ) || [];

    return savedFavorites.map(function(id) {
        return Number(id);
    });

}


/* =========================
   DISPLAY FAVORITES
========================= */

function displayFavorites() {

    const favorites = getFavorites();

    wishlistContainer.innerHTML = "";


    const favoriteProducts =
        products.filter(function(product) {

            return favorites.includes(
                Number(product.id)
            );

        });


    /* EMPTY WISHLIST */

    if (favoriteProducts.length === 0) {

        emptyWishlist.style.display = "flex";
        wishlistContainer.style.display = "none";

        return;

    }


    emptyWishlist.style.display = "none";
    wishlistContainer.style.display = "";


    /* CREATE PRODUCT CARDS */

    favoriteProducts.forEach(function(product) {

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";


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

                <button
                    class="favorite-btn favorite-active"
                    onclick="removeFavorite(${product.id})"
                    aria-label="Remove from favorites"
                >
                    ♥
                </button>


                <div class="product-image-blob">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>

            </div>

        `;


        wishlistContainer.appendChild(
            productCard
        );

    });

}


/* =========================
   REMOVE FAVORITE
========================= */

function removeFavorite(productId) {

    let favorites = getFavorites();


    favorites = favorites.filter(
        function(id) {

            return id !== Number(productId);

        }
    );


    localStorage.setItem(
        "bbooshFavorites",
        JSON.stringify(favorites)
    );


    displayFavorites();


    /* Update navbar counter */

    if (
        typeof updateFavoriteCount === "function"
    ) {

        updateFavoriteCount();

    }

}


/* =========================
   OPEN PRODUCT
========================= */

function viewProduct(id) {

    window.location.href =
        `product.html?id=${id}`;

}


/* START */

displayFavorites();