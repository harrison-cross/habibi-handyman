const menuToggle = document.querySelector(".menu-toggle");
const menuLabel = menuToggle.querySelector(".menu-label");
const primaryNav = document.querySelector("#primary-nav");
const firstNavLink = primaryNav.querySelector("a");
const lastNavLink = primaryNav.querySelector("a:last-of-type");
const menuScrim = document.querySelector(".menu-scrim");
const menuBackground = document.querySelectorAll(".skip-link, .brand, main, .site-footer");
const mobileMenu = window.matchMedia("(max-width: 720px)");
const root = document.documentElement;

document.querySelector("#current-year").textContent = new Date().getFullYear();

function syncHeader() {
  root.classList.toggle("is-scrolled", window.scrollY > 24);
}

function setMenuOpen(isOpen, returnFocus = false) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuLabel.textContent = isOpen ? "Close" : "Menu";
  primaryNav.classList.toggle("is-open", isOpen);
  primaryNav.inert = mobileMenu.matches && !isOpen;
  menuScrim.classList.toggle("is-open", isOpen);
  root.classList.toggle("menu-open", isOpen);
  menuBackground.forEach((element) => { element.inert = isOpen; });

  if (isOpen) firstNavLink.focus({ preventScroll: true });
  else if (returnFocus) menuToggle.focus({ preventScroll: true });
}

syncHeader();
setMenuOpen(false);
root.classList.add("js");
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true", true);
});

menuScrim.addEventListener("click", () => setMenuOpen(false, true));

primaryNav.addEventListener("click", (event) => {
  if (!mobileMenu.matches) return;
  const link = event.target.closest("a");
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

  setMenuOpen(false);
  const target = document.querySelector(link.hash);
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (menuToggle.getAttribute("aria-expanded") !== "true") return;

  if (event.key === "Escape") {
    event.preventDefault();
    setMenuOpen(false, true);
  } else if (event.key === "Tab") {
    if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault();
      lastNavLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastNavLink) {
      event.preventDefault();
      menuToggle.focus();
    }
  }
});

mobileMenu.addEventListener("change", () => setMenuOpen(false));
