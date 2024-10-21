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
    const emploiDuTempsHeader = document.querySelector('#emploi-du-temps thead');
    
    emploiDuTempsTable.innerHTML = '';
    emploiDuTempsHeader.innerHTML = '';

    const heures = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
        '15:00', '16:00', '17:00', '18:00', '19:00'
    ];
    
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    // Créer la ligne d'en-tête
    const headerRow = document.createElement('tr');
    const heureHeader = document.createElement('th');
    heureHeader.textContent = 'Heure';
    heureHeader.classList.add('heure');
    headerRow.appendChild(heureHeader);

    jours.forEach(jour => {
        const jourHeader = document.createElement('th');
        jourHeader.textContent = jour;
        jourHeader.dataset.jour = jour.toLowerCase();
        headerRow.appendChild(jourHeader);
    });

    emploiDuTempsHeader.appendChild(headerRow);

    // Créer les lignes du tableau
    heures.forEach(heure => {
        const row = document.createElement('tr');
        const heureCell = document.createElement('td');
        heureCell.textContent = heure;
        heureCell.classList.add('heure');
        row.appendChild(heureCell);

        jours.forEach(jour => {
            const cell = document.createElement('td');
            const cours = data.find(c => c.jour === jour && c.heure_debut === heure + ':00');
            cell.textContent = cours ? cours.matiere : '';
            cell.dataset.jour = jour.toLowerCase();
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
    
    if (window.innerWidth <= 768) { // Si l'écran est mobile
        toutesLesColonnes.forEach(cell => {
            if (cell.dataset.jour === jourColonne || cell.classList.contains('heure')) {
                cell.style.display = 'table-cell';
            } else {
                cell.style.display = 'none';
            }
        });
    } else {
        // Afficher toutes les colonnes sur les écrans plus larges
        toutesLesColonnes.forEach(cell => {
            cell.style.display = 'table-cell';
        });
    }
}

window.addEventListener('resize', afficherJourActuel);
recupererEmploiDuTemps();