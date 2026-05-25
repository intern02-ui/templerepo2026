/**
 * Temple Explorer Home Page
 * - Loads temple data from `temples.json`
 * - Provides real-time search, filters (location/deity), sorting, load-more pagination
 * - Optional: bookmarks, recently viewed, nearby suggestions (geolocation)
 *
 * Navigation to existing detail pages:
 * - Uses: `${detailPage}?id=${temple.id}`
 * - You can change it to `/temple/${id}` if you later add a router/server.
 */

const DATA_URL = "temples.json";
const PAGE_SIZE = 9;
const FALLBACK_TEMPLE_IMAGE =
  "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80";
const FAVORITES_KEY = "templeExplorerFavorites";
const RECENT_KEY = "templeExplorerRecent";
const NEW_NOTIF_SEEN_KEY = "templeExplorerNotifiedNew";
const LIVE_NOTIF_SEEN_KEY = "templeExplorerNotifiedLive";
const LANGUAGE_KEY = "preferredTempleLanguage";

const languageBtn = document.getElementById("languageBtn");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const locationFilter = document.getElementById("locationFilter");
const deityFilter = document.getElementById("deityFilter");
const sortSelect = document.getElementById("sortSelect");
const onlyFavoritesToggle = document.getElementById("onlyFavoritesToggle");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const nearbyBtn = document.getElementById("nearbyBtn");
const voiceBtn = document.getElementById("voiceBtn");

const templeGrid = document.getElementById("templeGrid");
const featuredGrid = document.getElementById("featuredGrid");
const favoritesGrid = document.getElementById("favoritesGrid");
const recentGrid = document.getElementById("recentGrid");

const resultsMeta = document.getElementById("resultsMeta");
const templeCount = document.getElementById("templeCount");
const favoriteCount = document.getElementById("favoriteCount");

const notifBtn = document.getElementById("notifBtn");
const notifCount = document.getElementById("notifCount");
const notifMenu = document.getElementById("notifMenu");
const notifClearBtn = document.getElementById("notifClearBtn");
const notifList = document.getElementById("notifList");

const festivalBanner = document.getElementById("festivalBanner");
const festivalChips = document.getElementById("festivalChips");

const modalOverlay = document.getElementById("modalOverlay");
const modalFrame = document.getElementById("modalFrame");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalTitle = document.getElementById("modalTitle");

let allTemples = [];
let viewLimit = PAGE_SIZE;
let nearbyCenter = null; // {lat, lng} when enabled
let festivalMatchedTempleIds = new Set();
let festivalChipsData = [];
let notificationsUnread = 0;
let currentLang = "en";

