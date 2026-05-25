const templeUPI = "temple@upi";
const templeName = "Shree Dharma Temple";

let currentLang = "en";

// Treat `temple.html` as a detail page. If opened without an id, go to homepage.
const urlParams = new URLSearchParams(window.location.search);
const templeIdFromUrl = urlParams.get("id");
if (!templeIdFromUrl) {
  window.location.replace("index.html");
}

const languageBtn = document.getElementById("languageBtn");

const donationForm = document.getElementById("donationForm");
const donorNameInput = document.getElementById("donorName");
const donationAmount = document.getElementById("donationAmount");
const donationPurpose = document.getElementById("donationPurpose");
const donationMessage = document.getElementById("donationMessage");
const showPublicNameInput = document.getElementById("showPublicName");
const donationQR = document.getElementById("donationQR");
const upiDonationLink = document.getElementById("upiDonationLink");
const recentDonationsList = document.getElementById("recentDonationsList");
const payNowBtn = document.getElementById("payNowBtn");
const donationStatus = document.getElementById("donationStatus");
const downloadDonationCertificateBtn = document.getElementById("downloadDonationCertificateBtn");

const sevaForm = document.getElementById("sevaForm");
const sevaType = document.getElementById("sevaType");
const sevaAmount = document.getElementById("sevaAmount");
const sevaQR = document.getElementById("sevaQR");
const upiSevaLink = document.getElementById("upiSevaLink");
const sevaStatus = document.getElementById("sevaStatus");

const certificateForm = document.getElementById("certificateForm");
const printCertificateBtn = document.getElementById("printCertificateBtn");
const sevaDate = document.getElementById("sevaDate");

const API_BASE =
  window.location.protocol === "file:" || window.location.port === "5500"
    ? "http://127.0.0.1:5000/api"
    : "/api";

let recentDonations = [];
let latestVerifiedDonation = null;

const placeholders = {
  donorName: { en: "Donor Name", hi: "दाता का नाम" },
  donationAmount: { en: "Amount INR", hi: "राशि रुपये" },
  donationMessage: { en: "Message", hi: "संदेश" },
  sevaName: { en: "Full Name", hi: "पूरा नाम" },
  sevaEmail: { en: "Email", hi: "ईमेल" },
  sevaPhone: { en: "Phone", hi: "फोन" },
  sevaAmount: { en: "Amount", hi: "राशि" },
  certName: { en: "Donor Name", hi: "दाता का नाम" },
  certAmount: { en: "Donation Amount", hi: "दान राशि" }
};

