
const shopProductsContainer =
    document.getElementById("shopProductsContainer");


/* =========================
   LOAD PRODUCTS FROM SUPABASE
========================= */

async function loadShopProducts() {

    shopProductsContainer.innerHTML =
        "<p>Loading products...</p>";


    const { data: products, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        shopProductsContainer.innerHTML =
            "<p>Could not load products.</p>";

        return;
    }


    shopProductsContainer.innerHTML = "";


    if (products.length === 0) {

        shopProductsContainer.innerHTML =
            "<p>No products available yet.</p>";

        return;
    }


    products.forEach(function(product) {

        const productCard =
            document.createElement("div");

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
                    ${product.description || ""}
                </p>

                <p class="product-price">
                    ${product.price} EGP
                </p>
<p class="product-stock-status">
    ${
        product.is_available
            ? "Available"
            : "Out of Stock"
    }
</p>
                <button
                    class="view-product-btn"
                    onclick="viewProduct(${product.id})"
                >
                    <span>View Product</span>

                    <span class="button-arrow">
                        →
                    </span>
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
                        src="${product.image_url || ""}"
                        alt="${product.name}"
                    >

                </div>


                <span class="product-doodle">
                    ♡
                </span>

            </div>

        `;


        shopProductsContainer.appendChild(
            productCard
        );

    });


    loadFavoriteButtons();

}


/* =========================
   VIEW PRODUCT
========================= */

function viewProduct(id) {

    window.location.href =
        `product.html?id=${id}`;

}


/* =========================
   FAVORITES
========================= */

function getFavorites() {

    return JSON.parse(
        localStorage.getItem(
            "bbooshFavorites"
        )
    ) || [];

}


function toggleFavorite(
    productId,
    button
) {

    let favorites =
        getFavorites();


    const alreadyFavorite =
        favorites.includes(
            productId
        );


    if (alreadyFavorite) {

        favorites =
            favorites.filter(
                function(id) {

                    return id !== productId;

                }
            );


        button.textContent = "♡";

        button.classList.remove(
            "favorite-active"
        );

    } else {

        favorites.push(
            productId
        );


        button.textContent = "♥";

        button.classList.add(
            "favorite-active"
        );

    }


    localStorage.setItem(
        "bbooshFavorites",
        JSON.stringify(favorites)
    );


    if (
        typeof updateFavoriteCount
        === "function"
    ) {

        updateFavoriteCount();

    }

}


/* =========================
   LOAD FAVORITE BUTTONS
========================= */

function loadFavoriteButtons() {

    const favorites =
        getFavorites();


    const favoriteButtons =
        document.querySelectorAll(
            ".favorite-btn"
        );


    favoriteButtons.forEach(
        function(button) {

            const productId =
                Number(
                    button.dataset.id
                );


            if (
                favorites.includes(
                    productId
                )
            ) {

                button.textContent =
                    "♥";

                button.classList.add(
                    "favorite-active"
                );

            }

        }
    );

}


/* =========================
   START
========================= */

loadShopProducts();