let startTime;
let elapsedTime = 0;
let timerInterval;
let lapCount = 0;
let audioCtx;

// Inicializa áudio no primeiro clique (necessário para navegadores modernos)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(freq, duration = 0.1) {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function start() {
    playSound(800); // Som de início
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("pauseBtn").style.display = "block";
}

function pause() {
    playSound(400); // Som de pausa
    clearInterval(timerInterval);
    document.getElementById("startBtn").style.display = "block";
    document.getElementById("pauseBtn").style.display = "none";
}

function reset() {
    playSound(200, 0.3); // Som de reset
    clearInterval(timerInterval);
    elapsedTime = 0;
    lapCount = 0;
    updateDisplay();
    document.getElementById("lapsList").innerHTML = "";
    document.getElementById("startBtn").style.display = "block";
    document.getElementById("pauseBtn").style.display = "none";
}

function recordLap() {
    if (elapsedTime === 0) return;
    playSound(1000, 0.05); // Som de volta
    lapCount++;
    const t = timeToString(elapsedTime);
    const list = document.getElementById("lapsList");
    const li = document.createElement("li");
    li.innerHTML = `<span>#${lapCount} VOLTA</span> <span>${t.m}:${t.s}.${t.ms}</span>`;
    list.prepend(li);
}

function updateDisplay() {
    const t = timeToString(elapsedTime);
    document.getElementById("minutes").innerText = t.m;
    document.getElementById("seconds").innerText = t.s;
    document.getElementById("milliseconds").innerText = "." + t.ms;
}

function timeToString(time) {
    let mm = Math.floor(time / 60000);
    let ss = Math.floor((time % 60000) / 1000);
    let ms = Math.floor((time % 1000) / 10);
    return {
        m: mm.toString().padStart(2, "0"),
        s: ss.toString().padStart(2, "0"),
        ms: ms.toString().padStart(2, "0")
    };
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}