// Mobile nav
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

// ── Umami helper ──
function track(event, props) {
  if (typeof umami !== "undefined") umami.track(event, props || {});
}

// ── Visitor + resume tracking ──
const SHEET_URL = document.body.dataset.sheetUrl;

async function getGeo() {
  const cached = sessionStorage.getItem("geo");
  if (cached) return JSON.parse(cached);
  try {
    const res = await fetch("https://ipinfo.io/json?token=");
    if (!res.ok) return {};
    const data = await res.json();
    const [latitude, longitude] = (data.loc || ",").split(",").map(Number);
    const geo = {
      city:         data.city    || "",
      country_name: data.country || "",
      region:       data.region  || "",
      latitude,
      longitude,
    };
    // Cache only non-sensitive fields to avoid storing precise coordinates in clear text.
    sessionStorage.setItem(
      "geo",
      JSON.stringify({
        city:         geo.city,
        country_name: geo.country_name,
        region:       geo.region,
      }),
    );
    return geo;
  }
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
  let url;
  try {
    url = new URL(SHEET_URL, window.location.origin);
  }
  catch (_) {
    return;
  }
  const allowedHosts = ["script.google.com"];
  if (!allowedHosts.includes(url.hostname)) return;
  navigator.sendBeacon(url.toString(), JSON.stringify(payload));
}

// Fire on every page load
(async () => {
  const geo = await getGeo();
  const payload = {
    page:     window.location.pathname,
    referrer: document.referrer || "direct",
    city:     geo.city         || "",
    country:  geo.country_name || "",
    region:   geo.region       || "",
    device:   getDevice(),
    os:       getOS(),
    browser:  getBrowser(),
  };
  sendToSheet(payload);
  track("page-visit", { city: payload.city, country: payload.country });
})();

// Resume click
document.querySelectorAll(".resume-track").forEach((link) => {
  link.addEventListener("click", async () => {
    const geo = await getGeo();
    const payload = {
      page:     "/resume",
      referrer: window.location.pathname,
      city:     geo.city         || "",
      country:  geo.country_name || "",
      region:   geo.region       || "",
      device:   getDevice(),
      os:       getOS(),
      browser:  getBrowser(),
    };
    sendToSheet(payload);
    track("resume-view", { city: payload.city, country: payload.country });
  });
});

// ── Nav clicks ──
document.querySelectorAll(".nav__links a, .nav__drawer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("nav-click", { label: a.textContent.trim(), href: a.getAttribute("href") });
  });
});

// ── Hero CTA ──
document.querySelectorAll(".hero__cta a").forEach((a) => {
  a.addEventListener("click", () => {
    track("hero-cta", { label: a.textContent.trim() });
  });
});

// ── Gallery preview (homepage timeline cards) ──
document.querySelectorAll(".hpt__card").forEach((card) => {
  card.addEventListener("click", () => {
    track("gallery-preview-click", { title: card.querySelector(".hpt__title") ? card.querySelector(".hpt__title").textContent.trim() : "" });
  });
});

// ── Blog post cards (homepage + writing index) ──
document.querySelectorAll(".post-card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h2, h3");
    track("blog-post-click", { title: title ? title.textContent.trim() : "", from: window.location.pathname });
  });
});

// ── Project links ──
document.querySelectorAll(".project-card a").forEach((a) => {
  a.addEventListener("click", () => {
    track("project-click", { name: a.textContent.trim() });
  });
});

// ── Company links in experience timeline ──
document.querySelectorAll(".timeline__company a").forEach((a) => {
  a.addEventListener("click", () => {
    track("company-click", { company: a.textContent.trim() });
  });
});

// ── Reference LinkedIn links ──
document.querySelectorAll(".ref-card__link").forEach((a) => {
  a.addEventListener("click", () => {
    const name = a.closest(".ref-card").querySelector(".ref-card__name");
    track("reference-click", { name: name ? name.textContent.trim() : "" });
  });
});

// ── Footer social links ──
document.querySelectorAll(".footer a").forEach((a) => {
  a.addEventListener("click", () => {
    track("social-click", { platform: a.textContent.trim() });
  });
});

// ── Visibility page — media card clicks ──
document.querySelectorAll(".li-card, .media-card a").forEach((el) => {
  el.addEventListener("click", () => {
    const card = el.closest(".media-card");
    const label = card ? card.querySelector(".media-card__label") : null;
    track("media-click", { label: label ? label.textContent.trim() : "", type: card ? card.className.replace("media-card media-card--", "") : "" });
  });
});

