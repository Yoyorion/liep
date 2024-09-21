// Initialisation de Supabase
const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9zZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';
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

        // Vérifier si des données existent déjà dans la base pour cette date
        const { data: existingData, error } = await supabase
            .from('homework')  // Remplace par le nom de ta table de devoirs
            .select('*')
            .eq('date', formattedDate); // Assurez-vous que 'date' correspond à votre colonne

        const row = document.createElement('tr');

        // Première colonne: la date
        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        row.appendChild(dateCell);

        // Colonnes pour chaque matière
        const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
        subjects.forEach(subject => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Les champs sont désactivés par défaut

            // Remplir les données si présentes dans la base
            if (existingData && existingData.length > 0) {
                const subjectEntry = existingData.find(entry => entry.subject === subject);
                if (subjectEntry) {
                    input.value = subjectEntry.activity; // Afficher l'activité si disponible
                }
            }

            // Attribuer des attributs pour la mise à jour
            input.setAttribute('data-date', formattedDate);
            input.setAttribute('data-subject', subject);

            // Ajouter l'écouteur pour la modification
            input.addEventListener('change', async function () {
                const newValue = input.value;

                // Enregistrer ou mettre à jour la valeur dans la base de données
                await updateHomeworkEntry(formattedDate, subject, newValue);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        });

        // Ajouter la ligne au tableau
        tableBody.appendChild(row);
    }
}

// Fonction pour mettre à jour la base de données avec les devoirs
async function updateHomeworkEntry(date, subject, activity) {
    const { data, error } = await supabase
        .from('homework')  // Remplace par le nom de ta table de devoirs
        .upsert({ date, subject, activity });  // Insérer ou mettre à jour

    if (error) {
        console.error('Erreur lors de la mise à jour des données:', error);
    } else {
        console.log('Devoirs mis à jour:', data);
    }
}

// Fonction pour permettre la modification du tableau si le bon code est entré
document.getElementById('code-input').addEventListener('input', function () {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false); // Activer les champs pour modification
        this.value = ''; // Effacer le code après validation
        this.placeholder = 'Modification activée';
    }
});

// Appeler la fonction pour générer les 31 lignes au chargement de la page
window.onload = function () {
    generateHomeworkRows();
};
