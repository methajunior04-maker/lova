let currentPerson = "Elle";
let selectedFeeling = "";
let selectedPain = null;

const personButtons = document.querySelectorAll(".person-button");
const feelingButtons = document.querySelectorAll(".feeling");
const painButtons = document.querySelectorAll(".pain-options button");
const messageInput = document.getElementById("wellbeingMessage");
const saveButton = document.getElementById("saveWellbeing");
const historyList = document.getElementById("historyList");
const clearHistoryButton = document.getElementById("clearHistory");

function getFeelingEmoji(feeling) {
    if (feeling.includes("Pas très")) return "😔";
    if (feeling.includes("bien")) return "❤️";
    if (feeling.includes("malade")) return "🤒";
    if (feeling.includes("Fatigué")) return "😴";
    if (feeling.includes("Moralement")) return "💭";
    if (feeling.includes("soutien")) return "🫂";
    if (feeling.includes("règles")) return "🌸";
    if (feeling.includes("mal")) return "😣";
    return "💗";
}

function getWellbeingHistory() {
    try {
        const history = JSON.parse(localStorage.getItem("nousBienEtre") || "[]");
        return Array.isArray(history) ? history : [];
    } catch {
        return [];
    }
}

function loadHistory() {
    if (!historyList) return;

    const history = getWellbeingHistory();
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <span>💗</span>
                <p>Aucun état enregistré pour le moment.</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = "";
    history.forEach(entry => {
        const item = document.createElement("article");
        const emoji = document.createElement("div");
        const content = document.createElement("div");
        const title = document.createElement("strong");
        const date = document.createElement("small");

        item.className = "history-item";
        emoji.className = "history-emoji";
        emoji.textContent = getFeelingEmoji(String(entry.feeling || ""));
        content.className = "history-content";
        title.textContent = `${entry.person || ""} — ${entry.feeling || ""}`;
        date.textContent = String(entry.date || "");
        content.append(title, date);

        if (entry.message) {
            const message = document.createElement("p");
            message.className = "history-message";
            message.textContent = String(entry.message);
            content.appendChild(message);
        }

        item.append(emoji, content);
        historyList.appendChild(item);
    });
}

personButtons.forEach(button => {
    button.addEventListener("click", function () {
        personButtons.forEach(personButton => personButton.classList.remove("active"));
        this.classList.add("active");
        currentPerson = this.dataset.person || this.querySelector("strong")?.textContent.trim() || "Elle";
    });
});

feelingButtons.forEach(button => {
    button.addEventListener("click", function () {
        feelingButtons.forEach(feelingButton => feelingButton.classList.remove("selected"));
        this.classList.add("selected");
        selectedFeeling = this.querySelector("strong")?.textContent.trim() || "";
    });
});

painButtons.forEach(button => {
    button.addEventListener("click", function () {
        painButtons.forEach(painButton => painButton.classList.remove("selected"));
        this.classList.add("selected");
        selectedPain = this.dataset.pain || this.querySelector("small")?.textContent.trim() || this.textContent.trim();
    });
});

if (saveButton && messageInput) {
    saveButton.addEventListener("click", function () {
        if (!selectedFeeling) {
            alert("❤️ Choisis d'abord comment tu te sens.");
            return;
        }

        const history = getWellbeingHistory();
        history.unshift({
            person: currentPerson,
            feeling: selectedFeeling,
            pain: selectedPain,
            message: messageInput.value.trim(),
            date: new Date().toLocaleString("fr-FR")
        });

        localStorage.setItem("nousBienEtre", JSON.stringify(history));
        messageInput.value = "";
        selectedFeeling = "";
        selectedPain = null;
        feelingButtons.forEach(button => button.classList.remove("selected"));
        painButtons.forEach(button => button.classList.remove("selected"));
        loadHistory();
        alert("❤️ Ton état a bien été enregistré.");
    });
}

if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", function () {
        if (!confirm("Voulez-vous vraiment effacer tout l'historique ?")) return;
        localStorage.removeItem("nousBienEtre");
        loadHistory();
    });
}

loadHistory();
