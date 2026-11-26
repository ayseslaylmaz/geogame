
"use strict";

/* AYSSKY CARGO - Turkish / English interface */

(() => {
  const STORAGE_KEY = "ayssky-language";

  const dictionary = {
    "GEOGRAPHY · DELIVERY · STRATEGY": "COĞRAFYA · TESLİMAT · STRATEJİ",
    "Start Game": "Oyuna Başla",
    "Restart Game": "Yeniden Başlat",
    "Next Level →": "Sonraki Seviye →",
    "TIME": "SÜRE",
    "ORDERS": "SİPARİŞLER",
    "FUEL": "YAKIT",
    "COINS": "JETON",
    "SCORE": "PUAN",
    "RECORD": "REKOR",
    "HIGH SCORE": "REKOR",
    "YOUR FLIGHT": "UÇUŞUN",
    "Flight Details": "Uçuş Bilgileri",
    "Selected route": "Seçilen rota",
    "Aircraft": "Uçak",
    "Cargo & fuel control": "Kargo ve yakıt kontrolü",
    "Location": "Konum",
    "Plane": "Uçak",
    "Active Cargo Hubs": "Aktif Kargo Merkezleri",
    "Cargo Capacity": "Kargo Kapasitesi",
    "Loaded Cargo": "Yüklenen Kargo",
    "Fuel Station": "Yakıt İstasyonu",
    "Aircraft Upgrade": "Uçak Geliştirme",
    "No cargo loaded.": "Henüz kargo yüklenmedi.",
    "Orders": "Siparişler",
    "Pickup and delivery tasks": "Alım ve teslimat görevleri",
    "Choose a delivery and load the packages": "Sipariş seç ve paketleri yükle",
    "No route selected": "Rota seçilmedi",
    "No destination selected": "Hedef seçilmedi",
    "Choose an airport to preview the flight.": "Uçuşu görmek için havalimanı seç.",
    "Choose an airport on the map to preview the flight.": "Uçuşu görmek için haritadan havalimanı seç.",
    "Select a destination airport.": "Hedef havalimanını seç.",
    "Select a destination to enable flight.": "Uçuş için hedef seç.",
    "Start Flight ✈": "Uçuşu Başlat ✈",
    "WAITING": "BEKLENİYOR",
    "READY": "HAZIR",
    "BLOCKED": "ENGELLENDİ",
    "Distance": "Mesafe",
    "Time": "Süre",
    "Fuel": "Yakıt",
    "Fee": "Ücret",
    "Delivered": "Teslim",
    "On Board": "Uçakta",
    "At Pickup": "Merkezde",
    "Load Packages": "Paketleri Yükle",
    "Free space now": "Boş kapasite",
    "Pickup hub": "Alım merkezi",
    "Delivery city": "Teslimat şehri",
    "Route time": "Uçuş süresi",
    "Route fuel": "Rota yakıtı",
    "Reward": "Ödül",
    "MAX LEVEL": "SON SEVİYE",
    "Maximum aircraft upgrade reached.": "Uçak en yüksek seviyede.",
    "Fuel tank is already full.": "Yakıt deposu zaten dolu.",
    "Start the game first.": "Önce oyunu başlat.",
    "Aircraft is already in flight.": "Uçak zaten uçuşta.",
    "Complete the delivery check before flying again.": "Yeni uçuş öncesinde teslimat sorusunu tamamla.",
    "You are already at this airport.": "Zaten bu havalimanındasın.",
    "Ready for departure.": "Kalkışa hazır.",
    "Select a destination airport on the map.": "Haritadan hedef havalimanı seç.",
    "Press Start Game to begin.": "Başlamak için Oyuna Başla'ya bas.",
    "Welcome to AYSSKY CARGO.": "AYSSKY CARGO'ya hoş geldin.",
    "Cargo Hub": "Kargo Merkezi",
    "Airport": "Havalimanı",
    "Your Plane": "Uçağın",
    "Hub": "Merkez",
    "WELCOME": "HOŞ GELDİN",
    "GAME GUIDE": "OYUN REHBERİ",
    "How to Play ✈": "Nasıl Oynanır ✈",
    "How to play": "Nasıl oynanır",
    "Start Adventure": "Maceraya Başla",
    "Close Guide": "Rehberi Kapat",
    "A geography and logistics game.": "Bir coğrafya ve lojistik oyunu.",
    "1. Load cargo": "1. Kargo yükle",
    "2. Plan your route": "2. Rotanı planla",
    "3. Deliver correctly": "3. Teslimatı tamamla",
    "4. Earn and upgrade": "4. Kazan ve geliştir",
    "Travel to active cargo hubs and load packages. Level 1 starts from Ankara.": "Aktif kargo merkezlerinden paketleri al. İlk seviyede Ankara'dan başlarsın.",
    "Choose your destination, manage fuel, coins and time carefully.": "Hedefini seç; yakıtını, jetonunu ve süreni dikkatli kullan.",
    "When you arrive, answer the geography question correctly to complete the delivery.": "Varınca coğrafya sorusunu doğru cevaplayarak teslimatı tamamla.",
    "Gain coins from deliveries, upgrade your aircraft and unlock the next levels.": "Teslimatlardan jeton kazan, uçağını geliştir ve yeni seviyelerin kilidini aç.",
    "Score comes only from completed orders.": "Siparişler tamamlandığında puan kazanılır.",
    "Wrong answer = 5 seconds penalty.": "Yanlış cevap = 5 saniye ceza.",
    "Hint = 3 coins.": "İpucu = 3 jeton.",
    "Level 2 adds İstanbul as a cargo hub.": "2. seviyede İstanbul kargo merkezi eklenir.",
    "Level 3 adds Dubai as a cargo hub.": "3. seviyede Dubai kargo merkezi eklenir.",
    "Become a cargo pilot and complete deliveries by exploring the world!": "Kargo pilotu ol, dünyayı keşfederek teslimatları tamamla!",
    "Collect your cargo": "Kargonu al",
    "Select an airport": "Havalimanı seç",
    "Fly and deliver": "Uç ve teslim et",
    "Earn coins and upgrade": "Jeton kazan ve geliştir",
    "Go to a cargo hub and press Load Packages. Each order must fit completely in your plane.": "Kargo merkezine git ve Paketleri Yükle'ye bas. Siparişin tamamı uçağa sığmalı.",
    "Click an airport on the map. Check the distance, flight time, fuel and coin cost.": "Haritada havalimanı seç. Mesafeyi, uçuş süresini, yakıtı ve jeton ücretini kontrol et.",
    "Press Start Flight. At the destination, answer the geography question correctly to complete your delivery.": "Uçuşu Başlat'a bas. Hedefte coğrafya sorusunu doğru cevaplayıp teslimatı tamamla.",
    "Deliver packages to earn coins. Buy fuel when needed and upgrade your aircraft at Ankara.": "Teslimatla jeton kazan. Gerektiğinde yakıt al ve uçağını Ankara'da geliştir.",
    "⭐ Important Rules": "⭐ Önemli Kurallar",
    "🌍 Game Levels": "🌍 Oyun Seviyeleri",
    "✓ Completed order: +20 points": "✓ Tamamlanan sipariş: +20 puan",
    "✓ Completed level: +25 bonus points": "✓ Tamamlanan seviye: +25 ek puan",
    "✕ Wrong answer: −5 seconds": "✕ Yanlış cevap: −5 saniye",
    "💡 Hint: 3 coins": "💡 İpucu: 3 jeton",
    "⛽ Flights require enough fuel, coins and time": "⛽ Uçuş için yeterli yakıt, jeton ve süre gerekir",
    "Got it! ✈": "Anladım! ✈",
    "Close guide": "Rehberi kapat",
    "DELIVERY CHECK": "TESLİMAT KONTROLÜ",
    "Cargo Verification": "Kargo Doğrulama",
    "Use Hint (3 Coins)": "İpucu Kullan (3 Jeton)",
    "Hint used: two incorrect answers removed.": "İpucu kullanıldı: iki yanlış seçenek kaldırıldı.",
    "Load cargo from active hubs and complete all deliveries." : "Aktif kargo merkezlerinden paketleri yükle ve tüm teslimatları tamamla."
  };

  // Dynamic values produced by game.js.
  const patterns = [
    [/^Level (\d+) · /, (_, n) => `Seviye ${n} · `],
    [/^Level (\d+) started\./, (_, n) => `${n}. seviye başladı.`],
    [/^Level (\d+) completed!/, (_, n) => `${n}. seviye tamamlandı!`],
    [/^Go to (.+) to load$/, (_, city) => `Yüklemek için ${city} merkezine git`],
    [/^Pickup at /, "Alım: "],
    [/ · Deliver to /, " · Teslimat: "],
    [/^Load Packages$/, "Paketleri Yükle"],
    [/^Upgrade \((\d+) Coins\)$/, "Geliştir ($1 Jeton)"],
    [/^Buy 5 Fuel \((\d+) Coins\)$/, "5 Yakıt Al ($1 Jeton)"],
    [/^Fill Tank \((\d+) Coins\)$/, "Depoyu Doldur ($1 Jeton)"],
    [/^Not enough fuel\./, "Yetersiz yakıt."],
    [/^Not enough coins\./, "Yetersiz jeton."],
    [/^Not enough time\./, "Yetersiz süre."],
    [/^Not enough cargo space!/, "Yeterli kargo alanı yok!"],
    [/^Flight started:/, "Uçuş başladı:"],
    [/^Flying /, "Uçuş: "],
    [/^Arrived at /, "Varış: "],
    [/^Time is up\./, "Süre doldu."],
    [/^All levels completed!/, "Bütün seviyeler tamamlandı!"],
    [/^Delivery approved:/, "Teslimat onaylandı:"],
    [/^Incorrect answer:/, "Yanlış cevap:"],
    [/^Order completed/, "Sipariş tamamlandı"],
    [/\bpackage\(s\)\b/g, "paket"],
    [/\bpackages\b/g, "paket"],
    [/\bpackage\b/g, "paket"],
    [/\bcoins\b/g, "jeton"],
    [/\bpoints\b/g, "puan"],
    [/\bsec\b/g, "sn"]
  ];

  let currentLanguage = "en";

  try {
    currentLanguage =
      localStorage.getItem(STORAGE_KEY) === "tr"
        ? "tr"
        : "en";
  } catch (_) {}

  const originals = new WeakMap();
  const outputs = new WeakMap();

  
function translateText(value) {
  if (currentLanguage === "en") {
    return value;
  }

  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);

  if (!match || !match[2]) {
    return value;
  }

  const start = match[1];
  const end = match[3];

  // Normalize spaces and line breaks.
  const content = match[2]
    .replace(/\s+/g, " ")
    .trim();

  // First try an exact translation.
  let result = dictionary[content];

  // Also support headings with an emoji.
  if (!result) {
    const emojiHeading = content.match(
      /^([📦🧭✈🌍📍]\s*)(.+)$/u
    );

    if (emojiHeading) {
      const translatedHeading =
        dictionary[emojiHeading[2]];

      if (translatedHeading) {
        result =
          emojiHeading[1] + translatedHeading;
      }
    }
  }

  // Keep the original when no translation exists.
  if (!result) {
    result = content;
  }

  // Translate dynamic game messages.
  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }

  return start + result + end;
}


  function translateNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;

    const parent = node.parentElement;

    if (
      parent &&
      ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)
    ) return;

    const last = outputs.get(node);

    if (
      !originals.has(node) ||
      (last !== undefined && last !== node.nodeValue)
    ) {
      originals.set(node, node.nodeValue);
    }

    const source = originals.get(node);
    const output = translateText(source);

    outputs.set(node, output);

    if (node.nodeValue !== output) {
      node.nodeValue = output;
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

  function translateAttributes() {
    const attrs = {
      "help-button": "How to play",
      "help-close": "Close guide"
    };

    for (const [id, text] of Object.entries(attrs)) {
      const node = document.getElementById(id);

      if (node) {
        node.setAttribute(
          "aria-label",
          currentLanguage === "tr"
            ? dictionary[text]
            : text
        );

        if (id === "help-button") {
          node.title =
            currentLanguage === "tr"
              ? dictionary[text]
              : text;
        }
      }
    }
  }

  function setGameLanguage(language) {
    currentLanguage = language === "tr" ? "tr" : "en";
    document.documentElement.lang = currentLanguage;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        currentLanguage
      );
    } catch (_) {}

    for (const code of ["tr", "en"]) {
      const button = document.getElementById(
        `lang-${code}`
      );

      if (!button) continue;

      const selected = code === currentLanguage;

      button.classList.toggle("active", selected);

      button.setAttribute(
        "aria-pressed",
        String(selected)
      );
    }

    translateTree(document.body);
    translateAttributes();
  }

  const tr = document.getElementById("lang-tr");
  const en = document.getElementById("lang-en");

  if (tr) {
    tr.addEventListener(
      "click",
      () => setGameLanguage("tr")
    );
  }

  if (en) {
    en.addEventListener(
      "click",
      () => setGameLanguage("en")
    );
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") {
        translateNode(record.target);
      }

      if (record.type === "childList") {
        record.addedNodes.forEach(translateTree);
      }
    }
  });

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true
  });

  setGameLanguage(currentLanguage);

  window.setGameLanguage = setGameLanguage;

  console.log("AYSSKY CARGO language selector ready.");
})();
