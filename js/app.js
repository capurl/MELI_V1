import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Tu configuración de Firebase (Firestore)
const firebaseConfig = {
  apiKey: "AIzaSyCMJWSJ78t03oImu0NK_xl-W0ju5NDzBvI",
  authDomain: "citas-meli.firebaseapp.com",
  projectId: "citas-meli",
  storageBucket: "citas-meli.firebasestorage.app",
  messagingSenderId: "1035533326169",
  appId: "1:1035533326169:web:85908941a6062bd8f25e48"
};

// NUEVO: Llave de ImgBB
const IMGBB_API_KEY = "5f85984ff1ab6b660277979470dac4fe"; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables de estado
let idCitaActual = null;
let usuarioActual = null;
let calificacionActual = 0;
let archivoSeleccionado = null; 
let fotoUrlActual = ""; 

// Referencias principales
const inputCita = document.getElementById('nuevaCitaInput');
const btnAgregar = document.getElementById('btnAgregar');
const listaPendientes = document.getElementById('listaPendientes');
const listaCompletadas = document.getElementById('listaCompletadas');

// Referencias del Modal
const modalRecuerdo = document.getElementById('modalRecuerdo');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const modalTitulo = document.getElementById('modalTitulo');
const modalHeader = document.querySelector('.title-section h1');
const modalFecha = document.getElementById('modalFecha');
const modalLugar = document.getElementById('modalLugar');
const modalPalabra = document.getElementById('modalPalabra');
const modalMejor = document.getElementById('modalMejor');
const btnGuardarRecuerdo = document.getElementById('btnGuardarRecuerdo');
const corazones = document.querySelectorAll('#modalEstrellas i');

// Referencias de la Foto
const btnSubirFoto = document.getElementById('btnSubirFoto');
const inputFotoArchivo = document.getElementById('inputFotoArchivo');
const iconoCamara = document.getElementById('iconoCamara');
const imagenPrevia = document.getElementById('imagenPrevia');

// 1. LÓGICA DE FOTOS (Previsualizar)
btnSubirFoto.addEventListener('click', () => {
    inputFotoArchivo.click(); 
});

inputFotoArchivo.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        archivoSeleccionado = file;
        const previewUrl = URL.createObjectURL(file);
        imagenPrevia.src = previewUrl;
        imagenPrevia.style.display = 'block';
        iconoCamara.style.display = 'none';
    }
});

// 2. LÓGICA DE CORAZONES
corazones.forEach(corazon => {
    corazon.addEventListener('click', (e) => {
        calificacionActual = parseInt(e.target.getAttribute('data-valor'));
        corazones.forEach(c => {
            if (parseInt(c.getAttribute('data-valor')) <= calificacionActual) {
                c.classList.remove('far'); c.classList.add('fas');
            } else {
                c.classList.remove('fas'); c.classList.add('far');
            }
        });
    });
});

// 3. AGREGAR CITA
btnAgregar.addEventListener('click', async () => {
    const textoCita = inputCita.value.trim();
    if (textoCita === "") return;
    try {
        await addDoc(collection(db, "citas"), { texto: textoCita, completada: false, fecha: new Date() });
        inputCita.value = ""; 
    } catch (e) { console.error("Error al agregar: ", e); }
});

// 4. MOSTRAR LISTA
onSnapshot(collection(db, "citas"), (snapshot) => {
    listaPendientes.innerHTML = ''; listaCompletadas.innerHTML = '';
    snapshot.forEach((documento) => {
        const cita = documento.data(); const id = documento.id;
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox'; checkbox.id = id; checkbox.checked = cita.completada;
        
        checkbox.addEventListener('change', async () => {
            await updateDoc(doc(db, "citas", id), { completada: checkbox.checked });
        });
        
        const label = document.createElement('label'); label.htmlFor = id; label.textContent = cita.texto;
        li.appendChild(checkbox); li.appendChild(label);

        if (cita.completada) {
            const contenedorBotones = document.createElement('span'); contenedorBotones.style.marginLeft = '15px';
            
            const btnMiRecuerdo = document.createElement('span');
            btnMiRecuerdo.innerHTML = '🐢 Fer';
            btnMiRecuerdo.style.cssText = 'cursor:pointer; font-size:0.80rem; margin-right:8px; background:#f0f0f0; padding:4px 8px; border-radius:12px;';
            btnMiRecuerdo.addEventListener('click', () => abrirTarjeta(id, cita.texto, 'novio'));

            const btnRecuerdoMeli = document.createElement('span');
            btnRecuerdoMeli.innerHTML = '🐘 Meli';
            btnRecuerdoMeli.style.cssText = 'cursor:pointer; font-size:0.80rem; background:#ffb6c1; color:white; padding:4px 8px; border-radius:12px;';
            btnRecuerdoMeli.addEventListener('click', () => abrirTarjeta(id, cita.texto, 'meli'));

            contenedorBotones.appendChild(btnMiRecuerdo); contenedorBotones.appendChild(btnRecuerdoMeli);
            li.appendChild(contenedorBotones); listaCompletadas.appendChild(li);
        } else {
            listaPendientes.appendChild(li);
        }
    });
});

