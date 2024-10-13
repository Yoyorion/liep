// agenda.js

// Récupérer les valeurs de groupe et de section depuis le localStorage
const utilisateurGroupe = localStorage.getItem('utilisateurGroupe');
const utilisateurSection = localStorage.getItem('utilisateurSection');

async function recupererEmploiDuTemps() {
    const { data, error } = await supabaseEtudiants
        .from('emploi_du_temps')
        .select('*')
        .eq('groupe', utilisateurGroupe)
        .eq('section', utilisateurSection);

    if (error) {
        console.error("Erreur lors de la récupération de l'emploi du temps :", error);
        return;
    }

    console.log("Données récupérées :", data); // Affichez les données récupérées pour diagnostiquer

    const emploiDuTempsTable = document.querySelector('#emploi-du-temps tbody');
    emploiDuTempsTable.innerHTML = '';

    const heures = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00'
    ];
    
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    heures.forEach(heure => {
        const row = document.createElement('tr');
        const heureCell = document.createElement('td');
        heureCell.textContent = heure;
        row.appendChild(heureCell);

        jours.forEach(jour => {
            const cell = document.createElement('td');
            const cours = data.find(c => c.jour === jour && c.heure_debut === heure + ':00');
            cell.textContent = cours ? cours.matiere : '';
            row.appendChild(cell);
        });
        
        emploiDuTempsTable.appendChild(row);
    });
}

recupererEmploiDuTemps();