function applyLanguagePlaceholders() {
  Object.entries(placeholders).forEach(([id, translation]) => {
    const element = document.getElementById(id);
    if (element) {
      element.placeholder = translation[currentLang];
    }
  });

  Array.from(sevaType.options).forEach((option) => {
    const label = sevaOptionLabels[option.value];
    if (label) option.textContent = label[currentLang];
  });

  Array.from(donationPurpose.options).forEach((option) => {
    const label = donationPurposeLabels[option.value];
    if (label) option.textContent = label[currentLang];
  });

  Array.from(document.getElementById("certPurpose").options).forEach((option) => {
    const label = certificatePurposeLabels[option.value];
    if (label) option.textContent = label[currentLang];
  });
}
const HI_TRANSLATIONS = {
  "Shree Dharma Temple": "श्री धर्म मंदिर",
  "Home": "मुख्य पृष्ठ",
  "About": "परिचय",
  "Gallery": "गैलरी",
  "Traditions": "परंपराएं",
  "Festivals": "त्योहार",
  "Donation": "दान",
  "Seva Booking": "सेवा बुकिंग",
  "Transparency": "पारदर्शिता",
  "Live Darshan": "लाइव दर्शन",
  "Certificate": "प्रमाणपत्र",
  "Welcome to Shree Dharma Temple": "श्री धर्म मंदिर में आपका स्वागत है",
  "A sacred place for devotion, peace, seva, festivals, and spiritual connection for devotees across the world.": "भक्ति, शांति, सेवा, त्योहारों और विश्वभर के भक्तों के आध्यात्मिक जुड़ाव का पवित्र स्थान।",
  "Donate Now": "अभी दान करें",
  "Watch Live Darshan": "लाइव दर्शन देखें",
  "About Us": "हमारे बारे में",
  "A living center of devotion": "भक्ति का जीवंत केंद्र",
  "Preserving worship, service, and sacred culture for every devotee.": "हर भक्त के लिए पूजा, सेवा और पवित्र संस्कृति का संरक्षण।",
  "Shree Dharma Temple is a peaceful spiritual home dedicated to daily worship, seva, festival celebrations, and the preservation of timeless cultural values.": "श्री धर्म मंदिर दैनिक पूजा, सेवा, त्योहारों के उत्सव और सनातन सांस्कृतिक मूल्यों के संरक्षण को समर्पित एक शांत आध्यात्मिक घर है।",
  "The temple brings devotees together through aarti, bhajan, prasad, community service, and learning. Its spiritual environment supports prayer, reflection, and connection across generations.": "यह मंदिर आरती, भजन, प्रसाद, सामुदायिक सेवा और शिक्षा के माध्यम से भक्तों को जोड़ता है। इसका आध्यात्मिक वातावरण प्रार्थना, चिंतन और पीढ़ियों के जुड़ाव को प्रोत्साहित करता है।",
  "Daily Darshan": "दैनिक दर्शन",
  "Morning and evening worship": "सुबह और शाम की पूजा",
  "Community Seva": "सामुदायिक सेवा",
  "Food, learning, and care": "भोजन, शिक्षा और सहयोग",
  "Village leadership": "ग्राम नेतृत्व",
  "Meet Our Gram Pradhan": "हमारे ग्राम प्रधान से मिलें",
  "Honoring the community leadership that supports temple service, local culture, and the welfare of devotees.": "मंदिर सेवा, स्थानीय संस्कृति और भक्तों के कल्याण में सहयोग देने वाले सामुदायिक नेतृत्व का सम्मान।",
  "Gram Pradhan": "ग्राम प्रधान",
  "Rajesh Sharma": "राजेश शर्मा",
  "A dedicated village leader supporting temple upkeep, festival coordination, cleanliness drives, and community welfare initiatives.": "मंदिर रखरखाव, त्योहार समन्वय, स्वच्छता अभियान और सामुदायिक कल्याण कार्यों में सहयोग देने वाले समर्पित ग्राम नेता।",
  "Together, we preserve faith, service, and harmony for every family.": "हम मिलकर हर परिवार के लिए आस्था, सेवा और सद्भाव को संजोते हैं।",
  "Sunita Devi": "सुनीता देवी",
  "Known for inclusive development, cultural programs, women-led seva efforts, and active participation in temple festivals.": "समावेशी विकास, सांस्कृतिक कार्यक्रमों, महिला-नेतृत्व वाली सेवा और मंदिर त्योहारों में सक्रिय भागीदारी के लिए प्रसिद्ध।",
  "A village grows stronger when devotion and service move together.": "जब भक्ति और सेवा साथ चलती हैं, तब गांव और मजबूत होता है।",
  "Mahendra Singh": "महेंद्र सिंह",
  "Committed to preserving village traditions while improving visitor facilities, safety, and local participation around the temple.": "मंदिर के आसपास आगंतुक सुविधाओं, सुरक्षा और स्थानीय भागीदारी को बेहतर बनाते हुए ग्राम परंपराओं को संरक्षित रखने के लिए प्रतिबद्ध।",
  "Our temple is the heart of our shared heritage and responsibility.": "हमारा मंदिर हमारी साझा विरासत और जिम्मेदारी का हृदय है।",
  "Temple History and Location": "मंदिर का इतिहास और स्थान",
  "History": "इतिहास",
  "The temple was established by devotees with the vision of creating a peaceful spiritual center for all generations.": "इस मंदिर की स्थापना भक्तों ने सभी पीढ़ियों के लिए एक शांत आध्यात्मिक केंद्र बनाने के उद्देश्य से की थी।",
  "Location": "स्थान",
  "Temple Address: Main Road, Holy City, India. Open daily from 5:00 AM to 9:00 PM.": "मंदिर पता: मुख्य मार्ग, पवित्र नगर, भारत। प्रतिदिन सुबह 5:00 बजे से रात 9:00 बजे तक खुला।",
  "Temple Photo Gallery": "मंदिर फोटो गैलरी",
  "Glimpses of major temple celebrations and devotee gatherings.": "मुख्य मंदिर उत्सवों और भक्त सभाओं की झलकियां।",
  "Rituals": "अनुष्ठान",
  "Daily aarti, abhishekam, havan, and special pujas.": "दैनिक आरती, अभिषेक, हवन और विशेष पूजाएं।",
  "Temple Architecture": "मंदिर वास्तुकला",
  "Traditional architecture, carvings, sanctum, and temple mandap.": "पारंपरिक वास्तुकला, नक्काशी, गर्भगृह और मंदिर मंडप।",
  "Temple Entrance": "मंदिर प्रवेश द्वार",
  "Beautiful darshan view from the temple entrance.": "मंदिर प्रवेश द्वार से सुंदर दर्शन दृश्य।",
  "Sacred Ambience": "पवित्र वातावरण",
  "Serene views that reflect the devotional atmosphere of the temple.": "मंदिर के भक्तिमय वातावरण को दर्शाने वाले शांत दृश्य।",
  "Sacred Architecture": "पवित्र वास्तुकला",
  "Graceful temple forms, carved details, and traditional design.": "सुंदर मंदिर रूप, नक्काशीदार विवरण और पारंपरिक डिजाइन।",
  "Temple Traditions and Culture": "मंदिर परंपराएं और संस्कृति",
  "Daily Aarti": "दैनिक आरती",
  "Morning and evening aarti create a calm rhythm of devotion, prayer, and collective blessings.": "सुबह और शाम की आरती भक्ति, प्रार्थना और सामूहिक आशीर्वाद की शांत लय बनाती है।",
  "Seva and Prasad": "सेवा और प्रसाद",
  "Devotees participate in annadanam, prasad distribution, temple care, and community service.": "भक्त अन्नदान, प्रसाद वितरण, मंदिर सेवा और सामुदायिक सेवा में भाग लेते हैं।",
  "Festival Culture": "त्योहार संस्कृति",
  "Major festivals bring bhajan, decoration, special puja, and joyful gatherings for all generations.": "मुख्य त्योहार भजन, सजावट, विशेष पूजा और सभी पीढ़ियों के लिए आनंदमय सभाएं लाते हैं।",
  "Cultural Learning": "सांस्कृतिक शिक्षा",
  "Stories, scriptures, music, and values are shared to keep spiritual heritage meaningful and alive.": "आध्यात्मिक विरासत को सार्थक और जीवंत रखने के लिए कथाएं, शास्त्र, संगीत और मूल्य साझा किए जाते हैं।",
  "Upcoming Festival and Countdown": "आगामी त्योहार और उलटी गिनती",
  "Next Major Festival": "अगला प्रमुख त्योहार",
  "Janmashtami Mahotsav 2026": "जन्माष्टमी महोत्सव 2026",
  "Date: 15 August 2026 | Special Abhishek, Bhajan Sandhya, Maha Aarti and Prasad distribution.": "तिथि: 15 अगस्त 2026 | विशेष अभिषेक, भजन संध्या, महा आरती और प्रसाद वितरण।",
  "Days": "दिन",
  "Hours": "घंटे",
  "Minutes": "मिनट",
  "Seconds": "सेकंड",
  "Ram Navami Utsav": "राम नवमी उत्सव",
  "Special Ramayan Path, Pushp Abhishek and evening maha aarti.": "विशेष रामायण पाठ, पुष्प अभिषेक और शाम की महा आरती।",
  "Navratri Mahapuja": "नवरात्रि महापूजा",
  "Nine-day Devi pujan, bhajan sandhya and kumari puja.": "नौ दिन की देवी पूजन, भजन संध्या और कुमारी पूजा।",
  "Mahashivratri Jaagran": "महाशिवरात्रि जागरण",
  "Rudrabhishek, night jaagran, and maha prasad seva.": "रुद्राभिषेक, रात्रि जागरण और महा प्रसाद सेवा।",
  "Donation via UPI QR": "UPI QR द्वारा दान",
  "Scan and Pay": "स्कैन करें और भुगतान करें",
  "Devotees can donate using UPI QR. NRI devotees with supported UPI-enabled NRE/NRO accounts may also use UPI.": "भक्त UPI QR से दान कर सकते हैं। समर्थित UPI-सक्षम NRE/NRO खातों वाले NRI भक्त भी UPI का उपयोग कर सकते हैं।",
  "Log Donation": "दान दर्ज करें",
  "Pay with UPI App": "UPI ऐप से भुगतान करें",
  "Show my name publicly": "मेरा नाम सार्वजनिक दिखाएं",
  "Recent Donations": "हाल के दान",
  "View All": "सभी देखें",
  "Anonymous Donor": "गुमनाम दाता",
  "Be the first to contribute 🙏": "योगदान देने वाले पहले भक्त बनें 🙏",
  "For international card payments, connect Razorpay, Stripe, PayPal, or a bank gateway in production.": "अंतरराष्ट्रीय कार्ड भुगतान के लिए उत्पादन में Razorpay, Stripe, PayPal या बैंक गेटवे जोड़ें।",
  "Donation Purposes": "दान का उपयोग",
  "Annadanam / Food donation": "अन्नदान / भोजन दान",
  "Temple maintenance": "मंदिर रखरखाव",
  "Festival arrangements": "त्योहार व्यवस्था",
  "Education and community seva": "शिक्षा और सामुदायिक सेवा",
  "Book Puja with Date and Payment": "तिथि और भुगतान के साथ पूजा बुक करें",
  "Book Seva and Generate Payment QR": "सेवा बुक करें और भुगतान QR बनाएं",
  "Seva Payment QR": "सेवा भुगतान QR",
  "Pay Seva Amount": "सेवा राशि का भुगतान करें",
  "Transparency: How Donations Are Used": "पारदर्शिता: दान का उपयोग कैसे होता है",
  "We believe in building trust with devotees. Donation usage is shared regularly for transparency.": "हम भक्तों के साथ विश्वास बनाने में विश्वास रखते हैं। पारदर्शिता के लिए दान उपयोग नियमित रूप से साझा किया जाता है।",
  "Annadanam and Prasad": "अन्नदान और प्रसाद",
  "Temple Maintenance": "मंदिर रखरखाव",
  "Festivals and Rituals": "त्योहार और अनुष्ठान",
  "Education and Community Seva": "शिक्षा और सामुदायिक सेवा",
  "Live Darshan Stream": "लाइव दर्शन स्ट्रीम",
  "Devotees from anywhere can watch live darshan, aarti, and special festival streams.": "भक्त कहीं से भी लाइव दर्शन, आरती और विशेष त्योहार स्ट्रीम देख सकते हैं।",
  "Replace the YouTube channel/video link with your temple's official livestream link.": "YouTube चैनल/वीडियो लिंक को अपने मंदिर के आधिकारिक लाइवस्ट्रीम लिंक से बदलें।",
  "Digital Prashad Certificate for Donor": "दाता के लिए डिजिटल प्रसाद प्रमाणपत्र",
  "Generate Donor Certificate": "दाता प्रमाणपत्र बनाएं",
  "Generate Certificate": "प्रमाणपत्र बनाएं",
  "Digital Prashad Certificate": "डिजिटल प्रसाद प्रमाणपत्र",
  "This certificate is presented with blessings to": "यह प्रमाणपत्र आशीर्वाद सहित प्रदान किया जाता है",
  "For a sacred donation of": "पवित्र दान राशि",
  "Purpose:": "उद्देश्य:",
  "Certificate ID:": "प्रमाणपत्र आईडी:",
  "Date:": "दिनांक:",
  "May the divine blessings bring peace, prosperity and happiness.": "ईश्वर का आशीर्वाद शांति, समृद्धि और सुख प्रदान करे।",
  "Download / Print Certificate": "प्रमाणपत्र डाउनलोड / प्रिंट करें",
  "© 2026 Shree Dharma Temple. All Rights Reserved.": "© 2026 श्री धर्म मंदिर। सर्वाधिकार सुरक्षित।",
  "Â© 2026 Shree Dharma Temple. All Rights Reserved.": "© 2026 श्री धर्म मंदिर। सर्वाधिकार सुरक्षित।",
  "Contact: temple@example.com | +91 98765 43210": "संपर्क: temple@example.com | +91 98765 43210"
};

