/* =============================================
   GIFT WALMART — JAVASCRIPT
   ============================================= */

// ---- RATES ----
const RATES = {
  USDT_PER_USD: 1 / 1.1,       // 1 USD = 1/1.1 USDT (since 1 USDT = 1.1 USD)
  BTC_USDT: 120000,             // 1 BTC = 120000 USDT
  ETH_USDT: 4500,               // 1 ETH = 4500 USDT
};

// ---- WALLET ADDRESSES ----
const WALLETS = {
  'USDT-BEP20': '0x3d349c6139de28c972698a18684609ec02a2735d',
  'USDT-TRC20': 'TLLnDAaYyVTUjAk4uqKztdJ7Pg6oyc7VbR',
  'ETH':        '0x3d349c6139de28c972698a18684609ec02a2735d',
  'BTC':        '1AdrCZ3wSA5x9NSX5LEty7VihmBrnzLY1t',
};

let currentProduct = null;
let currentPrice = 0;
let selectedMethod = null;

// ---- OFFICIAL BRAND LOGOS ----
// Most logos are loaded from Simple Icons CDN using each brand's official icon slug.
// Cards without a real brand keep a clean text badge fallback.
const BRAND_LOGOS = {
  'Amazon Gift Card': 'amazon',
  'Walmart Gift Card': 'walmart',
  'Target Gift Card': 'target',
  'eBay Gift Card': 'ebay',
  'Best Buy Gift Card': 'bestbuy',
  'Nike Gift Card': 'nike',
  'Adidas Gift Card': 'adidas',
  'Shein Gift Card': 'shein',
  'AliExpress Gift Card': 'aliexpress',
  'Steam Gift Card': 'steam',
  'PlayStation Gift Card': 'playstation',
  'Xbox Gift Card': 'xbox',
  'Nintendo eShop Gift Card': 'nintendo',
  'Roblox Gift Card': 'roblox',
  'Fortnite V-Bucks Gift Card': 'fortnite',
  'Razer Gold Gift Card': 'razer',
  'Google Play Gift Card': 'googleplay',
  'Apple App Store & iTunes Gift Card': 'apple',
  'Netflix Gift Card': 'netflix',
  'Spotify Gift Card': 'spotify',
  'Disney+ Gift Card': 'disneyplus',
  'Hulu Gift Card': 'hulu',
  'YouTube Premium Gift Card': 'youtube',
  'Twitch Gift Card': 'twitch',
  'Paramount+ Gift Card': 'paramountplus',
  'Starbucks Gift Card': 'starbucks',
  "McDonald's Gift Card": 'mcdonalds',
  'Uber Eats Gift Card': 'ubereats',
  'DoorDash Gift Card': 'doordash',
  "Domino's Gift Card": 'dominos',
  'Burger King Gift Card': 'burgerking',
  'Subway Gift Card': 'subway',
  'KFC Gift Card': 'kfc',
  'Airbnb Gift Card': 'airbnb',
  'Uber Gift Card': 'uber',
  'Lyft Gift Card': 'lyft',
  'Hotels.com Gift Card': 'hotelsdotcom',
  'Expedia Gift Card': 'expedia',
  'Booking.com Gift Card': 'bookingdotcom',
  'AT&T Prepaid Card': 'atandt',
  'T-Mobile Prepaid Card': 'tmobile',
  'Verizon Prepaid Card': 'verizon',
  'Vodafone Recharge Card': 'vodafone',
  'Orange Recharge Card': 'orange',
  'Etisalat Recharge Card': 'etisalat',
};


