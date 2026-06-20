import {
  bodyOf, countries, dateOf, extractItems, fetchData, isCountryRelevant,
  signal, titleOf, urlOf,
} from './common.js'

export const sourceName = 'KOTRA certification information'

export async function fetchKotraCertificationInfo({ country, industry }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/B410001/overseasAuthInfo/getOverseasAuthInfo',
    { type: 'json', numOfRows: 30, pageNo: 1, search1: industry },
  )
  return extractItems(data)
    .filter((item) => isCountryRelevant(item, country))
    .slice(0, 2)
    .map((item) => {
      const title = titleOf(item) || `${metadata.ko} 해외인증 정보`
      const body = bodyOf(item)
      return signal({
        source: 'KOTRA 해외인증정보 / Certification', sourceType: 'kotra',
        category: 'compliance', titleKo: title, titleEn: title,
        summaryKo: body, summaryEn: body, level: 'medium', publishedAt: dateOf(item),
        url: urlOf(item), rawSourceName: '대한무역투자진흥공사_해외인증정보',
      })
    })
}
