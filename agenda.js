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
        heureCell.classList.add('heure'); // Colonne des heures, toujours visible
        row.appendChild(heureCell);

        jours.forEach(jour => {
            const cell = document.createElement('td');
            const cours = data.find(c => c.jour === jour && c.heure_debut === heure + ':00');
            cell.textContent = cours ? cours.matiere : '';
            cell.dataset.jour = jour.toLowerCase(); // Marquer chaque cellule avec un attribut data-jour
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

    const toutesLesColonnes = document.querySelectorAll('td[data-jour], th[data-jour]');
    
    if (window.innerWidth <= 768) { // Si la largeur est mobile
        toutesLesColonnes.forEach(cell => {
            if (cell.dataset.jour === jourColonne) {
                cell.style.display = 'table-cell';
            } else {
                cell.style.display = 'none';
            }
        });

        // Masquer les en-têtes autres que les heures et le jour actuel
        const toutesLesEntetes = document.querySelectorAll('th');
        toutesLesEntetes.forEach(header => {
            if (header.classList.contains(jourColonne) || header.classList.contains('heure')) {
                header.style.display = 'table-cell';
            } else {
                header.style.display = 'none';
            }
        });

    } else {
        // Si l'écran est plus large, afficher toutes les colonnes
        toutesLesColonnes.forEach(cell => {
            cell.style.display = 'table-cell';
        });
    }
}

window.addEventListener('resize', afficherJourActuel);
recupererEmploiDuTemps();
