let startTime, updatedTime, difference, tInterval;
let savedTime = 0;
let isRunning = false;
let isPaused = false;
let laps = [];
let countdownTime, countdownInterval;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resumeBtn = document.getElementById('resumeBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const saveLapsBtn = document.getElementById('saveLapsBtn');
const loadLapsBtn = document.getElementById('loadLapsBtn');
const startCountdownBtn = document.getElementById('startCountdownBtn');
const countdownInput = document.getElementById('countdownInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const lapsContainer = document.getElementById('laps');

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resumeBtn.addEventListener('click', resume);
lapBtn.addEventListener('click', addLap);
resetBtn.addEventListener('click', reset);
saveLapsBtn.addEventListener('click', saveLaps);
loadLapsBtn.addEventListener('click', loadLaps);
startCountdownBtn.addEventListener('click', startCountdown);
darkModeToggle.addEventListener('onclick', toggleDarkMode);

function start() {
    startTime = Date.now() - savedTime;
    tInterval = setInterval(updateTime, 10);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    resumeBtn.disabled = true;
    isRunning = true;
    isPaused = false;
}

function stop() {
    if (isRunning) {
        clearInterval(tInterval);
        savedTime = Date.now() - startTime;
        startBtn.disabled = true;
        stopBtn.disabled = true;
        resumeBtn.disabled = false;
        isRunning = false;
        isPaused = true;
    }
}

function resume() {
    if (isPaused) {
        startTime = Date.now() - savedTime;
        tInterval = setInterval(updateTime, 10);
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resumeBtn.disabled = true;
        isRunning = true;
        isPaused = false;
    }
}

function updateTime() {
    updatedTime = Date.now() - startTime;
    difference = new Date(updatedTime);
    const minutes = (difference.getUTCMinutes()).toString().padStart(2, '0');
    const seconds = (difference.getUTCSeconds()).toString().padStart(2, '0');
    const milliseconds = (difference.getUTCMilliseconds() / 10).toFixed(0).padStart(2, '0');
    display.textContent = `${minutes}:${seconds}.${milliseconds}`;
}

function addLap() {
    if (isRunning || isPaused) {
        const lapTime = display.textContent;
        laps.push(lapTime);
        const lapElement = document.createElement('div');
        lapElement.textContent = `Lap ${laps.length}: ${lapTime}`;
        lapsContainer.appendChild(lapElement);
    }
}

function reset() {
    clearInterval(tInterval);
    savedTime = 0;
    isRunning = false;
    isPaused = false;
    display.textContent = '00:00:00.00';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    resumeBtn.disabled = true;
    laps = [];
    lapsContainer.innerHTML = '';
}

function saveLaps() {
    localStorage.setItem('laps', JSON.stringify(laps));
}

function loadLaps() {
    const savedLaps = JSON.parse(localStorage.getItem('laps'));
    if (savedLaps) {
        laps = savedLaps;
        lapsContainer.innerHTML = '';
        laps.forEach((lapTime, index) => {
            const lapElement = document.createElement('div');
            lapElement.textContent = `Lap ${index + 1}: ${lapTime}`;
            lapsContainer.appendChild(lapElement);
        });
    }
}

function startCountdown() {
    countdownTime = parseInt(countdownInput.value, 10) * 1000;
    if (isNaN(countdownTime) || countdownTime <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }
    const endTime = Date.now() + countdownTime;
    countdownInterval = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            display.textContent = '00:00:00.00';
            alert('Time\'s up!');
        } else {
            const minutes = (Math.floor(timeLeft / 60000)).toString().padStart(2, '0');
            const seconds = (Math.floor((timeLeft % 60000) / 1000)).toString().padStart(2, '0');
            const milliseconds = ((timeLeft % 1000) / 10).toFixed(0).padStart(2, '0');
            display.textContent = `${minutes}:${seconds}.${milliseconds}`;
        }
    }, 10);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Dark Mode On' : 'Dark Mode Off';
}
