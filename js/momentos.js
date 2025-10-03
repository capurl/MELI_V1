document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('moments-container');
    const totalPhotos = 50;
    let photos = [];

    // **INSTRUCCIÓN:** Crea una carpeta 'img/momentos/' y nombra tus 50 fotos
    // como '1.jpg', '2.jpg', '3.jpg', etc., hasta '50.jpg'.
    for (let i = 1; i <= totalPhotos; i++) {
        photos.push(`img/momentos/${i}.jpg`);
    }

    function showRandomPhoto() {
        if (photos.length === 0) return;

        // Elige una foto al azar
        const randomIndex = Math.floor(Math.random() * photos.length);
        const photoSrc = photos[randomIndex];

        const img = document.createElement('img');
        img.src = photoSrc;
        img.className = 'random-photo';

        // Posición aleatoria en la pantalla
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 200);
        img.style.left = `${x}px`;
        img.style.top = `${y}px`;

        container.appendChild(img);

        // La foto aparece y luego desaparece
        setTimeout(() => {
            img.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            img.style.opacity = '0';
            setTimeout(() => {
                container.removeChild(img);
            }, 2000); // Espera a que termine la transición de desaparición
        }, 6000); // La foto permanece visible por 4 segundos
    }

    // Muestra una nueva foto cada 2 segundos
    setInterval(showRandomPhoto, 900);
});