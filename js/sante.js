let selectedPain = null;

const periodDateInput = document.getElementById("periodDate");
const periodDurationSelect = document.getElementById("periodDuration");
const periodSaveButton = document.getElementById("savePeriod");
const periodHistoryList = document.getElementById("periodHistory");
const painButtons = document.querySelectorAll(".pain-options button");

function getCycleHistory() {
    try {
        const cycles = JSON.parse(localStorage.getItem("nousCycles") || "[]");
        if (Array.isArray(cycles) && cycles.length) return cycles;
    } catch {
        // Fall back to the previous single-cycle record.
    }

    try {
        const previousCycle = JSON.parse(localStorage.getItem("nousCycle") || "null");
        return previousCycle?.startDate ? [previousCycle] : [];
    } catch {
        return [];
    }
}

function formatCycleDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? String(value || "Date inconnue")
        : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function loadCycleHistory() {
    if (!periodHistoryList) return;

    const cycles = getCycleHistory().sort((first, second) =>
        String(second.startDate || "").localeCompare(String(first.startDate || ""))
    );

    if (!cycles.length) {
        periodHistoryList.innerHTML = `
            <div class="empty-history">
                <span>🌸</span>
                <p>Aucun cycle enregistré pour le moment.</p>
            </div>
        `;
        return;
    }

    periodHistoryList.innerHTML = "";
    cycles.forEach(cycle => {
        const item = document.createElement("article");
        const date = document.createElement("strong");
        const details = document.createElement("small");
        item.className = "period-entry";
        date.textContent = formatCycleDate(cycle.startDate);
        details.textContent = [
            cycle.duration || "Durée non précisée",
            cycle.pain ? `Douleur : ${cycle.pain}` : "Douleur non précisée"
        ].join(" · ");
        item.append(date, details);
        periodHistoryList.appendChild(item);
    });
}

painButtons.forEach(button => {
    button.addEventListener("click", function () {
        painButtons.forEach(painButton => painButton.classList.remove("selected"));
        this.classList.add("selected");
        selectedPain = this.dataset.pain || this.textContent.trim();
    });
});

if (periodDateInput && periodDurationSelect && periodSaveButton) {
    const cycles = getCycleHistory();
    const latestCycle = cycles[0];

    if (latestCycle) {
        periodDateInput.value = latestCycle.startDate || "";
        periodDurationSelect.value = latestCycle.duration || "";
        selectedPain = latestCycle.pain || null;
        const painButton = Array.from(painButtons).find(button =>
            button.dataset.pain === selectedPain || button.textContent.trim() === selectedPain
        );
        painButton?.classList.add("selected");
    }

    periodSaveButton.addEventListener("click", function () {
        if (!periodDateInput.value) {
            alert("🌸 Choisis le premier jour de tes dernières règles.");
            return;
        }

        const cycle = {
            startDate: periodDateInput.value,
            duration: periodDurationSelect.value,
            pain: selectedPain,
            savedAt: new Date().toISOString()
        };
        const history = getCycleHistory();
        const existingIndex = history.findIndex(item => item.startDate === cycle.startDate);

        if (existingIndex >= 0) history[existingIndex] = cycle;
        else history.unshift(cycle);

        localStorage.setItem("nousCycles", JSON.stringify(history));
        localStorage.setItem("nousCycle", JSON.stringify(cycle));
        loadCycleHistory();
        alert("🌸 Le suivi de ton cycle a bien été enregistré.");
    });
}

loadCycleHistory();
