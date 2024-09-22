// Initialisation de Supabase
const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Variables globales pour les matières
const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];

// Détection du mobile
const isMobile = window.matchMedia("(max-width: 768px)").matches;
let selectedSubject = subjects[0];  // Matière sélectionnée par défaut (Français)

// Fonction pour générer les lignes de devoirs en fonction de la matière sélectionnée
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
        currentDate.setDate(today.getDate() + i);
        const formattedDate = ("0" + currentDate.getDate()).slice(-2) + "/" + ("0" + (currentDate.getMonth() + 1)).slice(-2);

        // Première colonne: la date
        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        row.appendChild(dateCell);

        if (isMobile) {
            // Si mobile, afficher uniquement une colonne pour la matière sélectionnée
            const subjectCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true;
            input.dataset.day = i;
            input.dataset.subject = selectedSubject;

            // Charger les données de la base pour ce jour et cette matière
            const { data: homeworkData, error } = await supabase
                .from('homework')
                .select('value')
                .eq('day', i)
                .eq('subject', selectedSubject);

            if (error) {
                console.error('Erreur lors de la récupération des données:', error);
            } else if (homeworkData && homeworkData.length > 0) {
                input.value = homeworkData[0].value;
            }

            subjectCell.appendChild(input);
            row.appendChild(subjectCell);
        } else {
            // Sinon afficher toutes les matières
            subjects.forEach(subject => {
                const subjectCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.disabled = true;
                input.dataset.day = i;
                input.dataset.subject = subject;

                // Charger les données de la base pour ce jour et cette matière
                const { data: homeworkData, error } = await supabase
                    .from('homework')
                    .select('value')
                    .eq('day', i)
                    .eq('subject', subject);

                if (error) {
                    console.error('Erreur lors de la récupération des données:', error);
                } else if (homeworkData && homeworkData.length > 0) {
                    input.value = homeworkData[0].value;
                }

                subjectCell.appendChild(input);
                row.appendChild(subjectCell);
            });
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
                const day = input.dataset.day;
                const subject = input.dataset.subject;
                const value = input.value;
                saveHomeworkEntry(day, subject, value);
            });
        });
    }
});

// Fonction pour sauvegarder les modifications dans la base de données
async function saveHomeworkEntry(day, subject, value) {
    console.log(`Tentative de sauvegarde - Jour : ${day}, Matière : ${subject}, Valeur : ${value}`);

    // Supprimer toute entrée existante pour ce jour et cette matière
    const { error: deleteError } = await supabase
        .from('homework')
        .delete()
        .eq('day', day)
        .eq('subject', subject);

    if (deleteError) {
        console.error('Erreur lors de la suppression de l\'ancienne entrée:', deleteError.message);
    }

    // Insérer la nouvelle entrée
    const { data, error } = await supabase
        .from('homework')
        .insert({ day, subject, value });

    if (error) {
        console.error('Erreur lors de la sauvegarde des données:', error.message);
    } else {
        console.log('Donnée sauvegardée avec succès:', data);
    }
}

// Ajoute un écouteur pour détecter le changement de matière dans le menu déroulant
document.getElementById('subject-select').addEventListener('change', function () {
    selectedSubject = this.value;  // Mettre à jour la matière sélectionnée
    generateHomeworkRows();  // Recharger le tableau avec la nouvelle matière
});

// Fonction pour initialiser la page
window.onload = function () {
    generateHomeworkRows();  // Affiche toutes les matières sur ordinateur et sélectionne la première sur mobile
};
