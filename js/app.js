import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMJWSJ78t03oImu0NK_xl-W0ju5NDzBvI",
  authDomain: "citas-meli.firebaseapp.com",
  projectId: "citas-meli",
  storageBucket: "citas-meli.firebasestorage.app",
  messagingSenderId: "1035533326169",
  appId: "1:1035533326169:web:85908941a6062bd8f25e48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// NUEVO: Variables para recordar de quién es el turno y qué cita editamos
let idCitaActual = null;
let usuarioActual = null;

// Referencias principales
const inputCita = document.getElementById('nuevaCitaInput');
const btnAgregar = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('listaPendientes');
const listaCompletadas = document.getElementById('listaCompletadas');

// Referencias del Modal
const modalRecuerdo = document.getElementById('modalRecuerdo');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const modalTitulo = document.getElementById('modalTitulo');
const modalHeader = document.querySelector('.title-section h1'); // Para cambiar el título

// 1. AGREGAR NUEVA CITA
btnAgregar.addEventListener('click', async () => {
    const textoCita = inputCita.value.trim();
    if (textoCita === "") return;

    try {
        await addDoc(collection(db, "citas"), {
            texto: textoCita,
            completada: false,
            fecha: new Date()
        });
        inputCita.value = ""; 
    } catch (e) {
        console.error("Error al agregar documento: ", e);
    }
});

// 2. ESCUCHAR CAMBIOS Y MOSTRAR LISTA
onSnapshot(collection(db, "citas"), (snapshot) => {
    listaPendientes.innerHTML = '';
    listaCompletadas.innerHTML = '';

    snapshot.forEach((documento) => {
        const cita = documento.data();
        const id = documento.id;

        const li = document.createElement('li');
        
        // Crear el checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = cita.completada;
        
        checkbox.addEventListener('change', async () => {
            const citaRef = doc(db, "citas", id);
            await updateDoc(citaRef, {
                completada: checkbox.checked
            });
        });

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = cita.texto;

        li.appendChild(checkbox);
        li.appendChild(label);

        // NUEVO: Si la cita está completada, creamos dos botones
        if (cita.completada) {
            const contenedorBotones = document.createElement('span');
            contenedorBotones.style.marginLeft = '15px';

            // Botón Tuyo
            const btnMiRecuerdo = document.createElement('span');
            btnMiRecuerdo.innerHTML = '🐢 Fer';
            btnMiRecuerdo.style.cursor = 'pointer';
            btnMiRecuerdo.style.fontSize = '0.80rem';
            btnMiRecuerdo.style.marginRight = '8px';
            btnMiRecuerdo.style.backgroundColor = '#f0f0f0';
            btnMiRecuerdo.style.padding = '4px 8px';
            btnMiRecuerdo.style.borderRadius = '12px';

            btnMiRecuerdo.addEventListener('click', () => {
                abrirTarjeta(id, cita.texto, 'novio');
            });

            // Botón de Meli
            const btnRecuerdoMeli = document.createElement('span');
            btnRecuerdoMeli.innerHTML = '🐘 Meli';
            btnRecuerdoMeli.style.cursor = 'pointer';
            btnRecuerdoMeli.style.fontSize = '0.80rem';
            btnRecuerdoMeli.style.backgroundColor = '#ffb6c1';
            btnRecuerdoMeli.style.color = 'white';
            btnRecuerdoMeli.style.padding = '4px 8px';
            btnRecuerdoMeli.style.borderRadius = '12px';

            btnRecuerdoMeli.addEventListener('click', () => {
                abrirTarjeta(id, cita.texto, 'meli');
            });

            contenedorBotones.appendChild(btnMiRecuerdo);
            contenedorBotones.appendChild(btnRecuerdoMeli);
            li.appendChild(contenedorBotones);
            
            listaCompletadas.appendChild(li);
        } else {
            // Si no está completada, va a pendientes normal, sin botones
            listaPendientes.appendChild(li);
        }
    });
});

// NUEVO: Función para preparar y abrir la tarjeta
function abrirTarjeta(id, texto, usuario) {
    idCitaActual = id; // Guardamos qué cita estamos tocando
    usuarioActual = usuario; // Guardamos quién la está abriendo

    modalTitulo.value = texto; // Ponemos el nombre de la cita
    
    // Cambiamos el título visualmente
    if (usuario === 'novio') {
        modalHeader.innerHTML = 'Recuerdo de Fer 🐢';
    } else {
        modalHeader.innerHTML = 'Recuerdo de Meli 🐘';
    }

    modalRecuerdo.style.display = 'flex';
}

// 3. CERRAR EL MODAL
btnCerrarModal.addEventListener('click', () => {
    modalRecuerdo.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modalRecuerdo) {
        modalRecuerdo.style.display = 'none';
    }
});