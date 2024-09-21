document.addEventListener('DOMContentLoaded', function () {
    // Initialisation de Supabase
    const supabaseUrl = 'https://znwzdkgshtrickigthgd.supabase.co';  // Remplace par ton URL Supabase
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud3pka2dzaHRyaWNraWd0aGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4MjQyMzcsImV4cCI6MjA0MjQwMDIzN30.qGSSUfV7qjC0PUL3t_XVR3dXg6s5kRg0zwtQ2J1Gd5M';  // Remplace par ton anonpublic key
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
                input.value = '';

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

                    // Enregistrer la modification dans la base de données
                    await updateTimetable(hour, day, newValue);
                });
            });
            this.value = ''; 
            this.placeholder = 'Modification activée';
        }
    });

    async function updateTimetable(hour, day, activity) {
        const { data, error } = await supabase.from('timetable').upsert({ hour, day, activity });
        if (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
        } else {
            console.log('Données mises à jour:', data);
        }
    }

    fetchTimetable();
});
