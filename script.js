const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1101317833&single=true&output=csv";

async function fetchSchedule() {
    try {
        const res = await fetch(sheetURL);
        const csv = await res.text();
        const rows = csv.split("\n").slice(1);

        const today = new Date().getDate();
        let todayData = null;

        rows.forEach(row => {
            const cols = row.split(",");

            const tanggal = parseInt(cols[0]);

            if (tanggal === today) {
                todayData = {
                    subuh: cols[2],
                    dzuhur: cols[3],
                    ashar: cols[4],
                    maghrib: cols[5],
                    isya: cols[6],
                };
            }
        });

        if (todayData) {
            document.getElementById("subuh").textContent = todayData.subuh;
            document.getElementById("dzuhur").textContent = todayData.dzuhur;
            document.getElementById("ashar").textContent = todayData.ashar;
            document.getElementById("maghrib").textContent = todayData.maghrib;
            document.getElementById("isya").textContent = todayData.isya;

            highlightNextPrayer(todayData);
        }

    } catch (err) {
        console.error("Gagal ambil jadwal:", err);
    }
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

    let next = null;
    let nextMin = Infinity;

    prayers.forEach(p => {
        const [h, m] = p.time.split(":").map(Number);
        const total = h * 60 + m;

        if (total >= nowMinutes && total < nextMin) {
            nextMin = total;
            next = p.name;
        }
    });

    if (!next) next = prayers[0].name;

    document.querySelectorAll(".prayer-table tr").forEach(row => {
        row.classList.remove("highlight");
    });

    const row = document.getElementById("row-" + next);
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
}

setInterval(updateClock, 1000);
setInterval(fetchSchedule, 60000);

updateClock();
fetchSchedule();
