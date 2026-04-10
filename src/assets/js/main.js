// ── Mobile nav ────────────────────────────────────────────
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

// ── Umami helper ──────────────────────────────────────────
function track(event, props) {
  if (typeof umami !== "undefined") umami.track(event, props || {});
}

// ── Device / browser fingerprint ─────────────────────────
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

// ── Geo + IP via ipinfo.io (supports browser CORS, no token needed for basic fields) ──
async function getGeo() {
  const cached = sessionStorage.getItem("geo_full");
  if (cached) return JSON.parse(cached);
  try {
    const res = await fetch("https://ipinfo.io/json");
    if (!res.ok) return {};
    const d = await res.json();
    const [lat, lon] = (d.loc || ",").split(",").map(Number);
    const geo = {
      ip:           d.ip       || "",
      city:         d.city     || "",
      region:       d.region   || "",
      country:      d.country  || "",
      country_name: d.country  || "",
      postal:       d.postal   || "",
      timezone:     d.timezone || "",
      isp:          d.org      || "",   // ipinfo returns org field e.g. "AS7922 Comcast"
      hostname:     d.hostname || "",
      latitude:     lat        || "",
      longitude:    lon        || "",
    };
    sessionStorage.setItem("geo_full", JSON.stringify(geo));
    return geo;
  } catch (_) { return {}; }
}

// ── Build full enriched payload ───────────────────────────
async function buildPayload(extra) {
  const geo  = await getGeo();
  const scrn = getScreenInfo();
  const conn = getConnectionInfo();
  const pg   = getPageInfo();
  return Object.assign({}, pg, scrn, conn, {
    ip:           geo.ip           || "",
    city:         geo.city         || "",
    region:       geo.region       || "",
    country:      geo.country      || "",
    country_name: geo.country_name || "",
    postal:       geo.postal       || "",
    timezone:     geo.timezone     || pg.timezone || "",
    isp:          geo.isp          || "",
    hostname:     geo.hostname     || "",
    lat:          String(geo.latitude  || ""),
    lon:          String(geo.longitude || ""),
    device:       getDevice(),
    os:           getOS(),
    browser:      getBrowser(),
    ua:           navigator.userAgent.slice(0, 200),
  }, extra || {});
}

// ── Page visit ────────────────────────────────────────────
(async () => {
  const payload = await buildPayload({ event: "page-visit" });
  track("page-visit", payload);
})();

// ── visitor-ip Umami event — IP visible in event properties
(async () => {
  const geo = await getGeo();
  if (!geo.ip) return;
  track("visitor-ip", {
    ip:       geo.ip,
    isp:      geo.isp,
    hostname: geo.hostname,
    city:     geo.city,
    region:   geo.region,
    country:  geo.country_name,
    postal:   geo.postal,
    timezone: geo.timezone,
    lat:      String(geo.latitude),
    lon:      String(geo.longitude),
  });
})();

// ── Resume click ──────────────────────────────────────────
document.querySelectorAll(".resume-track").forEach((link) => {
  link.addEventListener("click", async () => {
    const payload = await buildPayload({ event: "resume-view", referrer: window.location.pathname, page: "/resume" });
    track("resume-view", payload);
  });
});

// ── Nav clicks ────────────────────────────────────────────
document.querySelectorAll(".nav__links a, .nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("nav-click", { label: a.textContent.trim(), href: a.getAttribute("href"), page: window.location.pathname });
  });
});

// ── Hero CTA ──────────────────────────────────────────────
document.querySelectorAll(".hero__cta a").forEach((a) => {
  a.addEventListener("click", () => {
    track("hero-cta", { label: a.textContent.trim(), href: a.getAttribute("href"), page: window.location.pathname });
  });
});

// ── Gallery preview ───────────────────────────────────────
document.querySelectorAll(".hpt__card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector(".hpt__title");
    track("gallery-preview-click", { title: title ? title.textContent.trim() : "", page: window.location.pathname });
  });
});

// ── Blog post cards ───────────────────────────────────────
document.querySelectorAll(".post-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h2, h3");
    track("blog-post-click", { title: title ? title.textContent.trim() : "", from: window.location.pathname });
  });
});

// ── Project links ─────────────────────────────────────────
document.querySelectorAll(".project-card a").forEach((a) => {
  a.addEventListener("click", () => {
    track("project-click", { name: a.textContent.trim(), page: window.location.pathname });
  });
});

