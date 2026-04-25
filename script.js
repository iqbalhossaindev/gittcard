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

function googleFaviconUrl(domain) {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=https://${domain}`;
}

function cleanBrandName(productName) {
  return (productName || 'Gift Card')
    .replace(/ Gift Card| Prepaid Card| Recharge Card/gi, '')
    .replace(/&/g, 'and')
    .replace(/\+/g, ' Plus ')
    .trim();
}

function makeMonogramSvg(label) {
  const clean = cleanBrandName(label).replace(/[^A-Za-z0-9 ]/g, ' ').trim();
  const chars = clean.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'GC';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#d7e8ff"/></linearGradient></defs><rect width="128" height="128" rx="28" fill="url(#g)"/><text x="64" y="78" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="44" text-anchor="middle" fill="#111111">${chars}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeLogoImage(productName) {
  const slug = BRAND_LOGOS[productName];
  const domain = BRAND_DOMAINS[productName];
  const label = cleanBrandName(productName);

  const img = document.createElement('img');
  img.className = 'brand-logo-img';
  img.alt = `${label} brand logo`;
  img.loading = 'lazy';

  if (domain) {
    img.src = googleFaviconUrl(domain);
    img.onerror = () => {
      if (!img.dataset.usedClearbit) {
        img.dataset.usedClearbit = 'true';
        img.src = domainLogoUrl(domain);
        return;
      }
      if (slug && !img.dataset.usedSimpleIcon) {
        img.dataset.usedSimpleIcon = 'true';
        img.src = logoUrl(slug);
        return;
      }
      img.onerror = null;
      img.src = makeMonogramSvg(label);
    };
    return img;
  }

  if (slug) {
    img.src = logoUrl(slug);
    img.onerror = () => {
      img.onerror = null;
      img.src = makeMonogramSvg(label);
    };
    return img;
  }

  img.src = makeMonogramSvg(label);
  return img;
}

function applyOfficialLogos() {
  document.querySelectorAll('.gift-card').forEach(card => {
    const productName = card.dataset.name;
    const iconBox = card.querySelector('.card-brand-icon');
    if (!iconBox) return;
    const img = makeLogoImage(productName);
    iconBox.textContent = '';
    iconBox.classList.add('has-logo');
    iconBox.appendChild(img);
  });
}


// ---- STATE ----
let currentOrderItems = [];
let currentSubtotal = 0;
let currentDiscount = 0;
let currentTotal = 0;
let currentDiscountCode = '';
let checkoutMode = 'single';
let cartItems = [];
const CART_KEY = 'giftwalmart_cart';
const FIRST_PURCHASE_KEY = 'giftwalmart_first_purchase_complete';
const NEW20_USED_KEY = 'giftwalmart_new20_used';

// ---- PRODUCT HELPERS ----
function getCardProduct(card) {
  return {
    name: card.dataset.name,
    price: parseFloat(card.dataset.price),
    color: card.dataset.color,
    color2: card.dataset.color2,
    logoSlug: BRAND_LOGOS[card.dataset.name] || null,
    quantity: 1,
  };
}

function itemKey(item) {
  return `${item.name}__${item.price}`;
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[ch]));
}

function coinIconForMethod(method) {
  if (method === 'BTC') return 'assets/btc.svg';
  if (method === 'ETH') return 'assets/eth.svg';
  return 'assets/usdt.svg';
}

