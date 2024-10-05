// Initialisation de Supabase
const supabaseUrl = 'https://shfodcxperklscksanzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZm9kY3hwZXJrbHNja3NhbnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5MzgxMTUsImV4cCI6MjQzMjYxNDExNX0.tS7bBXLfrYOXxbr_yCuwQNjAOlXPO2LAgZYCoEOVM-Y';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Variables globales pour les matières
const subjects = ['Français', 'Anglais', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];

// Fonction pour générer les lignes de devoirs avec les dates à partir d'aujourd'hui
async function generateHomeworkRows() {
    const tableBody = document.getElementById('table-body');
    const today = new Date();

    // Supprimer les anciennes lignes s'il y en a
    tableBody.innerHTML = '';

    // Boucle pour générer 31 jours
    for (let i = 0; i < 31; i++) {
        const row = document.createElement('tr');

        // Calculer la date du jour (au format YYYY-MM-DD)
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i); // Ajouter des jours à la date d'aujourd'hui
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

        // Première colonne: la date affichée au format JJ/MM
        const displayDate = ("0" + currentDate.getDate()).slice(-2) + "/" + ("0" + (currentDate.getMonth() + 1)).slice(-2);
        const dateCell = document.createElement('td');
        dateCell.textContent = displayDate;
        row.appendChild(dateCell);

        // Colonnes pour chaque matière
        for (let subject of subjects) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Les champs sont désactivés par défaut
            input.dataset.date = formattedDate; // Stocker la date réelle
            input.dataset.subject = subject; // Stocker la matière

            // Charger les données de la base pour cette date et cette matière
            const { data: homeworkData, error } = await supabase
                .from('homework')
                .select('value')
                .eq('date', formattedDate)
                .eq('subject', subject);

            if (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } else if (homeworkData && homeworkData.length > 0) {
                input.value = homeworkData[0].value;
            }

            cell.appendChild(input);
            row.appendChild(cell);
        }

        // Ajouter la ligne au tableau
        tableBody.appendChild(row);
    }
}

// Fonction pour permettre la modification du tableau si le bon code est entré
document.getElementById('code-input').addEventListener('input', function () {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false); // Activer les champs pour modification
        this.value = ''; // Effacer le code après validation
        this.placeholder = 'Modification activée';

        // Ajouter un événement pour chaque champ pour sauvegarder après modification
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                const date = input.dataset.date;
                const subject = input.dataset.subject;
                const value = input.value;
                saveHomeworkEntry(date, subject, value);
            });
        });
    }
});

// Fonction pour sauvegarder les modifications dans la base de données
async function saveHomeworkEntry(date, subject, value) {
    // Supprimer toute entrée existante pour cette date et cette matière
    const { error: deleteError } = await supabase
        .from('homework')
        .delete()
        .eq('date', date)
        .eq('subject', subject);

    if (deleteError) {
        console.error('Erreur lors de la suppression de l\'ancienne entrée:', deleteError.message);
    }

    // Insérer la nouvelle entrée
    const { data, error } = await supabase
        .from('homework')
        .insert({ date, subject, value });

    if (error) {
        console.error('Erreur lors de la sauvegarde des données:', error.message);
    }
}

// Appeler la fonction pour générer les lignes au chargement de la page
window.onload = function () {
    generateHomeworkRows();
};
