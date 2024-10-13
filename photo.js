// photo.js

document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const close = document.querySelector('.close');

    // Remplacez par un tableau des fichiers du dossier "images" pour simuler la liste
    const files = [
        'images/logo.WEBP',
    ];

    files.forEach(file => {
        const isVideo = file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov');
        
        const element = document.createElement(isVideo ? 'video' : 'img');
        element.src = file;
        element.classList.add('gallery-item');
        element.setAttribute('alt', 'Galerie');
        
        if (isVideo) {
            element.setAttribute('controls', ''); // Permettre de contrôler la vidéo
        }

        element.addEventListener('click', () => {
            lightbox.style.display = 'block';
            if (isVideo) {
                lightboxImage.style.display = 'none';
                lightboxVideo.style.display = 'block';
                lightboxVideo.src = file;
                lightboxVideo.play();
            } else {
                lightboxVideo.style.display = 'none';
                lightboxImage.style.display = 'block';
                lightboxImage.src = file;
            }
        });

        gallery.appendChild(element);
    });

    close.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = ''; // Pour arrêter la vidéo
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    });
});