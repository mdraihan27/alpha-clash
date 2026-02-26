/* ─────────────────────────────────────────────
   Keyboard Clash Pro — alpha-clash.js
   Game logic (unchanged) + modern UI + leaderboard
───────────────────────────────────────────── */

/* ── STATE ─────────────────────────────────── */
let gameRunning = false;
let intervalId1 = null;
let keyPressed = true;          // true = waiting for next letter
let pressedKey = 'no-key';
let right = true;
let wrongAlpha;
let runCount = 0;
let currentAlpha = 'no-key';
let lives = 5;
let score = 0;
let timerProgress = 0;
let timerInterval = null;

const INTERVAL_MS = 1500;                          // ms per round
const MAX_LIVES = 5;
const STORAGE_KEY = 'alphaClashScores';

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

/* ── DOM REFS ───────────────────────────────── */
const scoreCountEl = document.getElementById('score-count');
const currentAlphaEl = document.getElementById('current-alpha');
const finalScoreEl = document.getElementById('final-page-score');
const heartsEl = document.getElementById('hud-hearts');
const letterCard = document.getElementById('letter-card');
const nameEntryEl = document.getElementById('name-entry');
const gameoverActEl = document.getElementById('gameover-actions');
const nameInputEl = document.getElementById('player-name-input');
const lbListEl = document.getElementById('lb-list');
const timerCircle = document.getElementById('timer-circle');
const toastEl = document.getElementById('toast');

/* ── BACKGROUND PARTICLES ───────────────────── */
(function spawnParticles() {
    const container = document.getElementById('bg-particles');
    const colors = ['#ffffff', '#a3a3a3', '#404040'];
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const sz = Math.random() * 5 + 2;
        p.style.cssText = `
            width:${sz}px; height:${sz}px;
            left:${Math.random() * 100}%;
            bottom:${-10}%;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration:${6 + Math.random() * 10}s;
            animation-delay:${Math.random() * 12}s;
        `;
        container.appendChild(p);
    }
})();



/* ── SCREEN SWITCHER ─────────────────────────── */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

/* ── LEADERBOARD ─────────────────────────────── */
function getScores() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (_) { return []; }
}