// ── Company / timeline links ──────────────────────────────
document.querySelectorAll(".timeline__company a").forEach((a) => {
  a.addEventListener("click", () => {
    track("company-click", { company: a.textContent.trim(), page: window.location.pathname });
  });
});

// ── Reference links ───────────────────────────────────────
document.querySelectorAll(".ref-card__link").forEach((a) => {
  a.addEventListener("click", () => {
    const name = a.closest(".ref-card") ? a.closest(".ref-card").querySelector(".ref-card__name") : null;
    track("reference-click", { name: name ? name.textContent.trim() : "", page: window.location.pathname });
  });
});

// ── Footer social links ───────────────────────────────────
document.querySelectorAll(".footer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("social-click", { platform: a.textContent.trim(), href: a.getAttribute("href") });
  });
});

// ── Media card clicks ─────────────────────────────────────
document.querySelectorAll(".li-card, .media-card a").forEach((el) => {
  el.addEventListener("click", () => {
    const card  = el.closest(".media-card");
    const label = card ? card.querySelector(".media-card__label") : null;
    track("media-click", { label: label ? label.textContent.trim() : "", type: card ? card.className.replace("media-card media-card--", "") : "" });
  });
});

// ── Award card clicks ─────────────────────────────────────
document.querySelectorAll(".award-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector(".award-card__title");
    track("award-click", { title: title ? title.textContent.trim() : "", page: window.location.pathname });
  });
});

// ── FAQ opens ─────────────────────────────────────────────
document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      const q = item.querySelector(".faq-item__q");
      track("faq-open", { question: q ? q.textContent.trim() : "", page: window.location.pathname });
    }
  });
});

// ── Contact aside link clicks ─────────────────────────────
document.querySelectorAll(".contact-aside__item a").forEach((a) => {
  a.addEventListener("click", () => {
    const label = a.closest(".contact-aside__item") ? a.closest(".contact-aside__item").querySelector(".contact-aside__label") : null;
    track("contact-aside-click", { channel: label ? label.textContent.trim() : "", href: a.getAttribute("href") });
  });
});

// ── Section visibility ────────────────────────────────────
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

// ── Scroll depth ──────────────────────────────────────────
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

// ── Time on page ──────────────────────────────────────────
(function () {
  [30, 60, 120, 300].forEach((secs) => {
    setTimeout(() => track("time-on-page", { seconds: secs, page: window.location.pathname }), secs * 1000);
  });
})();

// ── Exit intent ───────────────────────────────────────────
(function () {
  let fired = false;
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY <= 0 && !fired) { fired = true; track("exit-intent", { page: window.location.pathname }); }
  });
})();

// ── Copy detection ────────────────────────────────────────
document.addEventListener("copy", () => {
  const sel = window.getSelection() ? window.getSelection().toString().slice(0, 100) : "";
  track("text-copy", { text: sel, page: window.location.pathname });
});

