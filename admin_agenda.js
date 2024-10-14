// admin_agenda.js

document.addEventListener('DOMContentLoaded', function() {
  const scheduleSelect = document.getElementById('schedule-select');
  const scheduleTable = document.querySelector('.editable-table');
  const heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const heures_un = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  function createScheduleTable() {
    scheduleTable.innerHTML = '';

    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));

    jours.forEach(jour => {
      const th = document.createElement('th');
      th.textContent = jour;
      headerRow.appendChild(th);
    });
    scheduleTable.appendChild(headerRow);

    heures.forEach((heure, index) => {
      const row = document.createElement('tr');
      const heureCell = document.createElement('td');
      heureCell.textContent = heure;
      row.appendChild(heureCell);

      jours.forEach(jour => {
        const cell = document.createElement('td');
        cell.contentEditable = true;

        cell.addEventListener('keydown', async (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const updatedContent = cell.textContent;
            const selectedOption = scheduleSelect.value.split('-');
            const groupe = parseInt(selectedOption[0], 10);
            const section = selectedOption[1];
            const heure_debut = heure + ':00';
            const heure_fin = heures_un[index] + ':00';

            try {
              // Supprime les enregistrements existants pour ce groupe et cette section, jour et heure
              const deleteResponse = await supabaseEtudiants
                .from('emploi_du_temps')
                .delete()
                .eq('groupe', groupe)
                .eq('section', section)
                .eq('jour', jour)
                .eq('heure_debut', heure_debut);

              if (deleteResponse.error) {
                console.error("Erreur lors de la suppression :", deleteResponse.error);
                alert('Erreur lors de la suppression : ' + deleteResponse.error.message);
                return;
              }

              // Ajoute les nouveaux enregistrements
              const insertResponse = await supabaseEtudiants
                .from('emploi_du_temps')
                .insert([
                  { jour, heure_debut, heure_fin, groupe, section, matiere: updatedContent }
                ]);

              if (insertResponse.error) {
                console.error("Erreur lors de l'insertion :", insertResponse.error);
                alert('Erreur lors de l\'insertion : ' + insertResponse.error.message);
              } else {
                alert(`Emploi du temps mis à jour pour ${jour} à ${heure}`);
              }
            } catch (error) {
              console.error('Erreur lors de la mise à jour :', error);
              alert('Une erreur est survenue lors de la mise à jour.');
            }
          }
        });

        row.appendChild(cell);
      });
      scheduleTable.appendChild(row);
    });
  }

  scheduleSelect.addEventListener('change', createScheduleTable);
  createScheduleTable();
});