// Importar las funciones de Firebase (versión 10) directamente desde la web
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Tu configuración específica de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCMJWSJ78t03oImu0NK_xl-W0ju5NDzBvI",
  authDomain: "citas-meli.firebaseapp.com",
  projectId: "citas-meli",
  storageBucket: "citas-meli.firebasestorage.app",
  messagingSenderId: "1035533326169",
  appId: "1:1035533326169:web:85908941a6062bd8f25e48",
  measurementId: "G-W99519LNNM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias a los elementos de tu página HTML
const inputCita = document.getElementById('nuevaCitaInput');
const btnAgregar = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('listaPendientes');
const listaCompletadas = document.getElementById('listaCompletadas');

// 1. FUNCIÓN PARA AGREGAR UNA NUEVA CITA A FIREBASE
btnAgregar.addEventListener('click', async () => {
    const textoCita = inputCita.value.trim();
    if (textoCita === "") return; // No agregar si está vacío

    try {
        await addDoc(collection(db, "citas"), {
            texto: textoCita,
            completada: false, // Inicia como no completada
            fecha: new Date()
        });
        inputCita.value = ""; // Limpiar la caja de texto
    } catch (e) {
        console.error("Error al agregar documento: ", e);
        alert("Hubo un error al guardar. Asegúrate de tener permisos (Modo de prueba).");
    }
});

// 2. FUNCIÓN PARA ESCUCHAR CAMBIOS EN TIEMPO REAL
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

        // Armar el <li>
        li.appendChild(checkbox);
        li.appendChild(label);

        // Acomodar en la lista correspondiente
        if (cita.completada) {
            listaCompletadas.appendChild(li);
        } else {
            listaPendientes.appendChild(li);
        }
    });
});