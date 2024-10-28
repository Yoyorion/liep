// dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
  const nom = localStorage.getItem('nomUtilisateur');
  if (!nom) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('welcome-message').textContent = `Bienvenue, ${nom}`;
    try {
      const { data, error } = await supabaseEtudiants
        .from('etudiants')
        .select('*')
        .eq('nom', nom);

      if (error) {
        console.error("Erreur lors de la récupération des données :", error);
        alert('Une erreur est survenue lors de la récupération des données.');
      } else if (data.length > 0) {
        const etudiant = data[0];
        document.getElementById('user-info').innerHTML = `
          <p><strong>Nom :</strong> ${etudiant.nom}</p>
          <p><strong>Groupe :</strong> ${etudiant.groupe}</p>
          <p><strong>Section :</strong> ${etudiant.section}</p>
        `;

        // Stocker le groupe et la section dans le localStorage pour les utiliser dans agenda.js
        localStorage.setItem('utilisateurGroupe', etudiant.groupe);
        localStorage.setItem('utilisateurSection', etudiant.section);
      } else {
        alert('Étudiant non trouvé.');
        window.location.href = 'index.html';
      }
    } catch (err) {
      console.error(err);
    }
  }
});