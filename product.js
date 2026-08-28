
const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find(function(item) {
    return item.id === productId;
});

if (product) {
    document.getElementById("productName").textContent = product.name;

    document.getElementById("productPrice").textContent =
        "$" + product.price;

    document.getElementById("productDescription").textContent =
        product.description;

    document.getElementById("productImage").src =
        product.image;
}
function addToCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(function(item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(product.name + " added to cart!");
}