// ── Scroll depth ──
(function () {
  const marks = [25, 50, 75, 100];
  const fired = new Set();
  window.addEventListener("scroll", () => {
    const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    marks.forEach((m) => {
      if (scrolled >= m && !fired.has(m)) {
        fired.add(m);
        track("scroll-depth", { depth: m + "%", page: window.location.pathname });
      }
    });
  }, { passive: true });
})();

// ── Time on page ──
(function () {
  [30, 60, 120].forEach((secs) => {
    setTimeout(() => {
      track("time-on-page", { seconds: secs, page: window.location.pathname });
    }, secs * 1000);
  });
})();


// ── Weather widget ──
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

  // Only US, Liberia (LR), and Myanmar (MM) use °F
  const FAHRENHEIT_COUNTRIES = new Set(["US", "LR", "MM"]);
  function usesFahrenheit(countryCode) { return FAHRENHEIT_COUNTRIES.has((countryCode || "").toUpperCase()); }

  let wxData = null;
  let useFahrenheit = false;

  function toF(c) { return Math.round(c * 9 / 5 + 32); }

  function renderWeather() {
    if (!wxData) return;
    const { tempC, code, city, forecast } = wxData;
    const temp = useFahrenheit ? toF(tempC) : tempC;
    const unit = useFahrenheit ? "°F" : "°C";

    document.getElementById("weatherIcon").textContent = icons[code] || "🌤️";
    document.getElementById("weatherTemp").textContent = `${temp}${unit}`;
    document.getElementById("weatherCity").textContent = city || "";
    document.getElementById("weatherDesc").textContent = descs[code] || "";

    // Forecast days
    const forecastEl = document.getElementById("weatherForecast");
    if (forecastEl && forecast) {
      forecastEl.innerHTML = forecast.map(d => {
        const hi = useFahrenheit ? toF(d.hi) : d.hi;
        const lo = useFahrenheit ? toF(d.lo) : d.lo;
        return `<span class="wx-day"><span class="wx-day__label">${d.label}</span><span class="wx-day__icon">${icons[d.code] || "🌤️"}</span><span class="wx-day__range">${hi}/${lo}${unit}</span></span>`;
      }).join("");
    }

    weatherWidget.hidden = false;
  }

  // Toggle °C / °F on temp click
  document.getElementById("weatherTemp").addEventListener("click", () => {
    useFahrenheit = !useFahrenheit;
    renderWeather();
  });

  (async () => {
    try {
      // Get coords — use dedicated cache key that preserves lat/lon
      let lat, lon, city, country;
      const coordCache = sessionStorage.getItem("wx_coords");
      if (coordCache) {
        ({ lat, lon, city, country } = JSON.parse(coordCache));
      } else {
        const geo = await getGeo();
        // getGeo() strips lat/lon from its own cache — re-fetch coords directly
        const res = await fetch("https://ipinfo.io/json?token=");
        if (res.ok) {
          const d = await res.json();
          [lat, lon] = (d.loc || ",").split(",").map(Number);
          city = d.city || "";
          const country = d.country || "";
          sessionStorage.setItem("wx_coords", JSON.stringify({ lat, lon, city, country }));
        }
      }
      if (!lat || !lon) return;

      let wx;
      const cachedWx = sessionStorage.getItem("wx");
      if (cachedWx) {
        wx = JSON.parse(cachedWx);
      } else {
        wx = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=4`
        ).then(r => r.json());
        sessionStorage.setItem("wx", JSON.stringify(wx));
      }

      const tempC = Math.round(wx.current_weather.temperature);
      const code  = wx.current_weather.weathercode;

      // Build 3-day forecast (skip today = index 0)
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const forecast = (wx.daily?.time || []).slice(1, 4).map((dateStr, i) => ({
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
if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
if (lightbox) document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

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

// ── Hero role typewriter ──────────────────────────────────
(function () {
  const el = document.getElementById("heroRole");
  if (!el) return;

  const roles = ["DevOps Engineer", "Machine Learning Engineer", "Cloud Architect"];
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (REDUCED) {
    el.textContent = roles.join(" · ");
    document.querySelector(".hero__cursor")?.remove();
    return;
  }

  const TYPE_SPEED   = 68;
  const DELETE_SPEED = 36;
  const PAUSE_FULL   = 1900;
  const PAUSE_EMPTY  = 380;

  let roleIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const word = roles[roleIndex];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIndex);
      if (charIndex === word.length) {
        deleting = true;
        return setTimeout(tick, PAUSE_FULL);
      }
    } else {
      el.textContent = word.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        return setTimeout(tick, PAUSE_EMPTY);
      }
    }
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  setTimeout(tick, 700);
})();
