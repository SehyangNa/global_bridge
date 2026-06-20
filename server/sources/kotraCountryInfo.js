import {
  combinedText, countries, extractItems, fetchData, signal,
} from './common.js'

export const sourceName = 'KOTRA country information'

export async function fetchKotraCountryInfo({ country, countryCode }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/B410001/kotra_nationalInformation/natnInfo/natnInfo',
    { type: 'json', isoWd2CntCd: countryCode || metadata.code },
  )
  return extractItems(data).slice(0, 1).map((item) => signal({
    source: 'KOTRA 국가정보 / Country Information', sourceType: 'kotra',
    category: 'business',
    titleKo: `${metadata.nameKo} 비즈니스·시장 환경`,
    titleEn: `${country} business and market environment`,
    summaryKo: combinedText(item), summaryEn: combinedText(item), level: 'medium',
    publishedAt: null, status: 'archived',
    url: 'https://dream.kotra.or.kr/', rawSourceName: '대한무역투자진흥공사_국가정보',
  }))
}
