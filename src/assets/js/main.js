const toggle = document.getElementById("navToggle");
const drawer = document.getElementById("navDrawer");
if (toggle && drawer) {
  toggle.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
}
document.querySelectorAll(".nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => {
    drawer.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

function track(event, props) {
  if (typeof umami !== "undefined") umami.track(event, props || {});
}

function getDevice() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "Mobile";
  if (/Tablet|iPad/i.test(ua))  return "Tablet";
  return "Desktop";
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes("Edg"))     return "Edge";
  if (ua.includes("Chrome"))  return "Chrome";
  if (ua.includes("Safari"))  return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  return "Other";
}

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac"))     return "macOS";
  if (ua.includes("Linux"))   return "Linux";
  if (ua.includes("Android")) return "Android";
  if (/iPhone|iPad/.test(ua)) return "iOS";
  return "Other";
}

function getScreenInfo() {
  return {
    screen_res:  screen.width + "x" + screen.height,
    viewport:    window.innerWidth + "x" + window.innerHeight,
    pixel_ratio: window.devicePixelRatio || 1,
    color_depth: screen.colorDepth || "",
    touch:       navigator.maxTouchPoints > 0 ? "yes" : "no",
    orientation: screen.orientation ? screen.orientation.type : (window.innerWidth > window.innerHeight ? "landscape" : "portrait"),
  };
}

function getConnectionInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return { connection: "unknown" };
  return {
    connection:    conn.effectiveType || conn.type || "unknown",
    downlink_mbps: conn.downlink  || "",
    save_data:     conn.saveData  ? "yes" : "no",
  };
}

function getPageInfo() {
  return {
    page:       window.location.pathname,
    referrer:   document.referrer || "direct",
    title:      document.title,
    lang:       navigator.language || "",
    timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    local_hour: new Date().getHours(),
    local_day:  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()],
  };
}

async function buildPayload(extra) {
  const scrn = getScreenInfo();
  const conn = getConnectionInfo();
  const pg   = getPageInfo();
  return Object.assign({}, pg, scrn, conn, {
    device:       getDevice(),
    os:           getOS(),
    browser:      getBrowser(),
    ua:           navigator.userAgent.slice(0, 200),
  }, extra || {});
}

(async () => {
  const payload = await buildPayload({ event: "page-visit" });
  track("page-visit", payload);
})();

document.querySelectorAll(".resume-track").forEach((link) => {
  link.addEventListener("click", async () => {
    const payload = await buildPayload({ event: "resume-view", referrer: window.location.pathname, page: "/resume" });
    track("resume-view", payload);
  });
});

document.querySelectorAll(".nav__links a, .nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("nav-click", { label: a.textContent.trim(), href: a.getAttribute("href"), page: window.location.pathname });
  });
});

document.querySelectorAll(".hero__cta a").forEach((a) => {
  a.addEventListener("click", () => {
    track("hero-cta", { label: a.textContent.trim(), href: a.getAttribute("href"), page: window.location.pathname });
  });
});

document.querySelectorAll(".hpt__card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector(".hpt__title");
    track("gallery-preview-click", { title: title ? title.textContent.trim() : "", page: window.location.pathname });
  });
});

document.querySelectorAll(".post-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h2, h3");
    track("blog-post-click", { title: title ? title.textContent.trim() : "", from: window.location.pathname });
  });
});

document.querySelectorAll(".project-card a").forEach((a) => {
  a.addEventListener("click", () => {
    track("project-click", { name: a.textContent.trim(), page: window.location.pathname });
  });
});

document.querySelectorAll(".timeline__company a").forEach((a) => {
  a.addEventListener("click", () => {
    track("company-click", { company: a.textContent.trim(), page: window.location.pathname });
  });
});

document.querySelectorAll(".ref-card__link").forEach((a) => {
  a.addEventListener("click", () => {
    const name = a.closest(".ref-card") ? a.closest(".ref-card").querySelector(".ref-card__name") : null;
    track("reference-click", { name: name ? name.textContent.trim() : "", page: window.location.pathname });
  });
});

document.querySelectorAll(".footer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("social-click", { platform: a.textContent.trim(), href: a.getAttribute("href") });
  });
});

document.querySelectorAll(".li-card, .media-card a").forEach((el) => {
  el.addEventListener("click", () => {
    const card  = el.closest(".media-card");
    const label = card ? card.querySelector(".media-card__label") : null;
    track("media-click", { label: label ? label.textContent.trim() : "", type: card ? card.className.replace("media-card media-card--", "") : "" });
  });
});