const HOME_TRANSLATIONS = {
  "Temple Explorer": "मंदिर एक्सप्लोरर",
  "Updates": "अपडेट",
  "Mark read": "पढ़ा हुआ",
  "Explore": "खोजें",
  "Featured": "विशेष",
  "Bookmarks": "बुकमार्क",
  "Recently Viewed": "हाल में देखे गए",
  "Temple Explorer Platform": "मंदिर एक्सप्लोरर प्लेटफॉर्म",
  "Explore Temples Across India": "भारत के मंदिरों को खोजें",
  "Discover divine places and connect spiritually": "पवित्र स्थान खोजें और आध्यात्मिक रूप से जुड़ें",
  "Search by temple name, city or state...": "मंदिर, शहर या राज्य से खोजें...",
  "Clear": "साफ करें",
  "Temples": "मंदिर",
  "Suggest Nearby": "पास के मंदिर सुझाएं",
  "Today's Aarti": "आज की आरती",
  "Peace • Seva • Darshan": "शांति • सेवा • दर्शन",
  "Festival Highlights": "त्योहार विशेष",
  "Explore Temples": "मंदिर खोजें",
  "Search, filter and open your existing temple detail pages.": "मंदिर खोजें, फिल्टर करें और विवरण पेज खोलें।",
  "Location": "स्थान",
  "All locations": "सभी स्थान",
  "Deity": "देवता",
  "All deities": "सभी देवता",
  "Sort": "क्रम",
  "Popular": "लोकप्रिय",
  "Latest": "नवीनतम",
  "Only bookmarks": "केवल बुकमार्क",
  "Load More": "और दिखाएं",
  "Featured / Popular Temples": "विशेष / लोकप्रिय मंदिर",
  "A few trending temples to start your spiritual journey.": "अपनी आध्यात्मिक यात्रा शुरू करने के लिए कुछ लोकप्रिय मंदिर।",
  "Bookmarked Temples": "बुकमार्क किए गए मंदिर",
  "Save temples and come back anytime.": "मंदिर सेव करें और कभी भी वापस आएं।",
  "Quick access to temples you opened.": "आपके खोले गए मंदिरों तक तुरंत पहुंच।",
  "Designed with a clean spiritual theme (white, saffron, gold).": "साफ आध्यात्मिक थीम के साथ डिजाइन किया गया।",
  "Back to top": "ऊपर जाएं",
  "Temple action": "मंदिर क्रिया",
  "No festival matches found yet.": "अभी कोई त्योहार मिलान नहीं मिला।",
  "No new updates right now.": "अभी कोई नया अपडेट नहीं है।",
  "New temples added": "नए मंदिर जोड़े गए",
  "Live darshan now": "लाइव दर्शन अभी",
  "new temple listings are available.": "नए मंदिर उपलब्ध हैं।",
  "temple streams are live.": "मंदिर स्ट्रीम लाइव हैं।",
  "Bookmark": "बुकमार्क",
  "Bookmarked": "बुकमार्क किया गया",
  "Live": "लाइव",
  "Donate": "दान करें",
  "View Darshan": "दर्शन देखें",
  "Popularity": "लोकप्रियता",
  "popular": "लोकप्रिय",
  "No temples found for the current filters.": "मौजूदा फिल्टर में कोई मंदिर नहीं मिला।",
  "No bookmarks yet. Click the bookmark icon on a temple card to save it.": "अभी कोई बुकमार्क नहीं है। मंदिर सेव करने के लिए बुकमार्क आइकन दबाएं।",
  "No temples viewed yet. Open a temple to see it here.": "अभी कोई मंदिर नहीं देखा गया। मंदिर खोलने के बाद यहां दिखेगा।",
  "Nearby suggestions enabled": "पास के सुझाव चालू हैं",
  "Showing": "दिखाए जा रहे हैं",
  "of": "में से",
  "Finding...": "खोज रहे हैं...",
  "Nearby Enabled": "पास के सुझाव चालू",
  "Listening...": "सुन रहा है...",
  "Donate •": "दान •",
  "Live Darshan •": "लाइव दर्शन •",
  "Failed to load temple data. Please check temples.json.": "मंदिर डेटा लोड नहीं हो सका। कृपया temples.json जांचें।"
};

function safeText(value) {
  return String(value ?? "").trim();
}

function translate(text) {
  const value = safeText(text);
  if (currentLang === "en") return value;
  return HOME_TRANSLATIONS[value] || value;
}

function setTextByLanguage(element, english) {
  if (!element) return;
  element.textContent = currentLang === "hi" ? translate(english) : english;
}

function normalize(value) {
  return safeText(value).toLowerCase();
}

function getFavorites() {
  try {
    const raw = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function setFavorites(favSet) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favSet)));
}

function getRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function addToRecent(templeId) {
  const existing = getRecent();
  const next = [templeId, ...existing.filter((id) => id !== templeId)].slice(0, 9);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function locationKey(temple) {
  const city = safeText(temple.city);
  const state = safeText(temple.state);
  if (!city && !state) return "";
  return [city, state].filter(Boolean).join(", ");
}

function getUniqueSorted(list) {
  return Array.from(new Set(list.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

function toDateMs(isoDate) {
  const t = Date.parse(isoDate);
  return Number.isFinite(t) ? t : 0;
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

function buildTempleHref(temple) {
  const detailPage = safeText(temple.detailPage) || "temple.html";
  return `${detailPage}?id=${encodeURIComponent(temple.id)}`;
}

function escapeHtml(text) {
  return safeText(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderEmpty(target, message) {
  target.innerHTML = `<div class="empty">${escapeHtml(translate(message))}</div>`;
}

function escapeHtmlAttr(text) {
  // Attribute-safe HTML string
  return escapeHtml(text).replaceAll("\n", " ");
}

function updateLanguageButton() {
  if (!languageBtn) return;

  const labels =
    currentLang === "hi"
      ? ["हिन्दी", "/", "अंग्रेजी"]
      : ["Hindi", "/", "English"];
  const parts = languageBtn.querySelectorAll("span");
  if (parts.length >= 3) {
    parts[0].textContent = labels[0];
    parts[1].textContent = labels[1];
    parts[2].textContent = labels[2];
  }
  languageBtn.setAttribute(
    "aria-label",
    currentLang === "hi" ? "भाषा अंग्रेजी में बदलें" : "Switch language to Hindi"
  );
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-en]").forEach((element) => {
    const english = element.getAttribute("data-en") || "";
    const hindi = element.getAttribute("data-hi") || translate(english);
    element.textContent = currentLang === "hi" ? hindi : english;
  });

  if (searchInput) {
    searchInput.placeholder = translate("Search by temple name, city or state...");
  }

  Array.from(sortSelect?.options || []).forEach((option) => {
    if (option.value === "az") option.textContent = "A-Z";
    if (option.value === "popular") option.textContent = translate("Popular");
    if (option.value === "latest") option.textContent = translate("Latest");
  });

  updateLanguageButton();
}

function applyLanguage({ rerender = true } = {}) {
  applyStaticLanguage();
  if (!rerender || allTemples.length === 0) return;
  populateFilters();
  renderFestivalBanner(allTemples);
  renderNotifications(allTemples);
  refreshFeatured();
  refreshFavoritesSection();
  refreshRecentSection();
  refreshExplore();
}

function initializeLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  currentLang = savedLanguage === "hi" ? "hi" : "en";
  applyLanguage({ rerender: false });
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem(LANGUAGE_KEY, currentLang);
  applyLanguage();
}

function syncLanguageFromStorage(event) {
  if (event.key !== LANGUAGE_KEY) return;
  if (event.newValue !== "hi" && event.newValue !== "en") return;
  if (event.newValue === currentLang) return;
  currentLang = event.newValue;
  applyLanguage();
}

function buildLiveHref(temple) {
  // Prefer a dedicated live stream page if present, otherwise fall back
  // to the temple detail page's "Live Darshan" section.
  const livePage = safeText(temple.liveStreamPage);
  if (livePage) {
    return `${livePage}?id=${encodeURIComponent(temple.id)}`;
  }
  const detailPage = safeText(temple.detailPage) || "temple.html";
  return `${detailPage}?id=${encodeURIComponent(temple.id)}#live`;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getPopularityPercent(temple) {
  // Normalize using rating, views and donation amounts (all optional).
  const rating = clamp(Number(temple.rating ?? 0), 0, 5); // 0..5
  const views = Math.max(0, Number(temple.views ?? 0));
  const donations = Math.max(0, Number(temple.donations ?? 0));

  const ratingScore = (rating / 5) * 40; // 0..40
  const viewsScore = clamp(views / 120000, 0, 1) * 30; // 0..30
  const donationScore = clamp(donations / 6000000, 0, 1) * 30; // 0..30

  return Math.round(ratingScore + viewsScore + donationScore); // 0..100
}

function renderStars(rating) {
  const r = clamp(Number(rating ?? 0), 0, 5);
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const starFull = "★";
  const starHalf = "⯨";
  const starEmpty = "☆";

  let out = "";
  for (let i = 0; i < full; i++) out += `<span aria-hidden="true">${starFull}</span>`;
  if (half) out += `<span aria-hidden="true">${starHalf}</span>`;
  for (let i = 0; i < empty; i++) out += `<span aria-hidden="true">${starEmpty}</span>`;
  return out;
}

function formatShortNumber(n) {
  const num = Number(n ?? 0);
  if (!Number.isFinite(num)) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(Math.round(num));
}

function computeFestivalMatchSet(temples, activeChips) {
  const matched = new Set();
  if (!activeChips?.length) return matched;

  const tags = new Set();
  activeChips.forEach((chip) => {
    (chip.matchTags || []).forEach((t) => tags.add(String(t).toLowerCase()));
    (chip.matchDeities || []).forEach((d) => tags.add(String(d).toLowerCase()));
  });

  temples.forEach((t) => {
    const deity = safeText(t.deity).toLowerCase();
    const templeTags = Array.isArray(t.tags) ? t.tags.map((x) => safeText(x).toLowerCase()) : [];
    const hit = tags.has(deity) || templeTags.some((tg) => tags.has(tg));
    if (hit) matched.add(t.id);
  });
  return matched;
}

function renderFestivalBanner(temples) {
  // Lightweight banner data; matches by temple deity/tags.
  const FESTIVALS = [
    {
      name: "Janmashtami",
      matchDeities: ["Krishna"],
      matchTags: ["krishna", "laddu", "bhakti", "festival"]
    },
    {
      name: "Navratri",
      matchDeities: ["Devi", "Sikh"],
      matchTags: ["festival", "architecture", "langar"]
    },
    {
      name: "Mahashivratri",
      matchDeities: ["Shiv"],
      matchTags: ["jyotirlinga", "himalaya", "darshan"]
    }
  ];

  // Choose festivals that match the most temples in current dataset.
  const scored = FESTIVALS.map((f) => {
    const tmpMatched = computeFestivalMatchSet(temples, [f]);
    return { festival: f, count: tmpMatched.size, matchedIds: tmpMatched };
  }).sort((a, b) => b.count - a.count);

  const active = scored.filter((s) => s.count > 0).slice(0, 3);
  const activeChips = active.map((x) => x.festival);
  festivalMatchedTempleIds = computeFestivalMatchSet(temples, activeChips);

  if (!activeChips.length) {
    if (festivalChips) festivalChips.innerHTML = "";
    if (festivalBanner) {
      festivalBanner.querySelector(".festival-text").textContent = translate("No festival matches found yet.");
    }
    return;
  }

  if (festivalBanner) {
    festivalBanner.querySelector(".festival-text").textContent =
      currentLang === "hi"
        ? "विशेष अवसर चल रहे हैं • हाइलाइट करने के लिए चिप दबाएं"
        : "Special moments happening now • Tap a chip to highlight";
  }

  festivalChipsData = activeChips;
  festivalChips.innerHTML = activeChips
    .map(
      (f) =>
        `<button class="festival-chip" type="button" data-action="festival-chip" data-chip="${escapeHtmlAttr(
          f.name
        )}" data-speak="${escapeHtmlAttr(f.name)}">${escapeHtmlAttr(f.name)}</button>`
    )
    .join("");
}

function getNotifState() {
  try {
    const seenNew = new Set(JSON.parse(localStorage.getItem(NEW_NOTIF_SEEN_KEY) || "[]"));
    const seenLive = new Set(JSON.parse(localStorage.getItem(LIVE_NOTIF_SEEN_KEY) || "[]"));
    return { seenNew, seenLive };
  } catch {
    return { seenNew: new Set(), seenLive: new Set() };
  }
}

function setNotifState(seenNew, seenLive) {
  localStorage.setItem(NEW_NOTIF_SEEN_KEY, JSON.stringify(Array.from(seenNew)));
  localStorage.setItem(LIVE_NOTIF_SEEN_KEY, JSON.stringify(Array.from(seenLive)));
}

function computeNotifications(temples) {
  const { seenNew, seenLive } = getNotifState();

  const newTemples = temples.filter((t) => t.isNew && !seenNew.has(t.id));
  const liveTemples = temples.filter((t) => t.isLive && !seenLive.has(t.id));

  const notifications = [];
  if (newTemples.length) {
    notifications.push({
      key: "new",
      title:
        currentLang === "hi"
          ? `${translate("New temples added")} (${newTemples.length})`
          : `New temples added (${newTemples.length})`,
      meta: newTemples
        .slice(0, 3)
        .map((t) => t.name)
        .join(" • "),
      ids: newTemples.map((t) => t.id)
    });
  }

  if (liveTemples.length) {
    notifications.push({
      key: "live",
      title:
        currentLang === "hi"
          ? `${translate("Live darshan now")} (${liveTemples.length})`
          : `Live Darshan started (${liveTemples.length})`,
      meta: liveTemples
        .slice(0, 2)
        .map((t) => t.name)
        .join(" • "),
      ids: liveTemples.map((t) => t.id)
    });
  }

  return { notifications, seenNew, seenLive };
}

function renderNotifications(temples) {
  const { notifications, seenNew, seenLive } = computeNotifications(temples);
  notificationsUnread = notifications.length
    ? notifications.reduce((sum, n) => sum + (Array.isArray(n.ids) ? n.ids.length : 1), 0)
    : 0;

  notifCount.textContent = String(notificationsUnread);
  notifCount.hidden = notificationsUnread === 0;
  notifList.innerHTML = "";

  if (!notifications.length) {
    notifList.innerHTML =
      `<div class="empty">${escapeHtml(translate("No new updates right now."))}</div>`;
    return;
  }

  notifList.innerHTML = notifications
    .map((n) => {
      return `
        <div class="notif-item" data-speak="${escapeHtmlAttr(n.title)}">
          <div class="notif-item-title">${escapeHtml(n.title)}</div>
          <div class="notif-item-meta">${escapeHtml(n.meta)}</div>
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
            ${
              Array.isArray(n.ids) && n.ids.length
                ? `<button class="btn btn-ghost" type="button" data-action="notif-mark" data-notif-key="${escapeHtmlAttr(
                    n.key
                  )}" data-speak="Mark read">${escapeHtml(translate("Mark read"))}</button>`
                : ""
            }
          </div>
        </div>
      `;
    })
    .join("");

  // If there are notifications, mark the underlying IDs as seen immediately when dropdown is opened.
  // Actual UI "Mark read" will still work, but this keeps the badge light.
  notifMenu.dataset.hasNotifs = "true";
}

function speakText(text) {
  if (!text) return;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

  const t = safeText(text);
  if (!t) return;

  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(t);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-IN";
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore
  }
}

function wireTouchToSpeak() {
  // Speak only when element explicitly opted-in via data-speak.
  document.addEventListener("click", (e) => {
    if (e.target.closest("button, .btn")) return;

    const el = e.target.closest("[data-speak]");
    if (!el) return;
    const text = el.getAttribute("data-speak") || el.textContent;
    if (!text) return;
    speakText(text);
  });
}

function wireVoiceSearch() {
  if (!voiceBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.disabled = true;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;
  voiceBtn.addEventListener("click", () => {
    if (listening) return;
    listening = true;
    voiceBtn.textContent = translate("Listening...");
    recognition.start();
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript;
    if (transcript) {
      searchInput.value = transcript;
      nearbyCenter = null;
      nearbyBtn.disabled = false;
      setTextByLanguage(nearbyBtn, "Suggest Nearby");
      resetAndRefreshExplore();
    }
  });

  recognition.addEventListener("end", () => {
    listening = false;
    voiceBtn.textContent = "🎤";
  });

  recognition.addEventListener("error", () => {
    listening = false;
    voiceBtn.textContent = "🎤";
  });
}

function openQuickActionModal(temple, mode) {
  // mode: 'donate' | 'darshan'
  const detailPage = safeText(temple.detailPage) || "temple.html";
  const href =
    mode === "donate"
      ? `${detailPage}?id=${encodeURIComponent(temple.id)}#donation`
      : (() => {
          const livePage = safeText(temple.liveStreamPage);
          if (livePage) return `${livePage}?id=${encodeURIComponent(temple.id)}`;
          return `${detailPage}?id=${encodeURIComponent(temple.id)}#live`;
        })();

  modalTitle.textContent =
    mode === "donate"
      ? `${translate("Donate •")} ${temple.name}`
      : `${translate("Live Darshan •")} ${temple.name}`;
  modalFrame.src = href;
  modalOverlay.hidden = false;
  modalOverlay.setAttribute("aria-hidden", "false");
}

function closeQuickActionModal() {
  modalFrame.src = "about:blank";
  modalOverlay.hidden = true;
  modalOverlay.setAttribute("aria-hidden", "true");
}

function wireModalInteractions() {
  if (!modalOverlay) return;

  modalOverlay.addEventListener("click", (e) => {
    // Close only if clicking overlay background, not inside modal.
    if (e.target === modalOverlay) closeQuickActionModal();
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeQuickActionModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && !modalOverlay.hidden) {
      closeQuickActionModal();
    }
  });
}

function makeCard(temple, { showBookmark = true } = {}) {
  const favs = getFavorites();
  const isFav = favs.has(temple.id);
  const loc = locationKey(temple);

  const isLive = Boolean(temple.isLive);
  const primaryHref = isLive ? buildLiveHref(temple) : buildTempleHref(temple);
  const popularity = getPopularityPercent(temple);
  const showFestival = festivalMatchedTempleIds.has(temple.id);
  const statusOverlay = isLive
    ? `<div class="card-topline">
          <div class="card-badges">
            <span class="live-badge" data-speak="Live"><span class="live-dot" aria-hidden="true"></span> ${escapeHtml(translate("Live")).toUpperCase()}</span>
          </div>
        </div>`
    : "";

  const bookmarkBtn = showBookmark
    ? `<button class="bookmark-btn${isFav ? " is-bookmarked" : ""}" type="button" data-action="toggle-fav" data-id="${escapeHtml(
        temple.id
      )}" aria-label="${escapeHtmlAttr(translate(isFav ? "Bookmarked" : "Bookmark"))}" title="${
        escapeHtmlAttr(translate(isFav ? "Bookmarked" : "Bookmark"))
      }" data-speak="${escapeHtmlAttr(isFav ? "Bookmarked" : "Bookmark")}">&#128278;</button>`
    : "";

  return `
    <article class="card${showFestival ? " festival-highlight" : ""}" data-id="${escapeHtml(
    temple.id
  )}">
      <div class="card-media-wrap">
        <a class="card-media" href="${escapeHtml(primaryHref)}" data-action="open">
          <img src="${escapeHtml(temple.image || FALLBACK_TEMPLE_IMAGE)}" alt="${escapeHtml(
            temple.name
          )}" onerror="this.onerror=null;this.src='${escapeHtml(FALLBACK_TEMPLE_IMAGE)}';">
        </a>
        ${statusOverlay}
        ${bookmarkBtn}
      </div>
      <div class="card-body">
        <div class="card-title">
          <h3 data-speak="${escapeHtmlAttr(temple.name)}">${escapeHtml(temple.name)}</h3>
          <span class="pill" data-speak="${escapeHtmlAttr(
            temple.deity || "Temple"
          )}">${escapeHtml(temple.deity || "Temple")}</span>
        </div>
        <div class="card-loc" data-speak="${escapeHtmlAttr(loc || "India")}">${escapeHtml(
          loc || "India"
        )}</div>
        <div class="popularity" data-speak="Popularity ${popularity} percent">
          <div class="stars" aria-label="Rating">${renderStars(temple.rating)}</div>
          <div><strong>${popularity}%</strong> ${escapeHtml(translate("popular"))}</div>
        </div>
        <p class="card-desc" data-speak="${escapeHtmlAttr(
          safeText(temple.description || "").slice(0, 120)
        )}">${escapeHtml(temple.description || "")}</p>
        <div class="card-actions">
          <div class="quick-actions" data-speak="Quick actions">
            <button class="btn btn-primary" type="button" data-action="quick-donate" data-id="${escapeHtml(
              temple.id
            )}" data-speak="Donate">${escapeHtml(translate("Donate"))}</button>
            <button class="btn btn-ghost" type="button" data-action="quick-darshan" data-id="${escapeHtml(
              temple.id
            )}" data-speak="View Darshan">${escapeHtml(translate("View Darshan"))}</button>
          </div>

          <a class="btn btn-primary" href="${escapeHtml(primaryHref)}" data-action="open" data-speak="Explore">${escapeHtml(translate("Explore"))}</a>
        </div>
      </div>
    </article>
  `;
}

function renderGrid(target, temples, { showBookmark = true } = {}) {
  if (!temples.length) {
    renderEmpty(target, "No temples found for the current filters.");
    return;
  }
  target.innerHTML = temples.map((t) => makeCard(t, { showBookmark })).join("");
}

function computeFilteredTemples() {
  const q = normalize(searchInput.value);
  const locationValue = safeText(locationFilter.value);
  const deityValue = safeText(deityFilter.value);
  const sortMode = safeText(sortSelect.value);
  const onlyFav = Boolean(onlyFavoritesToggle.checked);

  const favs = getFavorites();

  let list = allTemples.slice();

  if (onlyFav) {
    list = list.filter((t) => favs.has(t.id));
  }

  if (q) {
    list = list.filter((t) => {
      const haystack = [
        t.name,
        t.city,
        t.state,
        t.deity,
        ...(Array.isArray(t.tags) ? t.tags : [])
      ]
        .map(normalize)
        .join(" ");
      return haystack.includes(q);
    });
  }

  if (locationValue) {
    list = list.filter((t) => locationKey(t) === locationValue);
  }

  if (deityValue) {
    list = list.filter((t) => safeText(t.deity) === deityValue);
  }

  if (nearbyCenter) {
    list = list
      .map((t) => {
        const geo = t.geo;
        if (!geo || !Number.isFinite(geo.lat) || !Number.isFinite(geo.lng)) {
          return { t, distanceKm: Number.POSITIVE_INFINITY };
        }
        return { t, distanceKm: haversineKm(nearbyCenter, geo) };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .map((x) => x.t);
  } else if (sortMode === "az") {
    list.sort((a, b) => safeText(a.name).localeCompare(safeText(b.name)));
  } else if (sortMode === "popular") {
    list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  } else if (sortMode === "latest") {
    list.sort((a, b) => toDateMs(b.createdAt) - toDateMs(a.createdAt));
  }

  return list;
}

function refreshCounts() {
  templeCount.textContent = String(allTemples.length);
  favoriteCount.textContent = String(getFavorites().size);
}

function refreshFeatured() {
  const featured = allTemples
    .slice()
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6);

  renderGrid(featuredGrid, featured);
}

function refreshFavoritesSection() {
  const favs = getFavorites();
  const list = allTemples.filter((t) => favs.has(t.id));
  if (!list.length) {
    renderEmpty(favoritesGrid, "No bookmarks yet. Click the bookmark icon on a temple card to save it.");
    return;
  }
  renderGrid(favoritesGrid, list);
}

function refreshRecentSection() {
  const recentIds = getRecent();
  const map = new Map(allTemples.map((t) => [t.id, t]));
  const list = recentIds.map((id) => map.get(id)).filter(Boolean);
  if (!list.length) {
    renderEmpty(recentGrid, "No temples viewed yet. Open a temple to see it here.");
    return;
  }
  renderGrid(recentGrid, list, { showBookmark: true });
}

function refreshExplore() {
  const filtered = computeFilteredTemples();
  const showing = filtered.slice(0, viewLimit);

  if (nearbyCenter) {
    resultsMeta.textContent = `${translate("Nearby suggestions enabled")} • ${translate("Showing")} ${showing.length} ${translate("of")} ${filtered.length}`;
  } else {
    resultsMeta.textContent = `${translate("Showing")} ${showing.length} ${translate("of")} ${filtered.length}`;
  }

  renderGrid(templeGrid, showing);

  loadMoreBtn.style.display = filtered.length > showing.length ? "inline-flex" : "none";
}

function resetAndRefreshExplore() {
  viewLimit = PAGE_SIZE;
  refreshExplore();
}

function populateFilters() {
  const locations = getUniqueSorted(allTemples.map(locationKey));
  const deities = getUniqueSorted(allTemples.map((t) => safeText(t.deity)));

  locationFilter.innerHTML = `<option value="">${escapeHtml(translate("All locations"))}</option>${locations
    .map((loc) => `<option value="${escapeHtml(loc)}">${escapeHtml(loc)}</option>`)
    .join("")}`;

  deityFilter.innerHTML = `<option value="">${escapeHtml(translate("All deities"))}</option>${deities
    .map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`)
    .join("")}`;
}

function onGridClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.getAttribute("data-action");
  const id = button.getAttribute("data-id");
  const needsTempleId = action === "toggle-fav" || action.startsWith("quick-");
  if (needsTempleId && !id) return;

  const temple = id ? allTemples.find((t) => String(t.id) === String(id)) : null;
  if (!temple && action.startsWith("quick-")) return;

  if (action === "toggle-fav") {
    const favs = getFavorites();
    if (favs.has(id)) favs.delete(id);
    else favs.add(id);
    setFavorites(favs);

    addToRecent(id);
    refreshCounts();
    refreshExplore();
    refreshFeatured();
    refreshFavoritesSection();
    refreshRecentSection();
  } else if (action === "quick-donate") {
    addToRecent(id);
    openQuickActionModal(temple, "donate");
  } else if (action === "quick-darshan") {
    addToRecent(id);
    openQuickActionModal(temple, "darshan");
  } else if (action === "notif-mark") {
    // Mark read for the relevant category.
    const notifKey = button.getAttribute("data-notif-key");
    const { seenNew, seenLive } = getNotifState();
    if (notifKey === "new") {
      allTemples.filter((t) => t.isNew).forEach((t) => seenNew.add(t.id));
    }
    if (notifKey === "live") {
      allTemples.filter((t) => t.isLive).forEach((t) => seenLive.add(t.id));
    }
    setNotifState(seenNew, seenLive);
    renderNotifications(allTemples);
  }
}

function onNotificationClick(event) {
  const button = event.target.closest('button[data-action="notif-mark"]');
  if (!button) return;

  const notifKey = button.getAttribute("data-notif-key");
  const { seenNew, seenLive } = getNotifState();
  if (notifKey === "new") {
    allTemples.filter((t) => t.isNew).forEach((t) => seenNew.add(t.id));
  }
  if (notifKey === "live") {
    allTemples.filter((t) => t.isLive).forEach((t) => seenLive.add(t.id));
  }
  setNotifState(seenNew, seenLive);
  renderNotifications(allTemples);
}

function onGridNavigate(event) {
  const link = event.target.closest('a[data-action="open"]');
  if (!link) return;
  const card = link.closest(".card");
  const id = card?.getAttribute("data-id");
  if (id) addToRecent(id);
}

async function enableNearbySuggestions() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported in this browser.");
    return;
  }

  nearbyBtn.disabled = true;
  nearbyBtn.textContent = translate("Finding...");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      nearbyCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      nearbyBtn.textContent = translate("Nearby Enabled");
      resetAndRefreshExplore();
    },
    () => {
      nearbyCenter = null;
      nearbyBtn.disabled = false;
      setTextByLanguage(nearbyBtn, "Suggest Nearby");
      alert("Location permission denied. Nearby suggestions are disabled.");
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

async function loadData() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${DATA_URL}`);
  const data = await res.json();
  const temples = Array.isArray(data?.temples) ? data.temples : [];

  allTemples = temples
    .filter((t) => t && t.id && t.name)
    .map((t) => ({
      ...t,
      id: safeText(t.id),
      name: safeText(t.name),
      city: safeText(t.city),
      state: safeText(t.state),
      deity: safeText(t.deity),
      description: safeText(t.description),
      image:
        safeText(t.image) ||
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80",
      popularity: Number.isFinite(Number(t.popularity)) ? Number(t.popularity) : 0,
      rating: Number.isFinite(Number(t.rating)) ? Number(t.rating) : 0,
      views: Number.isFinite(Number(t.views)) ? Number(t.views) : 0,
      donations: Number.isFinite(Number(t.donations)) ? Number(t.donations) : 0,
      isLive: Boolean(t.isLive),
      isNew: Boolean(t.isNew),
      liveStartedAt: safeText(t.liveStartedAt) || null,
      createdAt: safeText(t.createdAt) || "2026-01-01",
      detailPage: safeText(t.detailPage) || "temple.html"
    }));
}

