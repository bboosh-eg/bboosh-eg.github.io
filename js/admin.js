/* =========================
   ELEMENTS
========================= */

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginMessage = document.getElementById("loginMessage");

const addProductBtn = document.getElementById("addProductBtn");
const productForm = document.getElementById("productForm");
const formTitle = productForm.querySelector("h3");

const saveProductBtn = document.getElementById("saveProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");

const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");
const productCategory = document.getElementById("productCategory");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");

const productMessage = document.getElementById("productMessage");
const productsList = document.getElementById("productsList");


/* =========================
   EDIT STATE
========================= */

let editingProductId = null;

let existingImages = [];


/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    loginMessage.textContent = "Logging in...";

    const { error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {

        console.error(error);

        loginMessage.textContent =
            "Wrong email or password.";

        return;
    }

    loginMessage.textContent = "";

    showDashboard();

});


logoutBtn.addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    showLogin();

});


function showDashboard() {

    loginSection.style.display = "none";
    dashboardSection.style.display = "block";

    loadProducts();

}


function showLogin() {

    loginSection.style.display = "block";
    dashboardSection.style.display = "none";

}


/* =========================
   ADD PRODUCT BUTTON
========================= */

addProductBtn.addEventListener("click", () => {

    resetProductForm();

    productForm.style.display = "block";

    formTitle.textContent = "Add New Product";

    saveProductBtn.textContent = "Save Product";

    productName.focus();

});


/* =========================
   CANCEL
========================= */

cancelProductBtn.addEventListener("click", () => {

    resetProductForm();

    productForm.style.display = "none";

});


/* =========================
   SAVE / UPDATE PRODUCT
========================= */

saveProductBtn.addEventListener("click", async () => {

    const name =
        productName.value.trim();

    const price =
        Number(productPrice.value);

    const stock =
        Number(productStock.value);

    const category =
        productCategory.value.trim();

    const description =
        productDescription.value.trim();

    const imageFiles =
        Array.from(productImage.files);


    if (!name || price <= 0) {

        productMessage.textContent =
            "Please enter product name and price.";

        return;
    }


    saveProductBtn.disabled = true;


    let finalImages = [...existingImages];


    /*
        لو اختار صور جديدة أثناء التعديل
        هنستبدل الصور القديمة بالصور الجديدة.
    */

    if (imageFiles.length > 0) {

        productMessage.textContent =
            "Uploading images...";

        const uploadedImages =
            await uploadProductImages(imageFiles);


        if (!uploadedImages) {

            saveProductBtn.disabled = false;

            return;
        }


        finalImages =
            uploadedImages;

    }


    const productData = {

        name,
        price,
        stock: stock || 0,
        category,
        description,

        image_url:
            finalImages.length > 0
                ? finalImages[0]
                : null,

        images:
            finalImages,

        is_active: true

    };


    /*
        EDIT MODE
    */

    if (editingProductId !== null) {

        productMessage.textContent =
            "Updating product...";


        const { error } =
            await supabaseClient
                .from("products")
                .update(productData)
                .eq("id", editingProductId);


        if (error) {

            console.error(error);

            productMessage.textContent =
                "Error updating product.";

            saveProductBtn.disabled = false;

            return;
        }


        productMessage.textContent =
            "Product updated successfully ✅";

    }

    /*
        ADD MODE
    */

    else {

        productMessage.textContent =
            "Saving product...";


        const { error } =
            await supabaseClient
                .from("products")
                .insert([
                    productData
                ]);


        if (error) {

            console.error(error);

            productMessage.textContent =
                "Error saving product.";

            saveProductBtn.disabled = false;

            return;
        }


        productMessage.textContent =
            "Product added successfully ✅";

    }


    saveProductBtn.disabled = false;


    await loadProducts();


    setTimeout(() => {

        productForm.style.display =
            "none";

        resetProductForm();

    }, 600);

});


/* =========================
   UPLOAD IMAGES
========================= */

async function uploadProductImages(files) {

    const imageUrls = [];


    for (const imageFile of files) {

        const safeFileName =
            imageFile.name.replace(
                /[^a-zA-Z0-9._-]/g,
                "-"
            );


        const fileName =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}-${safeFileName}`;


        const { error: uploadError } =
            await supabaseClient.storage
                .from("product-images")
                .upload(
                    fileName,
                    imageFile
                );


        if (uploadError) {

            console.error(uploadError);

            productMessage.textContent =
                "Error uploading images.";

            return null;
        }


        const { data } =
            supabaseClient.storage
                .from("product-images")
                .getPublicUrl(fileName);


        imageUrls.push(
            data.publicUrl
        );

    }


    return imageUrls;

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    productsList.innerHTML =
        "<p>Loading products...</p>";


    const { data: products, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        productsList.innerHTML =
            `<p>
                Could not load products:
                ${error.message}
            </p>`;

        return;
    }


    productsList.innerHTML = "";


    if (!products || products.length === 0) {

        productsList.innerHTML =
            "<p>No products yet.</p>";

        return;
    }


    products.forEach(function(product) {

        const card =
            document.createElement("div");


        card.innerHTML = `

            ${
                product.image_url

                ? `
                    <img
                        src="${product.image_url}"
                        alt="${product.name}"
                    >
                `

                : ""
            }


            <strong>
                ${product.name}
            </strong>


            <p>
                Price:
                ${product.price} EGP
            </p>


            <p>
                Stock:
                ${product.stock ?? 0}
            </p>


            <p>
                Category:
                ${product.category || "-"}
            </p>


            <p>
                ${product.description || ""}
            </p>


            <button onclick="editProduct(${product.id})">
    Edit
    <p>
    Status:
    <strong>
        ${product.is_available ? "Available ✅" : "Out of Stock ❌"}
    </strong>
</p>
</button>

<button onclick="toggleAvailability(
    ${product.id},
    ${product.is_available}
)">
    ${product.is_available ? "Mark Out of Stock" : "Mark Available"}
