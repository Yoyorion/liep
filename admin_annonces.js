// admin_annonces.js

async function chargerAnnonces() {
    const { data, error } = await supabaseEtudiants
        .from('annonces')
        .select('*')
        .order('date', { ascending: true });

    if (error) {
        console.error("Erreur lors de la récupération des annonces :", error);
        return;
    }

    const annoncesTable = document.querySelector('#annonces-table tbody');
    annoncesTable.innerHTML = '';

    // Afficher les annonces existantes
    data.forEach(annonce => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.contentEditable = true;
        dateCell.textContent = annonce.date;
        row.appendChild(dateCell);

        const infosCell = document.createElement('td');
        infosCell.contentEditable = true;
        infosCell.textContent = annonce.infos;
        row.appendChild(infosCell);

        annoncesTable.appendChild(row);
    });

    // Ajouter une ligne vide pour la nouvelle annonce
    const newRow = document.createElement('tr');

    const newDateCell = document.createElement('td');
    newDateCell.contentEditable = true;
    newRow.appendChild(newDateCell);

    const newInfosCell = document.createElement('td');
    newInfosCell.contentEditable = true;
    newRow.appendChild(newInfosCell);

    annoncesTable.appendChild(newRow);

    // Détecter l'entrée sur la nouvelle ligne pour sauvegarder les annonces
    newRow.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Récupérer toutes les annonces
            const annonces = [];
            const rows = annoncesTable.querySelectorAll('tr');
            rows.forEach(row => {
                const date = row.cells[0].textContent.trim();
                const infos = row.cells[1].textContent.trim();

                if (date && infos) {
                    annonces.push({ date, infos });
                }
            });

            // Supprimer les anciennes annonces avec une clause WHERE
            const deleteResponse = await supabaseEtudiants
                .from('annonces')
                .delete()
                .neq('id', -1); // Utilise une condition qui correspondra à toutes les lignes

            if (deleteResponse.error) {
                console.error("Erreur lors de la suppression des anciennes annonces :", deleteResponse.error);
                alert("Erreur lors de la suppression des anciennes annonces");
                return;
            }

            const insertResponse = await supabaseEtudiants
                .from('annonces')
                .insert(annonces);

            if (insertResponse.error) {
                console.error("Erreur lors de l'insertion des nouvelles annonces :", insertResponse.error);
                alert("Erreur lors de l'insertion des nouvelles annonces");
            } else {
                alert("Annonces mises à jour avec succès !");
                window.location.reload();
            }
        }
    });
}

// Charger les annonces au démarrage de la page
chargerAnnonces();