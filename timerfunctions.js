// Initialize all variables
let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let currentTime = 0;
let elapsedTime = 0;
let totalLapTime = 0;

// Two flags to track the state of the stopwatch
let running = false;
let paused = false;

let tInterval;
let startTime;
let lapTimes = [];
let lapTime = 0;
let lapStartTimes = [];
let lapStartTime;
let lapEndTimes = [];
let lapEndTime;
let bestLapTime = null;

// Get the required elements by their IDs
const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const resumeButton = document.getElementById("resumeBtn");
const lapButton = document.getElementById("lapBtn");
const timeDisplay = document.getElementById("display");
const lapDisplay = document.getElementById("lapList").getElementsByTagName("tbody")[0];
const bestLapDisplay = document.getElementById("bestLap");

// Initially keep the Pause and Lap buttons disabled
pauseButton.disabled = true;
lapButton.disabled = true;

// Start the stopwatch upon clicking the 'Start' button
const startTimer = () => {
    // Upon starting/resuming, fetch current time and update the button states
    if (!running && !paused) {
        if (elapsedTime === 0) {
            startTime = new Date().getTime();
            lapStartTimes.push(startTime);
        } else {
            startTime = new Date().getTime() - elapsedTime;
        }

        startButton.classList.remove("startBtn");
        startButton.classList.add("resetBtn");
        startButton.textContent = "Reset";
        pauseButton.disabled = false;
        lapButton.disabled = false;

        tInterval = setInterval(displayTime, 10);
        running = true;
    }
    
    // Timer can be reset while running or paused
    else if(running || paused) {
        resetTimer();
    }
}

// Pause the timer and read the time at which it was paused -- the timer resumes properly from this time
const pauseTimer = () => {
    if (running && !paused) {
        clearInterval(tInterval);
        startTime = elapsedTime;
        pauseButton.textContent = "Resume";
        lapButton.disabled = true;
        running = false;
        paused = true;
    }        
    else {
        resumeTimer();
    }
}

// The same button gets updated to enable resuming the timer
const resumeTimer = () => {
    startTime = new Date().getTime() - elapsedTime;
    pauseButton.textContent = "Pause";
    tInterval = setInterval(displayTime, 10);
    lapButton.disabled = false;
    running = true;
    paused = false;
}

// Upon resetting, bring all variables back to their initial state
const resetTimer = () => {
    clearInterval(tInterval);
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    elapsedTime = 0;
    currentTime = 0;
    lapTime = 0;
    lapStartTime = 0;
    lapEndTime = 0;
    totalLapTime = 0;
    lapTimes = [];
    lapStartTimes = [];
    lapEndTimes = [];
    document.getElementById("display").innerHTML = "00:00:00:00";
    lapDisplay.innerHTML = "";
    bestLapDisplay.innerHTML = "N/A";
    bestLapTime = null;
    startButton.classList.add("startBtn");
    startButton.classList.remove("resetBtn");
    startButton.textContent = "Start";
    pauseButton.textContent = "Pause";
    pauseButton.disabled = true;
    lapButton.disabled = true;
    running = false;
    paused = false;
}

// Display time in the format of hr:mins:secs:ms; constantly updated
const displayTime = () => {
    currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;

    let elapsedhours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    let elapsedminutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let elapsedseconds = Math.floor((elapsedTime / 1000) % 60);
    let elapsedmilliseconds = Math.floor((elapsedTime % 1000) / 10);

    timeDisplay.innerHTML = `${elapsedhours < 10 ? "0" + elapsedhours : elapsedhours}:${elapsedminutes < 10 ? "0" + elapsedminutes : elapsedminutes}:${elapsedseconds < 10 ? "0" + elapsedseconds : elapsedseconds}:${elapsedmilliseconds < 10 ? "0" + elapsedmilliseconds : elapsedmilliseconds}`;
}

// Once the user clicks the 'Lap' button, record the lap time. This is then displayed in a table
const recordLap = () => {
    if(running) {
        // Determine when a lap ends
        lapEndTime = lapStartTimes[lapStartTimes.length - 1] + elapsedTime;
        lapEndTimes.push(lapEndTime);

        // Time when one lap ends will be when the next lap starts
        lapStartTime = lapStartTimes[lapStartTimes.length - 1];

        // Find the time taken for current lap
        lapTime = (lapEndTime - lapStartTime) - totalLapTime;
        lapTimes.push(lapTime);

        // Total time for all laps
        totalLapTime += lapTime;

        // Format current lap time
        let lapHrs = Math.floor((lapTime / (1000 * 60 * 60)) % 24);
        let lapMins = Math.floor((lapTime / (1000 * 60)) % 60);
        let lapSecs = Math.floor((lapTime / 1000) % 60);
        let lapMills = Math.floor((lapTime % 1000) / 10);
        const formattedLapTime = `${lapHrs < 10 ? "0" + lapHrs : lapHrs}:${lapMins < 10 ? "0" + lapMins : lapMins}:${lapSecs < 10 ? "0" + lapSecs : lapSecs}:${lapMills < 10 ? "0" + lapMills : lapMills}`;

        // Format total lap time
        let totalLapHrs = Math.floor((totalLapTime / (1000 * 60 * 60)) % 24);
        let totalLapMins = Math.floor((totalLapTime / (1000 * 60)) % 60);
        let totalLapapSecs = Math.floor((totalLapTime / 1000) % 60);
        let totalLapMills = Math.floor((totalLapTime % 1000) / 10);
        const formattedTotalLapTime = `${totalLapHrs < 10 ? "0" + totalLapHrs : totalLapHrs}:${totalLapMins < 10 ? "0" + totalLapMins : totalLapMins}:${totalLapapSecs < 10 ? "0" + totalLapapSecs : totalLapapSecs}:${totalLapMills < 10 ? "0" + totalLapMills : totalLapMills}`;

        // Add new row to the lap table, such that the latest lap appears on the first row
        const lapRow = lapDisplay.insertRow(0);
        const lapCell0 = lapRow.insertCell(0);
        const lapCell1 = lapRow.insertCell(1);
        const lapCell2 = lapRow.insertCell(2);

        lapCell0.innerHTML = `${lapTimes.length}`;
        lapCell1.innerHTML = `${formattedLapTime}`;
        lapCell2.innerHTML = `${formattedTotalLapTime}`;

        // Determine and display the best lap time
        if (!bestLapTime || lapTime < bestLapTime) {
            bestLapTime = lapTime;
            bestLapDisplay.innerHTML = `${formattedLapTime}`;
        }
        lapStartTimes.push(lapEndTime);
    }
}

// Detect when the respective buttons are clicked
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
lapButton.addEventListener("click", recordLap);