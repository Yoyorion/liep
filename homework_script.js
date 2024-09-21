// Initialisation de Supabase
const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Test de connexion à Supabase
async function testSupabaseConnection() {
    const { data, error } = await supabase
        .from('homework')
        .select('*')
        .limit(1); // Juste pour vérifier la connexion

    if (error) {
        console.error('Erreur de connexion à Supabase:', error);
    } else {
        console.log('Connexion à Supabase réussie:', data);
    }
}

// Test de la connexion
testSupabaseConnection();

// Variables globales pour les matières
const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];

// Fonction pour générer les 31 lignes de devoirs avec les dates à partir d'aujourd'hui
async function generateHomeworkRows() {
    const tableBody = document.getElementById('table-body');
    const today = new Date();

    // Supprimer les anciennes lignes s'il y en a
    tableBody.innerHTML = '';

    // Boucle pour générer 31 jours
    for (let i = 0; i < 31; i++) {
        const row = document.createElement('tr');

        // Calculer la date du jour (au format JJ/MM)
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i); // Ajouter des jours à la date d'aujourd'hui
        const formattedDate = ("0" + currentDate.getDate()).slice(-2) + "/" + ("0" + (currentDate.getMonth() + 1)).slice(-2);

        // Première colonne: la date
        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        row.appendChild(dateCell);

        // Colonnes pour chaque matière
        for (let j = 0; j < subjects.length; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Les champs sont désactivés par défaut
            input.dataset.day = i; // Stocker le numéro du jour
            input.dataset.subject = subjects[j]; // Stocker la matière

            // Charger les données de la base pour ce jour et cette matière
            const { data: homeworkData, error } = await supabase
                .from('homework')
                .select('value')
                .eq('day', i)
                .eq('subject', subjects[j]);

            if (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } else if (homeworkData.length > 0) {
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
    }
});

// Fonction pour sauvegarder les modifications dans la base de données
async function saveHomeworkEntry(day, subject, value) {
    console.log(`Sauvegarde de la donnée - Jour : ${day}, Matière : ${subject}, Valeur : ${value}`);
    
    const { data, error } = await supabase
        .from('homework')
        .upsert({ day, subject, value });

    if (error) {
        console.error('Erreur lors de la sauvegarde des données:', error);
    } else {
        console.log('Donnée sauvegardée avec succès:', data);
    }
}

// Fonction pour supprimer une ligne (jour)
async function deleteHomeworkRow(day) {
    const { data, error } = await supabase
        .from('homework')
        .delete()
        .eq('day', day);

    if (error) {
        console.error('Erreur lors de la suppression des données:', error);
    }
}

// Fonction pour mettre à jour le tableau chaque jour
async function updateHomeworkTable() {
    const today = new Date();

    // Vérifier si la première ligne correspond à hier
    const firstRowDate = new Date();
    firstRowDate.setDate(today.getDate() - 1); // Date du jour d'hier
    const firstRow = document.getElementById('table-body').firstChild;

    if (firstRow) {
        const dateText = firstRow.firstChild.textContent;
        const [day, month] = dateText.split('/');
        const firstRowDateFormatted = ("0" + firstRowDate.getDate()).slice(-2) + "/" + ("0" + (firstRowDate.getMonth() + 1)).slice(-2);

        // Si la première ligne correspond à la date d'hier, on la supprime et on ajoute une nouvelle ligne
        if (dateText === firstRowDateFormatted) {
            // Supprimer les données associées au jour
            await deleteHomeworkRow(0);

            // Faire monter les valeurs d'un cran
            for (let i = 1; i < 31; i++) {
                for (let j = 0; j < subjects.length; j++) {
                    const oldDay = i - 1;
                    const newDay = i;
                    const input = document.querySelector(`input[data-day="${newDay}"][data-subject="${subjects[j]}"]`);
                    const value = input ? input.value : '';

                    // Sauvegarder les nouvelles données dans la base
                    await saveHomeworkEntry(oldDay, subjects[j], value);
                }
            }

            firstRow.remove(); // Supprimer la première ligne du tableau

            // Ajouter une nouvelle ligne pour le 32ème jour (vide)
            const lastRowDate = new Date();
            lastRowDate.setDate(today.getDate() + 30); // La nouvelle date sera 30 jours après aujourd'hui
            const newFormattedDate = ("0" + lastRowDate.getDate()).slice(-2) + "/" + ("0" + (lastRowDate.getMonth() + 1)).slice(-2);

            const row = document.createElement('tr');
            const dateCell = document.createElement('td');
            dateCell.textContent = newFormattedDate;
            row.appendChild(dateCell);

            subjects.forEach(subject => {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.disabled = true; // Désactivé par défaut
                input.dataset.day = 30; // Dernière ligne
                input.dataset.subject = subject;
                cell.appendChild(input);
                row.appendChild(cell);
            });

            document.getElementById('table-body').appendChild(row);
        }
    }
}

// Appeler la fonction pour générer les 31 lignes au chargement de la page
window.onload = function () {
    generateHomeworkRows();
    updateHomeworkTable();
};
