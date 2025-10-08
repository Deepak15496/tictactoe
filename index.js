const startBtn = document.getElementById('startBtn');
const turnInfo = document.getElementById('turnInfo');
const boxes = document.querySelectorAll('.box');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const timeElapsed = document.getElementById('timeElapsed');
const msg = document.getElementById('msg');

let startTime;       // When the timer started
let elapsedTime = 0; // Total elapsed time (including before pause)
let timerInterval;   // Reference to setInterval

// Start the timer
function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals

    startTime = new Date().getTime() - elapsedTime; // Adjust start time if resuming
    timerInterval = setInterval(updateTimer, 1000);
}

// Pause the timer
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = new Date().getTime() - startTime; // Store elapsed time so far
}

// Resume the timer
function resumeTimer() {
    if (!timerInterval) {
        startTime = new Date().getTime() - elapsedTime; // Adjust start time
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// Stop and reset the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = new Date().getTime() - startTime;
}

// Update display each second
function updateTimer() {
    const currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;

    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);

    updateDisplay(hours, minutes, seconds);
}

// Helper: update display
function updateDisplay(hours, minutes, seconds) {
    const formatted = 
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;

    timeElapsed.value = formatted;
}


startBtn.addEventListener('click', () => {
   const boxes = document.querySelectorAll('.box');
   
    boxes.forEach((box)=>{
         box.style.pointerEvents = 'auto';
         box.style.cursor = 'pointer';
    });
    startBtn.style.display = 'none';
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    msg.style.display = 'none';
    timeElapsed.style.display = 'inline-block';
    turnInfo.style.display = 'inline-block';
    startTimer();
    document.getElementById('turnInfo').value = "X's Turn";
});

pauseBtn.addEventListener('click', () => {
    boxes.forEach((box)=>{
         box.style.pointerEvents = 'none';
         box.style.cursor = 'not-allowed';
    });
    pauseTimer();
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'inline-block';
});

resumeBtn.addEventListener('click', () => {
     boxes.forEach((box)=>{
         box.style.pointerEvents = 'auto';
         box.style.cursor = 'pointer';
    });
    resumeTimer();
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
});

resetBtn.addEventListener('click', () => {
    boxes.forEach(box => {
        box.innerText = '';
        box.style.pointerEvents = 'none';
        box.style.cursor = 'not-allowed';
        box.style.backgroundColor = '#f5d4d4';
    });
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'inline-block';
    resumeBtn.style.display = 'none';
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    turnInfo.style.display = 'none';
    timeElapsed.style.display = 'none';
    msg.innerText= 'Welcome to TIC TAC TOE ! Start the game to begin'
    msg.style.display = 'inline-block';
    timeElapsed.value = '00:00:00';
    stopTimer();
    elapsedTime = 0;
});

boxes.forEach(box => {
    box.addEventListener('click', () => {
        if (box.innerText === '') { 
            box.innerText = 'X';
            const win = checkWin();
            if (win) return;
            document.getElementById('turnInfo').value = "O's Turn";
            box.style.pointerEvents = 'none';
            box.style.cursor = 'not-allowed';
            setTimeout(computerMove, 500);
        }
    });
});
function computerMove() {
    let availableBoxes = [];
    boxes.forEach(box => {
        if (box.innerText === '') {
            availableBoxes.push(box);
        }
    });
    if (availableBoxes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableBoxes.length);
        const selectedBox = availableBoxes[randomIndex];
        selectedBox.innerText = 'O';
        selectedBox.style.pointerEvents = 'none';
        selectedBox.style.cursor = 'not-allowed';
        checkWin();
        document.getElementById('turnInfo').value = "X's Turn";
        
    }
}

function checkWin(){
    const winCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let winner = null;

    winCombinations.forEach(combination => {
        const [a, b, c] = combination; 
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            winner = boxes[a].innerText;
            boxes[a].style.backgroundColor = '#90ee90';
            boxes[b].style.backgroundColor = '#90ee90';
            boxes[c].style.backgroundColor = '#90ee90';
        }
    });

    if (winner) {
        msg.style.display = 'block';
        msg.innerText = `${winner} Wins!`;
        boxes.forEach(box => {
            box.style.pointerEvents = 'none';
            box.style.cursor = 'not-allowed';
        });
        turnInfo.style.display = 'none';
        pauseBtn.disabled = true;
        stopTimer();

    }
    else if ([...boxes].every(box => box.innerText !== '')) {
        msg.style.display = 'block';
        msg.innerText = "It's a Draw!";
        turnInfo.style.display = 'none';
        pauseBtn.disabled = true;
        winner = 'Draw';
        stopTimer();
    }
    return winner;
}