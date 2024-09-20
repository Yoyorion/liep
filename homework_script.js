// Initialisation de Supabase
const { createClient } = supabase;
const supabaseUrl = 'https://znwzdkgshtrickigthgd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3pka2dzaHRyaWNraWd0aGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MjQyMzcsImV4cCI6MjA0MjQwMDIzN30.qGSSUfV7qjC0PUL3t_XVR3dXg6s5kRg0zwtQ2J1Gd5M';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour générer les dates du jour jusqu'à la fin du mois
function generateDatesUntilEndOfMonth() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const dates = [];

    let currentDate = new Date(today);

    // Générer les dates jusqu'à la fin du mois
    while (currentDate <= lastDayOfMonth) {
        const formattedDate = currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

// Fonction pour générer les lignes du tableau avec les matières
async function generateTableRows() {
    const tableBody = document.getElementById('table-body');
    const dates = generateDatesUntilEndOfMonth();

    // Récupérer les données depuis Supabase
    const { data: homework, error } = await supabase
        .from('homework')
        .select('*');

    if (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return;
    }

    dates.forEach((date, dateIndex) => {
        const row = document.createElement('tr');

        // Création de la cellule pour la date
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        row.appendChild(dateCell);

        // Création des cellules pour chaque matière
        const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
        subjects.forEach((subject, subjectIndex) => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Désactivé par défaut

            // Charger les données depuis Supabase si disponibles
            const homeworkEntry = homework.find(entry => entry.date_index === dateIndex && entry.subject_index === subjectIndex);
            if (homeworkEntry) {
                input.value = homeworkEntry.homework;
            }

            // Sauvegarder dans Supabase lorsqu'une valeur est modifiée
            input.addEventListener('change', async function () {
                await saveToDatabase(dateIndex, subjectIndex, input.value);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Fonction pour sauvegarder les données dans Supabase
async function saveToDatabase(dateIndex, subjectIndex, homework) {
    const { data, error } = await supabase
        .from('homework')
        .upsert({ date_index: dateIndex, subject_index: subjectIndex, homework });

    if (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
    } else {
        console.log('Données sauvegardées avec succès');
    }
}

// Activation de la modification avec un code spécifique
document.getElementById('code-input').addEventListener('input', function() {
    if (this.value === "codecodecode") {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false);
        this.value = ""; // Effacer le champ après l'activation
        this.placeholder = "Modification activée";
    }
});

// Générer les lignes du tableau au chargement de la page
window.onload = generateTableRows;
