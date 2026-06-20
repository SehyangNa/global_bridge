const briefingSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    situationSummary: { type: 'string' },
    mainRisks: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 5,
    },
    recommendedActions: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 5,
    },
    alternativeStrategy: { type: 'string' },
    sourceReminder: { type: 'string' },
    finalDecisionNote: { type: 'string' },
    generationMode: { type: 'string', enum: ['ai'] },
  },
  required: [
    'situationSummary',
    'mainRisks',
    'recommendedActions',
    'alternativeStrategy',
    'sourceReminder',
    'finalDecisionNote',
    'generationMode',
  ],
}

function text(value, maxLength = 600) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function stringList(value, maxItems = 8, maxLength = 500) {
  if (!Array.isArray(value)) return []
  return value.slice(0, maxItems).map((item) => text(item, maxLength)).filter(Boolean)
}

function number(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback
}

export function normalizeBriefingInput(body = {}) {
  const rawScores = body.categoryScores && typeof body.categoryScores === 'object'
    ? body.categoryScores
    : {}
  const categoryScores = Object.fromEntries(
    Object.entries(rawScores)
      .slice(0, 10)
      .map(([key, value]) => [text(key, 40), number(value)]),
  )
  const publicDataSignals = Array.isArray(body.publicDataSignals)
    ? body.publicDataSignals.slice(0, 10).map((signal) => ({
        source: text(signal?.source, 120),
        title: text(signal?.title, 240),
        summary: text(signal?.summary, 600),
        status: ['live', 'archived', 'mock'].includes(signal?.status)
          ? signal.status
          : 'mock',
        lastUpdated: text(signal?.lastUpdated, 80),
      }))
    : []

  return {
    language: body.language === 'en' ? 'en' : 'ko',
    countryKey: text(body.countryKey, 100),
    localizedCountryName: text(body.localizedCountryName, 100),
    countryCode: text(body.countryCode, 10),
    region: text(body.region, 100),
    purpose: text(body.purpose, 100),
    industry: text(body.industry, 100),
    urgency: text(body.urgency, 50),
    overallRiskScore: number(body.overallRiskScore),
    riskLevel: text(body.riskLevel, 60),
    categoryScores,
    recommendedActions: stringList(body.recommendedActions),
    warningSignals: stringList(body.warningSignals),
    alternativeStrategy: text(body.alternativeStrategy, 800),
    publicDataSignals,
    failedSources: stringList(body.failedSources, 10, 120),
  }
}

export function createFallbackBriefing(input) {
  const isKorean = input.language === 'ko'
  const risks = input.warningSignals.slice(0, 3)
  const actions = input.recommendedActions.slice(0, 3)
  const signalStatuses = [...new Set(input.publicDataSignals.map((signal) => signal.status))]
  const statusText = isKorean
    ? signalStatuses.map((status) => ({ live: '실시간', archived: '과거', mock: 'MVP 모의' })[status]).join('·')
    : signalStatuses.join(', ')

  return {
    situationSummary: isKorean
      ? `${input.localizedCountryName}의 ${input.purpose} 목적 리스크는 ${input.riskLevel} 수준이며 종합 점수는 ${input.overallRiskScore}/100입니다. ${input.industry} 산업과 ${input.urgency} 긴급도를 반영한 기본 브리핑입니다.`
      : `${input.localizedCountryName} has a ${input.riskLevel} risk level for ${input.purpose}, with an overall score of ${input.overallRiskScore}/100. This template briefing reflects the ${input.industry} industry and ${input.urgency} urgency.`,
    mainRisks: risks.length > 0
      ? risks
      : [isKorean ? '제공된 리스크 항목을 의사결정 전에 다시 확인하세요.' : 'Review the supplied risk categories before making a decision.'],
    recommendedActions: actions.length > 0
      ? actions
      : [isKorean ? '공식 출처의 최신 상태를 확인한 뒤 다음 단계를 진행하세요.' : 'Check the latest official-source status before proceeding.'],
    alternativeStrategy: input.alternativeStrategy || (isKorean
      ? '범위를 제한한 시험 단계로 시작한 뒤 검증 결과에 따라 확대하세요.'
      : 'Begin with a limited pilot and expand after the results are verified.'),
    sourceReminder: isKorean
      ? `이 기본 브리핑은 화면에 제공된 ${statusText || 'MVP 모의'} 공공데이터 신호만 사용했습니다. 모의 신호는 공식 사실이나 실시간 API 데이터가 아닙니다.`
      : `This template uses only the supplied ${statusText || 'MVP mock'} public-data signals. Mock signals are not official facts or live API data.`,
    finalDecisionNote: isKorean
      ? `${input.urgency} 긴급도에 맞춰 우선순위를 정하되, 자금 투입이나 이동 전에 최신 공식 정보를 확인하세요.`
      : `Prioritize the next steps for ${input.urgency} urgency, and verify current official information before committing funds or travel.`,
    generationMode: 'fallback',
  }
}

function isValidBriefing(value) {
  return Boolean(
    value &&
      typeof value.situationSummary === 'string' &&
      Array.isArray(value.mainRisks) &&
      Array.isArray(value.recommendedActions) &&
      typeof value.alternativeStrategy === 'string' &&
      typeof value.sourceReminder === 'string' &&
      typeof value.finalDecisionNote === 'string',
  )
}

export async function generateGroqBriefing(input, apiKey) {
  const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: [
            'You create concise business risk briefings from supplied JSON evidence only.',
            'Never invent official facts, dates, sources, or country conditions.',
            'Distinguish live, archived, and mock public-data signals exactly as provided.',
            'State clearly that mock signals are illustrative and not live official facts.',
            'Focus on the supplied country, purpose, industry, and urgency.',
            'Provide practical business actions.',
            `Write every field in ${input.language === 'ko' ? 'Korean' : 'English'}.`,
            'Return valid JSON only, with no Markdown or surrounding commentary.',
            `The required JSON schema is: ${JSON.stringify(briefingSchema)}`,
          ].join(' '),
        },
        { role: 'user', content: JSON.stringify(input) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_completion_tokens: 1400,
    }),
    signal: AbortSignal.timeout(20000),
  })

  if (!apiResponse.ok) {
    throw new Error(`AI provider responded with HTTP ${apiResponse.status}.`)
  }

  const data = await apiResponse.json()
  const outputText = data?.choices?.[0]?.message?.content ?? ''
  const briefing = JSON.parse(outputText)
  if (!isValidBriefing(briefing)) {
    throw new Error('AI provider returned an invalid briefing shape.')
  }

  return { ...briefing, generationMode: 'ai' }
}