// ── Weather widget ────────────────────────────────────────
const weatherWidget = document.getElementById("weatherWidget");
if (weatherWidget) {
  const icons = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️",
    51: "🌦️", 53: "🌦️", 55: "🌧️",
    61: "🌧️", 63: "🌧️", 65: "🌧️",
    71: "❄️", 73: "❄️", 75: "❄️",
    80: "🌦️", 81: "🌧️", 82: "⛈️",
    95: "⚡", 96: "⚡", 99: "⚡",
  };
  const descs = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow",
    80: "Showers", 81: "Rain showers", 82: "Heavy showers",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
  };
  const FAHRENHEIT_COUNTRIES = new Set(["US", "LR", "MM"]);
  function usesFahrenheit(cc) { return FAHRENHEIT_COUNTRIES.has((cc || "").toUpperCase()); }
  let wxData = null, useFahrenheit = false;
  function toF(c) { return Math.round(c * 9 / 5 + 32); }

  function renderWeather() {
    if (!wxData) return;
    const { tempC, code, city, forecast } = wxData;
    const temp = useFahrenheit ? toF(tempC) : tempC;
    const unit = useFahrenheit ? "°F" : "°C";
    document.getElementById("weatherIcon").textContent = icons[code] || "🌤️";
    document.getElementById("weatherTemp").textContent = temp + unit;
    document.getElementById("weatherCity").textContent = city || "";
    document.getElementById("weatherDesc").textContent = descs[code] || "";
    const forecastEl = document.getElementById("weatherForecast");
    if (forecastEl && forecast) {
      forecastEl.innerHTML = forecast.map(d => {
        const hi = useFahrenheit ? toF(d.hi) : d.hi;
        const lo = useFahrenheit ? toF(d.lo) : d.lo;
        return '<span class="wx-day"><span class="wx-day__label">' + d.label + '</span><span class="wx-day__icon">' + (icons[d.code] || "🌤️") + '</span><span class="wx-day__range">' + hi + "/" + lo + unit + "</span></span>";
      }).join("");
    }
    weatherWidget.hidden = false;
  }

  document.getElementById("weatherTemp").addEventListener("click", () => {
    useFahrenheit = !useFahrenheit;
    renderWeather();
  });

  (async () => {
    try {
      let lat, lon, city, country;
      const coordCache = sessionStorage.getItem("wx_coords");
      if (coordCache) {
        ({ lat, lon, city, country } = JSON.parse(coordCache));
      } else {
        const geo = await getGeo();
        lat     = geo.latitude;
        lon     = geo.longitude;
        city    = geo.city    || "";
        country = geo.country || "";
        if (lat && lon) sessionStorage.setItem("wx_coords", JSON.stringify({ lat, lon, city, country }));
      }
      if (!lat || !lon) return;
      let wx;
      const cachedWx = sessionStorage.getItem("wx");
      if (cachedWx) {
        wx = JSON.parse(cachedWx);
      } else {
        wx = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=4"
        ).then(r => r.json());
        sessionStorage.setItem("wx", JSON.stringify(wx));
      }
      const tempC = Math.round(wx.current_weather.temperature);
      const code  = wx.current_weather.weathercode;
      const days  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const forecast = (wx.daily && wx.daily.time ? wx.daily.time : []).slice(1, 4).map((dateStr, i) => ({
        label: days[new Date(dateStr).getDay()],
        code:  wx.daily.weathercode[i + 1],
        hi:    Math.round(wx.daily.temperature_2m_max[i + 1]),
        lo:    Math.round(wx.daily.temperature_2m_min[i + 1]),
      }));
      const coordData = JSON.parse(sessionStorage.getItem("wx_coords") || "{}");
      useFahrenheit = usesFahrenheit(country || coordData.country);
      wxData = { tempC, code, city, forecast };
      renderWeather();
    } catch (_) {}
  })();
}

// ── Lightbox ──────────────────────────────────────────────
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

// ── Caption tooltip ───────────────────────────────────────
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

// ── Hero role typewriter ──────────────────────────────────
(function () {
  const el = document.getElementById("heroRole");
  if (!el) return;
  const roles   = ["DevOps Engineer", "Machine Learning Engineer", "Cloud Specialist", "Multicloud Specialist"];
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) {
    el.textContent = roles.join(" · ");
    var cur = document.querySelector(".hero__cursor");
    if (cur) cur.remove();
    return;
  }
  const TYPE_SPEED = 68, DELETE_SPEED = 36, PAUSE_FULL = 1900, PAUSE_EMPTY = 380;
  let roleIndex = 0, charIndex = 0, deleting = false;
  function tick() {
    const word = roles[roleIndex];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIndex);
      if (charIndex === word.length) { deleting = true; return setTimeout(tick, PAUSE_FULL); }
    } else {
      el.textContent = word.slice(0, --charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; return setTimeout(tick, PAUSE_EMPTY); }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }
  setTimeout(tick, 700);
})();

// ── Contact form ──────────────────────────────────────────
(function () {
  const form    = document.getElementById("contactForm");
  const btn     = document.getElementById("contactSubmit");
  const success = form ? form.querySelector("[data-fs-success]") : null;
  const errBox  = form ? form.querySelector("[data-fs-error]:not([data-fs-error='name']):not([data-fs-error='email']):not([data-fs-error='message'])") : null;
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    btn.disabled = true;
    btn.textContent = "Sending...";
    if (errBox)  { errBox.textContent = "";  errBox.style.display = "none"; }
    if (success) { success.style.display = "none"; }
    try {
      const res  = await fetch("https://formspree.io/f/mnjokoon", {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        if (success) success.style.display = "block";
        form.reset();
        track("contact-form-submit", { page: window.location.pathname });
      } else {
        const msg = (data.errors || []).map(function (err) { return err.message; }).join(", ") || "Something went wrong. Please email me directly.";
        if (errBox) { errBox.textContent = msg; errBox.style.display = "block"; }
      }
    } catch (_) {
      if (errBox) { errBox.textContent = "Something went wrong. Please email me directly."; errBox.style.display = "block"; }
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();
