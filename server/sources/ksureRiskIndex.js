import {
  combinedText, countries, dateOf, extractItems, fetchData, isCountryRelevant,
  levelFromText, pick, signal,
} from './common.js'

export const sourceName = 'K-SURE country and industry risk index'

function riskScoreOf(item) {
  const raw = pick(item, [
    'riskIndex', 'risk_index', 'riskScore', 'risk_score', 'riskGrade',
    'risk_grade', 'riGrade', 'grade', 'RISK_INDEX',
  ], 40)
  const match = raw.match(/(?:RI)?\s*([1-5])/i)
  if (match) return Number(match[1]) * 20
  const numeric = Number(raw)
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : null
}

export async function fetchKsureRiskIndex({ country, countryCode, industry }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/B552696/ksight/riskindex',
    {
      type: 'json', numOfRows: 100, pageNo: 1,
      countryCode: countryCode || metadata.code, country: metadata.ko, industry,
    },
  )
  return extractItems(data)
    .filter((item) => isCountryRelevant(item, country))
    .slice(0, 2)
    .map((item) => {
      const riskScore = riskScoreOf(item)
      const riskLabel = pick(item, ['riskGrade', 'risk_grade', 'riGrade', 'grade'], 40)
      return signal({
        source: '한국무역보험공사 / K-SURE', sourceType: 'ksure', category: 'industryRisk',
        titleKo: `${metadata.ko} ${industry} 업종 위험지수 ${riskLabel}`.trim(),
        titleEn: `${country} ${industry} industry risk index ${riskLabel}`.trim(),
        summaryKo: combinedText(item), summaryEn: combinedText(item),
        level: levelFromText(riskLabel || String(riskScore ?? '')),
        publishedAt: dateOf(item), status: dateOf(item) ? undefined : 'live',
        url: 'https://www.ksure.or.kr/', rawSourceName: '한국무역보험공사_국가별 업종별 위험지수',
        riskScore,
      })
    })
}
