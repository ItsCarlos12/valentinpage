/* Stardew Valley Event Logic */

const script = [
    "Hola... Gracias por venir.",
    "He encontrado algo raro en la playa...",
    "Dicen que se entrega a quien más quieres en este mundo...",
    "¿Quieres ser mi Valentín?"
];

let currentIndex = 0;
let isTyping = false;
let waitingForChoice = false;
let hasSaidNoBefore = false; // <-- Añade esta línea

// DOM Elements
const textTarget = document.getElementById('text-target');
const arrow = document.getElementById('arrow');
const mainBox = document.getElementById('main-box');
const choicesMenu = document.getElementById('choices-menu');
const itemDisplay = document.getElementById('special-item');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const portraitImg = document.querySelector('.portrait-img'); // <-- SELECCIONAR EL RETRATO

/**
 * Types text character by character
 * @param {string} text - The text to display
 * @param {boolean} triggerChoices - Whether to show choices after this text
 * @param {function} callback - Optional callback after typing finishes
 */
function typeText(text, triggerChoices = false, callback = null) {
    isTyping = true;
    textTarget.innerHTML = "";
    arrow.style.display = "none";
    portraitImg.classList.add('is-talking'); // <-- AÑADIR CLASE DE ANIMACIÓN

    let i = 0;
    const speed = 40;

    const timer = setInterval(() => {
        textTarget.textContent += text.charAt(i);
        i++;

        if (i >= text.length) {
            clearInterval(timer);
            isTyping = false;
            portraitImg.classList.remove('is-talking'); // <-- QUITAR CLASE DE ANIMACIÓN

            if (triggerChoices) {
                showChoices();
            } else if (callback) {
                callback();
            } else {
                if (!waitingForChoice) {
                    arrow.style.display = "block";
                }
            }
        }
    }, speed);
}

function showChoices() {
    setTimeout(() => {
        waitingForChoice = true;
        itemDisplay.style.display = 'block';
        choicesMenu.style.display = 'flex';
    }, 400);
}

function advanceDialogue() {
    if (isTyping || waitingForChoice) return;

    if (currentIndex < script.length - 1) {
        currentIndex++;
        const isLast = (currentIndex === script.length - 1);
        typeText(script[currentIndex], isLast);
    }
}

mainBox.addEventListener('click', (e) => {
    if (e.target.closest('.choice-btn')) return;
    advanceDialogue();
});

arrow.addEventListener('click', (e) => {
    e.stopPropagation();
    advanceDialogue();
});

btnYes.addEventListener('click', () => {
    choicesMenu.style.display = 'none';

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.7 },
            colors: ['#ffe5b4', '#ff4d4d', '#ffffff'],
            shapes: ['heart']
        });
    }

    textTarget.innerHTML = "";
    typeText("¡Sabía que dirías que sí!", false, () => {
        // Comprueba si el usuario había dicho "no" antes
        if (hasSaidNoBefore) {
            setTimeout(() => {
                // Muestra el mensaje extra y luego el final
                typeText("¡Nunca lo dudé!", false, showFinalMessage);
            }, 1200); // Pausa para el mensaje extra
        } else {
            // Si es la primera vez, muestra el mensaje final directamente
            showFinalMessage();
        }
    });
});

btnNo.addEventListener('click', () => {
    hasSaidNoBefore = true; // Marcamos que el usuario ya ha dicho "no"
    choicesMenu.style.display = 'none';
    itemDisplay.style.display = 'none'; // Ocultamos el objeto para el chiste

    typeText("...Oh. Creo que no te escuché bien.", false, () => {
        setTimeout(() => {
            typeText("¿Querías decir que sí, verdad?", false, () => {
                waitingForChoice = false;
                showChoices();
            });
        }, 1500); // Pausa de 1.5 segundos entre frases
    });
});

window.onload = () => {
    setTimeout(() => typeText(script[0]), 800);
};

// Función para mostrar el mensaje final de los corazones
function showFinalMessage() {
    setTimeout(() => {
        // Usamos textTarget.innerHTML para añadir el nuevo contenido
        const existingText = textTarget.innerHTML.split('<br>')[0];
        textTarget.innerHTML = existingText + `<br><span class='success-message'><img src='assets/heart.png' class='heart-icon' alt='corazón'> 14 corazones conseguidos<img src='assets/heart.png' class='heart-icon' alt='corazón'></span>`;
    }, 300);
}

//cambio