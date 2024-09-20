// Vérification pour s'assurer que le DOM est entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {
    // Initialisation de Supabase
    const supabaseUrl = 'https://rmidxaibwmvbmtxpubgv.supabase.co';  // Remplace par ton URL Supabase
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtaWR4YWlid212Ym10eHB1Ymd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NDczODEsImV4cCI6MjA0MjQyMzM4MX0.pj54J6XB1xcEbZJETypCttJEr9vnm6JDoUfwz2TV_F4';  // Remplace par ton anonpublic key
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);  // S'assurer que supabase est bien initialisé à partir de la bibliothèque

    // Fonction pour récupérer et afficher l'emploi du temps depuis la base de données
    async function fetchTimetable() {
        const { data, error } = await supabase
            .from('timetable')  // Nom de ta table dans Supabase
            .select('*');  // Récupérer toutes les colonnes

        if (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } else {
            populateTimetable(data);  // Remplir le tableau avec les données récupérées
        }
    }

    // Fonction pour remplir le tableau avec les données
    function populateTimetable(data) {
        const tableBody = document.getElementById('calendar-body');
        tableBody.innerHTML = '';  // Effacer tout contenu précédent

        const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
        const startHour = 8;
        const endHour = 18;

        // Générer les lignes pour chaque heure et jour
        for (let hour = startHour; hour <= endHour; hour++) {
            const row = document.createElement('tr');
            
            // Ajouter la colonne des heures
            const hourCell = document.createElement('td');
            hourCell.textContent = `${hour}:00`;
            row.appendChild(hourCell);

            // Ajouter les colonnes pour chaque jour
            for (const day of days) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.value = '';  // Initialement vide

                // Remplir les données si présentes dans la base
                const entry = data.find(entry => entry.hour === hour && entry.day === day);
                if (entry && entry.activity) {
                    input.value = entry.activity;  // Afficher l'activité si disponible
                }

                input.disabled = true;  // Désactivé par défaut
                input.setAttribute('data-hour', hour);
                input.setAttribute('data-day', day);

                cell.appendChild(input);
                row.appendChild(cell);
            }

            tableBody.appendChild(row);
        }
    }

    // Activer la modification du tableau si le bon code est entré
    document.getElementById('code-input').addEventListener('input', function() {
        if (this.value === 'codecodecode') {
            const inputs = document.querySelectorAll('td input');
            inputs.forEach(input => input.disabled = false);  // Activer les champs
            this.value
