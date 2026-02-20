const jadwalURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1101317833&single=true&output=csv";
const tarawihURL  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1863254430&single=true&output=csv";
const khotibURL   = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwDvPc0X9rWyJ0MI95-UPaoVBq-yB-_mW4VVE2eIJmnzvONCbfy68YhF5tJykHeq9kit2vLxrUuY_L/pub?gid=1600526109&single=true&output=csv";

let slideIndex = 0;
const slides = ["slide-jadwal", "slide-tarawih", "slide-khotib"];

function showSlide() {
    slides.forEach(id => {
        document.getElementById(id).classList.add("hidden");
    });

    document.getElementById(slides[slideIndex]).classList.remove("hidden");

    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;
}

async function fetchCSV(url) {
    const res = await fetch(url, { cache: "no-store" });
    return (await res.text()).split("\n").slice(1);
}

async function loadTarawih() {
    try {
        const rows = await fetchCSV(tarawihURL);
        const today = new Date().getDate();

        let html = "";
        let hijri = "";
        let masehi = "";

        rows.forEach(row => {
            const cols = row.split(",");

            if (parseInt(cols[0]) === today) {
                hijri = cols[0];
                masehi = cols[1];

                html += `<div>${cols[1]} : ${cols[2]}</div>`;
            }
        });

        document.getElementById("tarawih-hijri").textContent =
            today + " Ramadhan 1447 H";

        document.getElementById("tarawih-date").textContent =
            new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        document.getElementById("tarawih-content").innerHTML =
            html || "<div>Tidak ada petugas hari ini</div>";

    } catch {
        document.getElementById("tarawih-content").innerHTML =
            "<div>Data gagal dimuat</div>";
    }
}

async function loadKhotib() {
    try {
        const rows = await fetchCSV(khotibURL);
        const today = new Date().getDate();

        let html = "";

        rows.forEach(row => {
            const cols = row.split(",");

            if (parseInt(cols[0]) === today) {
                html += `<div>🕌 ${cols[1]} : ${cols[2]}</div>`;
            }
        });

        document.getElementById("khotib-hijri").textContent =
            today + " Ramadhan 1447 H";

        document.getElementById("khotib-date").textContent =
            new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        document.getElementById("khotib-content").innerHTML =
            html || "<div>Tidak ada petugas hari ini</div>";

    } catch {
        document.getElementById("khotib-content").innerHTML =
            "<div>Data gagal dimuat</div>";
    }
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
setInterval(showSlide, 10000);
setInterval(loadTarawih, 60000);
setInterval(loadKhotib, 60000);

updateClock();
showSlide();
loadTarawih();
loadKhotib();
