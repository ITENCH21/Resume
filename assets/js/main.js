const THEME_STORAGE_KEY = "cv-site-theme";

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(!isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Включить светлую тему" : "Включить темную тему",
    );
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme);

  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) {
    return;
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

function initCardAnimations() {
  document.querySelectorAll(".card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.06}s`;
    card.style.animation = "fadeSlideDown .5s ease both";
  });
}

function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  if (!fills.length) {
    return;
  }

  setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const pct = entry.target.getAttribute("data-pct");
          entry.target.style.width = "0";

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              entry.target.style.width = `${pct}%`;
            });
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );

    fills.forEach((fill) => observer.observe(fill));
  }, 800);
}

function initAvatarFallback() {
  const photoImg = document.getElementById("photoImg");
  const avatarInner = document.getElementById("avatarInner");
  if (!photoImg || !avatarInner) {
    return;
  }

  const showInitials = () => {
    avatarInner.classList.add("is-fallback");
  };

  photoImg.addEventListener("error", showInitials, { once: true });

  if (!photoImg.getAttribute("src")) {
    showInitials();
  }
}

initTheme();
initCardAnimations();
initSkillBars();
initAvatarFallback();
