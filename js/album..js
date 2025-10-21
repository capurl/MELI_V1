document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // ¡AQUÍ VA TU HISTORIA!
    // Edita esta lista para añadir tus propios recuerdos.
    // Cada bloque {} es una página.
    // Solo cambia el texto en 'text' y el nombre del archivo en 'image'.
    // Asegúrate de que las imágenes estén en tu carpeta 'img'.
    // ===================================================================
    const albumPages = [
        {
            image: "img/Concierto.jpg",
            text: "Todo comenzó el 21-11-2024 en el concierto de nescui y en un viaje de 8 desconocidos hacia Toluca termino sucediendo la mejor casualidad de mi vida, conocerte a ti."
        },
        {
            image: "img/esc.jpg",
            text: "Despues de eso un dia fui a tu escuela y a partir de ese dia comenzaron nuestras platicas diarias ademas de mi atraccion por ti."
        },
        {
            image: "img/fiesta1.jpg",
            text: "En nuestro grupo del viaje a Toluca mandaron que iba a haber una fiesta el 21 de diciembre, fuimos y paso lo que 1 mes antes nunca hubiera imaginado, nos dimos nuestro primer beso, un tanto forzado pero en el fondo muy deseado, te quedaste a dormir en mi casa y a partir de lo que paso ese dia nuestra relacion tomo otro rumbo."
        },
        {
            image: "img/pao.jpg",
            text: "A la semana fue la fiesta de Pao donde confirmamos que habia algo mas que una simple amistad entre nosotros."
        },
        {
            image: "img/tor.jpg",
            text: "El 31 de Diciembre quedamos de vernos en Toreo un ratito antes de la comida de fin de año, en el momento donde estuvimos platicando abrazandonos y dandonos besitos fue cuando descubri que no queria que solamente fuera algo pasjero."
        },

        {
            image: "img/chapu.jpg",
            text: "Dias despues tuvimos nuestra primera cita, fuimos a Chapultepec twins y segui confirmando lo mucho que me estabas empezando a gustar."
        },
       {
            image: "img/bic.jpg",
            text: "Fuimos al parque y te di las primeras flores, era curioso como sin darnos cuenta y mientras seguíamos conociéndonos, los 'te quiero', los apodos y los detalles bonitos se repetian cada vez mas."
        }  ,
       {
            image: "img/ros.jpg",
            text: "Quedamos de salir con los chocoamigos pero al fnal nadie pudo y terminamos viendonos solo nosotros, te di mas florecitas y ese dia nos contamos lo que sentiamos, lo que queriamos y lo que sentiamos que era mejor para nosotros, los dos estabamos de acuerdo en que queriamos intentarlo pero era mejor seguirnos conociendo al menos un mes mas y esperar al 21 de febrero para que el 21 fuera nuestro dia, creo que fue el primer dia que te quedaste a dormir en mi casa despues de la fiesta "
        },        
       {
            image: "img/nov.jpg",
            text: "Llego el 21 de febrero, quedamos de vernos y te escribi 'Puedo ser tu novio?' con letras de madera  y por fin podiamos decir que eramos noviecitos despues de tanto tiempo y tantas cosas que habiamos pasado juntos, me espere a ese momento para decirte el primer 'te amo' y ha sido mi mas favorito."
        }                              

    ];

    const book = document.getElementById('book');
    const cover = document.getElementById('book-cover');
    const page = document.getElementById('book-page');
    const pageImage = document.getElementById('page-image');
    const pageText = document.getElementById('page-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentPage = -1; // -1 representa la portada

    function showPage(index) {
        if (index >= 0 && index < albumPages.length) {
            page.classList.remove('visible');
            setTimeout(() => {
                const pageData = albumPages[index];
                pageImage.src = pageData.image;
                pageText.textContent = pageData.text;
                page.classList.add('visible');
            }, 300); // Coincide con la transición del CSS
        }
        updateButtons();
    }

    function updateButtons() {
    // Solo muestra los botones si el libro está abierto (currentPage no es -1)
    if (currentPage === -1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = currentPage > 0 ? 'block' : 'none';
        nextBtn.style.display = currentPage < albumPages.length - 1 ? 'block' : 'none';
    }
}

    cover.addEventListener('click', () => {
        cover.style.display = 'none';
        currentPage = 0;
        showPage(currentPage);
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < albumPages.length - 1) {
            currentPage++;
            showPage(currentPage);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            showPage(currentPage);
        }
    });

    // Estado inicial
    updateButtons();
});