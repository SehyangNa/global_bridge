# Global Bridge

Public-data-powered AI country risk intelligence for international business decisions.

Global Bridge is a bilingual Korean/English MVP for small businesses, startups, and professionals preparing for overseas trade, sourcing, investment, partnerships, or business travel. It combines normalized public-data signals, transparent fallback evidence, purpose- and industry-aware risk scoring, and a Groq-generated executive briefing in one dashboard.

## Problem

Cross-border decisions require teams to compare travel advisories, market conditions, logistics exposure, certification requirements, partner concerns, and industry risk across disconnected sources. Small teams rarely have a dedicated geopolitical-risk function, so Global Bridge provides a practical first-pass briefing while keeping source coverage and fallback use visible.

## Supported Demo Countries

- Kenya (`KE`) / 케냐
- Nigeria (`NG`) / 나이지리아
- South Africa (`ZA`) / 남아프리카공화국
- Vietnam (`VN`) / 베트남
- India (`IN`) / 인도
- United Arab Emirates (`AE`) / 아랍에미리트

Country aliases and public-data filters are centralized so additional regions can be added without redesigning the product.

## MVP Features

- Dashboard-style landing, input, and result experiences
- Korean/English localization
- Six country profiles with political, security, logistics, health, and business scores
- Risk adjustments based on country, purpose, industry, and urgency
- Demo presets for import, travel, partner research, supply chain, IT partnership, and logistics-hub scenarios
- Collapsible Groq AI briefing with a server-side template fallback
- Public-data aggregation through a local Express proxy
- Source-grouped signals for MOFA, KOTRA, K-SURE, and MVP fallback evidence
- Live, archived, mock, and unavailable data-coverage indicators
- Per-signal cleaned summaries with expand/collapse controls
- Country-specific fallback signals when upstream data is missing
- Official source links and transparent fallback disclosures
- Copyable full briefing text

## Public Data and AI

The server is designed to aggregate and normalize:

- MOFA overseas safety information
- MOFA travel alerts
- KOTRA country information, market news, breaking news, and certification information
- K-SURE country and industry risk information
- Groq AI briefing generation

Public-data credentials and the Groq key remain server-side. Signals published within the latest six months are labeled `live`; older dated signals are labeled `archived`. Missing categories are filled with clearly marked `MVP mock` signals. If the backend or upstream services are unavailable, the frontend continues with local country-profile fallback evidence.

## Demo Walkthrough

1. Open the app and select Korean or English.
2. Click `Start Risk Check` / `리스크 확인 시작`.
3. Choose a demo preset or select a country, purpose, industry, and urgency.
4. Generate the risk briefing.
5. Review the compact AI summary and expand it for full details.
6. Check the risk snapshot, category scores, actions, alternative strategy, data coverage, and source-grouped signals.
7. Expand individual public-data cards or copy the full briefing.

Recommended competition scenarios:

- Vietnam supply-chain risk
- India IT partnership
- UAE logistics-hub review
- Nigeria business-trip risk

## Tech Stack

- React 19 and TypeScript
- Vite
- Express
- Groq Chat Completions API
- data.go.kr public APIs
- `fast-xml-parser`
- CSS dashboard design system

## Project Structure

```text
global-bridge/
├── server/
│   ├── sources/                  # Public-data source adapters
│   ├── aiBriefing.js             # Groq prompt and fallback briefing
│   ├── publicRiskAggregator.js   # Signal aggregation and fallback fill
│   └── index.js                  # Express API routes
├── src/
│   ├── data/                     # Localization and risk profiles
│   ├── services/                 # Frontend API clients
│   ├── types/
│   ├── utils/                    # Risk scoring
│   ├── App.tsx
│   └── App.css
├── public/
├── .env.example
└── package.json
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

Configure available credentials:

```text
DATA_GO_KR_SERVICE_KEY=your_service_key
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
```

Start the API proxy and Vite client together:

```bash
npm run dev
```

The frontend is normally available at `http://localhost:5173`, with `/api` requests proxied to the local server on port `3001`.

Individual processes can also be started with:

```bash
npm run server
npm run dev:client
```

## Deploy to Vercel

The Vite frontend calls same-origin server routes only:

- `GET /api/public-risk`
- `POST /api/ai-briefing`

Vercel functions in `api/` reuse the same handlers as the local Express server. External Groq and data.go.kr requests run only in those server environments; no API key is included in the browser bundle.

Add these variables in **Vercel Project Settings > Environment Variables**:

```text
DATA_GO_KR_SERVICE_KEY=your_data_go_kr_service_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

`DATA_GO_KR_SERVICE_KEY` and `GROQ_API_KEY` are required for live upstream calls. `GROQ_MODEL` is optional and defaults to `llama-3.1-8b-instant`. Do not create `VITE_GROQ_API_KEY` or any other `VITE_` secret variable, because Vite exposes those values to browser code.

## Quality Checks

```bash
npm run lint
npm run build
```

## Risk Scoring

Each country has non-official MVP base scores from `0` to `100` for political, security, logistics, health, and business risk. Purpose and industry adjust relevant categories, while urgency adds `0`, `5`, or `10` to the overall category average. K-SURE risk data adjusts the business score when a compatible live or archived index is available.

The resulting level is mapped to:

- `Managed`
- `Moderate`
- `High`
- `Critical`

Scores are decision-support indicators, not official government ratings.

## Current Limitations

- Coverage depends on upstream API availability, credentials, and source response quality.
- Some sources may return archived information or no country-specific result.
- MVP fallback signals and country profiles are illustrative, not live official facts.
- Generated briefings use only supplied normalized evidence but still require human review.
- The app does not persist scenarios or provide continuous monitoring.
- Global Bridge does not replace professional legal, security, insurance, medical, tax, or trade advice.

## Roadmap

- Add country and scenario comparison
- Add saved and shareable briefings
- Add downloadable PDF reports
- Add source-level citations inside AI briefing fields
- Add scheduled monitoring and risk-change alerts
- Expand country mappings and regional coverage

## Disclaimer

Global Bridge is an MVP decision-support prototype. Always verify material decisions, travel plans, contracts, counterparties, and compliance obligations against current official sources and qualified professional advice.
