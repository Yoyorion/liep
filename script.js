// script.js

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const nom = document.getElementById('nom').value.trim();

  // Vérifie si le nom correspond à l'accès admin
  if (nom === 'Lapilapinoun.1') {
    window.location.href = 'adminbh_z_rg_yhyatgfrctcfrtfvgcfrftvgcftv___________hgfghgfvgygfvbhygfvgtfv_____________________j.html';
  } else if (nom) {
    localStorage.setItem('nomUtilisateur', nom);
    window.location.href = 'dashboard.html';
  } else {
    alert('Veuillez entrer votre nom sous le format: Prénom NOM.');
  }
});