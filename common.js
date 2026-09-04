/* =========================
   MOBILE MENU
========================= */

function toggleMenu() {

    const navLinks =
        document.getElementById("navLinks");

    if (navLinks) {
        navLinks.classList.toggle("show");
    }

}


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


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let totalQuantity = 0;

    cart.forEach(function(item) {

        totalQuantity +=
            item.quantity || 1;

    });

    cartCount.textContent =
        totalQuantity;
}


/* =========================
   LOAD NAV COUNTS
========================= */

updateFavoriteCount();
updateCartCount();
/* =========================
   MINI CART
========================= */

const miniCart =
    document.getElementById("miniCart");

const cartOverlay =
    document.getElementById("cartOverlay");

const miniCartClose =
    document.getElementById("miniCartClose");

const miniCartItems =
    document.getElementById("miniCartItems");

const miniCartTotal =
    document.getElementById("miniCartTotal");


function renderMiniCart() {

    if (!miniCartItems) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    miniCartItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        miniCartItems.innerHTML = `
            <div class="mini-cart-empty">
                <span>♡</span>

                <p>
                    Your cart is feeling a little lonely.
                </p>
            </div>
        `;

        miniCartTotal.textContent =
            "0 EGP";

        return;
    }


    let total = 0;


    cart.forEach(function(item) {

        const quantity =
            item.quantity || 1;

        total +=
            item.price * quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "mini-cart-item";


        cartItem.innerHTML = `

    <img
        src="${item.image}"
        alt="${item.name}"
    >

    <div class="mini-cart-item-info">

        <h4>
            ${item.name}
        </h4>

        <p>
            ${item.price} EGP
        </p>

        <div class="mini-cart-controls">

            <button
                type="button"
                onclick="changeMiniCartQuantity(${item.id}, -1)"
            >
                −
            </button>

            <span>
                ${quantity}
            </span>

            <button
                type="button"
                onclick="changeMiniCartQuantity(${item.id}, 1)"
            >
                +
            </button>

        </div>

        <button
            type="button"
            class="mini-cart-remove"
            onclick="removeMiniCartItem(${item.id})"
        >
            Remove
        </button>

    </div>

`;


        miniCartItems.appendChild(
            cartItem
        );

    });


    miniCartTotal.textContent =
        total + " EGP";

}


function openMiniCart() {

    if (!miniCart) {
        return;
    }

    renderMiniCart();

    miniCart.classList.add("open");

    cartOverlay.classList.add("show");

    document.body.classList.add(
        "no-scroll"
    );

}


function closeMiniCart() {

    if (!miniCart) {
        return;
    }

    miniCart.classList.remove("open");

    cartOverlay.classList.remove("show");

    document.body.classList.remove(
        "no-scroll"
    );

}


if (miniCartClose) {

    miniCartClose.addEventListener(
        "click",
        closeMiniCart
    );

}
/* =========================
   MINI CART QUANTITY
========================= */

function changeMiniCartQuantity(
    productId,
    change
) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const item =
        cart.find(function(product) {

            return Number(product.id) ===
                Number(productId);

        });


    if (!item) {
        return;
    }


    item.quantity =
        (item.quantity || 1) + change;


    /* REMOVE IF QUANTITY REACHES ZERO */

    if (item.quantity <= 0) {

        cart = cart.filter(
            function(product) {

                return Number(product.id) !==
                    Number(productId);

            }
        );

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderMiniCart();

    updateCartCount();

}


/* =========================
   REMOVE MINI CART ITEM
========================= */

function removeMiniCartItem(productId) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    cart = cart.filter(
        function(product) {

            return Number(product.id) !==
                Number(productId);

        }
    );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    renderMiniCart();

    updateCartCount();

}

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeMiniCart
    );

}