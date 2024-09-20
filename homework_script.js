// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAeYwgSXpUJXdq5nL8bmANj5w4gJr03Aj8",
    authDomain: "nd5-2dc24.firebaseapp.com",
    projectId: "nd5-2dc24",
    storageBucket: "nd5-2dc24.appspot.com",
    messagingSenderId: "482770675959",
    appId: "1:482770675959:web:3307583fc3394bab7e0bf2",
    measurementId: "G-VX8G913VW3"
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
function generateTableRows() {
    const tableBody = document.getElementById('table-body');
    const dates = generateDatesUntilEndOfMonth();

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

            // Charger les données depuis Firebase
            loadDataFromFirebase(dateIndex, subjectIndex, input);

            // Sauvegarde dans Firebase lorsque l'utilisateur modifie une valeur
            input.addEventListener('change', function () {
                saveToDatabase(dateIndex, subjectIndex, input.value);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Fonction pour sauvegarder les données dans Firebase
function saveToDatabase(dateIndex, subjectIndex, value) {
    firebase.database().ref('homework/' + dateIndex + '/' + subjectIndex).set(value);
}

// Fonction pour charger les données depuis Firebase
function loadDataFromFirebase(dateIndex, subjectIndex, input) {
    firebase.database().ref('homework/' + dateIndex + '/' + subjectIndex).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            input.value = snapshot.val();
        }
    });
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
