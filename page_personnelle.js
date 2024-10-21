// page_personnelle.js

document.addEventListener('DOMContentLoaded', async function() {
    const utilisateur = localStorage.getItem('nomUtilisateur'); // Récupérer le nom de l'utilisateur
    const texteArea = document.getElementById('texte');
    const messageDiv = document.getElementById('message');
    const uploadForm = document.getElementById('upload-form');
    const uploadMessageDiv = document.getElementById('upload-message');
    const imagesContainer = document.getElementById('images-container');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalButton = document.getElementById('close-modal');

    function nettoyerNomFichier(nom) {
        return nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                  .replace(/\s+/g, '_')
                  .replace(/[^a-zA-Z0-9_\.-]/g, '');
    }

    async function recupererTexte() {
        const { data, error } = await supabaseEtudiants
            .from('textes_securises')
            .select('texte')
            .eq('utilisateur', utilisateur)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Erreur lors de la récupération du texte :", error);
            messageDiv.textContent = "Erreur lors de la récupération du texte.";
        } else if (data) {
            texteArea.value = data.texte;
        } else {
            texteArea.value = "";
        }
    }

    async function sauvegarderTexte() {
        const texte = texteArea.value.trim();

        if (texte === "") {
            messageDiv.textContent = "Le texte ne peut pas être vide.";
            return;
        }

        const { data, error } = await supabaseEtudiants
            .from('textes_securises')
            .select('id')
            .eq('utilisateur', utilisateur)
            .single();

        if (data) {
            const { error: updateError } = await supabaseEtudiants
                .from('textes_securises')
                .update({ texte: texte })
                .eq('id', data.id);

            if (updateError) {
                console.error("Erreur lors de la mise à jour du texte :", updateError);
                messageDiv.textContent = "Erreur lors de la mise à jour. Veuillez réessayer.";
            } else {
                messageDiv.textContent = "Texte mis à jour avec succès !";
                location.reload();
            }
        } else {
            const { error: insertError } = await supabaseEtudiants
                .from('textes_securises')
                .insert([{ utilisateur: utilisateur, texte: texte }]);

            if (insertError) {
                console.error("Erreur lors de l'insertion du texte :", insertError);
                messageDiv.textContent = "Erreur lors de l'enregistrement. Veuillez réessayer.";
            } else {
                messageDiv.textContent = "Texte enregistré avec succès !";
                location.reload();
            }
        }
    }

    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const file = document.getElementById('image-upload').files[0];
        if (!file) return;

        const cleanFileName = nettoyerNomFichier(file.name);
        const filePath = `${utilisateur}/${cleanFileName}`;

        const { error: uploadError } = await supabaseEtudiants.storage
            .from('images_utilisateurs')
            .upload(filePath, file);

        if (uploadError) {
            console.error("Erreur lors du téléchargement de l'image :", uploadError);
            uploadMessageDiv.textContent = "Erreur lors du téléchargement. Veuillez réessayer.";
            return;
        }

        const { data: publicData, error: urlError } = supabaseEtudiants
            .storage
            .from('images_utilisateurs')
            .getPublicUrl(filePath);

        if (urlError || !publicData) {
            console.error("Erreur lors de la récupération de l'URL :", urlError);
            uploadMessageDiv.textContent = "Erreur lors de la récupération de l'URL.";
            return;
        }

        const publicURL = publicData.publicUrl;
        console.log("URL publique de l'image :", publicURL);

        const { error: insertError } = await supabaseEtudiants
            .from('images_utilisateurs')
            .insert([{ utilisateur: utilisateur, url: publicURL }]);

        if (insertError) {
            console.error("Erreur lors de l'enregistrement de l'image :", insertError);
            uploadMessageDiv.textContent = "Erreur lors de l'enregistrement. Veuillez réessayer.";
        } else {
            uploadMessageDiv.textContent = "Image téléchargée avec succès !";
            location.reload();
        }
    });

    async function afficherImages() {
        const { data, error } = await supabaseEtudiants
            .from('images_utilisateurs')
            .select('id, url')
            .eq('utilisateur', utilisateur);

        if (error) {
            console.error("Erreur lors de la récupération des images :", error);
        } else if (data.length > 0) {
            data.forEach(image => {
                const img = document.createElement('img');
                img.src = image.url;
                img.alt = "Image utilisateur";
                img.style.width = "150px"; 
                img.setAttribute('data-id', image.id); // Ajouter l'ID de l'image
                img.addEventListener('click', () => afficherImageEnGrand(image.url, image.id));
                imagesContainer.appendChild(img);
            });
        }
    }

    function afficherImageEnGrand(url, imageId) {
        modal.style.display = 'flex';
        modalImage.src = url;

        closeModalButton.onclick = async () => {
            const filePath = url.split('/').pop(); // Récupère le nom du fichier
            const { error: deleteError } = await supabaseEtudiants
                .storage
                .from('images_utilisateurs')
                .remove([`${utilisateur}/${filePath}`]);

            if (deleteError) {
                console.error("Erreur lors de la suppression de l'image du stockage :", deleteError);
                uploadMessageDiv.textContent = "Erreur lors de la suppression. Veuillez réessayer.";
            } else {
                // Supprimer l'enregistrement de la base de données en utilisant l'ID
                const { error: dbDeleteError } = await supabaseEtudiants
                    .from('images_utilisateurs')
                    .delete()
                    .eq('id', imageId);

                if (dbDeleteError) {
                    console.error("Erreur lors de la suppression dans la base de données :", dbDeleteError);
                    uploadMessageDiv.textContent = "Erreur lors de la suppression de la base de données. Veuillez réessayer.";
                } else {
                    uploadMessageDiv.textContent = "Image supprimée avec succès !";
                    modal.style.display = 'none';
                    location.reload();
                }
            }
        };
    }

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('text-form').addEventListener('submit', function(event) {
        event.preventDefault();
        sauvegarderTexte();
    });

    texteArea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sauvegarderTexte();
        }
    });

    recupererTexte();
    afficherImages();
});