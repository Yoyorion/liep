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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to generate dates from today until the end of the current month
function generateDatesUntilEndOfMonth() {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
    const dates = [];

    let currentDate = new Date(today); // Create a new Date object to avoid modifying 'today'

    // Generate dates until the end of the month
    while (currentDate <= lastDayOfMonth) {
        const formattedDate = currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        dates.push(formattedDate);

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

// Function to generate the table rows with dates and subjects
function generateTableRows() {
    const tableBody = document.getElementById('table-body');
    const dates = generateDatesUntilEndOfMonth(); // Generate dates for the current month

    dates.forEach((date, dateIndex) => {
        const row = document.createElement('tr');

        // Create the date cell
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        row.appendChild(dateCell);

        // Create 10 cells for subjects with input fields
        const subjects = ['Français', 'Espagnol', 'Littérature', 'Histoire-Géo', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Techno', 'SES', 'EMC'];
        subjects.forEach((subject, subjectIndex) => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.disabled = true; // Disabled by default

            // Load data from Firebase
            loadDataFromFirebase(dateIndex, subjectIndex, input);

            // When the input changes, save to Firebase
            input.addEventListener('change', function () {
                saveToDatabase(dateIndex, subjectIndex, input.value);
            });

            cell.appendChild(input);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Function to save data to Firebase
function saveToDatabase(dateIndex, subjectIndex, value) {
    firebase.database().ref('homework/' + dateIndex + '/' + subjectIndex).set(value);
}

// Function to load data from Firebase
function loadDataFromFirebase(dateIndex, subjectIndex, input) {
    firebase.database().ref('homework/' + dateIndex + '/' + subjectIndex).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            input.value = snapshot.val();
        }
    });
}

// Enable editing when the correct code is entered
document.getElementById('code-input').addEventListener('input', function() {
    if (this.value === "codecodecode") {
        const inputs = document.querySelectorAll('td input');
        inputs.forEach(input => input.disabled = false);
        this.value = ""; // Clear the input field
        this.placeholder = "Modification activée";
    }
});

// Generate the table when the page loads
window.onload = generateTableRows;
