/* --- FONDO DE PANTALLA: SISTEMA DOBLE CAPA (CROSS-FADE) --- */
const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');

// Tu lista de imágenes
const images = [
    'imgs/bosque.jpg',
    'imgs/guitarra.jpg',
    'imgs/comida.jpg',
    'imgs/escaleras.jpg',
    'imgs/libro.jpg',
    'imgs/mijas.jpg',
    'imgs/mar.jpg',
    'imgs/kandinsky.jpg',
    'imgs/guitarrica.jpg',
    'imgs/teatro.jpg',
    'imgs/torcal.jpg'
];

let shuffledImages = [];
let currentIndex = 0;
let currentLayer = 1; // 1 = bg1 visible, 2 = bg2 visible

// Función para barajar (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function changeBackground() {
    // 1. Gestión del array aleatorio
    if (shuffledImages.length === 0 || currentIndex >= shuffledImages.length) {
        shuffledImages = [...images]; 
        shuffleArray(shuffledImages);
        // Evitar repetición inmediata
        const currentUrl = (currentLayer === 1 ? bg1 : bg2).style.backgroundImage;
        if (currentUrl.includes(shuffledImages[0])) {
            shuffledImages.push(shuffledImages.shift());
        }
        currentIndex = 0;
    }

    const nextImageUrl = shuffledImages[currentIndex];

    // 2. Determinar qué capa está oculta para cargar la foto ahí
    const hiddenLayer = currentLayer === 1 ? bg2 : bg1;
    const activeLayer = currentLayer === 1 ? bg1 : bg2;

    // 3. PRECARGA EN CAPA OCULTA
    const imgLoader = new Image();
    imgLoader.src = nextImageUrl;

    imgLoader.onload = () => {
        // Ponemos la foto en la capa oculta
        hiddenLayer.style.backgroundImage = `url('${nextImageUrl}')`;
        
        // Hacemos el Cross-Fade (Intercambio de opacidad)
        activeLayer.classList.remove('active');
        hiddenLayer.classList.add('active');
        
        // Cambiamos el puntero de capa actual
        currentLayer = currentLayer === 1 ? 2 : 1;
        currentIndex++;
    };
    
    imgLoader.onerror = () => {
        console.warn(`Error cargando: ${nextImageUrl}`);
        currentIndex++; // Saltamos imagen corrupta
    };
}

// Iniciar
// Primero cargamos una imagen inicial inmediatamente
changeBackground();

// Luego el ciclo cada 8 segundos
setInterval(changeBackground, 8000);


// --- LÓGICA DE LOS ACORDEONES (Desplegables) ---

// Seleccionamos todos los wrappers desplegables
const accordions = document.querySelectorAll('.expandable-wrapper');

accordions.forEach(acc => {
    // Buscamos el botón dentro de cada wrapper
    const trigger = acc.querySelector('.expand-trigger');

    trigger.addEventListener('click', () => {
        // 1. Comprobar si este ya está abierto
        const isOpen = acc.classList.contains('open');

        // 2. CERRAR TODOS los demás (Lógica de "Solo uno visible")
        accordions.forEach(otherAcc => {
            otherAcc.classList.remove('open');
            // Reseteamos el max-height para asegurar la animación de cierre
            otherAcc.querySelector('.hidden-content').style.maxHeight = null;
        });

        // 3. Si el que clicamos NO estaba abierto, lo abrimos ahora
        if (!isOpen) {
            acc.classList.add('open');
            const content = acc.querySelector('.hidden-content');
            // Usamos scrollHeight para que la altura sea exacta al contenido
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
});


// --- PROTECCIÓN DE EMAIL (Anti-Scraping) ---
const mailBtn = document.getElementById('secure-mail');

// Rompemos el email en trozos para que no esté escrito en el código
const user = 'juanra';
const dn = 'iesfuengirola1';
const tld = 'es'; 

// Al hacer clic, montamos el mailto y abrimos una ventana nueva
mailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${user}@${dn}.${tld}`;
    window.open(mailtoUrl, '_blank');
});

// También se lo ponemos al 'href' para que al hacer "hover"
// el usuario vea que es un enlace de correo
mailBtn.addEventListener('mouseenter', () => {
    mailBtn.href = `mailto:${user}@${dn}.${tld}`;
});

/* --- LÓGICA DE LA VENTANA MODAL DE COMPARTIR --- */

const shareBtn = document.getElementById('inlineShareBtn');
const modalOverlay = document.getElementById('shareModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const copyLinkOption = document.getElementById('copyLinkOption');
const copyFeedback = document.getElementById('copyFeedback');
const shareViaEmailBtn = document.getElementById('shareViaEmail');


// 1. ABRIR MODAL
if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
    });
}

// 2. CERRAR MODAL
//    en el botón de cierre (X)
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
}
//   pinchar fuera de la ventana (en lo oscuro)
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// 3. LÓGICA DEL BOTÓN EMAIL
if (shareViaEmailBtn) {
    shareViaEmailBtn.addEventListener('click', (e) => {
        // A. IMPORTANTE: Frenamos el comportamiento normal del enlace
        e.preventDefault();
        
        // B. Calculamos los datos al momento del clic
        const currentUrl = window.location.href;
        const subject = "Check out this profile!";
        const body = `Here is the contact profile for Juanra: ${currentUrl}`;
        
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // C. FORZAMOS LA VENTANA NUEVA con JS
        window.open(mailtoUrl, '_blank');
    });
}

// 4. FUNCIÓN COPIAR ENLACE (BLINDADA PARA REMOTO)
if (copyLinkOption) {
    copyLinkOption.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = window.location.href;

        // Intentamos primero la forma moderna
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(url);
                showCopyFeedback();
            } catch (err) {
                // Si falla, vamos al Plan B
                fallbackCopyTextToClipboard(url);
            }
        } else {
            // Si no hay API moderna, vamos directo al Plan B
            fallbackCopyTextToClipboard(url);
        }
    });
}

// --- PLAN B: COPIAR A LA ANTIGUA ---
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Lo hacemos invisible pero presente
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) showCopyFeedback();
    } catch (err) {
        console.error('No se pudo copiar', err);
        alert('Please copy the URL manually from the address bar.');
    }
    
    document.body.removeChild(textArea);
}

// Mostrar mensaje verde "Link Copied!"
function showCopyFeedback() {
    if (copyFeedback) {
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }
}