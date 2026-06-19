# Global Bridge

Public data-powered AI country risk intelligence for global business decisions.

Global Bridge is a polished MVP web app for small businesses, startups, and professionals preparing for international business, travel, sourcing, investment, or partner research. It turns country risk signals into a structured, screenshot-ready briefing with category scores, practical actions, warning signals, and official links.

## Problem Statement

Cross-border decisions often require reviewing travel advisories, market entry notes, logistics risks, partner concerns, and sector-specific exposure across many disconnected sources. Small teams usually do not have a dedicated geopolitical risk function, so they need a fast way to understand country risk before booking travel, contacting suppliers, signing partners, or entering a market.

Global Bridge demonstrates how an AI-assisted risk intelligence product could make that first risk check easier, clearer, and more actionable.

## Target Users

- Small business owners evaluating overseas suppliers, buyers, or distributors
- Startup founders and operators exploring market entry
- Professionals preparing for international business travel
- Consultants, trade advisors, and sourcing teams
- Non-specialists who need a clear first-pass country risk briefing

## MVP Features

- Landing page with clear product positioning and call to action
- Country risk input flow for country, purpose, industry, and urgency
- Mock country profiles for Kenya, Nigeria, and South Africa
- Category scores for political, security, logistics, health, and business risk
- Transparent scoring adjustments based on purpose, industry, and urgency
- Result dashboard with overall risk level and overall score
- Country summary, key risks, recommended actions, warning signals, and alternative strategy
- Official information links for each country profile
- Copy summary button for quick sharing
- Generate briefing button for a compact executive-style summary
- Live MOFA country safety information through a local server-side API proxy
- Automatic MVP mock-signal fallback when live MOFA data is unavailable
- No authentication, payments, or database

## Demo Scenario

Use this scenario for a portfolio walkthrough, GitHub demo, or LinkedIn post:

1. Open the app and click `Start Risk Check`.
2. Select `Kenya`.
3. Select `Business Trip`.
4. Select `Healthcare`.
5. Select `High` urgency.
6. Click `Generate Risk Briefing`.
7. Review the dashboard for adjusted security, health, and urgency-driven risk.
8. Click `Generate briefing` or `Copy summary` to share the result.

## Screenshots

### Landing Page

![Global Bridge landing page](screenshots/landing-page.png)

### Kenya Risk Briefing

![Kenya risk briefing](screenshots/risk-briefing-kenya.png)

### Risk Dashboard

![Global Bridge risk dashboard](screenshots/risk-dashboard.png)

## Tech Stack

- React
- TypeScript
- Vite
- Express
- CSS
- MOFA country safety information from data.go.kr
- Local TypeScript mock-data fallback
- Client-side state management with React hooks

## Project Structure

```text
global-bridge/
├── server/
│   └── index.js
├── public/
├── screenshots/
│   ├── landing-page.png
│   ├── risk-briefing-kenya.png
│   └── risk-dashboard.png
├── src/
│   ├── assets/
│   ├── data/
│   │   └── riskProfiles.ts
│   ├── services/
│   │   └── publicDataApi.ts
│   ├── types/
│   │   └── risk.ts
│   ├── utils/
│   │   └── riskScoring.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── .env.example
├── package.json
└── README.md
```

## How To Run Locally

Install dependencies:

```bash
npm install
```

Create a local environment file and add your data.go.kr decoding service key:

```bash
cp .env.example .env.local
```

```text
DATA_GO_KR_SERVICE_KEY=your_service_key
```

Start the API proxy in one terminal:

```bash
npm run server
```

Start Vite in a second terminal:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Create a production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Risk Scoring Model

Each country profile includes base scores from `0` to `100` across five categories:

- Political
- Security
- Logistics
- Health
- Business

The app calculates an adjusted result from four user inputs:

- Country selects the base mock risk profile.
- Purpose adjusts relevant category scores. For example, import increases logistics and business risk, while business travel increases security and health risk.
- Industry applies sector-specific category adjustments. For example, healthcare increases health exposure, while raw materials increase logistics exposure.
- Urgency increases the overall score: low adds `0`, medium adds `5`, and high adds `10`.

Scores are capped at `100`. The overall score is calculated from the adjusted category average plus the urgency adjustment, then mapped to a risk level:

- `Managed`
- `Moderate`
- `High`
- `Critical`

## Current Limitations

- Uses live data only for MOFA country safety information; all other public-data signals remain MVP mock data
- Falls back to MVP mock signals when the MOFA key, proxy, or upstream API is unavailable
- Covers only Kenya, Nigeria, and South Africa
- Does not persist user inputs or generated briefings
- Does not include source citations inside the generated briefing text
- Does not include authentication, payments, user accounts, or team workspaces
- Does not replace professional legal, security, insurance, medical, or trade advice

## Future Roadmap

- Add live official advisory and trade data ingestion
- Add source citations and confidence indicators
- Add downloadable PDF and shareable briefing links
- Add country comparison and industry comparison views
- Add saved briefings and scenario history
- Add partner due diligence checklists
- Add risk monitoring alerts for selected countries
- Add AI-generated narrative briefings with verifiable sources
- Add organization workspaces for teams and advisors

## Disclaimer

Global Bridge is an MVP prototype using live MOFA safety notices when available and mock data for all remaining public-data signals. It is not a comprehensive real-time risk advisory service and should not be used as the sole basis for business, travel, investment, legal, security, health, or compliance decisions. Always verify critical information with official sources and qualified professionals before acting.
