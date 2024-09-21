document.addEventListener('DOMContentLoaded', function () {
    // Initialisation de Supabase
    const supabaseUrl = 'https://okyvtousjpxqoqlphhfm.supabase.co';  // Remplace par ton URL Supabase
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reXZ0b3VzanB4cW9xbHBoaGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDc5NTYsImV4cCI6MjA0MjQyMzk1Nn0.-trScKtevO_HxaifhRsQg5uzBxzYV9pJ5Hz6EvqOVzk';  // Remplace par ton anonpublic key
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 

    async function fetchTimetable() {
        const { data, error } = await supabase.from('timetable').select('*');
        if (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } else {
            populateTimetable(data);
        }
    }

    function populateTimetable(data) {
        const tableBody = document.getElementById('calendar-body');
        tableBody.innerHTML = '';

        const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        const startHour = 8;
        const endHour = 18;

        for (let hour = startHour; hour <= endHour; hour++) {
            const row = document.createElement('tr');
            const hourCell = document.createElement('td');
            hourCell.textContent = `${hour}:00`;
            row.appendChild(hourCell);

            for (const day of days) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = '';  // Initialement vide

                const entry = data.find(entry => entry.hour === hour && entry.day === day);
                if (entry && entry.activity) {
                    input.value = entry.activity; 
                }

                input.disabled = true;  
                input.setAttribute('data-hour', hour);
                input.setAttribute('data-day', day);

                cell.appendChild(input);
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        }
    }

    document.getElementById('code-input').addEventListener('input', function() {
        if (this.value === 'codecodecode') {
            const inputs = document.querySelectorAll('td input');
            inputs.forEach(input => {
                input.disabled = false;  
                input.addEventListener('change', async function() {
                    const hour = input.getAttribute('data-hour');
                    const day = input.getAttribute('data-day');
                    const newValue = input.value;

                    console.log(`Tentative d'enregistrement : ${hour}, ${day}, ${newValue}`);  // Débogage

                    // Vérifier si une entrée existe déjà
                    await deleteExistingEntry(hour, day);  // Supprimer l'entrée existante

                    // Enregistrer la nouvelle valeur
                    await insertNewEntry(hour, day, newValue);
                });
            });
            this.value = ''; 
            this.placeholder = 'Modification activée';
        }
    });

    // Fonction pour supprimer une entrée existante
    async function deleteExistingEntry(hour, day) {
        const { data, error } = await supabase
            .from('timetable')
            .delete()  // Supprimer l'entrée existante
            .eq('hour', hour)
            .eq('day', day);

        if (error) {
            console.error('Erreur lors de la suppression des données:', error);
        } else {
            console.log('Données supprimées:', data);
        }
    }

    // Fonction pour insérer une nouvelle entrée
    async function insertNewEntry(hour, day, activity) {
        const { data, error } = await supabase
            .from('timetable')
            .insert({ hour, day, activity });  // Insérer la nouvelle valeur

        if (error) {
            console.error('Erreur lors de l\'insertion des données:', error);
        } else {
            console.log('Nouvelle donnée insérée:', data);
        }
    }

    fetchTimetable();
});
