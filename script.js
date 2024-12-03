// Initialisation d'EmailJS avec votre Public Key
(function () {
    emailjs.init("Zeu-CP-x1t8m9EvEE"); // Remplacez par votre clé publique EmailJS
})();

document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupération des données du formulaire
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Vérification des champs obligatoires
    if (!name || !email || !message) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // Création des paramètres pour le template
    const templateParams = {
        user_name: name,       // Nom de l'utilisateur
        user_email: email,     // Email de l'utilisateur
        user_message: message, // Message de l'utilisateur
    };

    // Envoi de l'email via EmailJS
    emailjs
        .send("service_0wqtics", "template_aysriws", templateParams)
        .then(
            function (response) {
                console.log("SUCCESS!", response.status, response.text);
                alert("Votre message a été envoyé avec succès !");
                document.getElementById("contact-form").reset(); // Réinitialise le formulaire
            },
            function (error) {
                console.error("Erreur complète :", error);
                alert(`Une erreur s'est produite : Code ${error.status}, Message : ${error.text}`);
            }
        );
});
