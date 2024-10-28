// annonces.js

async function recupererAnnonces() {
    const { data, error } = await supabaseEtudiants
      .from('annonces')
      .select('*')
      .order('date', { ascending: true });
  
    if (error) {
      console.error("Erreur lors de la récupération des annonces :", error);
      return;
    }
  
    const annoncesContainer = document.getElementById('annonces-container');
    annoncesContainer.innerHTML = '';
  
    data.forEach(annonce => {
      const annonceElement = document.createElement('div');
      annonceElement.classList.add('annonce');
  
      const dateElement = document.createElement('p');
      dateElement.classList.add('date');
      dateElement.textContent = `Date : ${annonce.date}`;
  
      const infosElement = document.createElement('p');
      infosElement.classList.add('infos');
      infosElement.textContent = annonce.infos;
  
      annonceElement.appendChild(dateElement);
      annonceElement.appendChild(infosElement);
  
      annoncesContainer.appendChild(annonceElement);
    });
  }
  
  document.addEventListener('DOMContentLoaded', recupererAnnonces);