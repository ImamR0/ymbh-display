function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour12: false });
    document.getElementById('clock').textContent = time;

    const date = now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    document.getElementById('date').textContent = date;
}

setInterval(updateClock, 1000);
updateClock();