const BRAND_DOMAINS = {
  'Amazon Gift Card': 'amazon.com',
  'Walmart Gift Card': 'walmart.com',
  'Target Gift Card': 'target.com',
  'eBay Gift Card': 'ebay.com',
  'Best Buy Gift Card': 'bestbuy.com',
  'Nike Gift Card': 'nike.com',
  'Adidas Gift Card': 'adidas.com',
  'Shein Gift Card': 'shein.com',
  'AliExpress Gift Card': 'aliexpress.com',
  'Steam Gift Card': 'steampowered.com',
  'PlayStation Gift Card': 'playstation.com',
  'Xbox Gift Card': 'xbox.com',
  'Nintendo eShop Gift Card': 'nintendo.com',
  'Roblox Gift Card': 'roblox.com',
  'Fortnite V-Bucks Gift Card': 'fortnite.com',
  'Razer Gold Gift Card': 'razer.com',
  'Google Play Gift Card': 'play.google.com',
  'Apple App Store & iTunes Gift Card': 'apple.com',
  'Netflix Gift Card': 'netflix.com',
  'Spotify Gift Card': 'spotify.com',
  'Disney+ Gift Card': 'disneyplus.com',
  'Hulu Gift Card': 'hulu.com',
  'YouTube Premium Gift Card': 'youtube.com',
  'Twitch Gift Card': 'twitch.tv',
  'Paramount+ Gift Card': 'paramountplus.com',
  'Starbucks Gift Card': 'starbucks.com',
  "McDonald's Gift Card": 'mcdonalds.com',
  'Uber Eats Gift Card': 'ubereats.com',
  'DoorDash Gift Card': 'doordash.com',
  "Domino's Gift Card": 'dominos.com',
  'Burger King Gift Card': 'bk.com',
  'Subway Gift Card': 'subway.com',
  'KFC Gift Card': 'kfc.com',
  'Airbnb Gift Card': 'airbnb.com',
  'Uber Gift Card': 'uber.com',
  'Lyft Gift Card': 'lyft.com',
  'Hotels.com Gift Card': 'hotels.com',
  'Expedia Gift Card': 'expedia.com',
  'Booking.com Gift Card': 'booking.com',
  'AT&T Prepaid Card': 'att.com',
  'T-Mobile Prepaid Card': 't-mobile.com',
  'Verizon Prepaid Card': 'verizon.com',
  'Vodafone Recharge Card': 'vodafone.com',
  'Orange Recharge Card': 'orange.com',
  'Etisalat Recharge Card': 'etisalat.ae',
  'Du Recharge Card': 'du.ae',
};

function logoUrl(slug) {
  return `https://cdn.simpleicons.org/${slug}`;
}

function domainLogoUrl(domain) {
  return `https://logo.clearbit.com/${domain}`;
}

function makeLogoImage(productName, fallbackText = '') {
  const slug = BRAND_LOGOS[productName];
  const domain = BRAND_DOMAINS[productName];
  if (!slug && !domain) return null;

  const img = document.createElement('img');
  img.className = 'brand-logo-img';
  img.src = slug ? logoUrl(slug) : domainLogoUrl(domain);
  img.alt = `${productName.replace(/ Gift Card| Prepaid Card| Recharge Card/g, '')} official logo`;
  img.loading = 'lazy';
  img.onerror = () => {
    if (domain && !img.dataset.usedDomainFallback) {
      img.dataset.usedDomainFallback = 'true';
      img.src = domainLogoUrl(domain);
      return;
    }
    const fallback = document.createElement('span');
    fallback.className = 'brand-logo-fallback';
    fallback.textContent = fallbackText || productName.charAt(0);
    img.replaceWith(fallback);
  };
  return img;
}

function applyOfficialLogos() {
  document.querySelectorAll('.gift-card').forEach(card => {
    const productName = card.dataset.name;
    const iconBox = card.querySelector('.card-brand-icon');
    if (!iconBox) return;

    const existingEmoji = iconBox.textContent.trim();
    const img = makeLogoImage(productName, existingEmoji);
    iconBox.textContent = '';

    if (img) {
      iconBox.classList.add('has-logo');
      iconBox.appendChild(img);
    } else {
      iconBox.classList.add('logo-fallback-card');
      iconBox.textContent = existingEmoji || productName.charAt(0);
    }
  });
}


// ---- UPDATE CARD PRICE from select ----
function updateCardPrice(select) {
  const card = select.closest('.gift-card');
  card.dataset.price = select.value;
}

