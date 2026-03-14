// Mobile nav
const toggle = document.getElementById("navToggle");
const drawer = document.getElementById("navDrawer");
if (toggle && drawer) {
  toggle.addEventListener("click", () => drawer.classList.toggle("open"));
}
document.querySelectorAll(".nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => drawer.classList.remove("open"));
});

// ── Visitor + resume tracking ──
const SHEET_URL = document.body.dataset.sheetUrl;

async function getGeo() {
  try { return await fetch("https://ipapi.co/json/").then(r => r.json()); }
  catch (_) { return {}; }
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

function sendToSheet(payload) {
  if (!SHEET_URL) return;
  navigator.sendBeacon(SHEET_URL, JSON.stringify(payload));
}

// Fire on every page load
(async () => {
  const geo = await getGeo();
  const payload = {
    page:    window.location.pathname,
    referrer: document.referrer || "direct",
    city:    geo.city         || "",
    country: geo.country_name || "",
    region:  geo.region       || "",
    device:  getDevice(),
    os:      getOS(),
    browser: getBrowser(),
  };
  sendToSheet(payload);
  if (typeof umami !== "undefined") {
    umami.track("page-visit", { city: payload.city, country: payload.country });
  }
})();

// Resume click — log with page = "/resume"
document.querySelectorAll(".resume-track").forEach((link) => {
  link.addEventListener("click", async () => {
    const geo = await getGeo();
    const payload = {
      page:    "/resume",
      referrer: window.location.pathname,
      city:    geo.city         || "",
      country: geo.country_name || "",
      region:  geo.region       || "",
      device:  getDevice(),
      os:      getOS(),
      browser: getBrowser(),
    };
    sendToSheet(payload);
    if (typeof umami !== "undefined") {
      umami.track("resume-view", { city: payload.city, country: payload.country });
    }
  });
});

// ── Weather widget ──
const weatherWidget = document.getElementById("weatherWidget");
if (weatherWidget) {
  (async () => {
    try {
      const geo = await getGeo();
      const { latitude: lat, longitude: lon, city } = geo;
      if (!lat || !lon) return;

      const wx = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
      ).then(r => r.json());

      const temp = Math.round(wx.current_weather.temperature);
      const code = wx.current_weather.weathercode;

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

      document.getElementById("weatherIcon").textContent = icons[code] || "🌤️";
      document.getElementById("weatherTemp").textContent = `${temp}°C`;
      document.getElementById("weatherCity").textContent = city || "";
      document.getElementById("weatherDesc").textContent = descs[code] || "";
      weatherWidget.hidden = false;
    } catch (_) {}
  })();
}

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