const sevaOptionLabels = {
  "": { en: "Select Seva", hi: "सेवा चुनें" },
  Archana: { en: "Archana - ₹251", hi: "अर्चना - ₹251" },
  Abhishekam: { en: "Abhishekam - ₹1100", hi: "अभिषेक - ₹1100" },
  "Satyanarayan Puja": { en: "Satyanarayan Puja - ₹2100", hi: "सत्यनारायण पूजा - ₹2100" },
  Havan: { en: "Havan - ₹5100", hi: "हवन - ₹5100" }
};

const certificatePurposeLabels = {
  "": { en: "Select Purpose", hi: "उद्देश्य चुनें" },
  Annadanam: { en: "Annadanam", hi: "अन्नदान" },
  "Temple Maintenance": { en: "Temple Maintenance", hi: "मंदिर रखरखाव" },
  "Festival Seva": { en: "Festival Seva", hi: "त्योहार सेवा" },
  "General Donation": { en: "General Donation", hi: "सामान्य दान" }
};

const donationPurposeLabels = {
  Annadanam: { en: "Annadanam", hi: "अन्नदान" },
  "Temple Maintenance": { en: "Temple Maintenance", hi: "मंदिर रखरखाव" },
  "Festival Seva": { en: "Festival Seva", hi: "त्योहार सेवा" },
  "General Donation": { en: "General Donation", hi: "सामान्य दान" },
  "Education and Community Seva": {
    en: "Education and Community Seva",
    hi: "शिक्षा और सामुदायिक सेवा"
  }
};

