import { useEffect, useMemo, useRef, useState } from 'react'
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
import {
  fetchMofaSafetyInfo,
  type MofaSafetyItem,
} from './services/publicDataApi'
import {
  generateAiBriefing,
  type AiBriefing,
  type PublicDataEvidence,
} from './services/aiBriefingApi'
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
type BriefingState = 'idle' | 'loading' | 'ready'
type MofaDataState = {
  status: 'idle' | 'loading' | 'live' | 'archived' | 'fallback'
  items: MofaSafetyItem[]
}

const demoPresets: Array<{ id: string; request: RiskRequest }> = [
  {
    id: 'kenyaImport',
    request: {
      country: 'Kenya',
      purpose: 'Import',
      industry: 'Food',
      urgency: 'High',
    },
  },
  {
    id: 'nigeriaTrip',
    request: {
      country: 'Nigeria',
      purpose: 'Business Trip',
      industry: 'General',
      urgency: 'High',
    },
  },
  {
    id: 'southAfricaPartner',
    request: {
      country: 'South Africa',
      purpose: 'Partner Research',
      industry: 'General',
      urgency: 'Medium',
    },
  },
]

function App() {
  const [language, setLanguage] = useState<Language>('ko')
  const [step, setStep] = useState<Step>('landing')
  const [request, setRequest] = useState<RiskRequest>({
    country: 'Kenya',
    purpose: 'Business Trip',
    industry: 'General',
    urgency: 'Medium',
  })
  const [briefingState, setBriefingState] = useState<BriefingState>('idle')
  const [aiBriefing, setAiBriefing] = useState<AiBriefing | null>(null)
  const briefingRequestId = useRef(0)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [mofaData, setMofaData] = useState<MofaDataState>({
    status: 'idle',
    items: [],
  })

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
  const mofaItems =
    mofaData.status === 'live' || mofaData.status === 'archived'
      ? mofaData.items.slice(0, 2)
      : []
  const liveMofaItems = mofaData.status === 'live' ? mofaItems : []
  const archivedMofaItems = mofaData.status === 'archived' ? mofaItems : []
  const hasLiveMofa = liveMofaItems.length > 0
  const hasArchivedMofa = archivedMofaItems.length > 0
  const hasMofaData = hasLiveMofa || hasArchivedMofa
  const mockSignalsToDisplay = hasMofaData
    ? localizedSignals.slice(1)
    : localizedSignals
  const mockSignalSummary = mockSignalsToDisplay
    .map(
      (signal) =>
        `${signal.source} [${t.mockData}]: ${signal.label}. ${signal.description} (${t.lastUpdated}: ${signal.lastUpdated})`,
    )
    .join('; ')
  const mofaSignalSummary = mofaItems
    .map(
      (item) =>
        `${language === 'ko' ? '외교부 해외안전정보' : 'MOFA safety information'} [${hasLiveMofa ? t.livePublicData : t.archivedPublicData}]: ${item.title}. ${item.summary} (${t.lastUpdated}: ${item.lastUpdated})`,
    )
    .join('; ')
  const publicSignalSummary = [mofaSignalSummary, mockSignalSummary]
    .filter(Boolean)
    .join('; ')
  const signalSummaryLabel = hasMofaData
    ? language === 'ko'
      ? `${hasLiveMofa ? '실시간' : '과거'} 외교부 안전정보 및 MVP 모의 공공데이터 신호`
      : `${hasLiveMofa ? 'Live' : 'Archived'} MOFA safety information and MVP mock public-data signals`
    : language === 'ko'
      ? 'MVP 모의 공공데이터 신호'
      : 'MVP mock public-data signals'
  const summaryText =
    language === 'ko'
      ? `${labels.country[request.country].ko} 공공데이터 기반 AI 리스크 브리핑 — 목적: ${labels.purpose[request.purpose].ko}, 산업: ${labels.industry[request.industry].ko}, 종합 수준: ${labels.riskLevel[level].ko}, 점수: ${result.overallScore}/100. ${profileSummary} 목적별 권고: ${purposeRecommendations[request.purpose].ko} ${signalSummaryLabel}: ${publicSignalSummary}. 핵심 조치: ${recommendedActions.join(' ')}`
      : `${profile.country} public data-powered AI risk briefing for ${request.purpose.toLowerCase()} in ${request.industry.toLowerCase()}: ${level} risk, score ${result.overallScore}/100. ${profileSummary} Purpose-specific recommendation: ${purposeRecommendations[request.purpose].en} ${signalSummaryLabel}: ${publicSignalSummary}. Key actions: ${recommendedActions.join(' ')}`
  const generatedBriefingText = aiBriefing
    ? [
        `${t.situationSummary}: ${aiBriefing.situationSummary}`,
        `${t.aiMainRisks}: ${aiBriefing.mainRisks.join(' · ')}`,
        `${t.aiRecommendedActions}: ${aiBriefing.recommendedActions.join(' · ')}`,
        `${t.aiAlternativeStrategy}: ${aiBriefing.alternativeStrategy}`,
        `${t.aiSourceReminder}: ${aiBriefing.sourceReminder}`,
        `${t.aiDecisionNote}: ${aiBriefing.finalDecisionNote}`,
        `${t.generationMode}: ${aiBriefing.generationMode === 'ai' ? t.aiGenerated : t.templateFallback}`,
      ].join('\n')
    : summaryText

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    if (step !== 'result') return

    let cancelled = false
    void fetchMofaSafetyInfo(request.country).then((data) => {
      if (cancelled) return
      setMofaData({
        status: data.items.length > 0 ? data.status : 'fallback',
        items: data.items,
      })
    })

    return () => {
      cancelled = true
    }
  }, [request.country, step])

  function changeLanguage(nextLanguage: Language) {
    briefingRequestId.current += 1
    setLanguage(nextLanguage)
    setAiBriefing(null)
    setBriefingState('idle')
    setCopyState('idle')
  }

  function updateRequest<Key extends keyof RiskRequest>(
    key: Key,
    value: RiskRequest[Key],
  ) {
    briefingRequestId.current += 1
    setRequest((current) => ({ ...current, [key]: value }))
    setAiBriefing(null)
    setBriefingState('idle')
    setCopyState('idle')
  }

  function applyPreset(preset: RiskRequest) {
    briefingRequestId.current += 1
    setRequest(preset)
    setAiBriefing(null)
    setBriefingState('idle')
    setCopyState('idle')
    setMofaData({ status: 'idle', items: [] })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMofaData({ status: 'loading', items: [] })
    setStep('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(generatedBriefingText)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      const textArea = document.createElement('textarea')
      const previouslyFocused = document.activeElement
      textArea.value = generatedBriefingText
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

  async function handleGenerateBriefing() {
    const requestId = briefingRequestId.current + 1
    briefingRequestId.current = requestId
    setBriefingState('loading')
    setAiBriefing(null)

    const publicDataSignals: PublicDataEvidence[] = [
      ...mofaItems.map((item) => ({
        source: language === 'ko' ? '외교부 해외안전정보' : 'MOFA safety information',
        title: item.title,
        summary: item.summary,
        status: (hasLiveMofa ? 'live' : 'archived') as 'live' | 'archived',
        lastUpdated: item.lastUpdated,
      })),
      ...mockSignalsToDisplay.map((signal) => ({
        source: signal.source,
        title: signal.label,
        summary: signal.description,
        status: 'mock' as const,
        lastUpdated: signal.lastUpdated,
      })),
    ]

    const briefing = await generateAiBriefing({
      language,
      country: labels.country[request.country][language],
      purpose: labels.purpose[request.purpose][language],
      industry: labels.industry[request.industry][language],
      urgency: labels.urgency[request.urgency][language],
      overallRiskScore: result.overallScore,
      riskLevel: labels.riskLevel[level][language],
      categoryScores: Object.fromEntries(
        categoryOrder.map((category) => [
          labels.category[category][language],
          result.categoryScores[category],
        ]),
      ),
      recommendedActions: [
        purposeRecommendations[request.purpose][language],
        ...recommendedActions,
      ],
      warningSignals,
      alternativeStrategy,
      publicDataSignals,
    })

    if (briefingRequestId.current !== requestId) return
    setAiBriefing(briefing)
    setBriefingState('ready')
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
            <div className="preset-panel">
              <div className="preset-copy">
                <strong>{t.demoPresets}</strong>
                <p>{t.demoPresetsIntro}</p>
              </div>
              <div className="preset-buttons">
                {demoPresets.map((preset) => {
                  const isActive =
                    request.country === preset.request.country &&
                    request.purpose === preset.request.purpose &&
                    request.industry === preset.request.industry &&
                    request.urgency === preset.request.urgency

                  return (
                    <button
                      className={isActive ? 'active' : ''}
                      type="button"
                      key={preset.id}
                      aria-pressed={isActive}
                      onClick={() => applyPreset(preset.request)}
                    >
                      {t.presets[preset.id as keyof typeof t.presets]}
                    </button>
                  )
                })}
              </div>
            </div>

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
              <small>{t.countryHelper}</small>
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
              <small>{t.purposeHelper}</small>
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
              <small>{t.industryHelper}</small>
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
              <small>{t.urgencyHelper}</small>
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
                disabled={briefingState === 'loading'}
                onClick={handleGenerateBriefing}
              >
                {briefingState === 'loading' ? t.generating : t.generate}
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
                  <p>
                    {hasLiveMofa
                      ? t.publicSignalsLiveIntro
                      : hasArchivedMofa
                        ? t.publicSignalsArchivedIntro
                      : t.publicSignalsIntro}
                  </p>
                </div>
                <span
                  className={`mock-label ${hasLiveMofa ? 'live' : hasArchivedMofa ? 'archived' : ''}`}
                >
                  {hasLiveMofa
                    ? t.livePublicData
                    : hasArchivedMofa
                      ? t.archivedPublicData
                      : t.mockData}
                </span>
              </div>
              <div className="data-status-note" aria-live="polite">
                <p>{t.liveAvailabilityNote}</p>
                {mofaData.status === 'loading' && <p>{t.liveLoading}</p>}
                {mofaData.status === 'fallback' && <p>{t.liveFallbackNote}</p>}
              </div>
              <div className="public-signal-grid">
                {mofaItems.map((item) => (
                  <section
                    className={`public-signal ${hasLiveMofa ? 'live-signal' : 'archived-signal'}`}
                    key={`mofa-${item.id || item.title}`}
                  >
                    <div className="signal-heading">
                      <span className="signal-source">
                        {language === 'ko'
                          ? '외교부 해외안전정보'
                          : 'MOFA safety information'}
                      </span>
                      <span
                        className={`signal-badge ${hasLiveMofa ? 'live' : 'archived'}`}
                      >
                        {hasLiveMofa
                          ? t.livePublicData
                          : t.archivedPublicData}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    {item.summary && <p>{item.summary}</p>}
                    <small>
                      {t.originalKorean} · {t.lastUpdated}:{' '}
                      {item.lastUpdated || '—'}
                    </small>
                  </section>
                ))}
                {mockSignalsToDisplay.map((signal) => (
                  <section className="public-signal" key={signal.source}>
                    <div className="signal-heading">
                      <span className="signal-source">{signal.source}</span>
                      <span className="signal-badge mock">
                        {t.mockData}
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
              <div className="briefing-title-row">
                <h3>{t.generated}</h3>
                {aiBriefing && (
                  <span className={`generation-badge ${aiBriefing.generationMode}`}>
                    {aiBriefing.generationMode === 'ai'
                      ? t.aiGenerated
                      : t.templateFallback}
                  </span>
                )}
              </div>
              {briefingState === 'loading' ? (
                <p className="briefing-loading" aria-live="polite">
                  <span aria-hidden="true" />
                  {t.generatingBriefing}
                </p>
              ) : aiBriefing ? (
                <div className="generated-briefing" aria-live="polite">
                  <section className="briefing-summary">
                    <h4>{t.situationSummary}</h4>
                    <p>{aiBriefing.situationSummary}</p>
                  </section>
                  <div className="briefing-columns">
                    <section>
                      <h4>{t.aiMainRisks}</h4>
                      <ul>
                        {aiBriefing.mainRisks.map((risk) => <li key={risk}>{risk}</li>)}
                      </ul>
                    </section>
                    <section>
                      <h4>{t.aiRecommendedActions}</h4>
                      <ol>
                        {aiBriefing.recommendedActions.map((action) => <li key={action}>{action}</li>)}
                      </ol>
                    </section>
                  </div>
                  <section>
                    <h4>{t.aiAlternativeStrategy}</h4>
                    <p>{aiBriefing.alternativeStrategy}</p>
                  </section>
                  <section className="briefing-source-note">
                    <h4>{t.aiSourceReminder}</h4>
                    <p>{aiBriefing.sourceReminder}</p>
                  </section>
                  <section className="briefing-decision-note">
                    <h4>{t.aiDecisionNote}</h4>
                    <p>{aiBriefing.finalDecisionNote}</p>
                  </section>
                </div>
              ) : (
                <p>{t.generatedPlaceholder}</p>
              )}
            </article>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
