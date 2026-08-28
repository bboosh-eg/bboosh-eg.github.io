const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function(product, index) {

        const item = document.createElement("div");
        item.className = "cart-item";

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div class="cart-item-info">
                <h3>${product.name}</h3>

                <p>$${product.price}</p>

                <div class="quantity-controls">
                    <button onclick="decreaseQuantity(${index})">−</button>

                    <span>${product.quantity || 1}</span>

                    <button onclick="increaseQuantity(${index})">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">
                    Remove
                </button>
            </div>
        `;

        cartItems.appendChild(item);

        total += product.price * (product.quantity || 1);
    });

    cartTotal.textContent = total;
}

function increaseQuantity(index) {
    cart[index].quantity += 1;

    saveCart();
}

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);

    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
}

renderCart();