document.querySelectorAll(".award-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector(".award-card__title");
    track("award-click", { title: title ? title.textContent.trim() : "", page: window.location.pathname });
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      const q = item.querySelector(".faq-item__q");
      track("faq-open", { question: q ? q.textContent.trim() : "", page: window.location.pathname });
    }
  });
});

document.querySelectorAll(".contact-aside__item a").forEach((a) => {
  a.addEventListener("click", () => {
    const label = a.closest(".contact-aside__item") ? a.closest(".contact-aside__item").querySelector(".contact-aside__label") : null;
    track("contact-aside-click", { channel: label ? label.textContent.trim() : "", href: a.getAttribute("href") });
  });
});

(function () {
  if (!window.IntersectionObserver) return;
  const seen = new Set();
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !seen.has(entry.target.id)) {
        seen.add(entry.target.id);
        track("section-view", { section: entry.target.id, page: window.location.pathname });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
})();

(function () {
  const marks = [25, 50, 75, 100];
  const fired = new Set();
  window.addEventListener("scroll", () => {
    const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    marks.forEach((m) => {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track("scroll-depth", { depth: m + "%", page: window.location.pathname });
      }
    });
  }, { passive: true });
})();

(function () {
  [30, 60, 120, 300].forEach((secs) => {
    setTimeout(() => track("time-on-page", { seconds: secs, page: window.location.pathname }), secs * 1000);
  });
})();

(function () {
  let fired = false;
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY <= 0 && !fired) { fired = true; track("exit-intent", { page: window.location.pathname }); }
  });
})();

document.addEventListener("copy", () => {
  const sel = window.getSelection() ? window.getSelection().toString().slice(0, 100) : "";
  track("text-copy", { text: sel, page: window.location.pathname });
});

const lightbox      = document.getElementById("lightbox");
const lightboxImg   = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDate  = document.getElementById("lightboxDate");
const lightboxCap   = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(card) {
  lightboxImg.src              = card.dataset.image;
  lightboxImg.alt              = card.dataset.title;
  lightboxTitle.textContent    = card.dataset.title;
  lightboxDate.textContent     = card.dataset.date;
  lightboxCap.textContent      = card.dataset.caption;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}
document.querySelectorAll(".instax").forEach((card) => {
  card.addEventListener("click", () => {
    openLightbox(card);
    track("gallery-lightbox-open", { title: card.dataset.title || "", page: window.location.pathname });
  });
});
if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
if (lightbox) document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

const tooltip = document.createElement("div");
tooltip.className = "gallery-tooltip";
document.body.appendChild(tooltip);
document.querySelectorAll(".instax__caption").forEach(function (el) {
  const fullText = el.closest(".instax").dataset.caption;
  if (!fullText) return;
  el.addEventListener("mouseenter", function () { tooltip.textContent = fullText; tooltip.classList.add("visible"); });
  el.addEventListener("mousemove",  function (e) {
    tooltip.style.left = (e.clientX - tooltip.offsetWidth / 2) + "px";
    tooltip.style.top  = (e.clientY - 48) + "px";
  });
  el.addEventListener("mouseleave", function () { tooltip.classList.remove("visible"); });
});

(function () {
  const form    = document.getElementById("contactForm");
  const btn     = document.getElementById("contactSubmit");
  const status  = document.getElementById("contactStatus");
  const errBox  = form ? form.querySelector("[data-fs-error]:not([data-fs-error='name']):not([data-fs-error='email']):not([data-fs-error='message'])") : null;
  if (!form) return;
  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message || "";
    status.classList.remove("contact-form__status--ok", "contact-form__status--error");
    if (type) status.classList.add(type);
  }
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true;
    btn.textContent = "Sending...";
    if (errBox)  { errBox.textContent = "";  errBox.style.display = "none"; }
    setStatus("", "");
    try {
      const res  = await fetch("https://formspree.io/f/mnjokoon", {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Thanks - your message was sent.", "contact-form__status--ok");
        form.reset();
        track("contact-form-submit", { page: window.location.pathname });
      } else {
        const msg = (data.errors || []).map(function (err) { return err.message; }).join(", ") || "Something went wrong. Please email me directly.";
        if (errBox) { errBox.textContent = msg; errBox.style.display = "block"; }
        setStatus(msg, "contact-form__status--error");
      }
    } catch (_) {
      if (errBox) { errBox.textContent = "Something went wrong. Please email me directly."; errBox.style.display = "block"; }
      setStatus("Something went wrong. Please email me directly.", "contact-form__status--error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();
