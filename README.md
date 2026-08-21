# Oluku LLC Global Logistics Website

Official repository for the Oluku LLC Global Logistics corporate website and mobile application dashboard. This platform provides real-time shipment tracking, service quotes, and supply chain updates for global shipping operations.

## 🚀 Key Features

* **Instant Service Quotes:** Integrated web form for clients to capture and submit freight volume details.
* **Consignment Tracker:** JavaScript-powered tracking module ready for TMS/carrier API integrations.
* **Mobile App Ready:** Progressively enhanced asset architecture configured to deploy as a mobile app.
* **Offline Capability:** Built-in Service Worker (`sw.js`) caching core branding assets, CSS, and application logic.

## 🛠️ Tech Stack

* **Frontend:** Clean HTML5, CSS3 Custom Properties (Flexbox/Grid layout)
* **Application Logic:** Native asynchronous JavaScript (ES6+)
* **PWA Architecture:** Service Worker caching (`oluku-v1` cache architecture) & web app manifest

## 📦 Project Structure

```text
├── index.html          # Main landing page & tracking dashboard
├── styles.css          # Global style sheets & layout variables
├── app.js              # Tracking logic, mobile menu, and form capture
├── sw.js               # Service Worker asset caching logic
├── manifest.json       # Progressive Web App configuration
└── assets/             # Brand identity images and media
```

## 💻 Technical Capabilities Detailed

### Service Worker & Performance
The platform leverages a local service worker structure to handle spotty network connections during transit or logistics management operations:
* Caches critical visual brand assets instantly on installation.
* Intercepts network requests to deliver a fast, localized experience.

### Tracking Terminal
The UI features a robust form submission listener built to capture shipping containers and package tracking numbers. It is currently built to dynamically update the DOM with custom HTML feedback messages upon text validation.

## 🔧 Installation & Local Setup

To run this project locally on your machine for development:

1. Clone this repository:
   ```bash
   git clone https://github.com
   ```
2. Navigate into the project directory.
3. Open the directory using an editor like **Visual Studio Code**.
4. Use a local development tool (such as the **Live Server** extension) to view the site in your browser.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
