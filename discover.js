// ===============================
// ANA REFI - Discover Egypt Page
// ===============================

// ---------- PAGE LOADER ----------
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.classList.add("hide");
  }, 900);
});

// ---------- MOBILE MENU ----------
document.getElementById("menuToggle")?.addEventListener("click", () => {
  document.getElementById("navContainer").classList.toggle("active");
  document.getElementById("menuToggle").classList.toggle("active");
});

// ===============================
// REGIONS DATA (Map + Crafts source of truth)
// ===============================
const egyptRegions = [
  {
    key: "siwa",
    name: "Siwa Oasis",
    coords: [29.2032, 25.5195],
    craft: "Pottery & Olive Oil",
    craftIcon: "fa-solid fa-mortar-pestle",
    desc: "An isolated oasis near the Libyan border, known for its hand-shaped pottery, salt lakes, and centuries-old Amazigh traditions."
  },
  {
    key: "fayoum",
    name: "Fayoum",
    coords: [29.3084, 30.8428],
    craft: "Traditional Pottery",
    craftIcon: "fa-solid fa-mortar-pestle",
    desc: "One of Egypt's oldest farming regions, famous for its pottery workshops and waterwheels along Lake Qarun."
  },
  {
    key: "aswan",
    name: "Aswan & Nubia",
    coords: [24.0889, 32.8998],
    craft: "Nubian Weaving & Beadwork",
    craftIcon: "fa-solid fa-scroll",
    desc: "Home to Nubian villages with colorful houses, handwoven textiles, and beadwork passed down through generations."
  },
  {
    key: "sohag",
    name: "Sohag",
    coords: [26.5592, 31.6957],
    craft: "Palm Leaf Weaving",
    craftIcon: "fa-solid fa-leaf",
    desc: "An Upper Egypt farming hub where palm fronds are hand-woven into baskets, mats, and furniture."
  },
  {
    key: "asyut",
    name: "Assiut",
    coords: [27.1809, 31.1837],
    craft: "Tally Embroidery (Assiuti)",
    craftIcon: "fa-solid fa-shirt",
    desc: "Birthplace of Tally, a centuries-old embroidery style using metal thread on fine mesh fabric."
  },
  {
    key: "sinai",
    name: "South Sinai",
    coords: [28.5091, 33.9634],
    craft: "Bedouin Textiles",
    craftIcon: "fa-solid fa-mountain-sun",
    desc: "Bedouin communities weave intricate textiles and jewelry rooted in centuries of desert life."
  },
  {
    key: "delta",
    name: "Nile Delta",
    coords: [30.9756, 31.1329],
    craft: "Organic Farming",
    craftIcon: "fa-solid fa-wheat-awn",
    desc: "Egypt's agricultural heartland — lush fields, canals, and family-run organic farms open to visitors."
  },
  {
    key: "luxor",
    name: "Luxor Countryside",
    coords: [25.6872, 32.6396],
    craft: "Alabaster Carving",
    craftIcon: "fa-solid fa-gem",
    desc: "Villages around Luxor still practice traditional alabaster carving, a craft tied to the region's ancient history."
  }
];

// ===============================
// HELPERS
// ===============================
function parsePeopleLocal(value) {
  if (!value) return 1;
  const text = value.toString().toLowerCase().trim();
  if (!isNaN(text)) return parseInt(text);
  if (text.includes("one")) return 1;
  if (text.includes("two")) return 2;
  if (text.includes("three")) return 3;
  if (text.includes("four")) return 4;
  if (text.includes("five")) return 5;
  return 1;
}

function priceToNumber(price) {
  return parseFloat(
    (price || "0").toString().replace(/[^\d.]/g, "")
  ) || 0;
}

function findRegionByLocationName(locationName) {
  if (!locationName) return null;
  const key = locationName.trim().toLowerCase();
  return egyptRegions.find(r =>
    r.key === key || r.name.toLowerCase().includes(key) || key.includes(r.key)
  ) || null;
}

// ===============================
// 1. INTERACTIVE MAP
// ===============================
function setupEgyptMap() {
  const mapEl = document.getElementById("egyptMap");
  if (!mapEl || typeof L === "undefined") return;

  const map = L.map("egyptMap").setView([26.8206, 30.8025], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18
  }).addTo(map);

  egyptRegions.forEach(region => {
    L.marker(region.coords)
      .addTo(map)
      .bindPopup(`
        <b>${region.name}</b><br>
        <i class="${region.craftIcon}"></i> ${region.craft}<br>
        <span style="font-size:12px;color:#666">${region.desc}</span>
      `);
  });

  setTimeout(() => map.invalidateSize(), 300);
}

