// Initialisation de Supabase
const supabaseUrl = 'https://znwzdkgshtrickigthgd.supabase.co';  // URL Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3pka2dzaHRyaWNraWd0aGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MjQyMzcsImV4cCI6MjA0MjQwMDIzN30.qGSSUfV7qjC0PUL3t_XVR3dXg6s5kRg0zwtQ2J1Gd5M';  // Clé Anon publique
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour générer les lignes du tableau pour l'emploi du temps
async function generateTimetableRows() {
    const tableBody = document.getElementById('calendar-body');
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const startHour = 8;
    const endHour = 18;

    // Récupérer les données depuis Supabase
    const { data: timetable, error } = await supabase
        .from('timetable') // Nom de la table dans Supabase
        .select('*');

    if (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return;
    }

    // Générer les heures (lignes)
    for (let hour = startHour; hour <= endHour; hour++) {
        const row = document.createElement('tr');

        // Colonne pour l'heure
        const hourCell = document.createElement('td');
        hourCell.textContent = hour + ':00';  // Affiche l'heure
        row.appendChild(hourCell);

        // Colonnes pour chaque jour
        for (let i = 0; i < days.length; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true;  // Désactivé par défaut (modifiable après le code)

            // Charger les données depuis Supabase si disponibles
            const timetableEntry = timetable.find(entry => entry.hour === hour && entry.day_index === i);
            if (timetableEntry) {
                input.value = timetableEntry.subject;  // Charger la matière
            } else {
                input.value = '';  // Laisser la case vide si aucune donnée
            }

            // Sauvegarder dans Supabase lorsqu'une valeur est modifiée
            input.addEventListener('change', async function () {
                await saveToDatabase(hour, i, input.value);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);  // Ajouter la ligne au tableau
    }
}

// Fonction pour sauvegarder les données dans Supabase
async function saveToDatabase(hour, dayIndex, subject) {
    const { data, error } = await supabase
        .from('timetable')  // Nom de la table dans Supabase
        .upsert({ hour, day_index: dayIndex, subject });

    if (error) {
        console.error('Erreur lors de la sauvegarde des données :', error);
    } else {
        console.log('Données sauvegardées avec succès pour', hour, 'h', dayIndex);
    }
}

// Activation de la modification avec un code spécifique
document.getElementById('code-input').addEventListener('input', function() {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false);  // Rendre les champs modifiables
        this.value = '';  // Effacer le champ après l'activation
        this.placeholder = 'Modification activée';
        console.log('Modification activée');
    }
});

// Générer les lignes du tableau au chargement de la page
window.onload = generateTimetableRows;
