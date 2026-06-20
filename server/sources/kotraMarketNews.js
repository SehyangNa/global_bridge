import {
  bodyOf, countries, dateOf, extractItems, fetchData, isCountryRelevant,
  levelFromText, signal, titleOf, urlOf,
} from './common.js'

export const sourceName = 'KOTRA market news'

export async function fetchKotraMarketNews({ country, industry }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/B410001/kotra_overseasMarketNews/ovseaMrktNews/ovseaMrktNews',
    { type: 'json', numOfRows: 20, pageNo: 1, search1: metadata.nameKo, search2: industry },
  )
  return extractItems(data)
    .filter((item) => isCountryRelevant(item, country, true))
    .slice(0, 2)
    .map((item) => {
      const title = titleOf(item)
      const body = bodyOf(item)
      return signal({
        source: 'KOTRA 해외시장뉴스 / Market News', sourceType: 'kotra', category: 'market',
        titleKo: title, titleEn: title, summaryKo: body, summaryEn: body,
        level: levelFromText(`${title} ${body}`), publishedAt: dateOf(item),
        url: urlOf(item), rawSourceName: '대한무역투자진흥공사_해외시장뉴스',
      })
    })
}
