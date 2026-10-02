document.querySelectorAll(".site-nav, .navbar").forEach(nav => {
    const menuButton = nav.querySelector(".menu-btn");
    const links = nav.querySelector(".site-links, .nav-links");
    if (!menuButton || !links) return;

    if (!links.id) links.id = "siteLinks";

    menuButton.replaceChildren();
    const icon = document.createElement("span");
    icon.className = "menu-icon";
    icon.setAttribute("aria-hidden", "true");
    menuButton.appendChild(icon);
    menuButton.setAttribute("aria-controls", links.id);
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");

    function closeMenu() {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
    }

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    links.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });
});

window.nousStorage = {
    get(key) {
        try {
            return window.localStorage.getItem(key);
        } catch {
            return null;
        }
    },
    set(key, value) {
        try {
            window.localStorage.setItem(key, value);
            return true;
        } catch {
            return false;
        }
    },
    remove(key) {
        try {
            window.localStorage.removeItem(key);
        } catch {
        }
    }
};