const extraTextLabels = {
  ".logo-subtitle": { en: "Dharma & Devotion", hi: "धर्म और भक्ति" },
  ".tradition-card:nth-child(1) .tradition-icon": { en: "Om", hi: "ॐ" },
  ".tradition-card:nth-child(2) .tradition-icon": { en: "Seva", hi: "सेवा" },
  ".tradition-card:nth-child(3) .tradition-icon": { en: "Fest", hi: "उत्सव" },
  ".tradition-card:nth-child(4) .tradition-icon": { en: "Dharma", hi: "धर्म" },
  "#certDisplayName": { en: "Donor Name", hi: "दाता का नाम" },
  "#certDisplayPurpose": { en: "General Donation", hi: "सामान्य दान" }
};

function normalizeEnglish(text) {
  return String(text || "")
    .replaceAll("Â©", "©")
    .replaceAll("â‚¹", "₹")
    .replace(/\s+/g, " ")
    .trim();
}

function translate(text) {
  const normalized = normalizeEnglish(text);
  if (currentLang === "en") return normalized;
  return HI_TRANSLATIONS[normalized] || HI_TRANSLATIONS[text] || normalized;
}

function applyLanguage() {
  document.querySelectorAll("[data-en]").forEach((element) => {
    const english = element.getAttribute("data-en") || "";
    element.textContent = translate(english);
  });

  Object.entries(extraTextLabels).forEach(([selector, labels]) => {
    const element = document.querySelector(selector);
    if (element && !element.dataset.userValue) {
      element.textContent = labels[currentLang];
    }
  });

  const certPurpose = document.getElementById("certDisplayPurpose");
  if (certPurpose?.dataset.purposeValue) {
    const purposeValue = certPurpose.dataset.purposeValue;
    certPurpose.textContent = certificatePurposeLabels[purposeValue]?.[currentLang] || purposeValue;
  }

  if (languageBtn) {
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

  const upiId = document.querySelector(".upi-id");
  if (upiId) {
    upiId.innerHTML =
      currentLang === "hi"
        ? 'UPI आईडी: <strong>temple@upi</strong>'
        : 'UPI ID: <strong>temple@upi</strong>';
  }

  const certTempleName = document.querySelector("#certificateBox h3");
  if (certTempleName) {
    certTempleName.textContent = currentLang === "hi" ? "श्री धर्म मंदिर" : "Shree Dharma Temple";
  }

  document.documentElement.lang = currentLang === "hi" ? "hi" : "en";
  document.title = currentLang === "hi" ? "श्री धर्म मंदिर" : "Shree Dharma Temple";
  localStorage.setItem("preferredTempleLanguage", currentLang);
  applyLanguagePlaceholders();
  renderRecentDonations();
}

function makeUPILink(amount, note) {
  return `upi://pay?pa=${templeUPI}&pn=${encodeURIComponent(templeName)}&am=${amount || ""}&cu=INR&tn=${encodeURIComponent(note || "Temple Donation")}`;
}

function makeQR(upiLink) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`;
}

function getStoredDonations() {
  const donations = JSON.parse(localStorage.getItem("donations") || "[]");
  return Array.isArray(donations) ? donations : [];
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();
      message = error.message || error.error || message;
    } catch (_error) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response;
}

function setDonationStatus(message, tone = "info") {
  if (!donationStatus) return;

  donationStatus.textContent = message;
  donationStatus.dataset.tone = tone;
}

function setDonationLoading(isLoading, label) {
  if (!payNowBtn) return;

  payNowBtn.disabled = isLoading;
  payNowBtn.textContent =
    label || (currentLang === "hi" ? "अभी भुगतान करें" : "Pay Now");
}

function formatDonationDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return String(value || "");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getDonationDisplayName(donation) {
  if (donation?.showPublicName || donation?.isPublic) return donation.name || "Anonymous Donor";
  return "Anonymous Donor";
}

function getDonationPurposeLabel(purpose) {
  const value = purpose || "General Donation";
  return donationPurposeLabels[value]?.[currentLang] || value;
}

function renderDonationItem(donation) {
  const name = escapeHTML(translate(getDonationDisplayName(donation)));
  const purpose = escapeHTML(getDonationPurposeLabel(donation?.purpose));
  const message = donation?.message
    ? `<p class="donation-message">${escapeHTML(donation.message)}</p>`
    : "";
  const parsedAmount = parseRupees(donation?.amount);
  const amount = Number.isFinite(parsedAmount) ? Math.max(0, parsedAmount) : 0;
  const date = escapeHTML(formatDonationDate(donation?.date || donation?.createdAt));

  return `
    <article class="donation-item">
      <div>
        <h4>${name}</h4>
        <p class="donation-meta">${purpose}</p>
        ${message}
        <p class="donation-date">${date}</p>
      </div>
      <div class="donation-amount">₹${Math.floor(amount).toLocaleString("en-IN")}</div>
    </article>
  `;
}

function renderRecentDonations(donations = recentDonations) {
  if (!recentDonationsList) return;

  const fallbackDonations = getStoredDonations().slice().reverse().slice(0, 8);
  const visibleDonations = donations.length ? donations : fallbackDonations;

  if (visibleDonations.length === 0) {
    recentDonationsList.innerHTML = `<div class="donations-empty">${translate("Be the first to contribute 🙏")}</div>`;
    return;
  }

  recentDonationsList.innerHTML = visibleDonations.map(renderDonationItem).join("");
}

async function fetchLatestDonations() {
  if (!recentDonationsList) return;

  try {
    recentDonationsList.innerHTML = `<div class="donations-empty">${translate("Loading recent donations...")}</div>`;
    const response = await apiRequest("/donations");
    const data = await response.json();
    recentDonations = Array.isArray(data.donations) ? data.donations : [];
    renderRecentDonations(recentDonations);
  } catch (error) {
    renderRecentDonations();
    setDonationStatus(
      currentLang === "hi"
        ? "हाल के दान अभी लोड नहीं हो सके।"
        : "Recent donations could not be refreshed right now.",
      "error"
    );
  }
}

function normalizeName(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function parseRupees(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function getDonorTotalDonations(donations, donorName) {
  const target = normalizeName(donorName);
  if (!target) return 0;

  return donations.reduce((sum, donation) => {
    if (normalizeName(donation?.name) !== target) return sum;
    const amount = parseRupees(donation?.amount);
    return Number.isFinite(amount) && amount > 0 ? sum + amount : sum;
  }, 0);
}

function updateDonationQR() {
  const amount = donationAmount.value || "";
  const purpose = donationPurpose?.value || "Temple Donation";
  const upiLink = makeUPILink(amount, purpose);

  donationQR.src = makeQR(upiLink);
  upiDonationLink.href = upiLink;
}

async function handleDonationPayment(event) {
  event.preventDefault();

  const amount = parseRupees(donationAmount.value);
  const donationDetails = {
    name: donorNameInput.value.trim(),
    amount,
    purpose: donationPurpose.value,
    message: donationMessage.value.trim(),
    isPublic: showPublicNameInput.checked
  };

  if (!donationDetails.name || !Number.isFinite(amount) || amount <= 0 || !donationDetails.purpose) {
    setDonationStatus(
      currentLang === "hi"
        ? "कृपया नाम, मान्य राशि और उद्देश्य भरें।"
        : "Please enter donor name, a valid amount, and purpose.",
      "error"
    );
    return;
  }

  if (!window.Razorpay) {
    setDonationStatus(
      currentLang === "hi"
        ? "Razorpay checkout लोड नहीं हो पाया। कृपया पेज रीफ्रेश करें।"
        : "Razorpay checkout could not load. Please refresh the page.",
      "error"
    );
    return;
  }

  try {
    setDonationLoading(true, currentLang === "hi" ? "ऑर्डर बन रहा है..." : "Creating order...");
    setDonationStatus(
      currentLang === "hi" ? "सुरक्षित भुगतान शुरू किया जा रहा है..." : "Starting secure payment...",
      "info"
    );

    const orderResponse = await apiRequest("/create-order", {
      method: "POST",
      body: JSON.stringify({ amount })
    });
    const order = await orderResponse.json();

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: templeName,
      description: donationDetails.purpose,
      order_id: order.orderId,
      prefill: {
        name: donationDetails.name
      },
      notes: {
        purpose: donationDetails.purpose
      },
      theme: {
        color: "#d35400"
      },
      modal: {
        ondismiss: () => {
          setDonationLoading(false);
          setDonationStatus(
            currentLang === "hi"
              ? "भुगतान विंडो बंद कर दी गई।"
              : "Payment window was closed.",
            "error"
          );
        }
      },
      handler: async (payment) => {
        try {
          setDonationLoading(
            true,
            currentLang === "hi" ? "भुगतान सत्यापित हो रहा है..." : "Verifying payment..."
          );
          setDonationStatus(
            currentLang === "hi"
              ? "भुगतान सफल हुआ। दान विवरण सुरक्षित किए जा रहे हैं..."
              : "Payment successful. Saving donation details...",
            "success"
          );

          const verifyResponse = await apiRequest("/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              order_id: payment.razorpay_order_id,
              payment_id: payment.razorpay_payment_id,
              signature: payment.razorpay_signature,
              ...donationDetails
            })
          });
          const verifyResult = await verifyResponse.json();

          latestVerifiedDonation = {
            ...donationDetails,
            ...(verifyResult.donation || {}),
            date: verifyResult.donation?.date || new Date().toISOString()
          };

          const storedDonations = getStoredDonations();
          storedDonations.push({
            ...latestVerifiedDonation,
            showPublicName: latestVerifiedDonation.isPublic
          });
          localStorage.setItem("donations", JSON.stringify(storedDonations));

          await fetchLatestDonations();
          donationForm.reset();
          updateDonationQR();

          if (downloadDonationCertificateBtn) {
            downloadDonationCertificateBtn.hidden = false;
          }

          setDonationStatus(
            currentLang === "hi"
              ? "दान सफल रहा। प्रमाणपत्र डाउनलोड कर सकते हैं।"
              : "Donation successful. Your certificate is ready to download.",
            "success"
          );
        } catch (error) {
          setDonationStatus(error.message, "error");
        } finally {
          setDonationLoading(false);
        }
      }
    });

    setDonationLoading(true, currentLang === "hi" ? "भुगतान पूरा करें..." : "Complete payment...");
    razorpay.open();
  } catch (error) {
    setDonationLoading(false);
    setDonationStatus(error.message, "error");
  }
}

async function downloadLatestDonationCertificate() {
  if (!latestVerifiedDonation) {
    setDonationStatus(
      currentLang === "hi"
        ? "प्रमाणपत्र डाउनलोड करने से पहले भुगतान पूरा करें।"
        : "Please complete a donation before downloading the certificate.",
      "error"
    );
    return;
  }

  try {
    downloadDonationCertificateBtn.disabled = true;
    setDonationStatus(
      currentLang === "hi" ? "प्रमाणपत्र बनाया जा रहा है..." : "Preparing certificate...",
      "info"
    );

    const response = await apiRequest("/certificates/donation", {
      method: "POST",
      body: JSON.stringify({
        donorName: latestVerifiedDonation.name,
        amount: latestVerifiedDonation.amount,
        purpose: latestVerifiedDonation.purpose,
        date: latestVerifiedDonation.date,
        templeName
      })
    });
    const certificate = await response.blob();
    const downloadUrl = URL.createObjectURL(certificate);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `donation-certificate-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);

    setDonationStatus(
      currentLang === "hi" ? "प्रमाणपत्र डाउनलोड हो गया।" : "Certificate downloaded.",
      "success"
    );
  } catch (error) {
    setDonationStatus(error.message, "error");
  } finally {
    downloadDonationCertificateBtn.disabled = false;
  }
}