function wireEvents() {
  if (languageBtn) {
    languageBtn.addEventListener("click", toggleLanguage);
  }
  window.addEventListener("storage", syncLanguageFromStorage);

  searchInput.addEventListener("input", () => {
    nearbyCenter = null;
    nearbyBtn.disabled = false;
    setTextByLanguage(nearbyBtn, "Suggest Nearby");
    resetAndRefreshExplore();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    resetAndRefreshExplore();
    searchInput.focus();
  });

  locationFilter.addEventListener("change", resetAndRefreshExplore);
  deityFilter.addEventListener("change", resetAndRefreshExplore);
  sortSelect.addEventListener("change", resetAndRefreshExplore);
  onlyFavoritesToggle.addEventListener("change", resetAndRefreshExplore);

  loadMoreBtn.addEventListener("click", () => {
    viewLimit += PAGE_SIZE;
    refreshExplore();
  });

  nearbyBtn.addEventListener("click", enableNearbySuggestions);

  // Notifications dropdown
  if (notifBtn && notifMenu) {
    notifBtn.addEventListener("click", () => {
      const isHidden = notifMenu.hidden;
      notifMenu.hidden = !isHidden;
      if (!isHidden) {
        return;
      }
      renderNotifications(allTemples);
    });

    document.addEventListener("click", (e) => {
      const clickedInside = e.target.closest("#notifMenu") || e.target.closest("#notifBtn");
      if (!clickedInside && notifMenu && !notifMenu.hidden) {
        notifMenu.hidden = true;
      }
    });
  }

  if (notifClearBtn) {
    notifClearBtn.addEventListener("click", () => {
      const { seenNew, seenLive } = getNotifState();
      allTemples.filter((t) => t.isNew).forEach((t) => seenNew.add(t.id));
      allTemples.filter((t) => t.isLive).forEach((t) => seenLive.add(t.id));
      setNotifState(seenNew, seenLive);
      renderNotifications(allTemples);
      if (notifMenu) notifMenu.hidden = true;
    });
  }

  if (notifList) {
    notifList.addEventListener("click", onNotificationClick);
  }

  // Festival chips: update highlight set
  if (festivalChips) {
    festivalChips.addEventListener("click", (e) => {
      const chipBtn = e.target.closest('[data-action="festival-chip"]');
      if (!chipBtn) return;
      const chipName = chipBtn.getAttribute("data-chip");
      const chipObj = festivalChipsData.find((x) => x.name === chipName);
      if (!chipObj) return;
      festivalMatchedTempleIds = computeFestivalMatchSet(allTemples, [chipObj]);
      // Re-render visible sections so highlight updates immediately.
      refreshExplore();
      refreshFeatured();
      refreshFavoritesSection();
      refreshRecentSection();
    });
  }

  templeGrid.addEventListener("click", onGridClick);
  featuredGrid.addEventListener("click", onGridClick);
  favoritesGrid.addEventListener("click", onGridClick);
  recentGrid.addEventListener("click", onGridClick);

  templeGrid.addEventListener("click", onGridNavigate);
  featuredGrid.addEventListener("click", onGridNavigate);
  favoritesGrid.addEventListener("click", onGridNavigate);
  recentGrid.addEventListener("click", onGridNavigate);
}

async function start() {
  try {
    initializeLanguage();
    await loadData();
    populateFilters();
    renderFestivalBanner(allTemples);
    renderNotifications(allTemples);
    refreshCounts();
    refreshFeatured();
    refreshFavoritesSection();
    refreshRecentSection();
    refreshExplore();
    wireEvents();
    wireTouchToSpeak();
    wireModalInteractions();
    wireVoiceSearch();
  } catch (err) {
    renderEmpty(templeGrid, "Failed to load temple data. Please check temples.json.");
    loadMoreBtn.style.display = "none";
    console.error(err);
  }
}

start();

