import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

//  configuración de Firebase 
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

// Referencias principales
const inputCita = document.getElementById('nuevaCitaInput');
const btnAgregar = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('listaPendientes');
const listaCompletadas = document.getElementById('listaCompletadas');

// Referencias del Modal
const modalRecuerdo = document.getElementById('modalRecuerdo');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const modalTitulo = document.getElementById('modalTitulo');

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
    // Limpiar las listas antes de volver a pintarlas
    listaPendientes.innerHTML = '';
    listaCompletadas.innerHTML = '';

    snapshot.forEach((documento) => {
        const cita = documento.data();
        const id = documento.id;

        // Crear el elemento de la lista (<li>)
        const li = document.createElement('li');
        
        // Crear el checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = cita.completada;
        
        // Cuando alguien marca/desmarca, actualizar Firebase
        checkbox.addEventListener('change', async () => {
            const citaRef = doc(db, "citas", id);
            await updateDoc(citaRef, {
                completada: checkbox.checked
            });
        });

        // Crear la etiqueta (texto de la cita)
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = cita.texto;

        // NUEVO: Crear un botoncito de cámara para abrir la tarjeta
        const btnRecuerdo = document.createElement('span');
        btnRecuerdo.innerHTML = ' 📸'; // Icono de cámara
        btnRecuerdo.style.cursor = 'pointer';
        btnRecuerdo.style.marginLeft = '12px'; // Un poco de espacio separado del texto
        btnRecuerdo.title = 'Abrir recuerdo';

        // Evento para abrir el modal al tocar la cámara
        btnRecuerdo.addEventListener('click', () => {
            modalTitulo.value = cita.texto; 
            modalRecuerdo.style.display = 'flex'; 
        });

        // Armar el <li> (Checkbox + Texto + Camarita)
        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(btnRecuerdo);

        // Acomodar en la lista correspondiente
        if (cita.completada) {
            listaCompletadas.appendChild(li);
        } else {
            listaPendientes.appendChild(li);
        }
    });
});

// 3. CERRAR EL MODAL
// Al hacer clic en la "X"
btnCerrarModal.addEventListener('click', () => {
    modalRecuerdo.style.display = 'none';
});

// Al hacer clic afuera de la tarjeta blanca (en el fondo oscuro)
window.addEventListener('click', (e) => {
    if (e.target === modalRecuerdo) {
        modalRecuerdo.style.display = 'none';
    }
});