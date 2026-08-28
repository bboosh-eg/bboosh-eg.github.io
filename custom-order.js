const pieceOptions = document.querySelectorAll(".piece-option");

let selectedPiece = "";

pieceOptions.forEach(function(option) {

    option.addEventListener("click", function() {

        pieceOptions.forEach(function(button) {
            button.classList.remove("selected");
        });

        option.classList.add("selected");

        selectedPiece = option.querySelector("span").textContent;

        console.log("Selected:", selectedPiece);
    });

});
const customImage = document.getElementById("customImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const imagePreviewContainer =
    document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");

customImage.addEventListener("change", function() {

    const file = customImage.files[0];

    if (!file) {
        return;
    }

    const imageURL = URL.createObjectURL(file);

    imagePreview.src = imageURL;

    uploadPlaceholder.style.display = "none";
    imagePreviewContainer.style.display = "flex";

});
const sendOrderBtn = document.querySelector(".send-custom-order-btn");

sendOrderBtn.addEventListener("click", function() {

    const idea = document.getElementById("customIdea").value.trim();
    const colors = document.getElementById("customColors").value.trim();
    const size = document.getElementById("customSize").value.trim();

    if (!selectedPiece) {
        alert("Please choose what you want us to make.");
        return;
    }

    if (!idea) {
        alert("Please tell us a little about your idea.");
        return;
    }

    const message = `
Hello Bboosh 🧶

I want to make a custom crochet piece.

Piece:
${selectedPiece}

My idea:
${idea}

Preferred colors:
${colors || "Not specified"}

Size / measurements:
${size || "Not specified"}

I also have an inspiration image if needed ♡
    `;

    const encodedMessage = encodeURIComponent(message);

    const whatsappNumber = "201503542454";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

});
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", function() {
    navLinks.classList.toggle("show");
});