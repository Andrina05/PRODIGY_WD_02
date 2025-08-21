let hours = 0;
let minutes = 0;
let seconds = 0;
let milliseconds = 0;
let currentTime = 0;
let elapsedTime = 0;
let totalLapTime = 0;

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

const startButton = document.getElementById("startBtn");
const pauseButton = document.getElementById("pauseBtn");
const resumeButton = document.getElementById("resumeBtn");
const lapButton = document.getElementById("lapBtn");
const timeDisplay = document.getElementById("display");
const lapDisplay = document.getElementById("lapList");
const bestLapDisplay = document.getElementById("bestLap");

pauseButton.disabled = true;
lapButton.disabled = true;

const startTimer = () => {
    if (!running && !paused) {
        if (elapsedTime === 0) {
            startTime = new Date().getTime();
            lapStartTimes.push(startTime);
        } else {
            startTime = new Date().getTime() - elapsedTime;
        }

        startButton.textContent = "Reset";
        pauseButton.disabled = false;
        lapButton.disabled = false;

        console.log("Start time: ", startTime);
        console.log("Lap start times: ", lapStartTimes);
        tInterval = setInterval(displayTime, 10);
        running = true;
    }
 
    else if(running || paused) {
        resetTimer();
    }
}

const pauseTimer = () => {
    if (running) {
        clearInterval(tInterval);
        startTime = elapsedTime;
        console.log("Paused at: ", startTime);
        pauseButton.textContent = "Resume";
        lapButton.disabled = true;
        running = false;
        paused = true;
    }        
    else {
        resumeTimer();
    }
}

const resumeTimer = () => {
    startTime = new Date().getTime() - elapsedTime;
    pauseButton.textContent = "Pause";
    tInterval = setInterval(displayTime, 10);
    lapButton.disabled = false;
    running = true;
    paused = false;
}

const resetTimer = () => {
    clearInterval(tInterval);
    hours = minutes = seconds = milliseconds = elapsedTime = currentTime = lapTime = lapStartTime = lapEndTime = totalLapTime = 0;
    lapTimes = lapStartTimes = lapEndTimes = [];
    document.getElementById("display").innerHTML = "00:00:00:00";
    lapDisplay.innerHTML = "";
    bestLapDisplay.innerHTML = "N/A";
    bestLapTime = null;
    startButton.textContent = "Start";
    pauseButton.textContent = "Pause";
    pauseButton.disabled = true;
    lapButton.disabled = true;
    startButton.disabled = false;
    running = false;
    paused = false;
}

const displayTime = () => {
    currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;

    let elapsedhours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    let elapsedminutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let elapsedseconds = Math.floor((elapsedTime / 1000) % 60);
    let elapsedmilliseconds = Math.floor((elapsedTime % 1000) / 10);

    timeDisplay.innerHTML = `${elapsedhours < 10 ? "0" + elapsedhours : elapsedhours}:${elapsedminutes < 10 ? "0" + elapsedminutes : elapsedminutes}:${elapsedseconds < 10 ? "0" + elapsedseconds : elapsedseconds}:${elapsedmilliseconds < 10 ? "0" + elapsedmilliseconds : elapsedmilliseconds}`;
}

const recordLap = () => {
    if(running) {
        lapEndTime = lapStartTimes[lapStartTimes.length - 1] + elapsedTime;
        lapEndTimes.push(lapEndTime);
        console.log("Lap end times: ", lapEndTimes);

        lapStartTime = lapStartTimes[lapStartTimes.length - 1];
        lapTime = (lapEndTime - lapStartTime) - totalLapTime;
        lapTimes.push(lapTime);
        console.log("Lap time: ", lapTime);

        totalLapTime += lapTime;
        console.log("Total lap time: ", totalLapTime);

        let lapHrs = Math.floor((lapTime / (1000 * 60 * 60)) % 24);
        let lapMins = Math.floor((lapTime / (1000 * 60)) % 60);
        let lapSecs = Math.floor((lapTime / 1000) % 60);
        let lapMills = Math.floor((lapTime % 1000) / 10);

        let totalLapHrs = Math.floor((totalLapTime / (1000 * 60 * 60)) % 24);
        let totalLapMins = Math.floor((totalLapTime / (1000 * 60)) % 60);
        let totalLapapSecs = Math.floor((totalLapTime / 1000) % 60);
        let totalLapMills = Math.floor((totalLapTime % 1000) / 10);

        const formattedLapTime = `${lapHrs < 10 ? "0" + lapHrs : lapHrs}:${lapMins < 10 ? "0" + lapMins : lapMins}:${lapSecs < 10 ? "0" + lapSecs : lapSecs}:${lapMills < 10 ? "0" + lapMills : lapMills}`;
        const formattedTotalLapTime = `${totalLapHrs < 10 ? "0" + totalLapHrs : totalLapHrs}:${totalLapMins < 10 ? "0" + totalLapMins : totalLapMins}:${totalLapapSecs < 10 ? "0" + totalLapapSecs : totalLapapSecs}:${totalLapMills < 10 ? "0" + totalLapMills : totalLapMills}`;

        const lapItem = document.createElement("li");
        lapItem.textContent = `Lap ${lapTimes.length}: ${formattedLapTime} Reached at ${formattedTotalLapTime}`;
        lapDisplay.appendChild(lapItem);

        if (!bestLapTime || lapTime < bestLapTime) {
            bestLapTime = lapTime;
            bestLapDisplay.innerHTML = `${formattedLapTime}`;
        }
        lapStartTimes.push(lapEndTime);
        console.log("Lap starting times:", lapStartTimes);
    }
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
lapButton.addEventListener("click", recordLap);