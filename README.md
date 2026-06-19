# Global Bridge

Global Bridge is an AI-powered country risk intelligence tool for small businesses, startups, and professionals preparing for international business, travel, sourcing, or partnerships.

## Problem

Small businesses and independent professionals often need to make international decisions quickly. However, country risk information is scattered across government websites, travel advisories, market reports, news, and logistics updates.

The challenge is not only finding information, but understanding what to do next.

Global Bridge helps users turn country risk information into a clear, practical briefing.

## Target Users

* Small and medium-sized businesses preparing for international trade
* Startups exploring overseas partnerships
* Freelancers and professionals planning business travel
* Import/export teams working with emerging markets

## MVP Scope

Users select:

* Country
* Purpose
* Industry
* Urgency

The app returns:

* Overall risk level
* Risk category scores
* Key risks
* Recommended actions
* Warning signals
* Alternative strategies
* Official information links

## Demo Scenario

A Korean small business wants to import goods from Kenya. Before making a decision, the user checks political, security, logistics, health, and business risks. Global Bridge generates a practical risk briefing and suggests alternative actions.

## Core Features

* Country risk input form
* Purpose-based risk briefing
* Risk category scoring
* Recommended action cards
* Alternative strategy section
* Official source link section

## Tech Stack

* Frontend: React / Next.js or Vite
* Data: Mock JSON risk profiles
* AI Layer: Prompt-based response generation or mock AI response
* Future: RAG, Supabase, PostgreSQL, n8n automation, real-time news monitoring

## Future Expansion

* Real-time news-based risk detection
* Government and public data integration
* RAG-based country document search
* Automated business risk reports
* Alternative supplier or country recommendation
* Slack and Telegram alert integration

## Disclaimer

Global Bridge is a prototype for informational and decision-support purposes. It does not replace official government advisories, legal advice, insurance advice, or professional trade consulting.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
