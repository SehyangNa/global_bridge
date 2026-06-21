import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  koreanProfiles,
  industryRecommendations,
  labels,
  officialPublicDataLabels,
  purposeRecommendations,
  purposeWarningSignals,
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
  fetchPublicRisk,
  type AggregatedPublicDataSignal,
} from './services/publicDataApi'
import {
  generateAiBriefing,
  type AiBriefing,
  type PublicDataEvidence,
} from './services/aiBriefingApi'
import type { Country, Industry, Purpose, RiskRequest, Urgency } from './types/risk'
import {
  calculateScores,
  applyKsureRiskAdjustment,
  categoryOrder,
  riskLevel,
  riskTone,
  urgencyAdjustments,
} from './utils/riskScoring'

type Step = 'landing' | 'input' | 'result'
type CopyState = 'idle' | 'copied' | 'failed'
type BriefingState = 'idle' | 'loading' | 'ready'
type DataCoverageStatus = 'live' | 'archived' | 'mock' | 'unavailable'
type PublicRiskState = {
  status: 'idle' | 'loading' | 'ready' | 'fallback'
  signals: AggregatedPublicDataSignal[]
  failedSources: string[]
  ksureRiskIndexUsed: boolean
  ksureRiskScore: number | null
}

const countryCodes: Record<Country, string> = {
  Kenya: 'KE',
  Nigeria: 'NG',
  'South Africa': 'ZA',
  Vietnam: 'VN',
  India: 'IN',
  'United Arab Emirates': 'AE',
}

