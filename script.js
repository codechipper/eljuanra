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

// --- LÓGICA DE LA VENTANA MODAL DE COMPARTIR ---

const shareBtn = document.getElementById('inlineShareBtn'); // El botón de arriba
const modalOverlay = document.getElementById('shareModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const copyLinkOption = document.getElementById('copyLinkOption');
const copyFeedback = document.getElementById('copyFeedback');

// 1. ABRIR MODAL
shareBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que el enlace haga nada raro
    modalOverlay.classList.add('active');
});

// 2. CERRAR MODAL (Botón X)
closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

// 3. CERRAR AL HACER CLIC FUERA (En lo oscuro)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// 4. FUNCIÓN COPIAR ENLACE
copyLinkOption.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        
        // Mostrar mensaje "Copiado"
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
            // Opcional: Cerrar modal automáticamente después de copiar
            // modalOverlay.classList.remove('active');
        }, 2000);
        
    } catch (err) {
        console.error('Error while copying', err);
    }
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