// ===============================
// 2. TRENDING DESTINATIONS (real booking data)
// ===============================
function renderTrending() {
  const container = document.getElementById("trendingContainer");
  if (!container) return;

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  if (bookings.length === 0) return;

  const counts = {};
  bookings.forEach(b => {
    const loc = (b.location || "Unknown").trim();
    counts[loc] = (counts[loc] || 0) + 1;
  });

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  container.innerHTML = "";

  ranked.forEach(([location, count], idx) => {
    const matchProduct = products.find(p =>
      (p.location || "").toLowerCase() === location.toLowerCase()
    );
    const img = matchProduct?.images?.[0] || matchProduct?.image || "";

    container.innerHTML += `
      <div class="trending-card" style="position:relative;">
        <span class="rank-badge">#${idx + 1}</span>
        ${img
          ? `<img src="${img}" class="trending-img" alt="${location}">`
          : `<div class="trending-img" style="display:flex;align-items:center;justify-content:center;background:var(--bg-cream);"><i class="fa-solid fa-map-location-dot" style="font-size:28px;color:var(--primary-green);"></i></div>`
        }
        <div class="trending-body">
          <h3>📍 ${location}</h3>
          <p class="trending-stat">${count} booking${count > 1 ? "s" : ""} made</p>
        </div>
      </div>
    `;
  });
}

// ===============================
// 3. CRAFTS OF EGYPT
// ===============================
function renderCrafts() {
  const container = document.getElementById("craftsContainer");
  if (!container) return;

  const products = JSON.parse(localStorage.getItem("products")) || [];

  container.innerHTML = "";

  egyptRegions.forEach(region => {
    const hasHost = products.some(p =>
      (p.location || "").toLowerCase().includes(region.key)
    );

    container.innerHTML += `
      <div class="craft-card">
        <div class="craft-icon"><i class="${region.craftIcon}"></i></div>
        <span class="craft-region">📍 ${region.name}</span>
        <h3>${region.craft}</h3>
        <p>${region.desc}</p>
        ${hasHost
          ? `<a href="./explor.html" class="craft-link">Book This Experience <i class="fa-solid fa-arrow-right"></i></a>`
          : `<span class="craft-link disabled"><i class="fa-solid fa-clock"></i> Coming Soon</span>`
        }
      </div>
    `;
  });
}

// ===============================
// 4. TRAVELER GALLERY
// ===============================
function renderGallery() {
  const container = document.getElementById("travelerGallery");
  if (!container) return;

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const shared = reviews.filter(r => r.photo && r.shareInGallery);

  if (shared.length === 0) return;

  container.innerHTML = "";

  shared.slice(0, 8).forEach(r => {
    container.innerHTML += `
      <div class="gallery-item">
        <img src="${r.photo}" alt="${r.name}">
        <div class="gallery-caption">
          <strong>${r.name}</strong>
          ${"⭐".repeat(r.rating)}
        </div>
      </div>
    `;
  });
}

// ===============================
// 5. ECONOMIC IMPACT
// ===============================
function renderImpact() {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let revenue = 0;
  let travelers = 0;
  const regionsReached = new Set();
  const hostsSupported = new Set();

  bookings.forEach(b => {
    const region = findRegionByLocationName(b.location);
    if (region) regionsReached.add(region.key);
    else if (b.location) regionsReached.add(b.location.toLowerCase());

    if (b.status === "accepted" && b.paid === true) {
      revenue += priceToNumber(b.price) * parsePeopleLocal(b.people);
    }
    travelers += parsePeopleLocal(b.people);
  });

  products.forEach(p => {
    if (p.location) hostsSupported.add(p.name + p.location);
  });

  const revenueEl = document.getElementById("impactRevenue");
  const hostsEl = document.getElementById("impactHosts");
  const regionsEl = document.getElementById("impactRegions");
  const travelersEl = document.getElementById("impactTravelers");

  if (revenueEl) revenueEl.innerText = "EGP " + revenue.toLocaleString();
  if (hostsEl) hostsEl.innerText = hostsSupported.size;
  if (regionsEl) regionsEl.innerText = regionsReached.size;
  if (travelersEl) travelersEl.innerText = travelers;
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  setupEgyptMap();
  renderTrending();
  renderCrafts();
  renderGallery();
  renderImpact();
});
