import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
// Agregamos 'getDoc' para poder leer los recuerdos guardados
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

// Variables de estado
let idCitaActual = null;
let usuarioActual = null;
let calificacionActual = 0;

// Referencias principales
const inputCita = document.getElementById('nuevaCitaInput');
const btnAgregar = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('listaPendientes');
const listaCompletadas = document.getElementById('listaCompletadas');

// Referencias del Modal (Tarjeta)
const modalRecuerdo = document.getElementById('modalRecuerdo');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const modalTitulo = document.getElementById('modalTitulo');
const modalHeader = document.querySelector('.title-section h1');

// Referencias de los campos del formulario
const modalFecha = document.getElementById('modalFecha');
const modalLugar = document.getElementById('modalLugar');
const modalPalabra = document.getElementById('modalPalabra');
const modalMejor = document.getElementById('modalMejor');
const btnGuardarRecuerdo = document.getElementById('btnGuardarRecuerdo');
const corazones = document.querySelectorAll('#modalEstrellas i');

// 1. LÓGICA DE LOS CORAZONES (Calificación)
corazones.forEach(corazon => {
    corazon.addEventListener('click', (e) => {
        calificacionActual = parseInt(e.target.getAttribute('data-valor'));
        // Pintar o despintar corazones según el valor
        corazones.forEach(c => {
            if (parseInt(c.getAttribute('data-valor')) <= calificacionActual) {
                c.classList.remove('far');
                c.classList.add('fas'); // Corazón relleno
            } else {
                c.classList.remove('fas');
                c.classList.add('far'); // Corazón vacío
            }
        });
    });
});

// 2. AGREGAR NUEVA CITA
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
        console.error("Error al agregar: ", e);
    }
});

// 3. ESCUCHAR CAMBIOS Y MOSTRAR LISTA
onSnapshot(collection(db, "citas"), (snapshot) => {
    listaPendientes.innerHTML = '';
    listaCompletadas.innerHTML = '';

    snapshot.forEach((documento) => {
        const cita = documento.data();
        const id = documento.id;

        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = cita.completada;
        
        checkbox.addEventListener('change', async () => {
            await updateDoc(doc(db, "citas", id), { completada: checkbox.checked });
        });

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = cita.texto;

        li.appendChild(checkbox);
        li.appendChild(label);

        if (cita.completada) {
            const contenedorBotones = document.createElement('span');
            contenedorBotones.style.marginLeft = '15px';

            const btnMiRecuerdo = document.createElement('span');
            btnMiRecuerdo.innerHTML = '🐢 Fer';
            btnMiRecuerdo.style.cssText = 'cursor:pointer; font-size:0.80rem; margin-right:8px; background:#f0f0f0; padding:4px 8px; border-radius:12px;';
            btnMiRecuerdo.addEventListener('click', () => abrirTarjeta(id, cita.texto, 'novio'));

            const btnRecuerdoMeli = document.createElement('span');
            btnRecuerdoMeli.innerHTML = '🐘 Meli';
            btnRecuerdoMeli.style.cssText = 'cursor:pointer; font-size:0.80rem; background:#ffb6c1; color:white; padding:4px 8px; border-radius:12px;';
            btnRecuerdoMeli.addEventListener('click', () => abrirTarjeta(id, cita.texto, 'meli'));

            contenedorBotones.appendChild(btnMiRecuerdo);
            contenedorBotones.appendChild(btnRecuerdoMeli);
            li.appendChild(contenedorBotones);
            
            listaCompletadas.appendChild(li);
        } else {
            listaPendientes.appendChild(li);
        }
    });
});

// 4. ABRIR TARJETA Y CARGAR DATOS SI EXISTEN
async function abrirTarjeta(id, texto, usuario) {
    idCitaActual = id; 
    usuarioActual = usuario; 
    modalTitulo.value = texto; 
    
    modalHeader.innerHTML = usuario === 'novio' ? '🐢 Fer' : '🐘 Meli';

    // Limpiar los campos por defecto al abrir
    modalFecha.value = '';
    modalLugar.value = '';
    modalPalabra.value = '';
    modalMejor.value = '';
    calificacionActual = 0;
    corazones.forEach(c => { c.classList.remove('fas'); c.classList.add('far'); });

    // Buscar en Firebase si ya habían escrito algo antes
    const docSnap = await getDoc(doc(db, "citas", id));
    if (docSnap.exists()) {
        const data = docSnap.data();
        const recuerdo = usuario === 'novio' ? data.recuerdo_novio : data.recuerdo_meli;
        
        if (recuerdo) {
            modalFecha.value = recuerdo.fecha || '';
            modalLugar.value = recuerdo.lugar || '';
            modalPalabra.value = recuerdo.palabra || '';
            modalMejor.value = recuerdo.mejor || '';
            calificacionActual = recuerdo.calificacion || 0;
            
            // Pintar los corazones guardados
            corazones.forEach(c => {
                if (parseInt(c.getAttribute('data-valor')) <= calificacionActual) {
                    c.classList.remove('far');
                    c.classList.add('fas');
                }
            });
        }
    }
    modalRecuerdo.style.display = 'flex';
}

// 5. GUARDAR EL RECUERDO EN FIREBASE
btnGuardarRecuerdo.addEventListener('click', async () => {
    if (!idCitaActual) return;
    
    // Empaquetamos todo lo que escribieron
    const datosRecuerdo = {
        fecha: modalFecha.value,
        lugar: modalLugar.value,
        palabra: modalPalabra.value,
        mejor: modalMejor.value,
        calificacion: calificacionActual
    };

    try {
        const citaRef = doc(db, "citas", idCitaActual);
        // Guardamos en un cajón u otro dependiendo de quién abrió la tarjeta
        if (usuarioActual === 'novio') {
            await updateDoc(citaRef, { recuerdo_novio: datosRecuerdo });
        } else {
            await updateDoc(citaRef, { recuerdo_meli: datosRecuerdo });
        }
        
        alert("¡Recuerdo guardado! 💖");
        modalRecuerdo.style.display = 'none';
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// 6. CERRAR EL MODAL
btnCerrarModal.addEventListener('click', () => { modalRecuerdo.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === modalRecuerdo) modalRecuerdo.style.display = 'none'; });