/* --- FONDO DE PANTALLA ALEATORIO --- */
const backgroundDiv = document.querySelector('.background-image');

const images = [
    'imgs/bosque.jpg',
    'imgs/guitarra.jpg',
    'imgs/kandinsky.jpg',
    'imgs/guitarrica.jpg',
    'imgs/teatro.jpg',
    'imgs/dorre2.jpg'
];

let currentIndex = 0;

function changeBackground() {
    let newIndex; // Obtener un índice aleatorio que no sea el actual
    do {
        newIndex = Math.floor(Math.random() * images.length);
    } while (newIndex === currentIndex); // Asegurarse de que no repita la misma imagen

    currentIndex = newIndex;
    backgroundDiv.style.backgroundImage = `url('${images[currentIndex]}')`;
}

// Cambiar el fondo cada 5 segundos (5000 milisegundos)
setInterval(changeBackground, 5000); 

// Cargar el primer fondo al iniciar
changeBackground();


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
