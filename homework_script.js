// Initialisation de Supabase
const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Récupérer les devoirs depuis la base de données
async function fetchHomework() {
    const { data, error } = await supabase
        .from('homework')  // Assurez-vous que la table s'appelle bien "homework" dans Supabase
        .select('*');

    if (error) {
        console.error('Erreur lors de la récupération des devoirs :', error);
    } else {
        populateHomework(data);  // Remplir le tableau avec les données
    }
}

// Remplir le tableau avec les données
function populateHomework(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';  // Effacer le contenu précédent

    // Générer les lignes du tableau
    data.forEach((entry) => {
        const row = document.createElement('tr');

        // Créer une cellule pour chaque matière
        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date || '';  // La date du devoir
        row.appendChild(dateCell);

        const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
        subjects.forEach(subject => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.value = entry[subject.toLowerCase()] || '';  // Récupérer la valeur de la matière
            input.disabled = true;  // Désactiver par défaut
            input.setAttribute('data-subject', subject.toLowerCase());
            input.setAttribute('data-date', entry.date);
            cell.appendChild(input);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Activer la modification du tableau après entrée du code
document.getElementById('code-input').addEventListener('input', function () {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false);  // Activer les champs de texte
        this.value = '';  // Effacer le champ après validation
        this.placeholder = 'Modification activée';

        // Ajouter un listener pour enregistrer les modifications dans la base de données
        inputs.forEach(input => {
            input.addEventListener('change', async function () {
                const date = input.getAttribute('data-date');
                const subject = input.getAttribute('data-subject');
                const newValue = input.value;

                // Mettre à jour la base de données avec la nouvelle valeur
                await updateHomework(date, subject, newValue);
            });
        });
    }
});

// Fonction pour mettre à jour les devoirs dans la base de données
async function updateHomework(date, subject, newValue) {
    const { data, error } = await supabase
        .from('homework')
        .update({ [subject]: newValue })  // Mise à jour de la matière modifiée
        .eq('date', date);  // Mise à jour basée sur la date

    if (error) {
        console.error('Erreur lors de la mise à jour des devoirs :', error);
    } else {
        console.log('Devoirs mis à jour avec succès :', data);
    }
}

// Charger les devoirs lorsque la page est chargée
window.onload = fetchHomework;