function cartSubtotal() {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function loadCart() {
  try {
    cartItems = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    cartItems = [];
  }
  renderCart();
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

function updateCardPrice(select) {
  const card = select.closest('.gift-card');
  card.dataset.price = select.value;
}

function addToCart(card) {
  const product = getCardProduct(card);
  const key = itemKey(product);
  const existing = cartItems.find(item => itemKey(item) === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push(product);
  }
  saveCart();
  renderCart();
  showNotif(`${product.name} added to cart.`, 'success');
}

function removeCartItem(index) {
  cartItems.splice(index, 1);
  saveCart();
  renderCart();
}

function changeCartQty(index, delta) {
  if (!cartItems[index]) return;
  cartItems[index].quantity += delta;
  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function toggleCart(show) {
  const overlay = document.getElementById('cartOverlay');
  if (!overlay) return;
  overlay.classList.toggle('active', !!show);
  document.body.classList.toggle('cart-open', !!show);
}

function renderCart() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartSubtotal();

  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const itemsEl = document.getElementById('cartItems');

  if (countEl) countEl.textContent = count;
  if (subtotalEl) subtotalEl.textContent = money(subtotal);

  if (!itemsEl) return;

  if (!cartItems.length) {
    itemsEl.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
    return;
  }

  itemsEl.innerHTML = cartItems.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-main">
        <div class="cart-item-title">${escapeHtml(item.name)}</div>
        <div class="cart-item-meta">${money(item.price)} × ${item.quantity}</div>
      </div>
      <div class="cart-item-actions">
        <button type="button" onclick="changeCartQty(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button type="button" onclick="changeCartQty(${index}, 1)">+</button>
        <button class="cart-remove" type="button" onclick="removeCartItem(${index})">Remove</button>
      </div>
    </div>
  `).join('');
}

function checkoutCart() {
  if (!cartItems.length) {
    showNotif('Your cart is empty.', 'warn');
    return;
  }
  toggleCart(false);
  const items = cartItems.map(item => ({ ...item }));
  setupOrder(items, 'cart');
}

function openPayment(card) {
  setupOrder([getCardProduct(card)], 'single');
}

function setupOrder(items, mode = 'single') {
  checkoutMode = mode;
  currentOrderItems = items.map(item => ({ ...item }));
  currentSubtotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  currentDiscount = 0;
  currentTotal = currentSubtotal;
  currentDiscountCode = '';
  selectedMethod = null;
  currentPrice = currentTotal;
  currentProduct = currentOrderItems.length === 1
    ? currentOrderItems[0]
    : {
        name: `Cart Checkout (${currentOrderItems.reduce((sum, item) => sum + item.quantity, 0)} cards)`,
        price: currentSubtotal,
        color: '#00E5A0',
        color2: '#00B8FF',
      };

  document.getElementById('modalProductName').textContent = currentProduct.name;
  document.getElementById('modalAmountDisplay').textContent = `${money(currentTotal)} USD`;

  const previewCard = document.getElementById('previewCard');
  previewCard.style.background = `linear-gradient(135deg, ${currentProduct.color || '#00E5A0'}, ${currentProduct.color2 || '#00B8FF'})`;
  const previewIcon = document.getElementById('previewEmoji');
  previewIcon.textContent = '';
  const previewLogo = currentOrderItems.length === 1
    ? makeLogoImage(currentOrderItems[0].name)
    : makeMonogramSvg('Cart');
  if (typeof previewLogo === 'string') {
    const img = document.createElement('img');
    img.src = previewLogo;
    img.className = 'preview-logo-img';
    img.alt = 'Cart';
    previewIcon.appendChild(img);
  } else if (previewLogo) {
    previewLogo.classList.add('preview-logo-img');
    previewIcon.appendChild(previewLogo);
  }
  document.getElementById('previewBrand').textContent = currentOrderItems.length === 1
    ? currentOrderItems[0].name.split(' ').slice(0, 2).join(' ').toUpperCase()
    : 'CART CHECKOUT';

  const discountInput = document.getElementById('discountCode');
  if (discountInput) discountInput.value = '';
  const msg = document.getElementById('discountMessage');
  if (msg) {
    msg.className = 'discount-message';
    msg.textContent = 'NEW20: 20% off first purchase over $500. Maximum discount $1000.';
  }

  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
  document.getElementById('selectedMethodBox').style.display = 'none';

  renderOrderSummary();
  updateCryptoRates();
  resetForm();
  showStep('step1');

  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderOrderSummary() {
  const list = document.getElementById('orderItemsList');
  if (list) {
    list.innerHTML = currentOrderItems.map(item => `
      <div class="order-item-row">
        <span>${escapeHtml(item.name)}${item.quantity > 1 ? ` × ${item.quantity}` : ''}</span>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
    `).join('');
  }

  document.getElementById('summarySubtotal').textContent = money(currentSubtotal);
  document.getElementById('summaryTotal').textContent = money(currentTotal);
  document.getElementById('modalAmountDisplay').textContent = `${money(currentTotal)} USD`;

  const discountLine = document.getElementById('summaryDiscountLine');
  if (currentDiscount > 0) {
    discountLine.style.display = 'flex';
    document.getElementById('summaryDiscount').textContent = `-${money(currentDiscount)}`;
  } else {
    discountLine.style.display = 'none';
    document.getElementById('summaryDiscount').textContent = '-$0.00';
  }
}

function applyDiscountCode() {
  const input = document.getElementById('discountCode');
  const msg = document.getElementById('discountMessage');
  const code = (input?.value || '').trim().toUpperCase();

  currentDiscount = 0;
  currentDiscountCode = '';
  currentTotal = currentSubtotal;

  if (!code) {
    if (msg) {
      msg.className = 'discount-message warn';
      msg.textContent = 'Enter a discount code first.';
    }
    renderOrderSummary();
    updateCryptoRates();
    return;
  }

  if (code !== 'NEW20') {
    if (msg) {
      msg.className = 'discount-message warn';
      msg.textContent = 'Invalid discount code.';
    }
    renderOrderSummary();
    updateCryptoRates();
    return;
  }

  if (localStorage.getItem(FIRST_PURCHASE_KEY) === '1' || localStorage.getItem(NEW20_USED_KEY) === '1') {
    if (msg) {
      msg.className = 'discount-message warn';
      msg.textContent = 'NEW20 is only available on the first purchase.';
    }
    renderOrderSummary();
    updateCryptoRates();
    return;
  }

  if (currentSubtotal < 500) {
    if (msg) {
      msg.className = 'discount-message warn';
      msg.textContent = 'NEW20 requires a subtotal of at least $500.';
    }
    renderOrderSummary();
    updateCryptoRates();
    return;
  }

  currentDiscount = Math.min(currentSubtotal * 0.20, 1000);
  currentTotal = Math.max(currentSubtotal - currentDiscount, 0);
  currentDiscountCode = 'NEW20';

  if (msg) {
    msg.className = 'discount-message success';
    msg.textContent = `NEW20 applied. You saved ${money(currentDiscount)}.`;
  }

  renderOrderSummary();
  updateCryptoRates();
  if (selectedMethod) {
    refreshSelectedPayment();
  }
}

function updateCryptoRates() {
  const usdtAmount = (currentTotal * RATES.USDT_PER_USD).toFixed(4);
  const btcAmount  = (currentTotal * RATES.USDT_PER_USD / RATES.BTC_USDT).toFixed(8);
  const ethAmount  = (currentTotal * RATES.USDT_PER_USD / RATES.ETH_USDT).toFixed(6);

  document.getElementById('rateUSDT').textContent = `${usdtAmount} USDT`;
  document.getElementById('rateBTC').textContent  = `${btcAmount} BTC`;
  document.getElementById('rateETH').textContent  = `${ethAmount} ETH`;
}

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
    showNotif('Please fill in your contact details before continuing.', 'warn');
    return;
  }
  if (!isValidEmail(email)) {
    showNotif('Please enter a valid email address.', 'warn');
    return;
  }

  updateCryptoRates();
  showStep('step2');
}

function backToStep1() {
  showStep('step1');
}

function selectPayment(el, method) {
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedMethod = method;
  refreshSelectedPayment();
}

function refreshSelectedPayment() {
  if (!selectedMethod) return;

  const usdtAmount = (currentTotal * RATES.USDT_PER_USD).toFixed(4);
  const btcAmount  = (currentTotal * RATES.USDT_PER_USD / RATES.BTC_USDT).toFixed(8);
  const ethAmount  = (currentTotal * RATES.USDT_PER_USD / RATES.ETH_USDT).toFixed(6);

  let cryptoAmount = '';
  let methodLabel = '';

  switch(selectedMethod) {
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
  document.getElementById('selectedAddr').textContent = WALLETS[selectedMethod];

  const icon = document.getElementById('selectedCoinIcon');
  if (icon) {
    icon.src = coinIconForMethod(selectedMethod);
    icon.alt = methodLabel;
  }
}

function confirmPayment() {
  if (!selectedMethod) {
    showNotif('Please select a payment method first.', 'warn');
    return;
  }

  const txidInput = document.getElementById('txid');
  const txid = txidInput.value.trim();
  if (!txid) {
    showNotif('Please enter your Transaction ID / TxID before confirming payment.', 'warn');
    txidInput.focus();
    return;
  }
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const email    = document.getElementById('email').value.trim();
  const location = document.getElementById('location').value.trim();

  const now = new Date();
  const orderRef = 'GW-' + Math.random().toString(36).substr(2,8).toUpperCase();
  const itemsHtml = currentOrderItems.map(item => `${escapeHtml(item.name)}${item.quantity > 1 ? ` × ${item.quantity}` : ''} (${money(item.price * item.quantity)})`).join('<br/>');
  const txidDisplay = `${txid.substr(0,12)}...${txid.substr(-6)}`;
  const orderHtml = `
    <strong>Order ID:</strong> ${orderRef}<br/>
    <strong>Items:</strong><br/>${itemsHtml}<br/>
    <strong>Subtotal:</strong> ${money(currentSubtotal)} USD<br/>
    <strong>Discount:</strong> ${currentDiscount > 0 ? `${currentDiscountCode} −${money(currentDiscount)}` : 'None'}<br/>
    <strong>Total Paid:</strong> ${money(currentTotal)} USD<br/>
    <strong>Payment:</strong> ${selectedMethod}<br/>
    <strong>TxID:</strong> ${txidDisplay}<br/>
    <strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}<br/>
    <strong>Email:</strong> ${escapeHtml(email)}<br/>
    <strong>Location:</strong> ${escapeHtml(location)}<br/>
    <strong>Time:</strong> ${now.toLocaleString()}
  `;

  localStorage.setItem(FIRST_PURCHASE_KEY, '1');
  if (currentDiscountCode === 'NEW20') {
    localStorage.setItem(NEW20_USED_KEY, '1');
  }

  if (checkoutMode === 'cart') {
    cartItems = [];
    saveCart();
    renderCart();
  }

  document.getElementById('successOrder').innerHTML = orderHtml;
  showStep('step3');
}

function copyAddr(event, addr) {
  event.stopPropagation();
  navigator.clipboard.writeText(addr).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = 'Copied';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = addr;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showNotif('Address copied!', 'success');
  });
}

function filterCat(cat) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target) {
    event.target.closest('.cat-btn')?.classList.add('active');
  }

  document.querySelectorAll('.section-block').forEach(section => {
    if (cat === 'all') {
      section.classList.remove('hidden');
    } else {
      const sectionCat = section.dataset.cat;
      section.classList.toggle('hidden', sectionCat !== cat);
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeModal() {
  const box = document.querySelector('.modal-box');
  box.style.animation = 'none';
  box.offsetHeight;
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => { box.style.animation = ''; }, 400);
}

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

applyOfficialLogos();
loadCart();

document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) closePayment();
});

document.querySelectorAll('.gift-card').forEach(card => {
  card.classList.add('card-ready');
});

function getProductCards() {
  return Array.from(document.querySelectorAll('.gift-card'));
}

function productMatches(card, query) {
  const name = (card.dataset.name || card.querySelector('.card-title')?.textContent || '').toLowerCase();
  const category = (card.dataset.cat || '').toLowerCase();
  return !query || name.includes(query) || category.includes(query);
}

function renderSearchResults(query, matches) {
  const box = document.getElementById('searchResults');
  if (!box) return;
  box.innerHTML = '';

  if (!query) {
    box.hidden = true;
    return;
  }

  if (matches.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-result-empty';
    empty.textContent = 'No gift card found.';
    box.appendChild(empty);
    box.hidden = false;
    return;
  }

  matches.slice(0, 8).forEach(card => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'search-result-item';
    const title = card.dataset.name || card.querySelector('.card-title')?.textContent || 'Gift Card';
    const cat = card.dataset.cat || 'gift card';
    const price = card.dataset.price || card.querySelector('.denom-select')?.value || '';
    item.innerHTML = `<span class="search-result-title">${title}</span><span class="search-result-meta">${cat}${price ? ` • $${price}` : ''}</span>`;
    item.addEventListener('click', () => goToSearchResult(card));
    box.appendChild(item);
  });
  box.hidden = false;
}

function goToSearchResult(card) {
  if (!card) return;
  document.querySelectorAll('.section-block, .gift-card').forEach(el => el.classList.remove('search-hidden'));
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  const allBtn = Array.from(document.querySelectorAll('.cat-btn')).find(btn => btn.textContent.toLowerCase().includes('all'));
  if (allBtn) allBtn.classList.add('active');

  const results = document.getElementById('searchResults');
  if (results) results.hidden = true;

  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.add('search-focus-card');
  setTimeout(() => card.classList.remove('search-focus-card'), 1800);
}

function searchProducts() {
  const input = document.getElementById('productSearch');
  const empty = document.getElementById('searchEmpty');
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  let visibleCount = 0;
  const matches = [];

  document.querySelectorAll('.section-block').forEach(section => {
    let sectionVisible = false;
    section.querySelectorAll('.gift-card').forEach(card => {
      const visible = productMatches(card, query);
      card.classList.toggle('search-hidden', !visible);
      if (visible) {
        visibleCount += 1;
        sectionVisible = true;
        if (query) matches.push(card);
      }
    });
    section.classList.toggle('search-hidden', !sectionVisible);
  });

  if (empty) empty.hidden = visibleCount !== 0;
  renderSearchResults(query, matches);
}

function clearProductSearch() {
  const input = document.getElementById('productSearch');
  const results = document.getElementById('searchResults');
  if (input) input.value = '';
  if (results) results.hidden = true;
  searchProducts();
  if (input) input.focus();
}


function bindFastTapButtons() {
  const bindings = [
    { selector: '[data-fast-action="payment"]', handler: goToPayment },
    { selector: '[data-fast-action="confirm"]', handler: confirmPayment },
  ];

  bindings.forEach(({ selector, handler }) => {
    document.querySelectorAll(selector).forEach(btn => {
      if (btn.dataset.fastTapBound === '1') return;
      btn.dataset.fastTapBound = '1';
      let lastTap = 0;
      const run = (event) => {
        const now = Date.now();
        if (now - lastTap < 350) return;
        lastTap = now;
        if (event && event.cancelable) event.preventDefault();
        btn.blur();
        handler();
      };
      btn.addEventListener('click', run);
      btn.addEventListener('touchend', run, { passive: false });
      btn.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'touch') run(event);
      }, { passive: false });
    });
  });
}

bindFastTapButtons();
console.log('GiftWalmart loaded successfully.');


document.addEventListener('click', function(e) {
  const search = document.querySelector('.site-search');
  const results = document.getElementById('searchResults');
  if (search && results && !search.contains(e.target)) results.hidden = true;
});