function saveScores(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function saveScore() {
    const name = nameInputEl.value.trim() || 'Anonymous';
    const scores = getScores();
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    saveScores(scores.slice(0, 20));           // keep top 20
    showToast(`✓ Score saved for "${name}"`);
    showGameoverActions();
}

function skipSave() {
    showGameoverActions();
}

function showGameoverActions() {
    nameEntryEl.style.display = 'none';
    gameoverActEl.style.display = 'flex';
}

function showLeaderboard() {
    renderLeaderboard();
    showScreen('leaderboard');
}

function renderLeaderboard() {
    const scores = getScores();
    if (scores.length === 0) {
        lbListEl.innerHTML = '<div class="lb-empty">No scores yet.<br>Be the first to claim the throne! 👑</div>';
        return;
    }
    const medals = ['🥇', '🥈', '🥉'];
    lbListEl.innerHTML = scores.map((entry, i) => `
        <div class="lb-row ${i < 3 ? 'rank-' + (i + 1) : ''}">
            <span class="lb-rank">${medals[i] || (i + 1)}</span>
            <span class="lb-name">${escHtml(entry.name)}</span>
            <span class="lb-score">${entry.score}</span>
        </div>
    `).join('');
}

function clearLeaderboard() {
    if (!confirm('Clear all saved scores?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderLeaderboard();
    showToast('Leaderboard cleared');
}

function goHome() {
    showScreen('home');
}

function escHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
}

/* ── TOAST ───────────────────────────────────── */
let toastTimer;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

/* ── TIMER RING ──────────────────────────────── */
const CIRCUMFERENCE = 138.2; // 2 * π * 22

function startTimerRing() {
    clearInterval(timerInterval);
    timerProgress = 0;
    updateTimerRing(0);
    const steps = 60;
    const step_ms = INTERVAL_MS / steps;
    timerInterval = setInterval(() => {
        timerProgress = Math.min(timerProgress + (1 / steps), 1);
        updateTimerRing(timerProgress);
    }, step_ms);
}

function updateTimerRing(progress) {
    const offset = CIRCUMFERENCE * progress;
    timerCircle.style.strokeDashoffset = offset;
    // colour shift: default → amber → red
    if (progress < 0.5) {
        timerCircle.style.stroke = 'var(--text)';
    } else if (progress < 0.8) {
        timerCircle.style.stroke = 'var(--warning)';
    } else {
        timerCircle.style.stroke = 'var(--danger)';
    }
}

function stopTimerRing() {
    clearInterval(timerInterval);
}

/* ── HEARTS ──────────────────────────────────── */
function updateHearts() {
    const heartSpans = heartsEl.querySelectorAll('.heart');
    heartSpans.forEach((h, i) => {
        if (i < lives) h.classList.remove('lost');
        else h.classList.add('lost');
    });
}

/* ── SCORE DISPLAY ───────────────────────────── */
function setScore(n) {
    scoreCountEl.textContent = n;
}

/* ── SCORE FLASH ─────────────────────────────── */
function flashScore(type) {
    const el = document.createElement('div');
    el.className = `score-flash ${type}`;
    el.textContent = type === 'plus' ? '+1' : '-1';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
}

/* ── KEYBOARD STATE ──────────────────────────── */
function highlightKey(letter) {
    const el = document.getElementById(letter);
    if (!el) return;
    el.classList.remove('correct-key', 'wrong-key');
    el.classList.add('active-key');
}

function correctKeyPressed(letter) {
    const el = document.getElementById(letter);
    if (!el) return;
    el.classList.remove('active-key', 'wrong-key');
    el.classList.add('correct-key');
    letterCard.classList.remove('wrong', 'timeout');
    letterCard.classList.add('correct');
    setTimeout(() => letterCard.classList.remove('correct'), 300);
}

function wrongKeyPressedUI(letter) {
    const el = document.getElementById(letter);
    if (!el) return;
    el.classList.remove('active-key', 'correct-key');
    el.classList.add('wrong-key');
    letterCard.classList.remove('correct', 'timeout');
    letterCard.classList.add('wrong');
    setTimeout(() => letterCard.classList.remove('wrong'), 400);
}

function keyColorReset() {
    alphabets.forEach(letter => {
        const el = document.getElementById(letter);
        if (el) el.classList.remove('active-key', 'correct-key', 'wrong-key');
    });
    letterCard.classList.remove('correct', 'wrong', 'timeout');
}

/* ── GAME FLOW ───────────────────────────────── */
function startGame() {
    gameRunning = true;
    runCount = 0;
    score = 0;
    lives = MAX_LIVES;
    keyPressed = true;
    setScore(0);
    updateHearts();
    currentAlphaEl.textContent = '';
    showScreen('play');
    genRandomAlpha();
    intervalId1 = setInterval(genRandomAlpha, INTERVAL_MS);
}

function play2() {
    gameRunning = true;
    score = 0;
    lives = MAX_LIVES;
    keyPressed = true;
    runCount = 0;
    setScore(0);
    updateHearts();
    keyColorReset();
    currentAlphaEl.textContent = '';
    showScreen('play');
    genRandomAlpha();
    intervalId1 = setInterval(genRandomAlpha, INTERVAL_MS);
}

function genRandomAlpha() {
    gameOverCheck();
    if (!gameRunning) return;

    if (!keyPressed) {
        // timed out
        wrongKeyPressedUI(currentAlpha);
        letterCard.classList.add('timeout');
        lives--;
        lives = Math.max(lives, 0);
        updateHearts();
        flashScore('minus');
        keyPressed = true;
        return;
    }

    keyColorReset();
    keyPressed = false;
    runCount++;

    const random = Math.floor(Math.random() * 26);
    currentAlpha = alphabets[random];
    currentAlphaEl.textContent = currentAlpha;
    highlightKey(currentAlpha);
    startTimerRing();
}

function gameOverCheck() {
    if (lives <= 0) {
        clearInterval(intervalId1);
        stopTimerRing();
        keyColorReset();
        gameRunning = false;
        finalScoreEl.textContent = score;

        // reset name entry UI
        nameInputEl.value = '';
        nameEntryEl.style.display = 'flex';
        gameoverActEl.style.display = 'none';

        showScreen('score');
    }
}

/* ── KEY LISTENER ────────────────────────────── */
document.addEventListener('keyup', function (event) {
    // Start / restart from home or score screens
    if (!gameRunning) {
        if (event.key === 'Enter') {
            const scoreScreen = document.getElementById('score');
            const homeScreen = document.getElementById('home');
            if (scoreScreen.classList.contains('active') && gameoverActEl.style.display !== 'none') {
                play2();
            } else if (homeScreen.classList.contains('active')) {
                startGame();
            }
        }
        return;
    }

    if (lives <= 0 || !gameRunning || keyPressed) return;

    pressedKey = event.key.toUpperCase();
    keyPressed = true;

    if (pressedKey === currentAlpha) {
        correctKeyPressed(pressedKey);
        score++;
        setScore(score);
        flashScore('plus');
    } else {
        right = false;
        if (alphabets.includes(pressedKey)) {
            wrongKeyPressedUI(pressedKey);
        } else {
            wrongKeyPressedUI(currentAlpha);
        }
        lives--;
        lives = Math.max(lives, 0);
        updateHearts();
        flashScore('minus');
    }
});

/* ── ENTER to save score ─────────────────────── */
nameInputEl.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') saveScore();
});
