// Mobile nav
const toggle = document.getElementById("navToggle");
const drawer = document.getElementById("navDrawer");
if (toggle && drawer) {
  toggle.addEventListener("click", () => drawer.classList.toggle("open"));
}

// Close drawer on link click
document.querySelectorAll(".nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => drawer.classList.remove("open"));
});
// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

// Load saved preference
const saved = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", saved);

themeToggle?.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
