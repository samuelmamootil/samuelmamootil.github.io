// Mobile nav
const toggle = document.getElementById("navToggle");
const drawer = document.getElementById("navDrawer");
if (toggle && drawer) {
  toggle.addEventListener("click", () => drawer.classList.toggle("open"));
}
document.querySelectorAll(".nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => drawer.classList.remove("open"));
});

// ── Lightbox ──
const lightbox      = document.getElementById("lightbox");
const lightboxImg   = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDate  = document.getElementById("lightboxDate");
const lightboxCap   = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(card) {
  lightboxImg.src       = card.dataset.image;
  lightboxImg.alt       = card.dataset.title;
  lightboxTitle.textContent = card.dataset.title;
  lightboxDate.textContent  = card.dataset.date;
  lightboxCap.textContent   = card.dataset.caption;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".instax").forEach((card) => {
  card.addEventListener("click", () => openLightbox(card));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ── Caption tooltip ──
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
    tooltip.style.left = (e.clientX - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top  = (e.clientY - 48) + 'px';
  });

  el.addEventListener('mouseleave', function () {
    tooltip.classList.remove('visible');
  });
});
