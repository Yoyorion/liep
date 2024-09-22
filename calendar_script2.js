// Initialisation de Supabase
const supabaseUrl = 'https://znwzdkgshtrickigthgd.supabase.co';  // Remplace par ton URL Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3pka2dzaHRyaWNraWd0aGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MjQyMzcsImV4cCI6MjA0MjQwMDIzN30.qGSSUfV7qjC0PUL3t_XVR3dXg6s5kRg0zwtQ2J1Gd5M';  // Remplace par ton anonpublic key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
const startHour = 8;
const endHour = 18;

// Détection du mobile (utilisation de media queries)
const isMobile = window.matchMedia("(max-width: 768px)").matches;

// Fonction pour récupérer et afficher l'emploi du temps depuis la base de données
async function fetchTimetable() {
    const { data, error } = await supabase
        .from('timetable')  // Nom de ta table dans Supabase
        .select('*');  // Récupérer toutes les colonnes

    if (error) {
        console.error('Erreur lors de la récupération des données:', error);
    } else {
        populateTimetable(data);  // Remplir le tableau avec les données récupérées
    }
}

// Fonction pour remplir le tableau avec les données
function populateTimetable(data) {
    const tableBody = document.getElementById('calendar-body');
    tableBody.innerHTML = '';  // Effacer tout contenu précédent

    let currentDay = new Date().getDay(); // Obtenir le jour actuel (0 = dimanche, 1 = lundi, etc.)

    // Si c'est le week-end (samedi = 6, dimanche = 0), on affiche le lundi
    if (currentDay === 0 || currentDay === 6) {
        currentDay = 1; // Forcer à afficher lundi
    }

    // Ajuster l'affichage pour le mobile
    if (isMobile) {
        // Convertir le jour actuel en index (0 pour lundi, etc.)
        const displayDay = currentDay - 1;  // currentDay (1 pour lundi) doit correspondre à l'index 0 du tableau

        // Générer uniquement pour le jour actuel sur mobile
        generateSingleDayTimetable(displayDay, data);
    } else {
        // Générer les heures (lignes) et tous les jours (colonnes) pour ordinateur
        generateFullTimetable(data);
    }
}

// Fonction pour générer l'emploi du temps uniquement pour le jour actuel sur mobile (en affichant le jour dans l'en-tête)
function generateSingleDayTimetable(dayIndex, data) {
    const tableHead = document.querySelector('thead');
    const tableBody = document.getElementById('calendar-body');
    const dayName = days[dayIndex]; // Obtenir le nom du jour (ex : 'lundi')

    // Effacer tout contenu de l'en-tête précédent
    tableHead.innerHTML = '';

    // Générer l'en-tête avec le nom du jour actuel
    const headerRow = document.createElement('tr');
    
    // Créer la cellule d'en-tête du jour actuel
    const dayHeaderCell = document.createElement('th');
    dayHeaderCell.textContent = dayName.charAt(0).toUpperCase() + dayName.slice(1); // Afficher le jour avec majuscule
    headerRow.appendChild(dayHeaderCell);

    // Ajouter la ligne d'en-tête au tableau
    tableHead.appendChild(headerRow);

    // Générer les lignes pour chaque heure du jour en cours (sans afficher la colonne des heures)
    for (let hour = startHour; hour <= endHour; hour++) {
        const row = document.createElement('tr');

        // Ajouter la colonne unique pour le jour en cours
        const cell = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = '';  // Initialement vide

        // Remplir les données si présentes dans la base pour ce jour
        const entry = data.find(entry => entry.hour === hour && entry.day === dayName);
        if (entry && entry.activity) {
            input.value = entry.activity;  // Afficher l'activité si disponible
        }

        input.disabled = true;  // Désactivé par défaut
        input.setAttribute('data-hour', hour);
        input.setAttribute('data-day', dayName);

        cell.appendChild(input);
        row.appendChild(cell);

        tableBody.appendChild(row);
    }
}

// Fonction pour générer le tableau complet sur ordinateur
function generateFullTimetable(data) {
    const tableHead = document.querySelector('thead');
    const tableBody = document.getElementById('calendar-body');

    // Effacer tout contenu précédent
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Générer l'en-tête des jours
    const headerRow = document.createElement('tr');

    // En-tête des heures
    const hourHeaderCell = document.createElement('th');
    hourHeaderCell.textContent = 'Heure';
    headerRow.appendChild(hourHeaderCell);

    // En-tête des jours
    days.forEach(day => {
        const dayHeaderCell = document.createElement('th');
        dayHeaderCell.textContent = day.charAt(0).toUpperCase() + day.slice(1); // Afficher le jour avec majuscule
        headerRow.appendChild(dayHeaderCell);
    });

    tableHead.appendChild(headerRow);

    // Générer les lignes pour chaque heure et jour
    for (let hour = startHour; hour <= endHour; hour++) {
        const row = document.createElement('tr');
        
        // Ajouter la colonne des heures
        const hourCell = document.createElement('td');
        hourCell.textContent = `${hour}:00`;
        row.appendChild(hourCell);

        // Ajouter les colonnes pour chaque jour
        for (const day of days) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = '';  // Initialement vide

            // Remplir les données si présentes dans la base
            const entry = data.find(entry => entry.hour === hour && entry.day === day);
            if (entry && entry.activity) {
                input.value = entry.activity;  // Afficher l'activité si disponible
            }

            input.disabled = true;  // Désactivé par défaut
            input.setAttribute('data-hour', hour);
            input.setAttribute('data-day', day);

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

// Activer la modification du tableau si le bon code est entré
document.getElementById('code-input').addEventListener('input', function() {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false);  // Activer les champs
        this.value = '';  // Effacer le champ après validation
        this.placeholder = 'Modification activée';

        // Ajouter un listener pour chaque input modifiable
        inputs.forEach(input => {
            input.addEventListener('change', async function() {
                const hour = input.getAttribute('data-hour');
                const day = input.getAttribute('data-day');
                const newValue = input.value;

                // Enregistrer la modification dans la base de données
                await updateTimetable(hour, day, newValue);
            });
        });
    }
});

// Fonction pour mettre à jour la base de données avec les modifications
async function updateTimetable(hour, day, activity) {
    try {
        // Supprimer l'entrée existante avec le même hour et day
        const { error: deleteError } = await supabase
            .from('timetable')
            .delete()
            .eq('hour', hour)
            .eq('day', day);

        if (deleteError) {
            throw deleteError;
        }

        // Insérer la nouvelle entrée avec hour, day et activity
        const { data, error: insertError } = await supabase
            .from('timetable')
            .insert({ hour, day, activity });

        if (insertError) {
            throw insertError;
        }

        console.log('Données mises à jour:', data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données:', error);
    }
}

// Appeler la fonction pour charger l'emploi du temps lors du chargement de la page
fetchTimetable();