const fallbackCategoryByIndex: AggregatedPublicDataSignal['category'][] = [
  'security', 'travel', 'market', 'business', 'fx',
]

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))]
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
  { id: 'vietnamSupplyChain', request: { country: 'Vietnam', purpose: 'Import', industry: 'Raw Materials', urgency: 'Medium' } },
  { id: 'indiaItPartner', request: { country: 'India', purpose: 'Partner Research', industry: 'IT', urgency: 'Medium' } },
  { id: 'uaeLogistics', request: { country: 'United Arab Emirates', purpose: 'Investment', industry: 'General', urgency: 'Medium' } },
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
  const [isBriefingExpanded, setIsBriefingExpanded] = useState(false)
  const [expandedPublicSignals, setExpandedPublicSignals] = useState<Record<string, boolean>>({})
  const [aiBriefing, setAiBriefing] = useState<AiBriefing | null>(null)
  const briefingRequestId = useRef(0)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [publicRisk, setPublicRisk] = useState<PublicRiskState>({
    status: 'idle',
    signals: [],
    failedSources: [],
    ksureRiskIndexUsed: false,
    ksureRiskScore: null,
  })

  const t = ui[language]

  const profile = riskProfiles[request.country]
  const baseResult = useMemo(
    () =>
      calculateScores(
        profile.scores,
        request.purpose,
        request.industry,
        request.urgency,
      ),
    [profile.scores, request.purpose, request.industry, request.urgency],
  )
  const result = useMemo(
    () => applyKsureRiskAdjustment(baseResult, publicRisk.ksureRiskScore),
    [baseResult, publicRisk.ksureRiskScore],
  )
  const level = riskLevel(result.overallScore)
  const tone = riskTone(result.overallScore)
  const koreanProfile = language === 'ko' ? koreanProfiles[request.country] : null
  const localizedRegion = koreanProfile?.region ?? profile.region
  const localizedSignals = useMemo(
    () =>
      profile.publicDataSignals.map((signal, index) => ({
        ...signal,
        ...(koreanProfile?.signals[index] ?? {}),
      })),
    [koreanProfile, profile.publicDataSignals],
  )
  const localFallbackSignals = useMemo<AggregatedPublicDataSignal[]>(
    () =>
      localizedSignals.map((item, index) => ({
        source: 'MVP fallback',
        sourceType: 'fallback',
        category: item.category ?? fallbackCategoryByIndex[index] ?? 'business',
        titleKo: koreanProfiles[request.country].signals[index]?.label ?? item.label,
        titleEn: profile.publicDataSignals[index]?.label ?? item.label,
        summaryKo:
          koreanProfiles[request.country].signals[index]?.description ?? item.description,
        summaryEn: profile.publicDataSignals[index]?.description ?? item.description,
        level: item.level,
        status: 'mock',
        publishedAt: null,
        url: null,
        rawSourceName: 'Global Bridge MVP fallback',
      })),
    [localizedSignals, profile.publicDataSignals, request.country],
  )
  const displaySignals = publicRisk.signals.length
    ? publicRisk.signals
    : localFallbackSignals
  const hasLiveData = displaySignals.some((item) => item.status === 'live')
  const hasArchivedData = displaySignals.some((item) => item.status === 'archived')
  const signalTitle = (item: AggregatedPublicDataSignal) =>
    language === 'ko' ? item.titleKo : item.titleEn
  const signalDescription = (item: AggregatedPublicDataSignal) =>
    language === 'ko' ? item.summaryKo : item.summaryEn
  const signalKey = (item: AggregatedPublicDataSignal) =>
    `${item.rawSourceName}-${item.category}-${item.titleKo}`
  const cleanedSignalSummary = (item: AggregatedPublicDataSignal) => {
    const cleaned = signalDescription(item)
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&(?:nbsp|amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);?/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const meaningfulCharacters = cleaned.match(/[A-Za-z가-힣]/g)?.length ?? 0
    if (cleaned.length > 0 && meaningfulCharacters >= 12) return cleaned

    const countryName = labels.country[request.country][language]
    const categoryName = labels.category[
      item.category === 'travel' || item.category === 'market' ||
      item.category === 'compliance' || item.category === 'fx' ||
      item.category === 'industryRisk'
        ? 'business'
        : item.category
    ][language]
    return language === 'ko'
      ? `${countryName}와(과) 관련된 ${categoryName} 공공데이터 신호입니다. ${item.source}의 '${signalTitle(item)}' 상세 내용을 확인하고 현재 일정과 목적에 맞게 재확인하세요.`
      : `This is a ${categoryName.toLowerCase()} public-data signal related to ${countryName}. Review '${signalTitle(item)}' at ${item.source} and verify its relevance to your current plan.`
  }
  const baseProfileSummary = koreanProfile?.summary ?? profile.summary
  const liveCountryInfoSignal = displaySignals.find(
    (item) =>
      item.sourceType === 'kotra' &&
      item.category === 'business' &&
      item.status === 'live',
  )
  const highestRiskCategories = [...categoryOrder]
    .sort((a, b) => profile.scores[b] - profile.scores[a])
    .slice(0, 2)
    .map((category) => labels.category[category][language])
    .join(language === 'ko' ? '·' : ' and ')
  const fallbackSignalFocus = uniqueStrings(displaySignals.map(signalTitle))
    .slice(0, 2)
    .join(language === 'ko' ? ', ' : ' and ')
  const contextualFallbackSummary = language === 'ko'
    ? `${baseProfileSummary} ${labels.country[request.country].ko}의 ${labels.purpose[request.purpose].ko} 의사결정에서는 ${labels.industry[request.industry].ko} 산업 특성과 ${highestRiskCategories} 리스크를 우선 검토해야 합니다.${fallbackSignalFocus ? ` 현재 확인할 신호는 ${fallbackSignalFocus}입니다.` : ''} ${labels.urgency[request.urgency].ko} 긴급도에 맞춰 실행하되, 최신 데이터가 부족한 경우 외교부와 KOTRA 출처를 다시 확인하세요.`
    : `${baseProfileSummary} For ${labels.purpose[request.purpose].en.toLowerCase()} decisions in the ${labels.industry[request.industry].en.toLowerCase()} sector, ${highestRiskCategories.toLowerCase()} risks should be reviewed first.${fallbackSignalFocus ? ` Current signals include ${fallbackSignalFocus}.` : ''} Proceed at ${labels.urgency[request.urgency].en.toLowerCase()} urgency, and recheck MOFA and KOTRA sources when recent data is limited.`
  const profileSummary = liveCountryInfoSignal
    ? signalDescription(liveCountryInfoSignal)
    : contextualFallbackSummary
  const baseKeyRisks = koreanProfile?.keyRisks ?? profile.keyRisks
  const baseRecommendedActions =
    koreanProfile?.recommendedActions ?? profile.recommendedActions
  const baseWarningSignals = koreanProfile?.warningSignals ?? profile.warningSignals
  const alternativeStrategy =
    koreanProfile?.alternativeStrategy ?? profile.alternativeStrategy ??
    (language === 'ko'
      ? '제한된 파일럿으로 시작하고 검증 결과에 따라 단계적으로 확대하세요.'
      : 'Begin with a limited pilot and expand in stages after verification.')
  const keyRisks = uniqueStrings([
    ...displaySignals
      .filter((item) => item.level !== 'low' && item.status !== 'mock')
      .map(signalTitle),
    ...baseKeyRisks,
    language === 'ko'
      ? '최신 공식 정보가 부족한 경우 실행 전 출처별 재확인이 필요합니다.'
      : 'When current official information is limited, recheck each source before execution.',
  ]).slice(0, 4)
  const warningSignals = uniqueStrings([
    purposeWarningSignals[request.purpose][language],
    ...displaySignals
      .filter((item) => ['security', 'travel', 'market'].includes(item.category))
      .map(signalTitle),
    ...baseWarningSignals,
    language === 'ko'
      ? '최신 공공데이터 업데이트 부족'
      : 'Limited recent public-data updates',
  ]).slice(0, 4)
  const dataDrivenActions = displaySignals
    .filter((item) => ['compliance', 'industryRisk', 'security', 'travel'].includes(item.category))
    .map((item) =>
      language === 'ko'
        ? `${signalTitle(item)} 신호를 공식 출처에서 재확인하고 실행 조건에 반영하세요.`
        : `Recheck the ${signalTitle(item)} signal at its official source and reflect it in execution terms.`,
    )
  const recommendedActions = uniqueStrings([
    industryRecommendations[request.industry][language],
    ...dataDrivenActions,
    ...baseRecommendedActions,
    language === 'ko'
      ? '실행 전 외교부·KOTRA 공식 출처의 최신 상태를 확인하세요.'
      : 'Confirm the latest MOFA and KOTRA source status before execution.',
  ]).slice(0, 4)
  const publicSignalSummary = displaySignals
    .map(
      (item) =>
        `${item.source} [${item.status}]: ${signalTitle(item)}. ${signalDescription(item)} (${t.lastUpdated}: ${item.publishedAt ?? '—'})`,
    )
    .join('; ')
  const signalSummaryLabel = language === 'ko'
    ? '정규화된 공공데이터 및 MVP 보완 신호'
    : 'Normalized public data and MVP supplementary signals'
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
    const requestId = briefingRequestId.current + 1
    briefingRequestId.current = requestId

    void fetchPublicRisk({
      country: request.country,
      countryCode: countryCodes[request.country],
      purpose: request.purpose,
      industry: request.industry,
      language,
    }).then(async (data) => {
      const activeSignals = data.ok && data.signals.length
        ? data.signals
        : localFallbackSignals
      const publicDataSignals: PublicDataEvidence[] = activeSignals.map((item) => ({
        source: item.source,
        title: language === 'ko' ? item.titleKo : item.titleEn,
        summary: language === 'ko' ? item.summaryKo : item.summaryEn,
        status: item.status,
        lastUpdated: item.publishedAt ?? '—',
      }))
      const adjustedResult = applyKsureRiskAdjustment(
        baseResult,
        data.ksureRiskScore,
      )
      const adjustedLevel = riskLevel(adjustedResult.overallScore)

      if (cancelled) return
      setPublicRisk({
        status: data.ok ? 'ready' : 'fallback',
        signals: activeSignals,
        failedSources: data.failedSources,
        ksureRiskIndexUsed: data.ksureRiskIndexUsed,
        ksureRiskScore: data.ksureRiskScore,
      })

      const briefing = await generateAiBriefing({
        language,
        countryKey: request.country,
        localizedCountryName: labels.country[request.country][language],
        countryCode: countryCodes[request.country],
        region: localizedRegion,
        purpose: labels.purpose[request.purpose][language],
        industry: labels.industry[request.industry][language],
        urgency: labels.urgency[request.urgency][language],
        overallRiskScore: adjustedResult.overallScore,
        riskLevel: labels.riskLevel[adjustedLevel][language],
        categoryScores: Object.fromEntries(
          categoryOrder.map((category) => [
            labels.category[category][language],
            adjustedResult.categoryScores[category],
          ]),
        ),
        recommendedActions: [
          purposeRecommendations[request.purpose][language],
          industryRecommendations[request.industry][language],
          ...baseRecommendedActions,
        ],
        warningSignals: [
          purposeWarningSignals[request.purpose][language],
          ...baseWarningSignals,
        ],
        alternativeStrategy,
        publicDataSignals,
        failedSources: data.failedSources,
      })

      if (cancelled || briefingRequestId.current !== requestId) return
      setAiBriefing(briefing)
      setBriefingState('ready')
    })

    return () => {
      cancelled = true
    }
  }, [
    alternativeStrategy,
    baseRecommendedActions,
    baseResult,
    baseWarningSignals,
    language,
    localizedRegion,
    localFallbackSignals,
    request.country,
    request.industry,
    request.purpose,
    request.urgency,
    step,
  ])

  function changeLanguage(nextLanguage: Language) {
    briefingRequestId.current += 1
    setLanguage(nextLanguage)
    setAiBriefing(null)
    setBriefingState(step === 'result' ? 'loading' : 'idle')
    setCopyState('idle')
    setIsBriefingExpanded(false)
    setExpandedPublicSignals({})
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
    setIsBriefingExpanded(false)
    setExpandedPublicSignals({})
  }

  function applyPreset(preset: RiskRequest) {
    briefingRequestId.current += 1
    setRequest(preset)
    setAiBriefing(null)
    setBriefingState('idle')
    setCopyState('idle')
    setIsBriefingExpanded(false)
    setExpandedPublicSignals({})
    setPublicRisk({
      status: 'idle', signals: [], failedSources: [],
      ksureRiskIndexUsed: false, ksureRiskScore: null,
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsBriefingExpanded(false)
    setExpandedPublicSignals({})
    setPublicRisk({
      status: 'loading', signals: [], failedSources: [],
      ksureRiskIndexUsed: false, ksureRiskScore: null,
    })
    setAiBriefing(null)
    setBriefingState('loading')
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
    setIsBriefingExpanded(false)
    setAiBriefing(null)

    const publicDataSignals: PublicDataEvidence[] = displaySignals.map((item) => ({
      source: item.source,
      title: signalTitle(item),
      summary: signalDescription(item),
      status: item.status,
      lastUpdated: item.publishedAt ?? '—',
    }))

    const briefing = await generateAiBriefing({
      language,
      countryKey: request.country,
      localizedCountryName: labels.country[request.country][language],
      countryCode: countryCodes[request.country],
      region: localizedRegion,
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
      failedSources: publicRisk.failedSources,
    })

    if (briefingRequestId.current !== requestId) return
    setAiBriefing(briefing)
    setBriefingState('ready')
  }

  const coverageFor = (
    directSignals: AggregatedPublicDataSignal[],
    hasMockFallback: boolean,
  ): DataCoverageStatus => {
    if (directSignals.some((item) => item.status === 'live')) return 'live'
    if (directSignals.some((item) => item.status === 'archived')) return 'archived'
    if (directSignals.some((item) => item.status === 'mock') || hasMockFallback) return 'mock'
    return 'unavailable'
  }
  const fallbackSignals = displaySignals.filter((item) => item.status === 'mock')
  const mofaSignals = displaySignals.filter((item) => item.sourceType === 'mofa')
  const kotraSignals = displaySignals.filter((item) => item.sourceType === 'kotra')
  const ksureSignals = displaySignals.filter((item) => item.sourceType === 'ksure')
  const koreaEximSignals = displaySignals.filter((item) => item.sourceType === 'kexim')
  const mofaSafetyCoverage = coverageFor(
    mofaSignals.filter((item) => item.category === 'security'),
    fallbackSignals.some((item) => item.category === 'security'),
  )
  const mofaTravelCoverage = coverageFor(
    mofaSignals.filter((item) => item.category === 'travel'),
    fallbackSignals.some((item) => item.category === 'travel'),
  )
  const kotraCoverage = coverageFor(
    kotraSignals,
    fallbackSignals.some((item) => ['market', 'business', 'compliance'].includes(item.category)),
  )
  const ksureCoverage = coverageFor(
    ksureSignals,
    fallbackSignals.some((item) => item.category === 'industryRisk'),
  )
  const koreaEximCoverage = coverageFor(
    koreaEximSignals,
    fallbackSignals.some((item) => item.category === 'fx'),
  )
  const groqCoverage: DataCoverageStatus = aiBriefing?.generationMode === 'ai'
    ? 'live'
    : aiBriefing?.generationMode === 'fallback'
      ? 'mock'
      : 'unavailable'
  const coverageLabel = (status: DataCoverageStatus) => ({
    live: t.coverageLive,
    archived: t.coverageArchived,
    mock: t.coverageMock,
    unavailable: t.coverageUnavailable,
  })[status]
  const coverageItems = [
    { id: 'mofa-safety', label: language === 'ko' ? '외교부 해외안전정보' : 'MOFA safety info', status: mofaSafetyCoverage },
    { id: 'mofa-travel', label: language === 'ko' ? '외교부 여행경보' : 'MOFA travel alert', status: mofaTravelCoverage },
    { id: 'kotra', label: 'KOTRA', status: kotraCoverage },
    { id: 'ksure', label: language === 'ko' ? '한국무역보험공사' : 'K-SURE risk index', status: ksureCoverage },
    { id: 'korea-exim', label: language === 'ko' ? '한국수출입은행 환율' : 'Korea Eximbank FX', status: koreaEximCoverage },
    { id: 'groq', label: 'Groq AI', status: groqCoverage },
  ]
  const hasLimitedCoverage = coverageItems.some((item) =>
    ['archived', 'mock', 'unavailable'].includes(item.status),
  )

  const signalGroups = [
    {
      id: 'mofa',
      label: language === 'ko' ? '외교부' : 'MOFA',
      signals: mofaSignals,
      status: coverageFor(
        mofaSignals,
        fallbackSignals.some((item) => ['security', 'travel'].includes(item.category)),
      ),
    },
    {
      id: 'kotra',
      label: 'KOTRA',
      signals: kotraSignals,
      status: kotraCoverage,
    },
    {
      id: 'ksure',
      label: language === 'ko' ? '한국무역보험공사' : 'K-SURE',
      signals: ksureSignals,
      status: ksureCoverage,
    },
    {
      id: 'korea-exim',
      label: language === 'ko' ? '한국수출입은행 환율' : 'Korea Eximbank FX',
      signals: koreaEximSignals,
      status: koreaEximCoverage,
    },
    {
      id: 'fallback',
      label: language === 'ko' ? 'MVP 모의 데이터' : 'Fallback / MVP mock data',
      signals: displaySignals.filter((item) => item.sourceType === 'fallback'),
      status: coverageFor(
        displaySignals.filter((item) => item.sourceType === 'fallback'),
        fallbackSignals.length > 0,
      ),
    },
  ]

  const briefingCard = (
    <article className="card briefing-card featured-briefing">
      <div className="briefing-title-row">
        <div>
          <span className="briefing-eyebrow">{t.primaryOutput}</span>
          <h3>{t.generated}</h3>
        </div>
        <div className="briefing-badges">
          {aiBriefing?.generationMode === 'ai' && (
            <span className="generation-badge">Groq AI</span>
          )}
          <span
            className={`generation-badge data-mode ${hasLiveData ? 'live' : hasArchivedData ? 'archived' : 'mock'}`}
          >
            {hasLiveData
              ? t.livePublicData
              : hasArchivedData
                ? t.archivedPublicData
                : t.mockData}
          </span>
          {aiBriefing?.generationMode === 'fallback' && (
            <span className="generation-badge fallback">{t.templateFallback}</span>
          )}
        </div>
      </div>
      {aiBriefing && (aiBriefing.generationMode === 'fallback' || displaySignals.some((item) => item.status === 'mock')) && (
        <p className="ai-data-disclosure">{t.aiFallbackDisclosure}</p>
      )}
      {briefingState === 'loading' ? (
        <p className="briefing-loading" aria-live="polite">
          <span aria-hidden="true" />
          {t.generatingBriefing}
        </p>
      ) : aiBriefing ? (
        <div
          className={`generated-briefing ${isBriefingExpanded ? 'expanded' : 'collapsed'}`}
          id="ai-briefing-details"
          aria-live="polite"
        >
          {isBriefingExpanded ? (
            <>
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
            </>
          ) : (
            <div className="briefing-compact-summary">
              <section className="briefing-summary">
                <h4>{t.situationSummary}</h4>
                <p>{aiBriefing.situationSummary}</p>
              </section>
              {aiBriefing.finalDecisionNote && (
                <section className="briefing-decision-note">
                  <h4>{t.aiDecisionNote}</h4>
                  <p>{aiBriefing.finalDecisionNote}</p>
                </section>
              )}
            </div>
          )}
          <button
            className="briefing-toggle"
            type="button"
            aria-expanded={isBriefingExpanded}
            aria-controls="ai-briefing-details"
            onClick={() => setIsBriefingExpanded((expanded) => !expanded)}
          >
            {isBriefingExpanded ? t.collapseBriefing : t.expandBriefing}
          </button>
        </div>
      ) : (
        <p>{t.generatedPlaceholder}</p>
      )}
    </article>
  )

  const publicDataCard = (
    <article className="card public-data-card">
      <div className="card-heading public-data-heading">
        <div>
          <h3>{t.publicSignals}</h3>
          <p>
            {hasLiveData
              ? t.publicSignalsLiveIntro
              : hasArchivedData
                ? t.publicSignalsArchivedIntro
                : t.publicSignalsIntro}
          </p>
        </div>
        <span
          className={`mock-label ${hasLiveData ? 'live' : hasArchivedData ? 'archived' : ''}`}
        >
          {hasLiveData
            ? t.livePublicData
            : hasArchivedData
              ? t.archivedPublicData
              : t.mockData}
        </span>
      </div>
      <div className="data-status-note" aria-live="polite">
        <p>{t.liveAvailabilityNote}</p>
        {hasLimitedCoverage && <p className="limited-data-disclosure">{t.limitedDataDisclosure}</p>}
        {publicRisk.status === 'loading' && <p>{t.aggregateLoading}</p>}
        {publicRisk.status === 'fallback' && <p>{t.aggregateFallbackNote}</p>}
        {publicRisk.failedSources.length > 0 && (
          <p>{t.failedSources}: {publicRisk.failedSources.join(', ')}</p>
        )}
      </div>
      <div className="public-signal-groups">
        {signalGroups.map((group) => (
          <section className="signal-group" key={group.id}>
            <h4>{group.label}</h4>
            <div className="public-signal-grid">
              {group.signals.length === 0 ? (
                <div className="signal-group-empty">
                  <span className={`coverage-status ${group.status}`}>
                    {coverageLabel(group.status)}
                  </span>
                  <p>{t.sourceFallbackNote}</p>
                </div>
              ) : group.signals.map((item) => {
                const itemKey = signalKey(item)
                const isExpanded = Boolean(expandedPublicSignals[itemKey])
                const fullSummary = cleanedSignalSummary(item)
                const previewLimit = language === 'ko' ? 90 : 180
                const canExpand = fullSummary.length > previewLimit
                const displayedSummary = isExpanded || !canExpand
                  ? fullSummary
                  : `${fullSummary.slice(0, previewLimit).trimEnd()}…`
                return (
                  <article
                    className={`public-signal ${isExpanded ? 'expanded' : 'collapsed'} ${item.status === 'live' ? 'live-signal' : item.status === 'archived' ? 'archived-signal' : ''}`}
                    key={itemKey}
                  >
                    <div className="signal-heading">
                      <span className="signal-source">{item.source}</span>
                      <span className={`signal-badge ${item.status}`}>
                        {item.status === 'live'
                          ? t.livePublicData
                          : item.status === 'archived'
                            ? t.archivedPublicData
                            : t.mockData}
                      </span>
                    </div>
                    <h4>{signalTitle(item)}</h4>
                    <p className="signal-summary">{displayedSummary}</p>
                    <div className="signal-meta">
                      <span className={`signal-level ${item.level}`}>
                        {labels.signalLevel[item.level][language]}
                      </span>
                      <small>{t.lastUpdated}: {item.publishedAt ?? '—'}</small>
                    </div>
                    {(item.url || canExpand) && (
                      <div className="signal-card-actions">
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {t.officialSourceLink}
                          </a>
                        )}
                        {canExpand && (
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => setExpandedPublicSignals((current) => ({
                              ...current,
                              [itemKey]: !current[itemKey],
                            }))}
                          >
                            {isExpanded ? t.showLess : t.showMore}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  )

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
              <span className="panel-title">
                <span className="panel-mark" aria-hidden="true">GB</span>
                {t.preview}
              </span>
              <span className="status-dot">{t.mock}</span>
            </div>
            <div className="preview-score-block">
              <div className="score-ring">
                <span>64</span>
                <small>{t.riskScore}</small>
              </div>
              <div className="preview-score-copy">
                <span>{t.preview}</span>
                <strong>64 / 100</strong>
                <p>{t.previewSignals}</p>
              </div>
            </div>
            <div className="mini-grid">
              <div>
                <span><i className="indicator-dot high" aria-hidden="true" />{t.security}</span>
                <strong>{t.high}</strong>
              </div>
              <div>
                <span><i className="indicator-dot watch" aria-hidden="true" />{t.logistics}</span>
                <strong>{t.watch}</strong>
              </div>
              <div>
                <span><i className="indicator-dot elevated" aria-hidden="true" />{t.business}</span>
                <strong>{t.elevated}</strong>
              </div>
            </div>
            <div className="signal-list">
              <span className="signal-list-heading">
                <span>{t.mockSignals}</span>
                <i aria-hidden="true" />
              </span>
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
                <span className="eyebrow">{localizedRegion}</span>
                <h2>
                  {labels.country[request.country][language]} {t.riskDashboard}
                </h2>
                <p>
                  {labels.purpose[request.purpose][language]} ·{' '}
                  {labels.industry[request.industry][language]} ·{' '}
                  {labels.urgency[request.urgency][language]} {t.urgencySuffix}
                </p>
              </div>
              <div className="dashboard-header-tools">
                <span
                  className={`mock-label ${hasLiveData ? 'live' : hasArchivedData ? 'archived' : ''}`}
                >
                  {hasLiveData
                    ? t.livePublicData
                    : hasArchivedData
                      ? t.archivedPublicData
                      : t.mockData}
                </span>
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
          </div>

          {briefingCard}

          <div className="risk-dashboard-shell">
            <section className="data-coverage-card" aria-label={t.dataCoverage}>
              <div className="coverage-heading">
                <span>{t.dataCoverage}</span>
                {hasLimitedCoverage && <small>{t.limitedDataDisclosure}</small>}
              </div>
              <div className="coverage-items">
                {coverageItems.map((item) => (
                  <div key={item.id}>
                    <span>{item.label}</span>
                    <strong className={`coverage-status ${item.status}`}>
                      {coverageLabel(item.status)}
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <article className={`card risk-snapshot-card ${tone}`}>
              <div className="card-heading">
                <div>
                  <span className="dashboard-card-kicker">{t.overallScore}</span>
                  <h3>{t.overallSnapshot}</h3>
                </div>
                <span className={`badge ${tone}`}>
                  {labels.riskLevel[level][language]}
                </span>
              </div>
              <div className="snapshot-main">
                <div
                  className="snapshot-score-ring"
                  style={{
                    background: `radial-gradient(circle at center, #123c69 59%, transparent 60%), conic-gradient(#f59e0b 0 ${result.overallScore}%, rgba(255, 255, 255, 0.16) ${result.overallScore}% 100%)`,
                  }}
                >
                  <strong>{result.overallScore}</strong>
                  <span>{t.riskScore}</span>
                </div>
                <div className="snapshot-meta">
                  <span>{t.overallLevel}</span>
                  <strong>{labels.riskLevel[level][language]}</strong>
                  <small>{t.urgencyAdjustment} +{urgencyAdjustments[request.urgency]}</small>
                  <div className="snapshot-summary">
                    <strong>{t.countrySummary}</strong>
                    <p>{profileSummary}</p>
                  </div>
                </div>
              </div>
              <div className="snapshot-indicators">
                {(['security', 'logistics', 'business'] as const).map((category) => (
                  <div key={category}>
                    <span>{labels.category[category][language]}</span>
                    <strong>{result.categoryScores[category]}</strong>
                    <div className="snapshot-bar" aria-hidden="true">
                      <span style={{ width: `${result.categoryScores[category]}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className={`risk-index-note ${publicRisk.ksureRiskIndexUsed ? 'used' : 'fallback'}`}>
                {publicRisk.ksureRiskIndexUsed ? t.ksureApplied : t.ksureFallback}
              </p>
            </article>

            <div className="dashboard-middle-grid">
            <article className="card category-dashboard-card">
              <div className="card-heading">
                <h3>{t.categoryScores}</h3>
                <span className={`badge ${tone}`}>{labels.riskLevel[level][language]}</span>
              </div>
              <div className="score-list compact-score-list">
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

            <article className="card action-dashboard-card">
              <span className="dashboard-card-kicker">{labels.purpose[request.purpose][language]}</span>
              <h3>{t.nowActions}</h3>
              <ol className="action-list">
                {uniqueStrings([
                  purposeRecommendations[request.purpose][language],
                  ...recommendedActions,
                ]).slice(0, 3).map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </article>

            <article className="card strategy-dashboard-card">
              <span className="dashboard-card-kicker">{t.keyRisks}</span>
              <h3>{t.alternative}</h3>
              <p>{alternativeStrategy}</p>
              <ul className="key-risk-compact">
                {keyRisks.slice(0, 2).map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
              <div className="warning-signal-list">
                <strong>{t.warningSignals}</strong>
                <ul>
                  {warningSignals.slice(0, 3).map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            </article>
            </div>
          </div>

          <div className="dashboard-public-section">{publicDataCard}</div>

          <footer className="source-transparency-footer">
            <div className="source-link-groups">
              <section className="official-links public-data-links">
                <h3>{t.officialSources}</h3>
                <p>{t.officialSourcesIntro}</p>
                <div>
                  {officialPublicDataLinks.map((link, index) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                      {officialPublicDataLabels[language][index]}
                    </a>
                  ))}
                </div>
              </section>
              <section className="official-links">
                <h3>{t.additionalLinks}</h3>
                <div>
                  {profile.officialLinks.map((link, index) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                      {koreanProfile?.officialLinkLabels[index] ?? link.label}
                    </a>
                  ))}
                </div>
              </section>
            </div>
            <div className="transparency-footer-notes">
              <p className="transparency-note">{t.transparency}</p>
              <p>{t.scopeNote}</p>
            </div>
          </footer>
        </section>
      )}
    </main>
  )
}

export default App
