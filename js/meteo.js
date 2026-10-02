const weatherChoices = document.querySelectorAll(".weather-choice");
const weatherIcon = document.getElementById("weatherIcon");
const weatherPrompt = document.getElementById("weatherPrompt");
const weatherQuestion = document.getElementById("weatherQuestion");
const weatherNote = document.getElementById("weatherNote");
const saveWeatherButton = document.getElementById("saveWeather");
const weatherHistory = document.getElementById("weatherHistory");
const weatherDetails = {
	Ensoleillée: { icon: "☀️", prompt: "Qu'est-ce qui nous fait du bien en ce moment ?", question: "Prenez le temps de nommer une chose que vous appréciez chez l'autre." },
	Nuageuse: { icon: "☁️", prompt: "Qu'est-ce qui nous préoccupe ?", question: "Écoutez-vous sans chercher tout de suite une solution." },
	Pluvieuse: { icon: "🌧️", prompt: "De quoi avons-nous besoin aujourd'hui ?", question: "Un geste simple ou un peu de repos peut déjà compter." },
	Orageuse: { icon: "⛈️", prompt: "Comment retrouver un peu de calme ?", question: "Vous pouvez faire une pause et reprendre la conversation plus tard." }
};
let selectedWeather = "";

function readWeatherHistory() {
	const raw = window.nousStorage?.get("nousMeteo") ?? null;
	if (raw === null) return [];
	try {
		const data = JSON.parse(raw);
		return Array.isArray(data) ? data : null;
	} catch {
		return null;
	}
}

function renderWeatherHistory() {
	if (!weatherHistory) return;
	const entries = readWeatherHistory();
	if (!entries || !entries.length) {
		weatherHistory.innerHTML = '<div class="empty-state"><span>🌤️</span><p>Aucun bulletin enregistré.</p></div>';
		return;
	}
	weatherHistory.replaceChildren();
	entries.forEach((entry, index) => {
		const article = document.createElement("article");
		const content = document.createElement("div");
		const heading = document.createElement("h3");
		const date = document.createElement("time");
		const remove = document.createElement("button");
		article.className = "weather-entry";
		heading.textContent = `${weatherDetails[entry.weather]?.icon || "🌤️"} ${String(entry.weather || "Météo")}`;
		date.textContent = String(entry.date || "");
		content.append(heading, date);
		if (entry.note) {
			const note = document.createElement("p");
			note.textContent = String(entry.note);
			content.appendChild(note);
		}
		remove.type = "button";
		remove.className = "weather-entry-delete";
		remove.textContent = "Supprimer";
		remove.addEventListener("click", () => {
			const current = readWeatherHistory();
			if (!current) return;
			current.splice(index, 1);
			window.nousStorage?.set("nousMeteo", JSON.stringify(current));
			renderWeatherHistory();
		});
		article.append(content, remove);
		weatherHistory.appendChild(article);
	});
}

weatherChoices.forEach(button => {
	button.addEventListener("click", () => {
		selectedWeather = button.dataset.weather || "";
		weatherChoices.forEach(choice => choice.classList.toggle("selected", choice === button));
		const details = weatherDetails[selectedWeather];
		if (!details) return;
		weatherIcon.textContent = details.icon;
		weatherPrompt.textContent = details.prompt;
		weatherQuestion.textContent = details.question;
	});
});

if (saveWeatherButton) {
	saveWeatherButton.addEventListener("click", () => {
		if (!selectedWeather) return;
		const entries = readWeatherHistory();
		if (!entries) return;
		entries.unshift({ weather: selectedWeather, note: weatherNote.value.trim(), date: new Date().toLocaleString("fr-FR") });
		window.nousStorage?.set("nousMeteo", JSON.stringify(entries));
		weatherNote.value = "";
		renderWeatherHistory();
	});
}

renderWeatherHistory();
