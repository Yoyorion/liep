document.addEventListener('DOMContentLoaded', async function() {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const close = document.querySelector('.close');

    try {
        // Récupère la liste des fichiers dans le bucket "fiches"
        const { data: files, error } = await supabaseEtudiants
            .storage
            .from('fiches')
            .list('', { limit: 100, offset: 0 });

        if (error) {
            console.error('Erreur lors de la récupération des fichiers du bucket:', error);
            return;
        }

        // Vérifiez si `files` contient des données
        console.log("Liste des fichiers récupérés:", files);

        files.forEach(file => {
            console.log("Nom du fichier:", file.name); // Ajout d'un log pour vérifier `file.name`

            // Génération manuelle de l'URL publique pour vérifier l'accessibilité
            const publicURL = `https://rmidxaibwmvbmtxpubgv.supabase.co/storage/v1/object/public/fiches/${file.name}`;

            console.log("URL de l'image:", publicURL); // Affiche l'URL dans la console pour vérification

            const img = document.createElement('img');
            img.src = publicURL;
            img.classList.add('gallery-item');
            img.setAttribute('alt', 'Galerie');

            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImage.src = publicURL;
            });

            gallery.appendChild(img);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
    }

    close.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxImage.src = '';
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxImage.src = '';
    });
});