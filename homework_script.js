// Initialisation de Supabase
const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Fonction pour générer les 31 lignes de devoirs avec les dates à partir d'aujourd'hui
async function generateHomeworkRows() {
    const tableBody = document.getElementById('table-body');
    const today = new Date();

    // Supprimer les anciennes lignes s'il y en a
    tableBody.innerHTML = '';

    // Boucle pour générer 31 jours
    for (let i = 0; i < 31; i++) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i); // Ajouter des jours à la date d'aujourd'hui
        const formattedDate = ("0" + currentDate.getDate()).slice(-2) + "/" + ("0" + (currentDate.getMonth() + 1)).slice(-2);

        const row = document.createElement('tr');

        // Première colonne: la date
        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        row.appendChild(dateCell);

        // Colonnes pour chaque matière
        const subjects = ['français', 'espagnol', 'littérature', 'histoire-géo', 'mathématiques', 'svt', 'physique-chimie', 'techno', 'ses', 'emc'];
        subjects.forEach(subject => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Les champs sont désactivés par défaut
            cell.appendChild(input);
            row.appendChild(cell);
        });

        // Ajouter la ligne au tableau
        tableBody.appendChild(row);
    }
}

// Fonction pour supprimer toutes les données de la base de données
async function deleteAllHomeworkEntries() {
    const { data, error } = await supabase
        .from('homework')  // Remplace par le nom de ta table de devoirs
        .delete();

    if (error) {
        console.error('Erreur lors de la suppression des données:', error);
    } else {
        console.log('Toutes les données supprimées:', data);
    }
}

// Fonction pour enregistrer le tableau dans la base de données
async function saveHomeworkEntries() {
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');

    for (const row of rows) {
        const date = row.cells[0].textContent; // La première cellule est la date
        const subjects = ['français', 'espagnol', 'littérature', 'histoire-géo', 'mathématiques', 'svt', 'physique-chimie', 'techno', 'ses', 'emc'];

        const entry = { date }; // Préparer l'entrée avec la date

        for (let i = 0; i < subjects.length; i++) {
            const input = row.cells[i + 1].querySelector('input'); // Chaque input
            const activity = input.value;

            // Ajouter la matière dans l'objet d'entrée
            entry[subjects[i]] = activity;
        }

        // Enregistrer la donnée
        const { data, error } = await supabase.from('homework').insert(entry);
        
        if (error) {
            console.error('Erreur lors de l\'enregistrement des données:', error);
        } else {
            console.log('Donnée enregistrée:', data);
        }
    }
}

// Événement pour permettre la modification du tableau si le bon code est entré
document.getElementById('code-input').addEventListener('input', function () {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false); // Activer les champs pour modification
        this.value = ''; // Effacer le code après validation
        this.placeholder = 'Modification activée';
    }
});

// Événement pour supprimer les anciennes données et enregistrer les nouvelles à l'appui de la touche Entrée
document.getElementById('code-input').addEventListener('keypress', async function (event) {
    if (event.key === 'Enter') {
        await deleteAllHomeworkEntries(); // Supprimer toutes les anciennes données
        await saveHomeworkEntries(); // Enregistrer le tableau affiché
        alert('Les données ont été mises à jour avec succès !'); // Alerte pour confirmation
    }
});

// Appeler la fonction pour générer les 31 lignes au chargement de la page
window.onload = function () {
    generateHomeworkRows();
};
