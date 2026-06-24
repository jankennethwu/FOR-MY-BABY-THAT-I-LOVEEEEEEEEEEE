// ── CONFIG ─────────────────────────────────────────
const CORRECT_PIN = "0626";   // ← change to your special date
const HINT_DATE   = "06/26";  // ← shown on wrong-pin screen (MM/DD format)
// ───────────────────────────────────────────────────

let currentPin    = "";
let envelopeOpen  = false;

/* ══════════════════════════════════════════
   PIN PAD
══════════════════════════════════════════ */
function pressKey(num) {
    if (currentPin.length >= 4) return;
    currentPin += num;
    updateDots();

    if (currentPin.length === 4) {
        setTimeout(checkPin, 320);
    }
}

function clearPin() {
    currentPin = currentPin.slice(0, -1);
    updateDots();
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('filled', i < currentPin.length);
    });
}

function checkPin() {
    if (currentPin === CORRECT_PIN) {
        // Play music at the chorus
        const music = document.getElementById('bg-music');
        if (music) {
            music.currentTime = 46;
            music.volume = 0.35;
            music.play().catch(() => {});
        }
        switchScreen('lock-screen', 'loading-screen');
        setTimeout(() => switchScreen('loading-screen', 'surprise-screen'), 3500);
    } else {
        showWrongPin();
    }
}

/* ══════════════════════════════════════════
   WRONG PIN SCREEN
══════════════════════════════════════════ */
function showWrongPin() {
    const parts = HINT_DATE.split('/');
    // Animate the numbers counting up to the hint date
    switchScreen('lock-screen', 'wrong-screen');

    const els = [
        document.getElementById('wrong-d1'),
        document.getElementById('wrong-d2'),
        document.getElementById('wrong-d3')
    ];

    const targets = [parts[0] || '??', parts[1] || '??', new Date().getFullYear().toString().slice(-2)];

    els.forEach((el, idx) => {
        el.textContent = '00';
        let count = 0;
        const target = parseInt(targets[idx]) || 0;
        const interval = setInterval(() => {
            count++;
            el.textContent = String(count).padStart(2, '0');
            if (count >= target) {
                clearInterval(interval);
                el.textContent = targets[idx];
            }
        }, 60);
    });

    // Return to lock screen after 3 seconds
    setTimeout(() => {
        currentPin = "";
        switchScreen('wrong-screen', 'lock-screen');
        updateDots();
    }, 3200);
}

/* ══════════════════════════════════════════
   ENVELOPE
══════════════════════════════════════════ */
function openEnvelope() {
    if (envelopeOpen) return;
    envelopeOpen = true;

    const env = document.getElementById('envelope');
    env.classList.add('opened');

    // After flap animation, reveal the letter
    setTimeout(() => {
        document.getElementById('envelope-wrap').style.display = 'none';
        const reveal = document.getElementById('letter-reveal');
        reveal.classList.remove('hidden');
    }, 650);
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
function goToCake() {
    switchScreen('surprise-screen', 'cake-screen');
}

function switchScreen(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    hideEl.classList.add('hidden');
    hideEl.classList.remove('active');

    showEl.classList.remove('hidden');
    showEl.classList.add('active');
}

/* ══════════════════════════════════════════
   CAKE — BLOW CANDLES
══════════════════════════════════════════ */
function blowCandles() {
    // 1. Extinguish flames
    document.querySelectorAll('.flame').forEach(f => f.classList.add('out'));

    // 2. Hide button, glow the cake, reveal message
    document.getElementById('blow-btn').style.display = 'none';
    document.getElementById('css-cake').classList.add('blown');

    setTimeout(() => {
        document.getElementById('celebration-msg').classList.remove('hidden');
        document.body.style.backgroundColor = '#8b2252';
    }, 500);

    // 3. Confetti burst
    for (let i = 0; i < 120; i++) {
        setTimeout(createConfetti, Math.random() * 600);
    }
}

function createConfetti() {
    const el = document.createElement('div');
    el.classList.add('confetti-piece');

    const colors = ['#ffd700', '#ff6b81', '#ffffff', '#ff9f40', '#9966ff', '#4bc0c0', '#ff3860'];
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.opacity           = Math.random() * 0.8 + 0.2;
    el.style.transform         = `scale(${Math.random() * 0.8 + 0.4})`;
    el.style.borderRadius      = Math.random() > 0.5 ? '50%' : '0';
    el.style.width             = (Math.random() * 8 + 6) + 'px';
    el.style.height            = (Math.random() * 8 + 6) + 'px';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
}