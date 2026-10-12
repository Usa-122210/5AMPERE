# 5AMPERE — Smart Energy Management Platform

[![Live Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-success)](https://5ampere.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-33%20Passing-brightgreen)](tests/energyMath.test.js)
[![React 19](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC)](https://tailwindcss.com/)

> **Live Deployment:** [https://5ampere.vercel.app](https://5ampere.vercel.app)  
> Smart home energy management platform designed to help Indian households monitor real-time electrical draw, identify phantom vampire consumption, audit progressive electricity tariff slabs, and optimize monthly bills through automated demand response and appliance controls.

---

## 🌟 Core Features & Application Routes

| Route | Page | Purpose & Capabilities |
| :--- | :--- | :--- |
| `/` | **Overview Dashboard** | Real-time household demand, daily energy consumption, 30-day projected bill in INR, and quick triage alerts. |
| `/monitoring` | **Live Monitoring** | Sub-second telemetry (Active Power, Voltage, Current, Power Factor, 50 Hz Frequency) with dynamic SVG conduit flow diagram. |
| `/appliances` | **Appliance Management** | Individual circuit monitoring (8 breakers), live kW/A draw, INR cost estimates, relay toggles, and refrigerator spoilage safety locks. |
| `/saving-mode` | **Saving Mode** | Configurable monthly budget ceiling (default ₹4,500 baseline), target savings sliders (5%, 15%, 30%), and automated peak load shedding schedules. |
| `/billing` | **Bill & Tariff Schedule** | Progressive slab visualizer for official UPPCL LMV-1 domestic schedule, fixed sanctioned demand charges, and statutory electricity duty. |
| `/analytics` | **Energy Analytics** | 24-hour diurnal load curves, hourly circuit attribution, and 95W continuous standby phantom load indicators. |
| `/recommendations` | **AI Insights & Simulator** | Interactive "What-If" lifestyle adjustments (AC 24°C BEE Eco setpoint, geyser pre-bath timer) computing marginal rupee savings from the top slab. |
| `/alerts` | **Alerts & Surveillance** | Active threshold notifications (high evening peak draw, continuous vampire loads) with acknowledgment workflow. |
| `/settings` | **System Preferences** | Sanctioned load capacity selector (2–10 kW), DISCOM tariff switcher, and IS 12360 electrical supply specifications (230V AC, 50 Hz). |

---

## ⚡ Mathematical & Tariff Calculation Engine

The billing engine strictly follows the official **UPERC Retail Tariff Schedule (LMV-1 Urban Metered Domestic)**:
* **Progressive Slabs (Per Billing Cycle):**
  * `0 to 100 kWh`: ₹5.50 / kWh
  * `101 to 150 kWh`: ₹5.50 / kWh
  * `151 to 300 kWh`: ₹6.00 / kWh
  * `Above 300 kWh`: ₹6.50 / kWh
* **Sanctioned Demand Fixed Charges:** ₹110 / kW of contracted load / month.
* **Statutory Electricity Duty:** 5.0% levied on energy charges under UP Electricity Duty Act.
* **Marginal Savings Computation:** Avoided kWh is correctly evaluated at the household's top marginal slab tier rather than misleading average rates.

All calculations are validated through **33 automated unit tests** (`tests/energyMath.test.js`).

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 19, JavaScript (ES Modules), Vite 6
* **Styling & Design Tokens:** Tailwind CSS v4, custom CSS variables (`tokens.css`), dark/light theme support
* **Routing:** React Router 7 with full SPA rewrite support (`vercel.json`, `dist/200.html`, `dist/_redirects`)
* **Icons & Animation:** Lucide React, Framer Motion
* **Hosting:** Vercel Global Edge Network

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ (tested on Node.js v24.11.0)
* npm v9+

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/Usa-122210/5AMPERE.git
cd 5AMPERE

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Running Unit Tests
```bash
npm test
```

### Production Build & Preview
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Directory Structure

```
5AMPERE/
├── dist/                     # Compiled production assets (git-ignored)
├── public/                   # Static icons, SPA fallback manifests
├── src/
│   ├── app/                  # App root and React Router tree (router.jsx)
│   ├── components/           # UI components, layout shells, telemetry cards
│   ├── context/              # EnergyDataContext state management & actions
│   ├── data/                 # Demo household telemetry and circuit models
│   ├── pages/                # 9 dedicated page views
│   ├── services/             # Tariff registry & official UPPCL schedules
│   ├── styles/               # Tailwind CSS v4 tokens and theme variables
│   └── utils/                # energyMath billing & conversion functions
├── tests/                    # 33 comprehensive math & tariff unit tests
├── .env.example              # Environment variables template
├── .gitignore                # Strict exclusion for secrets, node_modules, caches
├── vercel.json               # Vercel SPA rewrite configuration
├── vite.config.js            # Vite build configuration
└── package.json              # Project scripts and dependencies
```

---

## 🔒 Security & Verification

* Zero API keys, passwords, or secrets are contained in source files or configuration.
* Contactor relays and breaker controls operate safely on a local calibrated simulation engine without live mains risk.
