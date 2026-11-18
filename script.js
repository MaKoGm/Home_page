// --- 1. RELOJ SÓLIDO MATRIZ 3x5 (tty-clock exacto) ---
const DIGITS = {
    '0': [
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ],
    '1': [
        [1,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ],
    '2': [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ],
    '3': [
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '4': [
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [0,0,1]
    ],
    '5': [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    '6': [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '7': [
        [1,1,1],
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [0,0,1]
    ],
    '8': [
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],
    '9': [
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ],
    ':': [
        [0],
        [1],
        [0],
        [1],
        [0]
    ]
};

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const svg = document.getElementById('pixel-clock');
    let rects = '';
    let xOffset = 0;

    for (const ch of timeStr) {
        const matrix = DIGITS[ch] || DIGITS['0'];
        const width = matrix[0].length;

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < width; c++) {
                if (matrix[r][c]) {
                    // 1.02 evita micro-líneas transparentes entre bloques en pantallas HiDPI
                    rects += `<rect x="${xOffset + c}" y="${r}" width="1.02" height="1.02" />`;
                }
            }
        }
        xOffset += width + 1; // 1 unidad de separación entre dígitos
    }

    svg.innerHTML = rects;

    document.getElementById('date').textContent = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'short'
    }).toLowerCase();
}

updateClock();
setInterval(updateClock, 10000);


// --- 2. EASTER EGG: MODO CRT NEÓN ---
function toggleCRT() {
    document.body.classList.toggle('crt-mode');
}


// --- 3. NAVEGACIÓN VIM Y COMANDOS ---
const cmdInput = document.getElementById('cmd-input');
const links = Array.from(document.querySelectorAll('#menu-list a'));
let selectedIndex = 0;

function updateSelection() {
    links.forEach((link, idx) => {
        link.classList.toggle('active', idx === selectedIndex);
    });
}

document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = cmdInput.value.trim();
    if (!query) return;

    if (query === ':crt' || query === ':matrix') {
        toggleCRT();
        cmdInput.value = '';
        cmdInput.blur();
        return;
    }

    if (query.startsWith('http://') || query.startsWith('https://')) {
        window.location.href = query;
    } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
});

document.addEventListener('keydown', (e) => {
    // Easter Egg CRT: Alt + C
    if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        toggleCRT();
        return;
    }

    if (document.activeElement === cmdInput) {
        if (e.key === 'Escape') {
            cmdInput.value = '';
            cmdInput.blur();
        }
        return;
    }

    const key = e.key.toLowerCase();

    if (key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % links.length;
        updateSelection();
    } else if (key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + links.length) % links.length;
        updateSelection();
    } else if (e.key === 'Enter') {
        window.location.href = links[selectedIndex].href;
    } else if (key === '/') {
        e.preventDefault();
        cmdInput.focus();
    } else {
        const target = document.getElementById(`link-${key}`);
        if (target) {
            window.location.href = target.href;
        }
    }
});
