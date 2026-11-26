
/* AYSSKY CARGO - LANGUAGE SYSTEM */

"use strict";

const LANGUAGE_KEY = "ayssky-language";

let currentLanguage = "en";

try {
  currentLanguage =
    localStorage.getItem(LANGUAGE_KEY) || "en";
} catch (_) {}

/*
  English text -> Turkish text.
  English is the original language of the game.
*/

const UI_TR = {
  "GEOGRAPHY · DELIVERY · STRATEGY":
    "COĞRAFYA · TESLİMAT · STRATEJİ",

  "Start Adventure": "Oyuna Başla",
  "Close Guide": "Rehberi Kapat",

  "Start Game": "Oyuna Başla",
  "Restart Game": "Yeniden Başlat",
  "Next Level →": "Sonraki Seviye →",

  "TIME": "SÜRE",
  "ORDERS": "SİPARİŞLER",
  "FUEL": "YAKIT",
  "COINS": "JETON",
  "SCORE": "PUAN",
  "HIGH SCORE": "REKOR",

  "remaining": "kalan süre",
  "completed": "tamamlanan",
  "available": "mevcut",
  "balance": "bakiye",
  "points": "puan",
  "best run": "en iyi sonuç",

  "QUICK FLIGHT": "HIZLI UÇUŞ",
  "No destination selected": "Hedef seçilmedi",
  "Choose an airport on the map to preview the flight.":
    "Uçuşu görmek için haritadan havalimanı seç.",
  "Start Flight ✈": "Uçuşu Başlat ✈",

  "Aircraft Control": "Uçak Kontrolü",
  "aircraft · cargo · fuel": "uçak · kargo · yakıt",
  "CURRENT AIRPORT": "MEVCUT HAVALİMANI",
  "AIRCRAFT": "UÇAK",
  "Active Cargo Hubs": "Kargo Merkezleri",
  "Cargo Capacity": "Kargo Kapasitesi",
  "Loaded Packages": "Yüklenen Paketler",
  "Aircraft Upgrades": "Uçak Geliştirmeleri",
  "Fuel Station": "Yakıt İstasyonu",
  "No cargo loaded.": "Henüz kargo yüklenmedi.",
  "Load packages from active cargo hubs.":
    "Aktif kargo merkezlerinden paket yükle.",
  "Upgrade is available only at Ankara.":
    "Uçak geliştirme yalnızca Ankara'da yapılabilir.",
  "Fuel costs more outside Ankara.":
    "Ankara dışında yakıt daha pahalıdır.",

  "Operations Map": "Operasyon Haritası",
  "Select a destination airport":
    "Hedef havalimanını seç",
  "Hub": "Merkez",
  "Airport": "Havalimanı",
  "Aircraft": "Uçak",
  "Press Start Game to begin.":
    "Başlamak için Oyuna Başla'ya bas.",

  "Selected Flight": "Seçilen Uçuş",
  "route preview": "rota önizlemesi",
  "No route selected": "Rota seçilmedi",
  "WAITING": "BEKLENİYOR",
  "READY": "HAZIR",
  "BLOCKED": "UÇUŞ ENGELLİ",
  "Distance": "Mesafe",
  "Time": "Süre",
  "Fuel": "Yakıt",
  "Fee": "Ücret",

  "Orders": "Siparişler",
  "pickup and delivery tasks":
    "kargo alma ve teslimat görevleri",
  "Delivered": "Teslim",
  "On Board": "Uçakta",
  "At Pickup": "Merkezde",
  "Free space now": "Boş kapasite",
  "Pickup hub": "Alış merkezi",
  "Delivery city": "Teslimat şehri",
  "Route time": "Rota süresi",
  "Route fuel": "Rota yakıtı",
  "Reward": "Ödül",
  "Load Packages": "Paketleri Yükle",
  "Order completed · +20 points":
    "Sipariş tamamlandı · +20 puan",

  "WELCOME": "HOŞ GELDİN",
  "A geography and logistics game.":
    "Coğrafya ve lojistik strateji oyunu.",
  "1. Load cargo": "1. Kargo Yükle",
  "2. Plan your route": "2. Rotanı Planla",
  "3. Deliver correctly": "3. Teslimatı Tamamla",
  "4. Earn and upgrade": "4. Kazan ve Geliştir",

  "Travel to active cargo hubs and load packages. Level 1 starts from Ankara.":
    "Aktif kargo merkezlerine git ve paketleri yükle. İlk seviyede Ankara'dan başlarsın.",

  "Choose your destination, manage fuel, coins and time carefully.":
    "Hedefini seç; yakıtını, jetonlarını ve süreni dikkatli kullan.",

  "When you arrive, answer the geography question correctly to complete the delivery.":
    "Hedefe ulaştığında coğrafya sorusunu doğru cevaplayarak teslimatı tamamla.",

  "Gain coins from deliveries, upgrade your aircraft and unlock the next levels.":
    "Teslimatlardan jeton kazan, uçağını geliştir ve yeni seviyeleri aç.",

  "Score comes only from completed orders.":
    "Puan yalnızca tamamlanan siparişlerden kazanılır.",
  "Wrong answer = 5 seconds penalty.":
    "Yanlış cevap = 5 saniye ceza.",
  "Hint = 3 coins.":
    "İpucu = 3 jeton.",
  "Level 2 adds İstanbul as a cargo hub.":
    "2. seviyede İstanbul kargo merkezi açılır.",
  "Level 3 adds Dubai as a cargo hub.":
    "3. seviyede Dubai kargo merkezi açılır.",

  "Rehberi Kapat": "Rehberi Kapat",
  "Oyuna Başla": "Oyuna Başla",

  "DELIVERY CHECK": "TESLİMAT KONTROLÜ",
  "Cargo Verification": "Kargo Doğrulama",
  "Use Hint (3 Coins)": "İpucu Kullan (3 Jeton)",

  "Select a destination airport on the map.":
    "Haritadan bir hedef havalimanı seç.",
  "Start the game first.":
    "Önce oyunu başlat.",
  "Aircraft is already in flight.":
    "Uçak şu anda uçuşta.",
  "Complete the delivery check before flying again.":
    "Yeni uçuş öncesinde teslimat sorusunu tamamla.",
  "You are already at this airport.":
    "Zaten bu havalimanındasın.",
  "Ready for departure.":
    "Uçuşa hazırsın.",
  "Fuel tank is already full.":
    "Yakıt deposu zaten dolu.",
  "Maximum aircraft upgrade reached.":
    "En yüksek uçak seviyesine ulaşıldı.",
  "No available space or no package left to load.":
    "Yeterli alan yok veya yüklenecek paket kalmadı.",
  "Welcome to AYSSKY CARGO.":
    "AYSSKY CARGO'ya hoş geldin."
};