// ---- OPEN PAYMENT MODAL ----
function openPayment(card) {
  currentProduct = {
    name: card.dataset.name,
    price: parseFloat(card.dataset.price),
    color: card.dataset.color,
    color2: card.dataset.color2,
    emoji: card.dataset.emoji,
    logoSlug: BRAND_LOGOS[card.dataset.name] || null,
  };
  currentPrice = currentProduct.price;

  // Modal header
  document.getElementById('modalProductName').textContent = currentProduct.name;
  document.getElementById('modalAmountDisplay').textContent = `$${currentPrice.toFixed(2)} USD`;

  // Preview card
  const previewCard = document.getElementById('previewCard');
  previewCard.style.background = `linear-gradient(135deg, ${currentProduct.color}, ${currentProduct.color2})`;
  const previewIcon = document.getElementById('previewEmoji');
  previewIcon.textContent = '';
  const previewLogo = makeLogoImage(currentProduct.name, currentProduct.emoji);
  if (previewLogo) {
    previewLogo.classList.add('preview-logo-img');
    previewIcon.classList.add('has-logo');
    previewIcon.appendChild(previewLogo);
  } else {
    previewIcon.classList.remove('has-logo');
    previewIcon.textContent = currentProduct.emoji;
  }
  document.getElementById('previewBrand').textContent = currentProduct.name.split(' ').slice(0, 2).join(' ').toUpperCase();

  // Calculate rates
  const usdtAmount = (currentPrice * RATES.USDT_PER_USD).toFixed(4);
  const btcAmount  = (currentPrice * RATES.USDT_PER_USD / RATES.BTC_USDT).toFixed(8);
  const ethAmount  = (currentPrice * RATES.USDT_PER_USD / RATES.ETH_USDT).toFixed(6);

  document.getElementById('rateUSDT').textContent = `${usdtAmount} USDT`;
  document.getElementById('rateBTC').textContent  = `${btcAmount} BTC`;
  document.getElementById('rateETH').textContent  = `${ethAmount} ETH`;

  // Reset state
  selectedMethod = null;
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
  document.getElementById('selectedMethodBox').style.display = 'none';

  // Show step 1
  showStep('step1');

  // Open modal
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ---- CLOSE MODAL ----
function closePayment() {
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  ['whatsapp','email','location','txid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  selectedMethod = null;
}

// ---- STEP NAVIGATION ----
function showStep(stepId) {
  ['step1','step2','step3'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(stepId).classList.remove('hidden');
}

function goToPayment() {
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const email    = document.getElementById('email').value.trim();
  const location = document.getElementById('location').value.trim();

  if (!whatsapp || !email || !location) {
    shakeModal();
    showNotif('⚠️ Please fill in your contact details before continuing.', 'warn');
    return;
  }
  if (!isValidEmail(email)) {
    showNotif('⚠️ Please enter a valid email address.', 'warn');
    return;
  }

  showStep('step2');
}

function backToStep1() {
  showStep('step1');
}

// ---- SELECT PAYMENT METHOD ----
function selectPayment(el, method) {
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedMethod = method;

  const usdtAmount = (currentPrice * RATES.USDT_PER_USD).toFixed(4);
  const btcAmount  = (currentPrice * RATES.USDT_PER_USD / RATES.BTC_USDT).toFixed(8);
  const ethAmount  = (currentPrice * RATES.USDT_PER_USD / RATES.ETH_USDT).toFixed(6);

  let cryptoAmount = '';
  let methodLabel = '';

  switch(method) {
    case 'USDT-BEP20':
      cryptoAmount = `${usdtAmount} USDT (BEP20)`;
      methodLabel = 'USDT BEP20';
      break;
    case 'USDT-TRC20':
      cryptoAmount = `${usdtAmount} USDT (TRC20)`;
      methodLabel = 'USDT TRC20';
      break;
    case 'ETH':
      cryptoAmount = `${ethAmount} ETH`;
      methodLabel = 'Ethereum (ETH)';
      break;
    case 'BTC':
      cryptoAmount = `${btcAmount} BTC`;
      methodLabel = 'Bitcoin (BTC)';
      break;
  }

  document.getElementById('selectedMethodBox').style.display = 'block';
  document.getElementById('selectedMethodName').textContent = methodLabel;
  document.getElementById('selectedAmountCrypto').textContent = cryptoAmount;
  document.getElementById('selectedAddr').textContent = WALLETS[method];
}

// ---- CONFIRM PAYMENT ----
function confirmPayment() {
  if (!selectedMethod) {
    showNotif('⚠️ Please select a payment method first.', 'warn');
    return;
  }
  const txid = document.getElementById('txid').value.trim();
  if (!txid) {
    showNotif('⚠️ Please enter your Transaction ID (TxID).', 'warn');
    return;
  }

  const whatsapp = document.getElementById('whatsapp').value.trim();
  const email    = document.getElementById('email').value.trim();
  const location = document.getElementById('location').value.trim();

  // Build order summary
  const now = new Date();
  const orderRef = 'GW-' + Math.random().toString(36).substr(2,8).toUpperCase();
  const orderHtml = `
    <strong>Order ID:</strong> ${orderRef}<br/>
    <strong>Product:</strong> ${currentProduct.name}<br/>
    <strong>Amount:</strong> $${currentPrice.toFixed(2)} USD<br/>
    <strong>Payment:</strong> ${selectedMethod}<br/>
    <strong>TxID:</strong> ${txid.substr(0,12)}...${txid.substr(-6)}<br/>
    <strong>WhatsApp:</strong> ${whatsapp}<br/>
    <strong>Email:</strong> ${email}<br/>
    <strong>Location:</strong> ${location}<br/>
    <strong>Time:</strong> ${now.toLocaleString()}
  `;

  document.getElementById('successOrder').innerHTML = orderHtml;
  showStep('step3');
}

// ---- COPY ADDRESS ----
function copyAddr(event, addr) {
  event.stopPropagation();
  navigator.clipboard.writeText(addr).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = '✓ Copied';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea');
    el.value = addr;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showNotif('✓ Address copied!', 'success');
  });
}

// ---- CATEGORY FILTER ----
function filterCat(cat) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  document.querySelectorAll('.section-block').forEach(section => {
    if (cat === 'all') {
      section.classList.remove('hidden');
    } else {
      const sectionCat = section.dataset.cat;
      if (sectionCat === cat) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    }
  });
}

