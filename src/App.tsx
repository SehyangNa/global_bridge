import { useMemo, useState } from 'react'
import './App.css'
import {
  countries,
  industries,
  officialPublicDataLinks,
  purposes,
  riskProfiles,
  urgencies,
} from './data/riskProfiles'
import type { Country, Industry, Purpose, RiskRequest, Urgency } from './types/risk'
import {
  calculateScores,
  categoryLabels,
  categoryOrder,
  riskLevel,
  riskTone,
  urgencyAdjustments,
} from './utils/riskScoring'

type Step = 'landing' | 'input' | 'result'

const purposeRecommendations: Record<Purpose, string> = {
  'Business Trip':
    'Confirm current public safety and travel-alert signals before every trip segment.',
  Import:
    'Cross-check KOTRA trade guidance and exchange-rate movement before confirming landed cost.',
  Export:
    'Validate market-entry rules, buyer documentation, and currency terms before shipment.',
  Investment:
    'Use country information and market-news signals to stage investment through measurable milestones.',
  'Partner Research':
    'Verify counterpart credentials and compare partner claims with official country and market information.',
}

function App() {
  const [step, setStep] = useState<Step>('landing')
  const [request, setRequest] = useState<RiskRequest>({
    country: 'Kenya',
    purpose: 'Business Trip',
    industry: 'General',
    urgency: 'Medium',
  })
  const [briefingGenerated, setBriefingGenerated] = useState(false)
  const [copyStatus, setCopyStatus] = useState('Copy summary')

  const profile = riskProfiles[request.country]
  const result = useMemo(
    () =>
      calculateScores(
        profile.scores,
        request.purpose,
        request.industry,
        request.urgency,
      ),
    [profile.scores, request.purpose, request.industry, request.urgency],
  )
  const level = riskLevel(result.overallScore)
  const tone = riskTone(result.overallScore)
  const publicSignalSummary = profile.publicDataSignals
    .map((signal) => `${signal.source}: ${signal.label} (${signal.level})`)
    .join('; ')

  const summaryText = `${profile.country} public data-powered AI risk briefing for ${request.purpose.toLowerCase()} in ${request.industry.toLowerCase()}: ${level} risk, score ${result.overallScore}/100. ${profile.summary} Purpose-specific recommendation: ${purposeRecommendations[request.purpose]} MVP mock public-data signals: ${publicSignalSummary}. Key actions: ${profile.recommendedActions.join(' ')}`

  function updateRequest<Key extends keyof RiskRequest>(
    key: Key,
    value: RiskRequest[Key],
  ) {
    setRequest((current) => ({ ...current, [key]: value }))
    setBriefingGenerated(false)
    setCopyStatus('Copy summary')
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStep('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(summaryText)
      setCopyStatus('Copied')
      window.setTimeout(() => setCopyStatus('Copy summary'), 1800)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = summaryText
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const copied = document.execCommand('copy')
      textArea.remove()
      setCopyStatus(copied ? 'Copied' : 'Copy failed')
      if (copied) {
        window.setTimeout(() => setCopyStatus('Copy summary'), 1800)
      }
    }
  }

  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <button className="brand" type="button" onClick={() => setStep('landing')}>
          <span className="brand-mark">GB</span>
          <span>Global Bridge</span>
        </button>
        <div className="nav-actions">
          <button className="ghost-button" type="button" onClick={() => setStep('input')}>
            Risk check
          </button>
        </div>
      </nav>

      {step === 'landing' && (
        <section className="landing">
          <div className="hero-copy">
            <span className="eyebrow">Public-data country intelligence</span>
            <h1>Global Bridge</h1>
            <p className="tagline">
              Public data-powered AI country risk intelligence
            </p>
            <p className="intro">
              Compare market, travel, logistics, health, and partner risks before
              entering a new country. Global Bridge turns country signals into a
              practical briefing for small teams that need to move fast without
              missing critical exposure.
            </p>
            <p className="source-intro">
              This MVP is designed around public sources including MOFA safety
              information and travel alerts, KOTRA market news and country
              information, and Korea Eximbank exchange-rate data.
            </p>
            <button className="primary-button" type="button" onClick={() => setStep('input')}>
              Start Risk Check
            </button>
          </div>

          <div className="hero-panel" aria-label="Risk intelligence preview">
            <div className="panel-header">
              <span>Public-data briefing preview</span>
              <span className="status-dot">MVP mock</span>
            </div>
            <div className="score-ring">
              <span>64</span>
              <small>risk score</small>
            </div>
            <div className="mini-grid">
              <div>
                <span>Security</span>
                <strong>High</strong>
              </div>
              <div>
                <span>Logistics</span>
                <strong>Watch</strong>
              </div>
              <div>
                <span>Business</span>
                <strong>Elevated</strong>
              </div>
            </div>
            <div className="signal-list">
              <span>Mock public-data signals</span>
              <p>MOFA travel context, KOTRA market news, FX pressure</p>
            </div>
          </div>
        </section>
      )}

      {step === 'input' && (
        <section className="form-page">
          <div className="section-heading">
            <span className="eyebrow">Risk input</span>
            <h2>Generate a country risk briefing</h2>
            <p>
              Select the country, purpose, industry, and urgency. The MVP uses
              mock public-data signals and transparent scoring adjustments. No
              live API data is fetched.
            </p>
          </div>

          <form className="risk-form" onSubmit={handleSubmit}>
            <label>
              <span>Country</span>
              <select
                value={request.country}
                onChange={(event) =>
                  updateRequest('country', event.target.value as Country)
                }
              >
                {countries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Purpose</span>
              <select
                value={request.purpose}
                onChange={(event) =>
                  updateRequest('purpose', event.target.value as Purpose)
                }
              >
                {purposes.map((purpose) => (
                  <option key={purpose}>{purpose}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Industry</span>
              <select
                value={request.industry}
                onChange={(event) =>
                  updateRequest('industry', event.target.value as Industry)
                }
              >
                {industries.map((industry) => (
                  <option key={industry}>{industry}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Urgency</span>
              <select
                value={request.urgency}
                onChange={(event) =>
                  updateRequest('urgency', event.target.value as Urgency)
                }
              >
                {urgencies.map((urgency) => (
                  <option key={urgency}>{urgency}</option>
                ))}
              </select>
            </label>

            <button className="primary-button form-submit" type="submit">
              Generate Risk Briefing
            </button>
          </form>
        </section>
      )}

      {step === 'result' && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <span className="eyebrow">{profile.region}</span>
              <h2>{profile.country} Risk Briefing</h2>
              <p>
                {request.purpose} · {request.industry} · {request.urgency} urgency
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="ghost-button" type="button" onClick={copySummary}>
                {copyStatus}
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => setBriefingGenerated(true)}
              >
                Generate briefing
              </button>
            </div>
          </div>

          <p className="transparency-note">
            This MVP uses mock public-data signals to demonstrate how official
            public data APIs can support business risk briefings. It does not yet
            fetch live data.
          </p>

          <div className="metric-grid">
            <article className={`metric-card ${tone}`}>
              <span>Overall risk level</span>
              <strong>{level}</strong>
            </article>
            <article className="metric-card">
              <span>Overall score</span>
              <strong>{result.overallScore}/100</strong>
            </article>
            <article className="metric-card">
              <span>Urgency adjustment</span>
              <strong>+{urgencyAdjustments[request.urgency]}</strong>
            </article>
          </div>

          <div className="content-grid">
            <article className="card wide">
              <div className="card-heading">
                <h3>Risk category scores</h3>
                <span className={`badge ${tone}`}>{level}</span>
              </div>
              <div className="score-list">
                {categoryOrder.map((category) => (
                  <div className="score-row" key={category}>
                    <div>
                      <span>{categoryLabels[category]}</span>
                      <strong>{result.categoryScores[category]}</strong>
                    </div>
                    <div className="bar" aria-hidden="true">
                      <span style={{ width: `${result.categoryScores[category]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="card summary-card">
              <h3>Country risk summary</h3>
              <p>{profile.summary}</p>
            </article>

            <article className="card">
              <h3>Key risks</h3>
              <ul>
                {profile.keyRisks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>Recommended actions</h3>
              <ol>
                <li className="purpose-action">
                  <strong>{request.purpose}:</strong>{' '}
                  {purposeRecommendations[request.purpose]}
                </li>
                {profile.recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </article>

            <article className="card">
              <h3>Warning signals</h3>
              <ul>
                {profile.warningSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>Alternative strategy</h3>
              <p>{profile.alternativeStrategy}</p>
            </article>

            <article className="card public-data-card">
              <div className="card-heading public-data-heading">
                <div>
                  <h3>Public Data Signals</h3>
                  <p>Five MVP mock signals structured for future API connections.</p>
                </div>
                <span className="mock-label">Mock data · not live</span>
              </div>
              <div className="public-signal-grid">
                {profile.publicDataSignals.map((signal) => (
                  <section className="public-signal" key={signal.source}>
                    <div className="signal-heading">
                      <span className="signal-source">{signal.source}</span>
                      <span className={`signal-badge ${signal.level}`}>
                        {signal.level}
                      </span>
                    </div>
                    <h4>{signal.label}</h4>
                    <p>{signal.description}</p>
                    <small>Last updated: {signal.lastUpdated}</small>
                  </section>
                ))}
              </div>
            </article>

            <article className="card official-links public-data-links">
              <h3>Official public data sources</h3>
              <p>Reference links for the official sources this MVP is designed to use.</p>
              <div>
                {officialPublicDataLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="card official-links">
              <h3>Additional country links</h3>
              <div>
                {profile.officialLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="card briefing-card">
              <h3>Generated briefing</h3>
              {briefingGenerated ? (
                <p>{summaryText}</p>
              ) : (
                <p>
                  Generate a compact executive briefing that includes the selected
                  context and mock public-data signal summary.
                </p>
              )}
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