/*
  Some game messages contain variable numbers
  or airport names. Translate their fixed parts.
*/
const UI_PATTERNS = [
  [/\bNot enough fuel\./g, "Yetersiz yakıt."],
  [/\bNot enough coins\./g, "Yetersiz jeton."],
  [/\bNot enough time\./g, "Yetersiz süre."],
  [/\bNeed (\d+)/g, "$1 gerekli"],
  [/\byou have (\d+)/g, "mevcut: $1"],
  [/\bremaining (\d+) sec/g, "kalan $1 saniye"],
  [/\bsec\b/g, "sn"],
  [/\bcoins\b/g, "jeton"],
  [/\bpackage\(s\)/g, "paket"],
  [/\bpackages\b/g, "paket"],
  [/\bper package\b/g, "paket başına"],
  [/\bPickup at\b/g, "Alış merkezi:"],
  [/\bDeliver to\b/g, "Teslimat:"],
  [/\bGo to (.*?) to load\b/g, "Yüklemek için $1'a git"],
  [/\bFlight started:/g, "Uçuş başladı:"],
  [/\bFlying\b/g, "Uçuş:"],
  [/\bArrived at\b/g, "Varış:"],
  [/\bNot enough cargo space!/g, "Yeterli kargo alanı yok!"],
  [/\bFree space now\b/g, "Boş kapasite"],
  [/\bOrder completed\b/g, "Sipariş tamamlandı"],
  [/\bLevel (\d+) started\./g, "$1. seviye başladı."],
  [/\bLevel (\d+) completed!/g, "$1. seviye tamamlandı!"],
  [/\bAll levels completed!/g, "Bütün seviyeler tamamlandı!"],
  [/\bTime is up\./g, "Süre doldu."],
  [/\bRestart Game\b/g, "Yeniden Başlat"],
  [/\bUpgrade \((\d+) Coins\)/g, "Geliştir ($1 Jeton)"],
  [/\bBuy 5 Fuel \((\d+) Coins\)/g, "5 Yakıt Al ($1 Jeton)"],
  [/\bFill Tank \((\d+) Coins\)/g, "Depoyu Doldur ($1 Jeton)"]
];