function updateSevaAmount() {
  const selectedOption = sevaType.options[sevaType.selectedIndex];
  const price = selectedOption ? selectedOption.dataset.price || "" : "";

  sevaAmount.value = price;
}

function bookSeva(event) {
  event.preventDefault();

  const booking = {
    name: document.getElementById("sevaName").value,
    email: document.getElementById("sevaEmail").value,
    phone: document.getElementById("sevaPhone").value,
    sevaType: sevaType.value,
    date: document.getElementById("sevaDate").value,
    amount: sevaAmount.value,
    createdAt: new Date().toLocaleString()
  };

  const bookings = JSON.parse(localStorage.getItem("sevaBookings") || "[]");
  bookings.push(booking);

  localStorage.setItem("sevaBookings", JSON.stringify(bookings));

  const upiLink = makeUPILink(sevaAmount.value, `${sevaType.value} Seva Booking`);

  sevaQR.src = makeQR(upiLink);
  upiSevaLink.href = upiLink;

  sevaStatus.innerText =
    currentLang === "hi"
      ? "सेवा बुकिंग दर्ज हो गई। कृपया QR स्कैन कर भुगतान करें।"
      : "Seva booking logged. Please scan QR to complete payment.";
}

function generateCertificate(event) {
  event.preventDefault();

  const name = document.getElementById("certName").value;
  const amount = parseRupees(document.getElementById("certAmount").value);
  const purpose = document.getElementById("certPurpose").value;

  const donations = JSON.parse(localStorage.getItem("donations") || "[]");
  if (!Array.isArray(donations) || donations.length === 0) {
    alert(
      currentLang === "hi"
        ? "प्रमाणपत्र बनाने से पहले कृपया दान अनुभाग में दान दर्ज करें।"
        : "Please log a donation in the Donation section before generating a certificate."
    );
    document.getElementById("certificateBox").style.display = "none";
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    alert(
      currentLang === "hi"
        ? "कृपया मान्य दान राशि दर्ज करें।"
        : "Please enter a valid donation amount."
    );
    document.getElementById("certificateBox").style.display = "none";
    return;
  }

  const totalByDonor = getDonorTotalDonations(donations, name);
  if (totalByDonor < amount) {
    alert(
      currentLang === "hi"
        ? `इस नाम से कुल दान ₹${Math.floor(totalByDonor)} है। प्रमाणपत्र के लिए दान राशि मेल नहीं खा रही।`
        : `Total donations found for this name are ₹${Math.floor(totalByDonor)}. Certificate can only be generated for donated amount.`
    );
    document.getElementById("certificateBox").style.display = "none";
    return;
  }

  const certificateId = "SDT-" + Date.now();

  const certDisplayName = document.getElementById("certDisplayName");
  const certDisplayPurpose = document.getElementById("certDisplayPurpose");

  certDisplayName.innerText = name;
  certDisplayName.dataset.userValue = "true";
  document.getElementById("certDisplayAmount").innerText = amount;
  certDisplayPurpose.dataset.purposeValue = purpose;
  certDisplayPurpose.innerText = certificatePurposeLabels[purpose]?.[currentLang] || purpose;
  document.getElementById("certId").innerText = certificateId;
  document.getElementById("certDate").innerText =
    new Date().toLocaleDateString(currentLang === "hi" ? "hi-IN" : "en-IN");

  document.getElementById("certificateBox").style.display = "block";

  const certificates = JSON.parse(localStorage.getItem("certificates") || "[]");

  certificates.push({
    certificateId,
    name,
    amount,
    purpose,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("certificates", JSON.stringify(certificates));
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  applyLanguage();
}

function startCountdown() {
  const festivalDate = new Date("August 15, 2026 06:00:00").getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const difference = festivalDate - now;

    if (difference <= 0) {
      document.getElementById("days").innerText = 0;
      document.getElementById("hours").innerText = 0;
      document.getElementById("minutes").innerText = 0;
      document.getElementById("seconds").innerText = 0;
      return;
    }

    document.getElementById("days").innerText =
      Math.floor(difference / (1000 * 60 * 60 * 24));

    document.getElementById("hours").innerText =
      Math.floor((difference / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").innerText =
      Math.floor((difference / (1000 * 60)) % 60);

    document.getElementById("seconds").innerText =
      Math.floor((difference / 1000) % 60);
  }, 1000);
}

function initializeLanguage() {
  const savedLanguage = localStorage.getItem("preferredTempleLanguage");
  if (savedLanguage === "hi" || savedLanguage === "en") {
    currentLang = savedLanguage;
  }

  applyLanguage();
}

function syncLanguageFromStorage(event) {
  if (event.key !== "preferredTempleLanguage") return;
  if (event.newValue !== "hi" && event.newValue !== "en") return;
  if (event.newValue === currentLang) return;
  currentLang = event.newValue;
  applyLanguage();
}

function initializeMinDates() {
  const today = new Date().toISOString().split("T")[0];
  sevaDate.min = today;
}

function initializePhotoCarousel() {
  const carousel = document.getElementById("photoCarousel");
  const previousButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");

  if (!carousel || !previousButton || !nextButton) return;

  const scrollCarousel = (direction) => {
    const firstCard = carousel.querySelector(".gallery-card");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : carousel.clientWidth;
    const gap = 22;

    carousel.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth"
    });
  };

  previousButton.addEventListener("click", () => scrollCarousel(-1));
  nextButton.addEventListener("click", () => scrollCarousel(1));
}

