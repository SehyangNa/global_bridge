export type PublicDataEvidence = {
  source: string
  title: string
  summary: string
  status: 'live' | 'archived' | 'mock'
  lastUpdated: string
}

export type AiBriefingRequest = {
  language: 'ko' | 'en'
  country: string
  purpose: string
  industry: string
  urgency: string
  overallRiskScore: number
  riskLevel: string
  categoryScores: Record<string, number>
  recommendedActions: string[]
  warningSignals: string[]
  alternativeStrategy: string
  publicDataSignals: PublicDataEvidence[]
  failedSources: string[]
}

export type AiBriefing = {
  situationSummary: string
  mainRisks: string[]
  recommendedActions: string[]
  alternativeStrategy: string
  sourceReminder: string
  finalDecisionNote: string
  generationMode: 'ai' | 'fallback'
}

function clientFallback(request: AiBriefingRequest): AiBriefing {
  const isKorean = request.language === 'ko'
  return {
    situationSummary: isKorean
      ? `${request.country}의 ${request.purpose} 목적 리스크는 ${request.riskLevel} 수준이며 종합 점수는 ${request.overallRiskScore}/100입니다. 현재 서버 연결을 사용할 수 없어 기본 브리핑을 표시합니다.`
      : `${request.country} has a ${request.riskLevel} risk level for ${request.purpose}, with an overall score of ${request.overallRiskScore}/100. A template briefing is shown because the server is unavailable.`,
    mainRisks: request.warningSignals.slice(0, 3),
    recommendedActions: request.recommendedActions.slice(0, 3),
    alternativeStrategy: request.alternativeStrategy,
    sourceReminder: isKorean
      ? '이 기본 브리핑은 화면에 제공된 공공데이터 신호만 사용합니다. MVP 모의 신호는 실시간 공식 데이터가 아닙니다.'
      : 'This template uses only the public-data signals shown on screen. MVP mock signals are not live official data.',
    finalDecisionNote: isKorean
      ? '실행 전에 최신 공식 정보를 확인하세요.'
      : 'Verify the latest official information before acting.',
    generationMode: 'fallback',
  }
}

function isBriefing(value: unknown): value is AiBriefing {
  if (!value || typeof value !== 'object') return false
  const briefing = value as Partial<AiBriefing>
  return (
    typeof briefing.situationSummary === 'string' &&
    Array.isArray(briefing.mainRisks) &&
    Array.isArray(briefing.recommendedActions) &&
    typeof briefing.alternativeStrategy === 'string' &&
    typeof briefing.sourceReminder === 'string' &&
    typeof briefing.finalDecisionNote === 'string' &&
    (briefing.generationMode === 'ai' || briefing.generationMode === 'fallback')
  )
}

export async function generateAiBriefing(
  request: AiBriefingRequest,
): Promise<AiBriefing> {
  try {
    const response = await fetch('/api/ai-briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    if (!response.ok) throw new Error(`AI briefing request failed: ${response.status}`)

    const data: unknown = await response.json()
    return isBriefing(data) ? data : clientFallback(request)
  } catch {
    return clientFallback(request)
  }
}
