# GiftCard Hub Website

This ZIP contains a static website for **GiftCard Hub**.

## Files

- `index.html` - main website
- `assets/styles.css` - responsive styling
- `assets/app.js` - product catalog, calculator, wallet copying, SEO updates, payment confirmation behavior
- `assets/gift-card-icon.svg` - animated gift card icon
- `robots.txt` - SEO crawler instructions
- `sitemap.xml` - basic sitemap
- `manifest.webmanifest` - PWA metadata

## Features Included

- GiftCard Hub branding
- Animated gift card icon
- Product catalog with all requested gift card names
- Search and category filter
- Auto SEO title/meta description updates when selecting a product
- Structured data JSON-LD
- Payment calculator using provided rates:
  - 1 USDT = 1.1 USD
  - 1 BTC = 12,000 USDT
  - 1 ETH = 4,500 USDT
- Crypto wallet payment section
- Payment Complete confirmation form with:
  - WhatsApp Number
  - TXID
  - Location
  - Email
- Waiting message: 5-10 minutes and up to 2 hours; asks customer to check email

## Important Notes

This is a frontend-only static website. It does not verify payments, send emails, or deliver gift cards automatically. For production, connect the confirmation form to a secure backend, database, email provider, and transaction-verification service.

Replace `https://example.com/` in `index.html`, `robots.txt`, and `sitemap.xml` with your real domain before publishing.