</button>

<button onclick="deleteProduct(${product.id})">
    Delete
</button>

        `;


        productsList.appendChild(
            card
        );

    });

}


/* =========================
   EDIT PRODUCT
========================= */

async function editProduct(id) {

    const { data: product, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq("id", id)
            .single();


    if (error || !product) {

        console.error(error);

        alert(
            "Could not load product."
        );

        return;
    }


    editingProductId =
        product.id;


    existingImages =
        Array.isArray(product.images) &&
        product.images.length > 0

            ? product.images

            : product.image_url

                ? [product.image_url]

                : [];


    productName.value =
        product.name || "";


    productPrice.value =
        product.price || "";


    productStock.value =
        product.stock ?? 0;


    productCategory.value =
        product.category || "";


    productDescription.value =
        product.description || "";


    productImage.value = "";


    formTitle.textContent =
        "Edit Product";


    saveProductBtn.textContent =
        "Update Product";


    productMessage.textContent =
        existingImages.length > 0

            ? `${existingImages.length} current image(s). Choose new images only if you want to replace them.`

            : "No images currently.";


    productForm.style.display =
        "block";


    productForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmation) {

        return;

    }


    const { error } =
        await supabaseClient
            .from("products")
            .delete()
            .eq("id", id);


    if (error) {

        console.error(error);

        alert(
            "Could not delete product."
        );

        return;
    }


    await loadProducts();

}


/* =========================
   RESET FORM
========================= */

function resetProductForm() {

    editingProductId =
        null;


    existingImages =
        [];


    productName.value =
        "";


    productPrice.value =
        "";


    productStock.value =
        "";


    productCategory.value =
        "";


    productDescription.value =
        "";


    productImage.value =
        "";


    productMessage.textContent =
        "";


    formTitle.textContent =
        "Add New Product";


    saveProductBtn.textContent =
        "Save Product";

}


/* =========================
   CHECK LOGIN
========================= */

async function checkSession() {

    const { data } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        showDashboard();

    } else {

        showLogin();

    }

}


/* =========================
   START
========================= */

checkSession();
/* =========================
   IMPORT OLD PRODUCTS
========================= */

const importOldProductsBtn =
    document.getElementById("importOldProductsBtn");


importOldProductsBtn.addEventListener(
    "click",
    async function () {

        const confirmation = confirm(
            "Import all old Bboosh products into the dashboard?"
        );

        if (!confirmation) {
            return;
        }


        if (
            typeof products === "undefined" ||
            !Array.isArray(products)
        ) {

            alert(
                "Could not find the old products.js file."
            );

            return;
        }


        importOldProductsBtn.disabled = true;

        importOldProductsBtn.textContent =
            "Importing...";


        const oldProducts =
            products.map(function (item) {

                let productImages = [];


                if (
                    Array.isArray(item.images) &&
                    item.images.length > 0
                ) {

                    productImages = item.images;

                } else if (item.image) {

                    productImages = [
                        item.image
                    ];

                }


                return {

                    legacy_id: item.id,

                    name:
                        item.name || "Untitled Product",

                    price:
                        Number(item.price) || 0,

                    stock:
                        Number(item.stock) || 0,

                    category:
                        item.category || "Handmade",

                    description:
                        item.description || "",

                    image_url:
                        productImages.length > 0
                            ? productImages[0]
                            : null,

                    images:
                        productImages,

                    is_active:
                        true

                };

            });


        const { error } =
            await supabaseClient
                .from("products")
                .upsert(
                    oldProducts,
                    {
                        onConflict: "legacy_id"
                    }
                );


        if (error) {

            console.error(error);

            alert(
                "Import failed: " +
                error.message
            );

            importOldProductsBtn.disabled =
                false;

            importOldProductsBtn.textContent =
                "Import Old Products";

            return;
        }


        alert(
    oldProducts.length +
    " old products imported successfully ✅"
);

await loadProducts();

importOldProductsBtn.disabled = false;

importOldProductsBtn.textContent =
    "Old Products Imported ✓";
    }
);
async function toggleAvailability(id, currentStatus) {

    const { error } =
        await supabaseClient
            .from("products")
            .update({
                is_available: !currentStatus
            })
            .eq("id", id);

    if (error) {

        console.error(error);

        alert("Could not update product status.");

        return;
    }

    await loadProducts();
}