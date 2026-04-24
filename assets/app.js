const categories = {
  "Shopping Gift Cards": [
    "Amazon Gift Card", "Walmart Gift Card", "Target Gift Card", "eBay Gift Card", "Best Buy Gift Card", "Nike Gift Card", "Adidas Gift Card", "Shein Gift Card", "AliExpress Gift Card"
  ],
  "Gaming Gift Cards": [
    "Steam Gift Card", "PlayStation Gift Card", "Xbox Gift Card", "Nintendo eShop Gift Card", "Roblox Gift Card", "Fortnite V-Bucks Gift Card", "Razer Gold Gift Card", "Google Play Gift Card", "Apple App Store & iTunes Gift Card"
  ],
  "Entertainment & Streaming Gift Cards": [
    "Netflix Gift Card", "Spotify Gift Card", "Disney+ Gift Card", "Hulu Gift Card", "YouTube Premium Gift Card", "Twitch Gift Card", "Paramount+ Gift Card"
  ],
  "Food & Restaurant Gift Cards": [
    "Starbucks Gift Card", "McDonald’s Gift Card", "Uber Eats Gift Card", "DoorDash Gift Card", "Domino’s Gift Card", "Burger King Gift Card", "Subway Gift Card", "KFC Gift Card"
  ],
  "Travel & Transport Gift Cards": [
    "Airbnb Gift Card", "Uber Gift Card", "Lyft Gift Card", "Hotels.com Gift Card", "Expedia Gift Card", "Booking.com Gift Card", "Flight Gift Card", "Travel Experience Gift Card"
  ],
  "Mobile Recharge Gift Cards": [
    "AT&T Prepaid Card", "T-Mobile Prepaid Card", "Verizon Prepaid Card", "Vodafone Recharge Card", "Orange Recharge Card", "Etisalat Recharge Card", "Du Recharge Card"
  ],
  "Crypto-Friendly Universal Gift Cards": [
    "Universal Shopping Gift Card", "Universal Gaming Gift Card", "Universal Food Gift Card", "Universal Travel Gift Card", "Custom Digital Gift Card", "Corporate Reward Gift Card", "Birthday Gift Card", "Holiday Gift Card"
  ]
};

const products = Object.entries(categories).flatMap(([category, names]) => names.map(name => ({ name, category })));

const wallets = {
  ETH_ERC20: {
    label: "ETH (ERC20)",
    address: "0x3d349c6139de28c972698a18684609ec02a2735d",
    rate: "1 ETH = 4,500 USDT",
    unit: "ETH"
  },
  BTC: {
    label: "BTC",
    address: "1AdrCZ3wSA5x9NSX5LEty7VihmBrnzLY1t",
    rate: "1 BTC = 12,000 USDT",
    unit: "BTC"
  },
  USDT_BEP20: {
    label: "USDT (BEP20)",
    address: "0x3d349c6139de28c972698a18684609ec02a2735d",
    rate: "1 USDT = 1.1 USD",
    unit: "USDT"
  },
  USDT_TRC20: {
    label: "USDT (TRC20)",
    address: "TLLnDAaYyVTUjAk4uqKztdJ7Pg6oyc7VbR",
    rate: "1 USDT = 1.1 USD",
    unit: "USDT"
  }
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const selectedProduct = document.querySelector("#selectedProduct");
const confirmProduct = document.querySelector("#confirmProduct");
const usdAmount = document.querySelector("#usdAmount");
const paymentMethod = document.querySelector("#paymentMethod");
const amountToSend = document.querySelector("#amountToSend");
const rateNote = document.querySelector("#rateNote");
const walletGrid = document.querySelector("#walletGrid");
const confirmMethod = document.querySelector("#confirmMethod");
const confirmAmount = document.querySelector("#confirmAmount");
const copyWalletBtn = document.querySelector("#copyWalletBtn");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");

function formatCrypto(value, unit) {
  const decimals = unit === "USDT" ? 2 : 8;
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: unit === "USDT" ? 2 : 0 })} ${unit}`;
}

function calculateAmount() {
  const usd = Math.max(Number(usdAmount.value || 0), 0);
  const method = paymentMethod.value;
  const usdtAmount = usd / 1.1;
  let cryptoAmount = usdtAmount;

  if (method === "BTC") cryptoAmount = usdtAmount / 12000;
  if (method === "ETH_ERC20") cryptoAmount = usdtAmount / 4500;

  const wallet = wallets[method];
  const formatted = formatCrypto(cryptoAmount, wallet.unit);
  amountToSend.textContent = formatted;
  rateNote.textContent = wallet.rate;
  confirmAmount.value = formatted;
  confirmMethod.value = method === "ETH_ERC20" ? "ETH - ERC20" : method === "USDT_BEP20" ? "USDT - BEP20" : method === "USDT_TRC20" ? "USDT - TRC20" : "BTC";
}

function renderCategoryOptions() {
  Object.keys(categories).forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function renderProductOptions() {
  [selectedProduct, confirmProduct].forEach(select => {
    select.innerHTML = "";
    products.forEach(product => {
      const option = document.createElement("option");
      option.value = product.name;
      option.textContent = product.name;
      select.appendChild(option);
    });
  });
}

function updateSeo(product) {
  const title = product ? `${product.name} | Buy Digital Gift Cards at GiftCard Hub` : "GiftCard Hub | Digital Gift Cards";
  const description = product
    ? `Shop ${product.name} on GiftCard Hub. Calculate crypto payment amounts, send to the correct wallet, and confirm your payment for digital delivery.`
    : "GiftCard Hub helps customers browse digital gift cards and calculate crypto payment amounts instantly.";

  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute("content", description);
  document.querySelector('meta[property="og:title"]').setAttribute("content", title);
  document.querySelector('meta[property="og:description"]').setAttribute("content", description);
  document.querySelector('meta[name="twitter:title"]').setAttribute("content", title);
  document.querySelector('meta[name="twitter:description"]').setAttribute("content", description);
  document.querySelector("#seoPreviewTitle").textContent = title;
  document.querySelector("#seoPreviewDescription").textContent = description;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": product ? `${product.name} product listing` : "GiftCard Hub product catalog",
    "itemListElement": products.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": {
        "@type": "Product",
        "name": item.name,
        "category": item.category,
        "brand": { "@type": "Brand", "name": item.name.replace(/ Gift Card| Prepaid Card| Recharge Card/g, "") },
        "offers": { "@type": "Offer", "availability": "https://schema.org/InStock", "priceCurrency": "USD" }
      }
    }))
  };
  document.querySelector("#structuredData").textContent = JSON.stringify(itemList, null, 2);
}

function selectProduct(name) {
  selectedProduct.value = name;
  confirmProduct.value = name;
  const product = products.find(item => item.name === name);
  updateSeo(product);
  document.querySelector("#calculator").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  productGrid.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <small>${product.category}</small>
      <strong>${product.name}</strong>
      <button class="btn btn-secondary" type="button">Select Gift Card</button>
    `;
    card.querySelector("button").addEventListener("click", () => selectProduct(product.name));
    productGrid.appendChild(card);
  });

  if (!filtered.length) {
    productGrid.innerHTML = `<p>No gift cards matched your search.</p>`;
  }
}

