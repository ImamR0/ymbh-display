const jadwalURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1101317833&single=true&output=csv";
const tarawihURL  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1863254430&single=true&output=csv";
const khotibURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1600526109&single=true&output=csv";

function getSlidesForToday() {
    const today = new Date().getDay(); // 5 = Jumat

    if (today === 5) {
        return ["slide-jadwal", "slide-tarawih", "slide-khotib"];
    } else {
        return ["slide-jadwal", "slide-tarawih"];
    }
}

let slides = getSlidesForToday();
let slideIndex = 0;

/* ================= SLIDE ================= */

function showSlide() {
    slides = getSlidesForToday(); // refresh tiap rotasi

    slides.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });

    const active = document.getElementById(slides[slideIndex]);
    if (active) active.classList.remove("hidden");

    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;
}

/* ================= FETCH CSV ================= */

async function fetchCSV(url) {
    const res = await fetch(url, { cache: "no-store" });
    return (await res.text()).split("\n").slice(1);
}

/* ================= JADWAL SHOLAT ================= */

async function loadJadwal() {
    try {
        const rows = await fetchCSV(jadwalURL);
        const today = new Date().getDate();

        rows.forEach(row => {
            const cols = row.split(",").map(c => c.trim());

            const tanggal = parseInt(cols[0]);

            if (tanggal === today) {
                document.getElementById("subuh").textContent   = cols[2];
                document.getElementById("dzuhur").textContent  = cols[3];
                document.getElementById("ashar").textContent   = cols[4];
                document.getElementById("maghrib").textContent = cols[5];
                document.getElementById("isya").textContent    = cols[6];

                highlightNextPrayer(cols);
                updateCountdown(cols);
            }
        });

    } catch (e) {
        console.log("Jadwal gagal dimuat");
    }
}

/* ================= HIGHLIGHT SHOLAT ================= */

function highlightNextPrayer(cols) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: "subuh",   time: cols[2] },
        { name: "dzuhur",  time: cols[3] },
        { name: "ashar",   time: cols[4] },
        { name: "maghrib", time: cols[5] },
        { name: "isya",    time: cols[6] },
    ];

    let nextPrayer = null;

    prayers.forEach(p => {
        if (!nextPrayer && p.time && p.time.includes(":")) {
            const [h, m] = p.time.split(":").map(Number);
            const total = h * 60 + m;

            if (total > nowMinutes) {
                nextPrayer = p.name;
            }
        }
    });

    if (!nextPrayer) nextPrayer = "subuh";

    document.querySelectorAll(".prayer-table tr").forEach(row => {
        row.classList.remove("highlight");
    });

    const row = document.getElementById("row-" + nextPrayer);
    if (row) row.classList.add("highlight");
}

/* ================= IMAM TARAWIH ================= */

async function loadTarawih() {
    try {
        const rows = await fetchCSV(tarawihURL);
        const today = new Date().getDate();

        let html = "";

        rows.forEach(row => {
            const cols = row.split(",").map(c => c.trim());

            const tanggal = parseInt(cols[0]);
            const lokasi  = cols[2];
            const imam    = cols[3];

            if (tanggal === today) {
                html += `<div>${lokasi} : ${imam}</div>`;
            }
        });

        const hijriEl = document.getElementById("tarawih-hijri");
        const dateEl  = document.getElementById("tarawih-date");

        if (hijriEl) hijriEl.textContent = today + " Ramadhan 1447 H";

        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        document.getElementById("tarawih-content").innerHTML =
            html || "<div>Tidak ada petugas hari ini</div>";

    } catch (e) {
        document.getElementById("tarawih-content").innerHTML =
            "<div>Data gagal dimuat</div>";
    }
}

/* ================= KHOTIB JUMAT ================= */

async function loadKhotib() {
    try {
        const rows = await fetchCSV(khotibURL);
        const today = new Date().getDate();

        let html = "";

        rows.forEach(row => {
            const cols = row.split(",").map(c => c.trim());

            const tanggal = parseInt(cols[0]);
            const masjid  = cols[2];
            const petugas = cols[3];

            if (tanggal === today) {
                html += `<div>🕌 ${masjid} : ${petugas}</div>`;
            }
        });

        const hijriEl = document.getElementById("khotib-hijri");
        const dateEl  = document.getElementById("khotib-date");

        if (hijriEl) hijriEl.textContent = today + " Ramadhan 1447 H";

        if (dateEl) {
            dateEl.textContent = new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        document.getElementById("khotib-content").innerHTML =
            html || "<div>Tidak ada petugas hari ini</div>";

    } catch (e) {
        document.getElementById("khotib-content").innerHTML =
            "<div>Data gagal dimuat</div>";
    }
}

/* ================= JAM REALTIME ================= */

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

function updateCountdown(cols) {
    const now = new Date();
    const nowMs = now.getTime();

    const prayers = [
        { name: "Subuh",   time: cols[2] },
        { name: "Dzuhur",  time: cols[3] },
        { name: "Ashar",   time: cols[4] },
        { name: "Maghrib", time: cols[5] },
        { name: "Isya",    time: cols[6] },
    ];

    let next = null;

    prayers.forEach(p => {
        if (!next && p.time && p.time.includes(":")) {
            const [h, m] = p.time.split(":").map(Number);

            const prayerDate = new Date();
            prayerDate.setHours(h, m, 0, 0);

            if (prayerDate.getTime() > nowMs) {
                next = { ...p, date: prayerDate };
            }
        }
    });

    if (!next) {
        const [h, m] = cols[2].split(":").map(Number);
        const prayerDate = new Date();
        prayerDate.setDate(prayerDate.getDate() + 1);
        prayerDate.setHours(h, m, 0, 0);

        next = { name: "Subuh", date: prayerDate };
    }

    const diff = next.date.getTime() - nowMs;

    const hours = Math.floor(diff / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    document.getElementById("next-prayer-name").textContent =
        "Menuju " + next.name;

    document.getElementById("next-prayer-countdown").textContent =
        `${hours.toString().padStart(2,"0")}:${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
}

/* ================= INTERVAL ================= */

setInterval(updateClock, 1000);
setInterval(showSlide, 10000);
setInterval(loadTarawih, 60000);
setInterval(loadKhotib, 60000);
setInterval(loadJadwal, 1000);

/* ================= INITIAL LOAD ================= */

updateClock();
showSlide();

loadTarawih();
loadKhotib();
loadJadwal();
