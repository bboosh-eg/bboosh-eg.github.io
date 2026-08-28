const contactSendBtn =
    document.getElementById("contactSendBtn");

contactSendBtn.addEventListener("click", function() {

    const name =
        document.getElementById("contactName").value.trim();

    const email =
        document.getElementById("contactEmail").value.trim();

    const message =
        document.getElementById("contactMessage").value.trim();


    if (!name) {
        alert("Please enter your name ♡");
        return;
    }

    if (!message) {
        alert("Please write your message ♡");
        return;
    }


    const whatsappMessage = `
Hello Bboosh 🧶♡

My name is ${name}.

${message}

Email:
${email || "Not provided"}
    `;


    const encodedMessage =
        encodeURIComponent(whatsappMessage);

    const whatsappURL =
        `https://wa.me/201503542454?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

});