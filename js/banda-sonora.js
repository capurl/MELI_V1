document.addEventListener('DOMContentLoaded', () => {
    const songItems = document.querySelectorAll('.song-item-improved');
    const background = document.getElementById('playlist-bg');

    songItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const bgImage = item.getAttribute('data-bg');
            background.style.backgroundImage = `url(${bgImage})`;
            background.style.opacity = '1';
        });

        item.addEventListener('mouseout', () => {
            background.style.opacity = '0';
        });
    });
});