// 5. ABRIR TARJETA
async function abrirTarjeta(id, texto, usuario) {
    idCitaActual = id; usuarioActual = usuario; modalTitulo.value = texto; 
    modalHeader.innerHTML = usuario === 'novio' ? 'Fer 🐢' : 'Meli 🐘';

    modalFecha.value = ''; modalLugar.value = ''; modalPalabra.value = ''; modalMejor.value = '';
    calificacionActual = 0; archivoSeleccionado = null; fotoUrlActual = "";
    inputFotoArchivo.value = ""; 
    imagenPrevia.style.display = 'none'; imagenPrevia.src = ''; iconoCamara.style.display = 'block';
    corazones.forEach(c => { c.classList.remove('fas'); c.classList.add('far'); });
    btnGuardarRecuerdo.innerHTML = "Guardar Recuerdo 📸";

    const docSnap = await getDoc(doc(db, "citas", id));
    if (docSnap.exists()) {
        const data = docSnap.data();
        const recuerdo = usuario === 'novio' ? data.recuerdo_novio : data.recuerdo_meli;
        if (recuerdo) {
            modalFecha.value = recuerdo.fecha || ''; modalLugar.value = recuerdo.lugar || '';
            modalPalabra.value = recuerdo.palabra || ''; modalMejor.value = recuerdo.mejor || '';
            calificacionActual = recuerdo.calificacion || 0;
            fotoUrlActual = recuerdo.fotoUrl || "";
            
            if (fotoUrlActual) {
                imagenPrevia.src = fotoUrlActual;
                imagenPrevia.style.display = 'block';
                iconoCamara.style.display = 'none';
            }
            corazones.forEach(c => {
                if (parseInt(c.getAttribute('data-valor')) <= calificacionActual) {
                    c.classList.remove('far'); c.classList.add('fas');
                }
            });
        }
    }
    modalRecuerdo.style.display = 'flex';
}

// 6. GUARDAR RECUERDO Y FOTO (Con ImgBB)
btnGuardarRecuerdo.addEventListener('click', async () => {
    if (!idCitaActual) return;
    
    // Si eligieron una foto nueva, la enviamos a ImgBB primero
    if (archivoSeleccionado) {
        btnGuardarRecuerdo.innerHTML = "Subiendo foto... ⏳";
        
        const formData = new FormData();
        formData.append("image", archivoSeleccionado);
        
        try {
            const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });
            const datosImgbb = await respuesta.json();
            
            if (datosImgbb.success) {
                fotoUrlActual = datosImgbb.data.url; // Obtenemos el link de la foto
            } else {
                throw new Error("Error al subir a ImgBB");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al subir la foto.");
            btnGuardarRecuerdo.innerHTML = "Guardar Recuerdo 📸";
            return; // Detiene el guardado si falla la foto
        }
    }

    // Guardamos los textos y el link de la foto en Firebase Firestore
    const datosRecuerdo = {
        fecha: modalFecha.value, lugar: modalLugar.value, palabra: modalPalabra.value,
        mejor: modalMejor.value, calificacion: calificacionActual, fotoUrl: fotoUrlActual
    };

    try {
        const citaRef = doc(db, "citas", idCitaActual);
        if (usuarioActual === 'novio') { await updateDoc(citaRef, { recuerdo_novio: datosRecuerdo }); } 
        else { await updateDoc(citaRef, { recuerdo_meli: datosRecuerdo }); }
        
        alert("¡Recuerdo guardado! 💖");
        modalRecuerdo.style.display = 'none';
    } catch (error) { console.error("Error al guardar:", error); }
});

// 7. CERRAR MODAL
btnCerrarModal.addEventListener('click', () => { modalRecuerdo.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === modalRecuerdo) modalRecuerdo.style.display = 'none'; });