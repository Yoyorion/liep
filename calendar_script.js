//Générer le tableau pour l'emploi du temps
function generateTimetableRows() {
    const tableBody = document.getElementById('calendar-body');
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const startHour = 8;
    const endHour = 18;

    // Générer les heures (lignes)
    for (let hour = startHour; hour <= endHour; hour++) {
        const row = document.createElement('tr');

        // Colonne pour l'heure
        const hourCell = document.createElement('td');
        hourCell.textContent = hour + ':00'; // Affiche l'heure
        row.appendChild(hourCell);

        // Colonnes pour chaque jour
        for (let i = 0; i < days.length; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Désactivé par défaut (modifiable seulement après avoir entré le code)
            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row); // Ajouter la ligne au tableau
    }
}

// Activation de la modification avec un code spécifique
document.getElementById('code-input').addEventListener('input', function() {
    if (this.value === "codecodecode") {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false); // Rendre les champs modifiables
        this.value = ""; // Effacer le champ après l'activation
        this.placeholder = "Modification activée";
    }
});

// Générer les lignes du tableau au chargement de la page
window.onload = generateTimetableRows;