// ---- HELPERS ----
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeModal() {
  const box = document.querySelector('.modal-box');
  box.style.animation = 'none';
  box.offsetHeight; // reflow
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => { box.style.animation = ''; }, 400);
}

// ---- NOTIFICATION TOAST ----
function showNotif(msg, type = 'info') {
  let notif = document.getElementById('gw-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'gw-notif';
    notif.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      padding:12px 24px; border-radius:50px; font-family:var(--font-general);
      font-size:0.88rem; font-weight:600; z-index:9999; white-space:nowrap;
      box-shadow:0 8px 32px rgba(0,0,0,0.4); transition: opacity 0.3s;
    `;
    document.body.appendChild(notif);
  }
  notif.textContent = msg;
  notif.style.background = type === 'warn' ? '#FF6B35' : type === 'success' ? '#00E5A0' : '#333';
  notif.style.color = type === 'warn' || type === 'success' ? '#000' : '#fff';
  notif.style.opacity = '1';
  clearTimeout(notif._t);
  notif._t = setTimeout(() => { notif.style.opacity = '0'; }, 3000);
}

// ---- ADD SHAKE KEYFRAME ----
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);

// ---- APPLY BRAND LOGOS ----
applyOfficialLogos();

// ---- CLOSE ON OVERLAY CLICK ----
document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) closePayment();
});

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.gift-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.5s ease ${(i % 9) * 0.06}s, transform 0.5s ease ${(i % 9) * 0.06}s`;
  observer.observe(card);
});

// ---- CARD TILT EFFECT ----
document.querySelectorAll('.gift-card').forEach(card => {
  const inner = card.querySelector('.card-face.card-front');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    if (inner) {
      inner.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    if (inner) {
      inner.style.transform = '';
    }
  });
});

console.log('🎁 Gift Walmart — Loaded successfully.');
