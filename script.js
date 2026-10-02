/* =====================================================
   MENU MOBILE
===================================================== */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        // Changer l'icône du menu
        const icon = menuBtn.querySelector("i");

        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

    });
}


/* =====================================================
   FERMER LE MENU APRÈS UN CLIC
===================================================== */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =====================================================
   ANIMATIONS AU SCROLL
===================================================== */

const animatedElements = document.querySelectorAll(
    ".letter, .memory-card, .timeline-item, .final-content"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    },
    {
        threshold: 0.15
    }
);


animatedElements.forEach(element => {
    observer.observe(element);
});


/* =====================================================
   CRÉATION DE CŒURS AU CLIC
===================================================== */

document.addEventListener("click", (event) => {

    // Ne pas créer de cœur si on clique sur un lien
    if (
        event.target.closest("a") ||
        event.target.closest("button")
    ) {
        return;
    }

    createHeart(event.clientX, event.clientY);

});


function createHeart(x, y) {

    const heart = document.createElement("div");

    heart.innerHTML = "❤️";

    heart.style.position = "fixed";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    heart.style.pointerEvents = "none";
    heart.style.zIndex = "9999";

    heart.style.fontSize = `${Math.random() * 15 + 15}px`;

    heart.style.transform = "translate(-50%, -50%)";

    heart.style.transition =
        "transform 1.2s ease, opacity 1.2s ease";

    document.body.appendChild(heart);


    setTimeout(() => {

        heart.style.transform =
            `translate(
                ${Math.random() * 80 - 40}px,
                -120px
            ) scale(1.5)`;

        heart.style.opacity = "0";

    }, 50);


    setTimeout(() => {

        heart.remove();

    }, 1300);

}


/* =====================================================
   CŒURS FLOTTANTS AUTOMATIQUES
===================================================== */

function createFloatingHeart() {

    const heart = document.createElement("div");

    const hearts = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "💓",
        "💞"
    ];

    heart.innerHTML =
        hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.position = "fixed";

    heart.style.left =
        `${Math.random() * 100}%`;

    heart.style.bottom = "-40px";

    heart.style.fontSize =
        `${Math.random() * 18 + 12}px`;

    heart.style.opacity =
        `${Math.random() * 0.5 + 0.2}`;

    heart.style.pointerEvents = "none";

    heart.style.zIndex = "0";

    const duration =
        Math.random() * 6 + 7;

    heart.style.transition =
        `transform ${duration}s linear, opacity ${duration}s linear`;

    document.body.appendChild(heart);


    setTimeout(() => {

        heart.style.transform =
            `translateY(-110vh)
             translateX(${Math.random() * 150 - 75}px)
             rotate(${Math.random() * 90 - 45}deg)`;

        heart.style.opacity = "0";

    }, 100);


    setTimeout(() => {

        heart.remove();

    }, duration * 1000 + 500);

}


/* Créer un cœur toutes les 1,5 secondes */

setInterval(createFloatingHeart, 1500);


/* =====================================================
   EFFET PARALLAXE SUR LA PHOTO
===================================================== */

const heroPhoto = document.querySelector(".hero-photo");

if (heroPhoto) {

    document.addEventListener("mousemove", (event) => {

        const x =
            (window.innerWidth / 2 - event.clientX) / 40;

        const y =
            (window.innerHeight / 2 - event.clientY) / 40;

        heroPhoto.style.transform =
            `translate(${x}px, ${y}px)`;

    });

}


/* =====================================================
   ANIMATION DU TITRE
===================================================== */

const heroTitle = document.querySelector(".hero h1");

if (heroTitle) {

    heroTitle.style.opacity = "0";
    heroTitle.style.transform = "translateY(30px)";

    setTimeout(() => {

        heroTitle.style.transition =
            "opacity 1s ease, transform 1s ease";

        heroTitle.style.opacity = "1";
        heroTitle.style.transform = "translateY(0)";

    }, 400);

}


/* =====================================================
   EFFET SUR LE BOUTON PRINCIPAL
===================================================== */

const mainBtn = document.querySelector(".main-btn");

if (mainBtn) {

    mainBtn.addEventListener("mouseenter", () => {

        const heart = mainBtn.querySelector("i");

        if (heart) {
            heart.classList.add("fa-beat");
        }

    });


    mainBtn.addEventListener("mouseleave", () => {

        const heart = mainBtn.querySelector("i");

        if (heart) {
            heart.classList.remove("fa-beat");
        }

    });

}


/* =====================================================
   ANNÉE AUTOMATIQUE DANS LE FOOTER
===================================================== */

const copyright = document.querySelector(".copyright");

if (copyright) {

    const currentYear = new Date().getFullYear();

    copyright.innerHTML =
        `© ${currentYear} — Notre histoire ❤️`;

}


/* =====================================================
   MESSAGE DANS LA CONSOLE
===================================================== */

console.log(
    "❤️ Bienvenue dans votre petite histoire d'amour."
);