function renderWallets() {
  walletGrid.innerHTML = "";
  Object.entries(wallets).forEach(([key, wallet]) => {
    const card = document.createElement("article");
    card.className = "wallet-card";
    card.innerHTML = `
      <h3>${wallet.label}</h3>
      <p class="wallet-meta">${wallet.rate}</p>
      <code>${wallet.address}</code>
      <button class="btn btn-secondary copy-wallet" type="button" data-wallet="${key}">Copy Address</button>
    `;
    card.querySelector("button").addEventListener("click", () => copyText(wallet.address, "Wallet address copied."));
    walletGrid.appendChild(card);
  });
}

async function copyText(text, successText) {
  try {
    await navigator.clipboard.writeText(text);
    showMessage(successText, false);
  } catch (error) {
    showMessage(`Copy failed. Please copy manually: ${text}`, true);
  }
}

function showMessage(message, isError = false) {
  const formMessage = document.querySelector("#formMessage");
  formMessage.textContent = message;
  formMessage.style.display = "block";
  formMessage.style.borderColor = isError ? "rgba(255,107,107,.45)" : "rgba(74,222,128,.28)";
  formMessage.style.background = isError ? "rgba(255,107,107,.12)" : "rgba(74,222,128,.1)";
  formMessage.style.color = isError ? "#ffd1d1" : "#baf7ca";
}

function buildMailto(formData) {
  const subject = encodeURIComponent(`GiftCard Hub Payment Confirmation - ${formData.get("product")}`);
  const body = encodeURIComponent([
    "Payment confirmation details:",
    `Product: ${formData.get("product")}`,
    `WhatsApp Number: ${formData.get("whatsapp")}`,
    `TXID: ${formData.get("txid")}`,
    `Location: ${formData.get("location")}`,
    `Email: ${formData.get("email")}`,
    `Payment Method: ${formData.get("method")}`,
    `Amount Sent: ${formData.get("amountSent")}`,
    `Notes: ${formData.get("notes") || "None"}`,
    "",
    "Status: Payment Complete. Please check email. Waiting time is 5-10 minutes and may take up to 2 hours."
  ].join("\n"));
  return `mailto:?subject=${subject}&body=${body}`;
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
selectedProduct.addEventListener("change", () => {
  confirmProduct.value = selectedProduct.value;
  updateSeo(products.find(item => item.name === selectedProduct.value));
});
confirmProduct.addEventListener("change", () => {
  selectedProduct.value = confirmProduct.value;
  updateSeo(products.find(item => item.name === confirmProduct.value));
});
[usdAmount, paymentMethod].forEach(input => input.addEventListener("input", calculateAmount));
copyWalletBtn.addEventListener("click", () => copyText(wallets[paymentMethod.value].address, "Selected wallet address copied."));

document.querySelector("#confirmForm").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const confirmation = {
    product: formData.get("product"),
    whatsapp: formData.get("whatsapp"),
    txid: formData.get("txid"),
    location: formData.get("location"),
    email: formData.get("email"),
    method: formData.get("method"),
    amountSent: formData.get("amountSent"),
    notes: formData.get("notes"),
    createdAt: new Date().toISOString()
  };

  const stored = JSON.parse(localStorage.getItem("giftcardHubConfirmations") || "[]");
  stored.push(confirmation);
  localStorage.setItem("giftcardHubConfirmations", JSON.stringify(stored));

  showMessage("Payment Complete. Your details have been saved in this browser. Waiting time is 5–10 minutes and may take up to 2 hours. Please check your email.");

  const mailto = buildMailto(formData);
  const mailLink = document.createElement("a");
  mailLink.href = mailto;
  mailLink.textContent = "Open email confirmation";
  mailLink.className = "btn btn-secondary";
  mailLink.style.marginTop = "12px";
  document.querySelector("#formMessage").appendChild(document.createElement("br"));
  document.querySelector("#formMessage").appendChild(mailLink);
});

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

renderCategoryOptions();
renderProductOptions();
renderProducts();
renderWallets();
calculateAmount();
updateSeo(null);
