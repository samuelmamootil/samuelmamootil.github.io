// Mobile nav
const toggle = document.getElementById("navToggle");
const drawer = document.getElementById("navDrawer");
if (toggle && drawer) {
  toggle.addEventListener("click", () => drawer.classList.toggle("open"));
}
document.querySelectorAll(".nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => drawer.classList.remove("open"));
});
// ── Caption tooltip (fixed position, escapes card transform) ──
const tooltip = document.createElement('div');
tooltip.className = 'gallery-tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('.instax__caption').forEach(function (el) {
  const fullText = el.closest('.instax').dataset.caption;
  if (!fullText) return;

  el.addEventListener('mouseenter', function (e) {
    tooltip.textContent = fullText;
    tooltip.classList.add('visible');
  });

  el.addEventListener('mousemove', function (e) {
    // follow cursor, offset above finger/cursor
    tooltip.style.left = (e.clientX - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top  = (e.clientY - 48) + 'px';
  });

  el.addEventListener('mouseleave', function () {
    tooltip.classList.remove('visible');
  });
});
