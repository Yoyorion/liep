// agenda.js

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

    console.log("Données récupérées :", data);

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
        heureCell.classList.add('heure'); // Classe pour toujours afficher les heures sur mobile
        row.appendChild(heureCell);

        jours.forEach(jour => {
            const cell = document.createElement('td');
            const cours = data.find(c => c.jour === jour && c.heure_debut === heure + ':00');
            cell.textContent = cours ? cours.matiere : '';
            cell.classList.add(jour.toLowerCase()); // Ajoute une classe pour chaque jour
            row.appendChild(cell);
        });
        
        emploiDuTempsTable.appendChild(row);
    });

    afficherJourActuel();
}

// Fonction pour afficher uniquement la colonne du jour actuel sur mobile
function afficherJourActuel() {
    const jourActuel = new Date().getDay();
    let jourColonne = '';

    if (jourActuel === 6 || jourActuel === 0) { // Samedi (6) ou Dimanche (0)
        jourColonne = 'lundi';
    } else {
        const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        jourColonne = jours[jourActuel - 1];
    }

    // Cacher toutes les colonnes sauf celle du jour actuel sur mobile
    if (window.innerWidth <= 768) {
        const allDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        allDays.forEach(day => {
            const dayCells = document.querySelectorAll(`.${day}`);
            dayCells.forEach(cell => {
                cell.classList.toggle('current-day', day === jourColonne);
            });
        });
    }
}

window.addEventListener('resize', afficherJourActuel);
recupererEmploiDuTemps();
