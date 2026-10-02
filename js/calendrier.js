const eventsStorageKey = "nousEvenements";
const legacyEventsStorageKey = "nousCalendrier";
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventType = document.getElementById("eventType");
const eventDescription = document.getElementById("eventDescription");
const saveEvent = document.getElementById("saveEvent");
const eventsList = document.getElementById("eventsList");

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
}

function getEvents() {
    for (const key of [eventsStorageKey, legacyEventsStorageKey]) {
        try {
            const stored = localStorage.getItem(key);
            if (stored === null) continue;
            const events = JSON.parse(stored);
            if (Array.isArray(events)) {
                if (key === legacyEventsStorageKey) {
                    localStorage.setItem(eventsStorageKey, JSON.stringify(events));
                }
                return events;
            }
        } catch {
            continue;
        }
    }
    return [];
}

function getEventEmoji(type) {
    if (type.includes("Amour")) return "❤️";
    if (type.includes("Anniversaire")) return "🎂";
    if (type.includes("Rendez-vous")) return "📅";
    if (type.includes("Surprise")) return "🎁";
    if (type.includes("Souvenir")) return "📸";
    return "✨";
}

function formatEventDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? String(value || "Date inconnue")
        : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function loadEvents() {
    if (!eventsList) return;

    const events = getEvents().sort((first, second) =>
        String(first.date || "").localeCompare(String(second.date || ""))
    );

    if (!events.length) {
        eventsList.innerHTML = `
            <div class="empty-history">
                <span>📅</span>
                <p>Aucun événement pour le moment.</p>
            </div>
        `;
        return;
    }

    eventsList.innerHTML = "";
    events.forEach((event, index) => {
        const card = document.createElement("article");
        const type = String(event.type || "✨ Autre");
        card.className = "event-card";
        card.innerHTML = `
            <div class="event-icon">${getEventEmoji(type)}</div>
            <div class="event-content">
                <strong>${escapeHTML(event.title || "")}</strong>
                <div class="event-date">📅 ${escapeHTML(formatEventDate(event.date))} · ${escapeHTML(type)}</div>
                ${event.description ? `<div class="event-description">${escapeHTML(event.description)}</div>` : ""}
            </div>
            <button type="button" class="delete-event" data-index="${index}" title="Supprimer" aria-label="Supprimer ${escapeHTML(event.title || "cet événement")}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        eventsList.appendChild(card);
    });

    eventsList.querySelectorAll(".delete-event").forEach(button => {
        button.addEventListener("click", function () {
            if (!confirm("Supprimer cet événement du calendrier ?")) return;
            const events = getEvents();
            events.splice(Number(this.dataset.index), 1);
            localStorage.setItem(eventsStorageKey, JSON.stringify(events));
            loadEvents();
        });
    });
}

if (saveEvent && eventTitle && eventDate && eventType && eventDescription) {
    saveEvent.addEventListener("click", function () {
        const title = eventTitle.value.trim();
        const date = eventDate.value;

        if (!title || !date) {
            alert(!title ? "❤️ Donne un nom à cet événement." : "📅 Choisis une date.");
            return;
        }

        const events = getEvents();
        events.push({
            title,
            date,
            type: eventType.value,
            description: eventDescription.value.trim()
        });
        localStorage.setItem(eventsStorageKey, JSON.stringify(events));
        eventTitle.value = "";
        eventDate.value = "";
        eventDescription.value = "";
        loadEvents();
        alert("💕 La date a été ajoutée à votre calendrier.");
    });
}

loadEvents();
