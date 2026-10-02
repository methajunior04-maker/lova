const ideaForm = document.getElementById("ideaForm");
const ideaList = document.getElementById("ideasList");
const ideaFilters = document.querySelectorAll(".idea-filter");
let activeIdeaFilter = "Toutes";

function readIdeas() {
	const raw = window.nousStorage?.get("nousIdees") ?? null;
	if (raw === null) return [];
	try {
		const data = JSON.parse(raw);
		return Array.isArray(data) ? data : null;
	} catch {
		return null;
	}
}

function saveIdeas(ideas) {
	return window.nousStorage?.set("nousIdees", JSON.stringify(ideas)) ?? false;
}

function renderIdeas() {
	if (!ideaList) return;
	const ideas = readIdeas();
	if (ideas === null) {
		ideaList.innerHTML = '<p class="empty-state">Les données existantes ne peuvent pas être affichées.</p>';
		return;
	}
	const visibleIdeas = ideas
		.map((idea, index) => ({ idea, index }))
		.filter(({ idea }) => activeIdeaFilter === "Toutes" || idea.status === activeIdeaFilter);
	if (!visibleIdeas.length) {
		ideaList.innerHTML = '<div class="empty-state"><span>💡</span><p>Aucune idée dans cette liste.</p></div>';
		return;
	}

	ideaList.replaceChildren();
	visibleIdeas.forEach(({ idea, index }) => {
		const article = document.createElement("article");
		const details = document.createElement("div");
		const title = document.createElement("h3");
		const meta = document.createElement("div");
		const description = document.createElement("p");
		const status = document.createElement("select");
		const remove = document.createElement("button");
		article.className = "idea-item";
		details.className = "idea-details";
		title.textContent = String(idea.title || "Idée sans titre");
		meta.className = "idea-meta";
		meta.textContent = `${String(idea.category || "Autre")} · ${String(idea.status || "À faire")}`;
		description.textContent = String(idea.description || "");
		details.append(title, meta, description);
		["À faire", "En cours", "Fait"].forEach(value => {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = value;
			status.appendChild(option);
		});
		status.className = "idea-status";
		status.setAttribute("aria-label", `Statut de ${title.textContent}`);
		status.value = ["À faire", "En cours", "Fait"].includes(idea.status) ? idea.status : "À faire";
		status.addEventListener("change", () => {
			const currentIdeas = readIdeas();
			if (currentIdeas === null) return;
			currentIdeas[index].status = status.value;
			saveIdeas(currentIdeas);
			renderIdeas();
		});
		remove.type = "button";
		remove.className = "idea-delete";
		remove.setAttribute("aria-label", `Supprimer ${title.textContent}`);
		remove.textContent = "Supprimer";
		remove.addEventListener("click", () => {
			const currentIdeas = readIdeas();
			if (currentIdeas === null) return;
			currentIdeas.splice(index, 1);
			saveIdeas(currentIdeas);
			renderIdeas();
		});
		article.append(details, status, remove);
		ideaList.appendChild(article);
	});
}

if (ideaForm) {
	ideaForm.addEventListener("submit", event => {
		event.preventDefault();
		const ideas = readIdeas();
		if (ideas === null) return;
		const formData = new FormData(ideaForm);
		const title = String(formData.get("title") || "").trim();
		if (!title) return;
		ideas.unshift({
			id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
			title,
			category: String(formData.get("category") || "Autre"),
			description: String(formData.get("description") || "").trim(),
			status: "À faire",
			createdAt: new Date().toISOString()
		});
		saveIdeas(ideas);
		ideaForm.reset();
		activeIdeaFilter = "Toutes";
		ideaFilters.forEach(button => button.classList.toggle("active", button.dataset.filter === "all"));
		renderIdeas();
	});
}

ideaFilters.forEach(button => {
	button.addEventListener("click", function () {
		activeIdeaFilter = this.dataset.filter === "all" ? "Toutes" : this.dataset.filter || "Toutes";
		ideaFilters.forEach(item => item.classList.toggle("active", item === this));
		renderIdeas();
	});
});

renderIdeas();
