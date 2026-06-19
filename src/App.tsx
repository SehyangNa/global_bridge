import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  koreanProfiles,
  labels,
  officialPublicDataLabels,
  purposeRecommendations,
  ui,
} from './data/localization'
import type { Language } from './data/localization'
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
  categoryOrder,
  riskLevel,
  riskTone,
  urgencyAdjustments,
} from './utils/riskScoring'

type Step = 'landing' | 'input' | 'result'
type CopyState = 'idle' | 'copied' | 'failed'

function App() {
  const [language, setLanguage] = useState<Language>('ko')
  const [step, setStep] = useState<Step>('landing')
  const [request, setRequest] = useState<RiskRequest>({
    country: 'Kenya',
    purpose: 'Business Trip',
    industry: 'General',
    urgency: 'Medium',
  })
  const [briefingGenerated, setBriefingGenerated] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const t = ui[language]

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
  const koreanProfile = language === 'ko' ? koreanProfiles[request.country] : null
  const localizedSignals = profile.publicDataSignals.map((signal, index) => ({
    ...signal,
    ...(koreanProfile?.signals[index] ?? {}),
  }))
  const profileSummary = koreanProfile?.summary ?? profile.summary
  const keyRisks = koreanProfile?.keyRisks ?? profile.keyRisks
  const recommendedActions =
    koreanProfile?.recommendedActions ?? profile.recommendedActions
  const warningSignals = koreanProfile?.warningSignals ?? profile.warningSignals
  const alternativeStrategy =
    koreanProfile?.alternativeStrategy ?? profile.alternativeStrategy
  const publicSignalSummary = localizedSignals
    .map(
      (signal) =>
        `${signal.source}: ${signal.label} (${labels.signalLevel[signal.level][language]})`,
    )
    .join('; ')
  const summaryText =
    language === 'ko'
      ? `${labels.country[request.country].ko} 공공데이터 기반 AI 리스크 브리핑 — 목적: ${labels.purpose[request.purpose].ko}, 산업: ${labels.industry[request.industry].ko}, 종합 수준: ${labels.riskLevel[level].ko}, 점수: ${result.overallScore}/100. ${profileSummary} 목적별 권고: ${purposeRecommendations[request.purpose].ko} MVP 모의 공공데이터 신호: ${publicSignalSummary}. 핵심 조치: ${recommendedActions.join(' ')}`
      : `${profile.country} public data-powered AI risk briefing for ${request.purpose.toLowerCase()} in ${request.industry.toLowerCase()}: ${level} risk, score ${result.overallScore}/100. ${profileSummary} Purpose-specific recommendation: ${purposeRecommendations[request.purpose].en} MVP mock public-data signals: ${publicSignalSummary}. Key actions: ${recommendedActions.join(' ')}`

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    setCopyState('idle')
  }

  function updateRequest<Key extends keyof RiskRequest>(
    key: Key,
    value: RiskRequest[Key],
  ) {
    setRequest((current) => ({ ...current, [key]: value }))
    setBriefingGenerated(false)
    setCopyState('idle')
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
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      const textArea = document.createElement('textarea')
      const previouslyFocused = document.activeElement
      textArea.value = summaryText
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '0'
      textArea.setAttribute('readonly', '')
      textArea.setAttribute('aria-hidden', 'true')
      document.body.appendChild(textArea)
      textArea.focus({ preventScroll: true })
      textArea.select()
      textArea.setSelectionRange(0, textArea.value.length)
      const copied = (() => {
        try {
          return document.execCommand('copy')
        } catch {
          return false
        }
      })()
      textArea.remove()
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true })
      }
      setCopyState(copied ? 'copied' : 'failed')
      if (copied) {
        window.setTimeout(() => setCopyState('idle'), 1800)
      }
    }
  }

  return (
    <main>
      <nav className="topbar" aria-label={t.primaryNav}>
        <button className="brand" type="button" onClick={() => setStep('landing')}>
          <span className="brand-mark">GB</span>
          <span>Global Bridge</span>
        </button>
        <div className="nav-actions">
          <div className="language-toggle" aria-label="Language / 언어">
            <button
              className={language === 'ko' ? 'active' : ''}
              type="button"
              aria-pressed={language === 'ko'}
              onClick={() => changeLanguage('ko')}
            >
              한국어
            </button>
            <button
              className={language === 'en' ? 'active' : ''}
              type="button"
              aria-pressed={language === 'en'}
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
          </div>
          <button className="ghost-button" type="button" onClick={() => setStep('input')}>
            {t.riskCheck}
          </button>
        </div>
      </nav>

      {step === 'landing' && (
        <section className="landing">
          <div className="hero-copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>Global Bridge</h1>
            <p className="tagline">
              {t.tagline}
            </p>
            <p className="intro">
              {t.intro}
            </p>
            <p className="source-intro">
              {t.sourceIntro}
            </p>
            <button className="primary-button" type="button" onClick={() => setStep('input')}>
              {t.start}
            </button>
          </div>

          <div className="hero-panel" aria-label={t.preview}>
            <div className="panel-header">
              <span>{t.preview}</span>
              <span className="status-dot">{t.mock}</span>
            </div>
            <div className="score-ring">
              <span>64</span>
              <small>{t.riskScore}</small>
            </div>
            <div className="mini-grid">
              <div>
                <span>{t.security}</span>
                <strong>{t.high}</strong>
              </div>
              <div>
                <span>{t.logistics}</span>
                <strong>{t.watch}</strong>
              </div>
              <div>
                <span>{t.business}</span>
                <strong>{t.elevated}</strong>
              </div>
            </div>
            <div className="signal-list">
              <span>{t.mockSignals}</span>
              <p>{t.previewSignals}</p>
            </div>
          </div>
        </section>
      )}

      {step === 'input' && (
        <section className="form-page">
          <div className="section-heading">
            <span className="eyebrow">{t.riskInput}</span>
            <h2>{t.formTitle}</h2>
            <p>{t.formIntro}</p>
          </div>

          <form className="risk-form" onSubmit={handleSubmit}>
            <label>
              <span>{t.country}</span>
              <select
                value={request.country}
                onChange={(event) =>
                  updateRequest('country', event.target.value as Country)
                }
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {labels.country[country][language]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>{t.purpose}</span>
              <select
                value={request.purpose}
                onChange={(event) =>
                  updateRequest('purpose', event.target.value as Purpose)
                }
              >
                {purposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {labels.purpose[purpose][language]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>{t.industry}</span>
              <select
                value={request.industry}
                onChange={(event) =>
                  updateRequest('industry', event.target.value as Industry)
                }
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {labels.industry[industry][language]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>{t.urgency}</span>
              <select
                value={request.urgency}
                onChange={(event) =>
                  updateRequest('urgency', event.target.value as Urgency)
                }
              >
                {urgencies.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {labels.urgency[urgency][language]}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-button form-submit" type="submit">
              {t.generateRisk}
            </button>
          </form>
        </section>
      )}

      {step === 'result' && (
        <section className="dashboard">
          <div className="dashboard-header">
            <div>
              <span className="eyebrow">{koreanProfile?.region ?? profile.region}</span>
              <h2>
                {labels.country[request.country][language]} {t.briefingSuffix}
              </h2>
              <p>
                {labels.purpose[request.purpose][language]} ·{' '}
                {labels.industry[request.industry][language]} ·{' '}
                {labels.urgency[request.urgency][language]} {t.urgencySuffix}
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="ghost-button" type="button" onClick={copySummary}>
                {copyState === 'copied'
                  ? t.copied
                  : copyState === 'failed'
                    ? t.copyFailed
                    : t.copy}
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => setBriefingGenerated(true)}
              >
                {t.generate}
              </button>
            </div>
          </div>

          <p className="transparency-note">
            {t.transparency}
          </p>

          <div className="metric-grid">
            <article className={`metric-card ${tone}`}>
              <span>{t.overallLevel}</span>
              <strong>{labels.riskLevel[level][language]}</strong>
            </article>
            <article className="metric-card">
              <span>{t.overallScore}</span>
              <strong>{result.overallScore}/100</strong>
            </article>
            <article className="metric-card">
              <span>{t.urgencyAdjustment}</span>
              <strong>+{urgencyAdjustments[request.urgency]}</strong>
            </article>
          </div>

          <div className="content-grid">
            <article className="card wide">
              <div className="card-heading">
                <h3>{t.categoryScores}</h3>
                <span className={`badge ${tone}`}>
                  {labels.riskLevel[level][language]}
                </span>
              </div>
              <div className="score-list">
                {categoryOrder.map((category) => (
                  <div className="score-row" key={category}>
                    <div>
                      <span>{labels.category[category][language]}</span>
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
              <h3>{t.countrySummary}</h3>
              <p>{profileSummary}</p>
            </article>

            <article className="card">
              <h3>{t.keyRisks}</h3>
              <ul>
                {keyRisks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>{t.recommended}</h3>
              <ol>
                <li className="purpose-action">
                  <strong>{labels.purpose[request.purpose][language]}:</strong>{' '}
                  {purposeRecommendations[request.purpose][language]}
                </li>
                {recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </article>

            <article className="card">
              <h3>{t.warningSignals}</h3>
              <ul>
                {warningSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h3>{t.alternative}</h3>
              <p>{alternativeStrategy}</p>
            </article>

            <article className="card public-data-card">
              <div className="card-heading public-data-heading">
                <div>
                  <h3>{t.publicSignals}</h3>
                  <p>{t.publicSignalsIntro}</p>
                </div>
                <span className="mock-label">{t.notLive}</span>
              </div>
              <div className="public-signal-grid">
                {localizedSignals.map((signal) => (
                  <section className="public-signal" key={signal.source}>
                    <div className="signal-heading">
                      <span className="signal-source">{signal.source}</span>
                      <span className={`signal-badge ${signal.level}`}>
                        {labels.signalLevel[signal.level][language]}
                      </span>
                    </div>
                    <h4>{signal.label}</h4>
                    <p>{signal.description}</p>
                    <small>{t.lastUpdated}: {signal.lastUpdated}</small>
                  </section>
                ))}
              </div>
            </article>

            <article className="card official-links public-data-links">
              <h3>{t.officialSources}</h3>
              <p>{t.officialSourcesIntro}</p>
              <div>
                {officialPublicDataLinks.map((link, index) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {officialPublicDataLabels[language][index]}
                  </a>
                ))}
              </div>
            </article>

            <article className="card official-links">
              <h3>{t.additionalLinks}</h3>
              <div>
                {profile.officialLinks.map((link, index) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {koreanProfile?.officialLinkLabels[index] ?? link.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="card briefing-card">
              <h3>{t.generated}</h3>
              {briefingGenerated ? (
                <p>{summaryText}</p>
              ) : (
                <p>
                  {t.generatedPlaceholder}
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
