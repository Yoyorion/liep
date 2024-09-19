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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Generate the timetable
const timetableBody = document.getElementById("calendar-body");
const startHour = 8;
const endHour = 18;

for (let hour = startHour; hour < endHour; hour++) {
    const row = document.createElement("tr");

    // First cell for the time (e.g., 8:00, 9:00, ...)
    const timeCell = document.createElement("td");
    timeCell.textContent = `${hour}:00`;
    row.appendChild(timeCell);

    // Generate 5 cells for each day (Monday to Friday)
    for (let day = 0; day < 5; day++) {
        const dayCell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 3;
        input.disabled = true; // Disabled by default

        // When the input changes, save to Firebase
        input.addEventListener('change', function() {
            saveToDatabase(hour, day, input.value);
        });

        dayCell.appendChild(input);
        row.appendChild(dayCell);
    }

    timetableBody.appendChild(row);
}

// Function to save data to Firebase
function saveToDatabase(hour, day, value) {
    firebase.database().ref('timetable/' + hour + '/' + day).set(value);
}

// Function to retrieve data from Firebase
function loadFromDatabase() {
    firebase.database().ref('timetable/').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Populate the timetable with the data from Firebase
            const rows = timetableBody.querySelectorAll("tr");
            rows.forEach((row, hourIndex) => {
                const cells = row.querySelectorAll("td input");
                cells.forEach((cell, dayIndex) => {
                    if (data[hourIndex] && data[hourIndex][dayIndex] !== undefined) {
                        cell.value = data[hourIndex][dayIndex];
                    }
                });
            });
        }
    });
}

// Enable editing when the correct code is entered
document.getElementById("code-input").addEventListener("input", function() {
    if (this.value === "codecodecode") {
        const inputs = document.querySelectorAll("td input");
        inputs.forEach(input => input.disabled = false);
        this.value = ""; // Clear the input field after entering the correct code
        this.placeholder = "Modification activée";
    }
});

// Load data when the page loads
loadFromDatabase();
