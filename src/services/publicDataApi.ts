export type PublicSignalSourceType = 'mofa' | 'kotra' | 'ksure' | 'fallback'
export type PublicSignalCategory =
  | 'security'
  | 'travel'
  | 'business'
  | 'market'
  | 'compliance'
  | 'fx'
  | 'industryRisk'
export type PublicSignalStatus = 'live' | 'archived' | 'mock'

export type AggregatedPublicDataSignal = {
  source: string
  sourceType: PublicSignalSourceType
  category: PublicSignalCategory
  titleKo: string
  titleEn: string
  summaryKo: string
  summaryEn: string
  level: 'low' | 'medium' | 'high'
  status: PublicSignalStatus
  publishedAt: string | null
  url: string | null
  rawSourceName: string
  riskScore?: number
}

export type PublicRiskResult = {
  ok: boolean
  signals: AggregatedPublicDataSignal[]
  failedSources: string[]
  missingCategories: string[]
  ksureRiskIndexUsed: boolean
  ksureRiskScore: number | null
  error?: { code: string; message: string }
}

const emptyResult: PublicRiskResult = {
  ok: false,
  signals: [],
  failedSources: ['public-risk-proxy'],
  missingCategories: [],
  ksureRiskIndexUsed: false,
  ksureRiskScore: null,
}

export async function fetchPublicRisk(params: {
  country: string
  countryCode: string
  purpose: string
  industry: string
  language: 'ko' | 'en'
}): Promise<PublicRiskResult> {
  try {
    const query = new URLSearchParams(params)
    const response = await fetch(`/api/public-risk?${query}`, {
      headers: { Accept: 'application/json' },
    })
    const data = (await response.json()) as Partial<PublicRiskResult>
    if (!response.ok || !data.ok) return { ...emptyResult, error: data.error }
    return {
      ok: true,
      signals: data.signals ?? [],
      failedSources: data.failedSources ?? [],
      missingCategories: data.missingCategories ?? [],
      ksureRiskIndexUsed: Boolean(data.ksureRiskIndexUsed),
      ksureRiskScore:
        typeof data.ksureRiskScore === 'number' ? data.ksureRiskScore : null,
    }
  } catch {
    return emptyResult
  }
}
