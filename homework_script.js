// Vérification pour s'assurer que le DOM est entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {
    // Initialisation de Supabase
    const supabaseUrl = 'https://shcuezruvlenxmtsgxrs.supabase.co';  // URL de Supabase
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3VlenJ1dmxlbnhtdHNneHJzIiwicm9zZSI6ImFub24iLCJpYXQiOjE3MjY4NDgzNzEsImV4cCI6MjA0MjQyNDM3MX0.OhHpA0eGnPzo2ouhsD979vXAY9dVDC5TiFDMg5JbWao';  // Clé anonpublic
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); 

    // Fonction pour récupérer et afficher les devoirs depuis la base de données
    async function fetchHomework() {
        const { data, error } = await supabase.from('homework').select('*');  // Nom de ta table de devoirs

        if (error) {
            console.error('Erreur lors de la récupération des devoirs:', error);
        } else {
            populateHomework(data);  // Remplir le tableau avec les devoirs récupérés
        }
    }

    // Fonction pour remplir le tableau avec les devoirs
    function populateHomework(data) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';  // Effacer tout contenu précédent

        data.forEach(homework => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${homework.date}</td>
                <td>${homework.francais}</td>
                <td>${homework.espagnol}</td>
                <td>${homework.litterature}</td>
                <td>${homework.histoire_geo}</td>
                <td>${homework.maths}</td>
                <td>${homework.svt}</td>
                <td>${homework.physique_chimie}</td>
                <td>${homework.techno}</td>
                <td>${homework.ses}</td>
                <td>${homework.emc}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fonction pour mettre à jour les devoirs dans la base de données
    async function updateHomework(data) {
        const { error } = await supabase
            .from('homework')  // Nom de la table
            .upsert(data);  // Mettre à jour ou insérer si la donnée n'existe pas

        if (error) {
            console.error('Erreur lors de la mise à jour des devoirs:', error);
        } else {
            console.log('Devoirs mis à jour avec succès');
        }
    }

    // Appeler la fonction pour charger les devoirs lors du chargement de la page
    fetchHomework();
});
