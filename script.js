const jadwalURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1101317833&single=true&output=csv";
const tarawihURL  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1863254430&single=true&output=csv";
const khotibURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1600526109&single=true&output=csv";

let slideIndex = 0;
const slides = ["slide-jadwal", "slide-tarawih", "slide-khotib"];

/* ================= SLIDE ================= */

function showSlide() {
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
        { name: "subuh", time: cols[1] },
        { name: "dzuhur", time: cols[2] },
        { name: "ashar", time: cols[3] },
        { name: "maghrib", time: cols[4] },
        { name: "isya", time: cols[5] },
    ];

    let nextPrayer = null;

    prayers.forEach(p => {
        if (p.time && p.time.includes(":")) {
            const [h, m] = p.time.split(":").map(Number);
            const total = h * 60 + m;

            if (!nextPrayer && total > nowMinutes) {
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

/* ================= INTERVAL ================= */

setInterval(updateClock, 1000);
setInterval(showSlide, 10000);
setInterval(loadTarawih, 60000);
setInterval(loadKhotib, 60000);
setInterval(loadJadwal, 60000);

/* ================= INITIAL LOAD ================= */

updateClock();
showSlide();

loadTarawih();
loadKhotib();
loadJadwal();