function initializeGramPradhanSlider() {
  const slider = document.querySelector('[data-slider="gram-pradhan"]');
  if (!slider) return;

  const track = slider.querySelector(".pradhan-track");
  const slides = Array.from(slider.querySelectorAll(".pradhan-card"));
  const previousButton = slider.querySelector(".pradhan-prev");
  const nextButton = slider.querySelector(".pradhan-next");
  const dots = Array.from(document.querySelectorAll(".pradhan-dot"));

  if (!track || slides.length === 0 || !previousButton || !nextButton) return;

  let activeIndex = 0;
  let autoplayId;

  const setActiveSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  };

  const startAutoplay = () => {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 5500);
  };

  previousButton.addEventListener("click", () => {
    setActiveSlide(activeIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    setActiveSlide(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      setActiveSlide(dotIndex);
      startAutoplay();
    });
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(autoplayId));
  slider.addEventListener("mouseleave", startAutoplay);

  setActiveSlide(0);
  startAutoplay();
}

function initializeActiveNavigation() {
  const navLinks = Array.from(document.querySelectorAll(".primary-nav a[href^='#']"));
  const sections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActiveLink = (activeLink) => {
    navLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveFromScroll = () => {
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const marker = headerHeight + 90;
    let active = sections[0];

    sections.forEach((item) => {
      const rect = item.target.getBoundingClientRect();
      if (rect.top <= marker && rect.bottom > marker) {
        active = item;
      }
    });

    setActiveLink(active.link);
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveLink(link));
  });

  window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
  window.addEventListener("hashchange", updateActiveFromScroll);
  updateActiveFromScroll();
}

languageBtn.addEventListener("click", toggleLanguage);
window.addEventListener("storage", syncLanguageFromStorage);

donationAmount.addEventListener("input", updateDonationQR);
donationPurpose.addEventListener("change", updateDonationQR);
donationForm.addEventListener("submit", handleDonationPayment);
downloadDonationCertificateBtn.addEventListener("click", downloadLatestDonationCertificate);

sevaType.addEventListener("change", updateSevaAmount);
sevaForm.addEventListener("submit", bookSeva);

certificateForm.addEventListener("submit", generateCertificate);

printCertificateBtn.addEventListener("click", () => {
  window.print();
});

initializeLanguage();
initializeMinDates();
initializePhotoCarousel();
initializeGramPradhanSlider();
initializeActiveNavigation();
updateDonationQR();
fetchLatestDonations();
updateSevaAmount();

const defaultSevaUPI = makeUPILink("", "Seva Booking");
sevaQR.src = makeQR(defaultSevaUPI);
upiSevaLink.href = defaultSevaUPI;

startCountdown();
