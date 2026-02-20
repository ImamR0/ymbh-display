const todayData = {
    subuh: "04:59",
    dzuhur: "12:30",
    ashar: "15:35",
    maghrib: "18:40",
    isya: "19:50"
};

function applySchedule() {
    document.getElementById("subuh").textContent = todayData.subuh;
    document.getElementById("dzuhur").textContent = todayData.dzuhur;
    document.getElementById("ashar").textContent = todayData.ashar;
    document.getElementById("maghrib").textContent = todayData.maghrib;
    document.getElementById("isya").textContent = todayData.isya;

    highlightNextPrayer(todayData);
}

function highlightNextPrayer(times) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: "subuh", time: times.subuh },
        { name: "dzuhur", time: times.dzuhur },
        { name: "ashar", time: times.ashar },
        { name: "maghrib", time: times.maghrib },
        { name: "isya", time: times.isya },
    ];

    let nextPrayer = null;

    for (let i = 0; i < prayers.length; i++) {
        const [h, m] = prayers[i].time.split(":").map(Number);
        const totalMinutes = h * 60 + m;

        if (totalMinutes > nowMinutes) {
            nextPrayer = prayers[i].name;
            break;
        }
    }

    if (!nextPrayer) nextPrayer = "subuh";

    document.querySelectorAll(".prayer-table tr").forEach(row => {
        row.classList.remove("highlight");
    });

    const row = document.getElementById("row-" + nextPrayer);
    if (row) row.classList.add("highlight");
}

function updateClock() {
    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("id-ID", { hour12: false });

    document.getElementById("date").textContent =
        now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    highlightNextPrayer(todayData);
}

setInterval(updateClock, 1000);

updateClock();
applySchedule();
