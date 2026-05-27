const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const navLinks = [...document.querySelectorAll(".site-nav a[href^='#']")];
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    const id = event.target.getAttribute("href")?.slice(1);
    if (id) {
      setActiveNav(id);
    }
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]?.target.id) {
      setActiveNav(visibleEntries[0].target.id);
    }
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.08, 0.2, 0.45, 0.7],
  }
);

navTargets.forEach((section) => observer.observe(section));

if (window.location.hash) {
  setActiveNav(window.location.hash.slice(1));
} else {
  setActiveNav("services");
}
