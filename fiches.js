// photo.js

document.addEventListener('DOMContentLoaded', async function() {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const close = document.querySelector('.close');

    try {
        const response = await fetch('/.netlify/functions/getFilesfiches');
        const files = await response.json();

        files.forEach(file => {
            const isVideo = file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov');
            
            const element = document.createElement(isVideo ? 'video' : 'img');
            element.src = `images/${file}`;
            element.classList.add('gallery-item');
            element.setAttribute('alt', 'Galerie');
            
            if (isVideo) {
                element.setAttribute('controls', '');
            }

            element.addEventListener('click', () => {
                lightbox.style.display = 'block';
                if (isVideo) {
                    lightboxImage.style.display = 'none';
                    lightboxVideo.style.display = 'block';
                    lightboxVideo.src = `images/${file}`;
                    lightboxVideo.play();
                } else {
                    lightboxVideo.style.display = 'none';
                    lightboxImage.style.display = 'block';
                    lightboxImage.src = `images/${file}`;
                }
            });

            gallery.appendChild(element);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
    }

    close.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    });
});