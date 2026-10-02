const relationshipPersonButtons = document.querySelectorAll(".relationship-person .person-button");
const relationshipFields = {
    likes: document.getElementById("likesInput"),
    dislikes: document.getElementById("dislikesInput"),
    needs: document.getElementById("needsInput"),
    limits: document.getElementById("limitsInput"),
    goal: document.getElementById("goalInput")
};
const saveRelationshipButton = document.getElementById("saveRelationship");
const relationshipList = document.getElementById("relationshipList");
let relationshipPerson = "Elle";

function getRelationshipAnswers() {
    try {
        const storedAnswers = JSON.parse(localStorage.getItem("nousRelation") || "[]");
        if (Array.isArray(storedAnswers)) return storedAnswers;

        if (storedAnswers && typeof storedAnswers === "object") {
            const migratedAnswers = Object.entries(storedAnswers)
                .filter(([person, profile]) =>
                    ["Elle", "Moi"].includes(person) && profile && typeof profile === "object"
                )
                .map(([person, profile]) => ({
                    person,
                    likes: profile.likes || "",
                    dislikes: profile.dislikes || "",
                    needs: profile.needs || "",
                    limits: profile.limits || "",
                    goal: profile.goal || "",
                    date: profile.updatedAt
                        ? new Date(profile.updatedAt).toLocaleString("fr-FR")
                        : ""
                }));
            localStorage.setItem("nousRelation", JSON.stringify(migratedAnswers));
            return migratedAnswers;
        }
    } catch {
        return [];
    }

    return [];
}

function loadRelationship() {
    if (!relationshipList) return;

    const answers = getRelationshipAnswers();
    if (!answers.length) {
        relationshipList.innerHTML = `
            <div class="empty-history">
                <span>💗</span>
                <p>Rien n'a encore été enregistré.</p>
            </div>
        `;
        return;
    }

    const labels = [
        ["likes", "❤️ Ce que j'aime"],
        ["dislikes", "😕 Ce que je n'aime pas"],
        ["needs", "🫂 Mes besoins"],
        ["limits", "🛡️ Mes limites"],
        ["goal", "🎯 Ce que j'aimerais améliorer"]
    ];

    relationshipList.innerHTML = "";
    answers.forEach(answer => {
        const card = document.createElement("article");
        const header = document.createElement("div");
        const person = document.createElement("span");
        const date = document.createElement("span");
        card.className = "relationship-answer";
        header.className = "relationship-answer-header";
        person.className = "relationship-answer-person";
        person.textContent = answer.person === "Elle" ? "👩 Elle" : "👨 Moi";
        date.className = "relationship-answer-date";
        date.textContent = String(answer.date || "");
        header.append(person, date);
        card.appendChild(header);

        labels.forEach(([key, label]) => {
            const item = document.createElement("div");
            const title = document.createElement("strong");
            const text = document.createElement("p");
            item.className = "relationship-answer-item";
            title.textContent = label;
            text.textContent = String(answer[key] || "Non renseigné");
            item.append(title, text);
            card.appendChild(item);
        });

        relationshipList.appendChild(card);
    });
}

relationshipPersonButtons.forEach(button => {
    button.addEventListener("click", function () {
        relationshipPersonButtons.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        relationshipPerson = this.dataset.person === "Moi" ? "Moi" : "Elle";
    });
});

if (saveRelationshipButton) {
    saveRelationshipButton.addEventListener("click", function () {
        const answer = {
            person: relationshipPerson,
            likes: relationshipFields.likes?.value.trim() || "",
            dislikes: relationshipFields.dislikes?.value.trim() || "",
            needs: relationshipFields.needs?.value.trim() || "",
            limits: relationshipFields.limits?.value.trim() || "",
            goal: relationshipFields.goal?.value.trim() || "",
            date: new Date().toLocaleString("fr-FR")
        };

        if (![answer.likes, answer.dislikes, answer.needs, answer.limits, answer.goal].some(Boolean)) {
            alert("💗 Écris au moins une réponse avant d'enregistrer.");
            return;
        }

        const answers = getRelationshipAnswers();
        answers.unshift(answer);
        localStorage.setItem("nousRelation", JSON.stringify(answers));
        Object.values(relationshipFields).forEach(field => {
            if (field) field.value = "";
        });
        loadRelationship();
        alert("❤️ Tes réponses ont été enregistrées.");
    });
}

loadRelationship();
