
const params =
    new URLSearchParams(window.location.search);

const productId =
    Number(params.get("id"));

let product = null;


/* =========================
   LOAD PRODUCT FROM SUPABASE
========================= */

async function loadProduct() {

    // First: try current Supabase ID
    let { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("id", productId)
            .eq("is_active", true)
            .maybeSingle();


    // If not found, try the old products.js ID
    if (!data) {

        const legacyResult =
            await supabaseClient
                .from("products")
                .select("*")
                .eq("legacy_id", productId)
                .eq("is_active", true)
                .maybeSingle();

        data = legacyResult.data;
        error = legacyResult.error;
    }


    if (error || !data) {

        console.error(error);

        document.getElementById(
            "productName"
        ).textContent =
            "Product not found";

        return;
    }


    product = {
        ...data,

        image: data.image_url,

        images:
            Array.isArray(data.images) &&
            data.images.length > 0

                ? data.images

                : data.image_url
                    ? [data.image_url]
                    : []
    };


    displayProduct();
}


/* =========================
   DISPLAY PRODUCT
========================= */

function displayProduct() {

    document.getElementById(
        "productName"
    ).textContent =
        product.name;


    document.getElementById(
        "productPrice"
    ).textContent =
        product.price + " EGP";


    document.getElementById(
        "productDescription"
    ).textContent =
        product.description || "";

        const addCartBtn =
    document.getElementById("addCartBtn");

if (addCartBtn) {

    if (
        product.is_available === false ||
        product.stock <= 0
    ) {

        addCartBtn.textContent =
            "Out of Stock";

        addCartBtn.disabled = true;

        addCartBtn.classList.add(
            "out-of-stock"
        );

    } else {

        addCartBtn.textContent =
            "Add to Cart ♡";

        addCartBtn.disabled = false;

        addCartBtn.classList.remove(
            "out-of-stock"
        );

    }

}

    setupGallery();
}


/* =========================
   PRODUCT GALLERY
========================= */

function setupGallery() {

    const mainImage =
        document.getElementById(
            "productImage"
        );

    const thumbnailsContainer =
        document.getElementById(
            "productThumbnails"
        );

    const prevButton =
        document.getElementById(
            "galleryPrev"
        );

    const nextButton =
        document.getElementById(
            "galleryNext"
        );


    const productImages =
        Array.isArray(product.images) &&
        product.images.length > 0

            ? product.images

            : product.image
                ? [product.image]
                : [];


    let currentImageIndex = 0;


    function showImage(index) {

        if (productImages.length === 0) {
            return;
        }


        if (index < 0) {

            index =
                productImages.length - 1;

        }


        if (
            index >=
            productImages.length
        ) {

            index = 0;

        }


        currentImageIndex = index;


        mainImage.src =
            productImages[
                currentImageIndex
            ];


        const thumbnails =
            document.querySelectorAll(
                ".product-thumbnail"
            );


        thumbnails.forEach(
            function(thumbnail, i) {

                thumbnail.classList.toggle(
                    "active-thumbnail",
                    i === currentImageIndex
                );

            }
        );

    }


    /* =========================
       CREATE THUMBNAILS
    ========================= */

    if (thumbnailsContainer) {

        thumbnailsContainer.innerHTML =
            "";


        productImages.forEach(
            function(image, index) {

                const thumbnail =
                    document.createElement(
                        "img"
                    );


                thumbnail.src =
                    image;


                thumbnail.className =
                    "product-thumbnail";


                thumbnail.alt =
                    product.name;


                thumbnail.addEventListener(
                    "click",
                    function() {

                        showImage(
                            index
                        );

                    }
                );


                thumbnailsContainer.appendChild(
                    thumbnail
                );

            }
        );

    }


    /* =========================
       GALLERY ARROWS
    ========================= */

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


    /* =========================
       HIDE ARROWS
    ========================= */

    if (
        productImages.length <= 1
    ) {

        if (prevButton) {

            prevButton.style.display =
                "none";

        }


        if (nextButton) {

            nextButton.style.display =
                "none";

        }

    }


    if (
        productImages.length > 0
    ) {

        showImage(0);

    }


    /* =========================
       MOBILE SWIPE
    ========================= */

    const swipeArea =
        document.querySelector(
            ".main-product-image"
        );


    if (swipeArea) {

        let touchStartX = 0;
        let touchEndX = 0;


        swipeArea.addEventListener(
            "touchstart",
            function(event) {

                touchStartX =
                    event
                        .changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        swipeArea.addEventListener(
            "touchend",
            function(event) {

                touchEndX =
                    event
                        .changedTouches[0]
                        .screenX;


                const swipeDistance =
                    touchEndX -
                    touchStartX;


                if (
                    Math.abs(
                        swipeDistance
                    ) < 50
                ) {

                    return;

                }


                if (
                    swipeDistance < 0
                ) {

                    showImage(
                        currentImageIndex + 1
                    );

                }


                if (
                    swipeDistance > 0
                ) {

                    showImage(
                        currentImageIndex - 1
                    );

                }

            },
            {
                passive: true
            }
        );

    }

}

/* =========================
   ADD TO CART
========================= */

function addToCart() {

    if (!product) {
        return;
    }

    if (
        product.is_available === false ||
        product.stock <= 0
    ) {

        alert(
            "This product is currently out of stock."
        );

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const existingProduct =
        cart.find(function(item) {

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


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    if (
        typeof updateCartCount === "function"
    ) {

        updateCartCount();

    }


    if (
        typeof openMiniCart === "function"
    ) {

        openMiniCart();

    }

}
/* =========================
   IMAGE LIGHTBOX
========================= */

const productLightbox =
    document.getElementById(
        "productLightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const lightboxClose =
    document.getElementById(
        "lightboxClose"
    );

const productMainImage =
    document.getElementById(
        "productImage"
    );


if (
    productMainImage &&
    productLightbox &&
    lightboxImage
) {

    productMainImage.addEventListener(
        "click",
        function() {

            lightboxImage.src =
                productMainImage.src;


            productLightbox.classList.add(
                "show"
            );


            document.body.classList.add(
                "no-scroll"
            );

        }
    );

}


function closeLightbox() {

    if (!productLightbox) {
        return;
    }


    productLightbox.classList.remove(
        "show"
    );


    document.body.classList.remove(
        "no-scroll"
    );

}


if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if (productLightbox) {

    productLightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                productLightbox
            ) {

                closeLightbox();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeLightbox();

        }

    }
);


/* =========================
   START
========================= */

loadProduct();