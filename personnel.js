// personnel.js

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Récupérer les valeurs de nom et de mot de passe
    const nom = document.getElementById('nom').value.trim();
    const mdp = document.getElementById('mdp').value.trim();

    console.log("Nom d'utilisateur :", nom);
    console.log("Mot de passe :", mdp);

    // Vérifier les informations d'identification dans la table 'motdepasses'
    const { data, error } = await supabaseEtudiants
        .from('motdepasses')
        .select('*')
        .eq('nom', nom)
        .eq('mdp', mdp);

    if (error) {
        console.error("Erreur lors de la vérification des informations :", error);
        alert("Erreur lors de la connexion. Veuillez réessayer.");
        return;
    }

    console.log("Données récupérées :", data);

    if (data.length > 0) {
        // Authentification réussie, redirection vers la page personnelle
        alert("Connexion réussie !");
        window.location.href = 'page_personnelle.html';
    } else {
        // Identifiant ou mot de passe incorrect
        alert("Nom ou mot de passe incorrect. Veuillez réessayer.");
    }
});