const originalText = new WeakMap();
const translatedText = new WeakMap();

function translateValue(value) {
  if (currentLanguage !== "tr") return value;

  const match = value.match(/^(\s*)(.*?)(\s*)$/s);
  if (!match) return value;

  const start = match[1];
  const content = match[2];
  const end = match[3];

  let translated = UI_TR[content] || content;

  for (const [pattern, replacement] of UI_PATTERNS) {
    translated = translated.replace(pattern, replacement);
  }

  return start + translated + end;
}

function translateNode(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return;

  const parent = node.parentElement;

  if (
    parent &&
    ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)
  ) return;

  const previousOutput = translatedText.get(node);

  if (
    !originalText.has(node) ||
    (previousOutput !== undefined &&
      node.nodeValue !== previousOutput)
  ) {
    originalText.set(node, node.nodeValue);
  }

  const source = originalText.get(node);
  const result = translateValue(source);

  translatedText.set(node, result);

  if (node.nodeValue !== result) {
    node.nodeValue = result;
  }
}

function translateTree(root) {
  if (!root) return;

  if (root.nodeType === Node.TEXT_NODE) {
    translateNode(root);
    return;
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT
  );

  let node;
  while ((node = walker.nextNode())) {
    translateNode(node);
  }
}

function setGameLanguage(language) {
  currentLanguage = language === "tr" ? "tr" : "en";

  document.documentElement.lang = currentLanguage;

  try {
    localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  } catch (_) {}

  document.getElementById("lang-tr")
    .classList.toggle("active", currentLanguage === "tr");

  document.getElementById("lang-en")
    .classList.toggle("active", currentLanguage === "en");

  document.getElementById("lang-tr")
    .setAttribute("aria-pressed", currentLanguage === "tr");

  document.getElementById("lang-en")
    .setAttribute("aria-pressed", currentLanguage === "en");

  translateTree(document.body);
}

document.getElementById("lang-tr")
  .addEventListener("click", () => setGameLanguage("tr"));

document.getElementById("lang-en")
  .addEventListener("click", () => setGameLanguage("en"));

/*
  The game creates order cards and messages dynamically.
  Translate new text when the DOM changes.
*/
const languageObserver = new MutationObserver(records => {
  for (const record of records) {
    if (record.type === "characterData") {
      translateNode(record.target);
    }

    if (record.type === "childList") {
      record.addedNodes.forEach(translateTree);
    }
  }
});

languageObserver.observe(document.body, {
  subtree: true,
  childList: true,
  characterData: true
});

/* Refresh Leaflet if layout size changes */
if (typeof ResizeObserver !== "undefined") {
  const mapElement = document.getElementById("map");

  const mapResizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => {
      if (typeof map !== "undefined") {
        map.invalidateSize({ pan: false });
      }
    });
  });

  mapResizeObserver.observe(mapElement);
}

setGameLanguage(currentLanguage);

console.log("AYSSKY CARGO language selector ready.");
