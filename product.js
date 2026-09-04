
const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find(function(item) {
    return item.id === productId;
});

if (product) {

    document.getElementById("productName").textContent =
        product.name;

    document.getElementById("productPrice").textContent =
        product.price + " EGP";

    document.getElementById("productDescription").textContent =
        product.description;


    /* =========================
       PRODUCT GALLERY
    ========================= */

    const mainImage =
        document.getElementById("productImage");

    const thumbnailsContainer =
        document.getElementById("productThumbnails");

    const prevButton =
        document.getElementById("galleryPrev");

    const nextButton =
        document.getElementById("galleryNext");


    const productImages =
        Array.isArray(product.images) &&
        product.images.length > 0

        ? product.images

        : [product.image];


    let currentImageIndex = 0;


    function showImage(index) {

        if (index < 0) {
            index = productImages.length - 1;
        }

        if (index >= productImages.length) {
            index = 0;
        }

        currentImageIndex = index;

        mainImage.src =
            productImages[currentImageIndex];


        const thumbnails =
            document.querySelectorAll(
                ".product-thumbnail"
            );

        thumbnails.forEach(function(thumbnail, i) {

            thumbnail.classList.toggle(
                "active-thumbnail",
                i === currentImageIndex
            );

        });

    }


    /* CREATE THUMBNAILS */

    if (thumbnailsContainer) {

        thumbnailsContainer.innerHTML = "";

        productImages.forEach(function(image, index) {

            const thumbnail =
                document.createElement("img");

            thumbnail.src = image;

            thumbnail.className =
                "product-thumbnail";

            thumbnail.alt =
                product.name;

            thumbnail.addEventListener(
                "click",
                function() {

                    showImage(index);

                }
            );

            thumbnailsContainer.appendChild(
                thumbnail
            );

        });

    }


    /* ARROWS */

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function() {

                showImage(
                    currentImageIndex - 1
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function() {

                showImage(
                    currentImageIndex + 1
                );

            }
        );

    }


    /* HIDE ARROWS IF ONLY ONE IMAGE */

    if (productImages.length <= 1) {

        if (prevButton) {
            prevButton.style.display = "none";
        }

        if (nextButton) {
            nextButton.style.display = "none";
        }

    }


    showImage(0);
/* =========================
   MOBILE GALLERY SWIPE
========================= */

const swipeArea =
    document.querySelector(".main-product-image");

let touchStartX = 0;
let touchEndX = 0;


swipeArea.addEventListener(
    "touchstart",
    function(event) {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


swipeArea.addEventListener(
    "touchend",
    function(event) {

        touchEndX =
            event.changedTouches[0].screenX;

        handleGallerySwipe();

    },
    { passive: true }
);


function handleGallerySwipe() {

    const swipeDistance =
        touchEndX - touchStartX;

    /* تجاهل الحركات الصغيرة */
    if (Math.abs(swipeDistance) < 50) {
        return;
    }


    /* Swipe Left = Next Image */

    if (swipeDistance < 0) {

        showImage(
            currentImageIndex + 1
        );

    }


    /* Swipe Right = Previous Image */

    if (swipeDistance > 0) {

        showImage(
            currentImageIndex - 1
        );

    }

}
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

    if (typeof updateCartCount === "function") {
    updateCartCount();
}

if (typeof openMiniCart === "function") {
    openMiniCart();
}

}
/* =========================
   PRODUCT IMAGE LIGHTBOX
========================= */

const productLightbox =
    document.getElementById("productLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxClose =
    document.getElementById("lightboxClose");

const productMainImage =
    document.getElementById("productImage");


productMainImage.addEventListener("click", function() {

    lightboxImage.src = productMainImage.src;

    productLightbox.classList.add("show");

    document.body.classList.add("no-scroll");

});


function closeLightbox() {

    productLightbox.classList.remove("show");

    document.body.classList.remove("no-scroll");

}


lightboxClose.addEventListener(
    "click",
    closeLightbox
);


productLightbox.addEventListener(
    "click",
    function(event) {

        if (event.target === productLightbox) {
            closeLightbox();
        }

    }
);


/* ESC KEY */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeLightbox();
        }

    }
);
