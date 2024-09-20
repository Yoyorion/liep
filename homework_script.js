// Fonction pour générer les 31 lignes de devoirs avec les dates à partir d'aujourd'hui
function generateHomeworkRows() {
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
        const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
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

// Fonction pour permettre la modification du tableau si le bon code est entré
document.getElementById('code-input').addEventListener('input', function () {
    if (this.value === 'codecodecode') {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false); // Activer les champs pour modification
        this.value = ''; // Effacer le code après validation
        this.placeholder = 'Modification activée';
    }
});

// Fonction pour mettre à jour le tableau chaque jour
function updateHomeworkTable() {
    const today = new Date();
    const firstRowDate = new Date();
    firstRowDate.setDate(today.getDate() - 1); // Date du jour d'hier

    // Vérifier si la première ligne correspond à hier
    const firstRow = document.getElementById('table-body').firstChild;
    if (firstRow) {
        const dateText = firstRow.firstChild.textContent;
        const [day, month] = dateText.split('/');
        const firstRowDateFormatted = ("0" + firstRowDate.getDate()).slice(-2) + "/" + ("0" + (firstRowDate.getMonth() + 1)).slice(-2);

        // Si la première ligne correspond à la date d'hier, on la supprime et on ajoute une nouvelle ligne
        if (dateText === firstRowDateFormatted) {
            firstRow.remove();

            // Ajouter une nouvelle ligne pour le 32ème jour
            const lastRowDate = new Date();
            lastRowDate.setDate(today.getDate() + 30); // La nouvelle date sera 30 jours après aujourd'hui
            const newFormattedDate = ("0" + lastRowDate.getDate()).slice(-2) + "/" + ("0" + (lastRowDate.getMonth() + 1)).slice(-2);

            const row = document.createElement('tr');

            // Première colonne: la nouvelle date
            const dateCell = document.createElement('td');
            dateCell.textContent = newFormattedDate;
            row.appendChild(dateCell);

            // Colonnes pour les matières
            const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
            subjects.forEach(subject => {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.disabled = true; // Désactivé par défaut
                cell.appendChild(input);
                row.appendChild(cell);
            });

            // Ajouter la nouvelle ligne à la fin du tableau
            document.getElementById('table-body').appendChild(row);
        }
    }
}

// Appeler la fonction pour générer les 31 lignes au chargement de la page
window.onload = function () {
    generateHomeworkRows();
    updateHomeworkTable();
};
