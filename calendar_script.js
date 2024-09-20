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

// Fonction pour générer les lignes du tableau pour l'emploi du temps
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
            input.disabled = true; // Désactivé par défaut

            // Charger les données depuis Firebase
            loadDataFromFirebase(hour, i, input);

            // Sauvegarder dans Firebase lorsqu'une valeur est modifiée
            input.addEventListener('change', function () {
                saveToDatabase(hour, i, input.value);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row); // Ajouter la ligne au tableau
    }
}

// Fonction pour sauvegarder les données dans Firebase
function saveToDatabase(hour, dayIndex, value) {
    firebase.database().ref('timetable/' + hour + '/' + dayIndex).set(value);
}

// Fonction pour charger les données depuis Firebase
function loadDataFromFirebase(hour, dayIndex, input) {
    firebase.database().ref('timetable/' + hour + '/' + dayIndex).once('value').then((snapshot) => {
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
window.onload = generateTimetableRows;
