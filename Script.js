let breakStartTime;
let breakDuration;
let breakHistory = [];
let totalBreakTime = 0;

function startBreak() {
    const name = document.getElementById('name').value;
    const desiredBreakTime = parseInt(document.getElementById('break-time').value);
    breakDuration = desiredBreakTime * 60000; // Convert minutes to milliseconds

    if (name && desiredBreakTime > 0) {
        breakStartTime = new Date();
        const currentHour = breakStartTime.getHours();
        
        let shiftName;
        if (currentHour >= 7 && currentHour < 15) {
            shiftName = "Morning Shift";
        } else if (currentHour >= 15 && currentHour < 23) {
            shiftName = "Mid Shift";
        } else {
            shiftName = "Night Shift";
        }

        document.getElementById('break-status').innerText = `${name}, your break has started at ${breakStartTime.toLocaleTimeString()} (${shiftName}).`;

        breakHistory.push({
            name: name,
            start: breakStartTime.toLocaleTimeString(),
            shift: shiftName,
            desired: desiredBreakTime,
            date: breakStartTime.toLocaleDateString(),
        });

        document.getElementById('start-break').disabled = true;
        document.getElementById('end-break').disabled = false;
    } else {
        alert("Please enter valid information.");
    }
}

function endBreak() {
    const breakEndTime = new Date();
    const actualBreakDuration = breakEndTime - breakStartTime;
    const name = document.getElementById('name').value;

    const lastEntry = breakHistory[breakHistory.length - 1];
    const exceededBreakTime = actualBreakDuration > (lastEntry.desired * 60000);

    const statusText = exceededBreakTime
        ? "You have exceeded your break time!"
        : `You took a break for ${Math.round(actualBreakDuration / 60000)} minutes.`;

    document.getElementById('break-status').innerText = statusText;

    lastEntry.end = breakEndTime.toLocaleTimeString();
    lastEntry.duration = Math.round(actualBreakDuration / 60000);
    lastEntry.exceeded = exceededBreakTime;

    // Update total break time
    totalBreakTime += lastEntry.duration;

    // Display total break time
    document.getElementById('total-duration').value = `${totalBreakTime} minutes`;

    // Check if total break time exceeds 65 minutes
    const notification = document.getElementById('duration-notification');
    if (totalBreakTime > 65) {
        notification.style.display = 'block';
    } else {
        notification.style.display = 'none';
    }

    updateBreakHistory();

    // Disable the end break button
    document.getElementById('end-break').disabled = true;
    
    // Enable the start break button
    document.getElementById('start-break').disabled = false;
}



function updateBreakHistory() {
    const historyDiv = document.getElementById('break-history');
    historyDiv.innerHTML = '<h2>Break History</h2>';
    
    if (breakHistory.length === 0) {
        historyDiv.innerHTML += '<p>No break history available.</p>';
    } else {
        breakHistory.forEach((entry, index) => {
            const overbreakText = entry.exceeded ? " (Overbreak)" : "";
            historyDiv.innerHTML += `
                <p>${index + 1}. ${entry.name}: Break on ${entry.date} from ${entry.start} to ${entry.end} - Shift: ${entry.shift}, Desired: ${entry.desired} minutes, Duration: ${entry.duration} minutes${overbreakText}</p>
            `;
        });
    }
}

function trackBreak() {
    const endBreakButton = document.getElementById('end-break');

    const checkBreak = setInterval(() => {
        if (breakStartTime) {
            const currentTime = new Date();
            const elapsed = currentTime - breakStartTime;

            if (elapsed >= breakDuration) {
                clearInterval(checkBreak);
                document.getElementById('break-status').innerText = "Your break time is up!";
                endBreakButton.enabled = true; // Automatically enable end break button if time is up
            }
        }
    }, 1000);
}
