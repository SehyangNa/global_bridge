import {
  bodyOf, countries, dateOf, extractItems, fetchData, isCountryRelevant,
  levelFromText, signal, titleOf, urlOf,
} from './common.js'

export const sourceName = 'KOTRA breaking news'

export async function fetchKotraBreakingNews({ country }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/B410001/shortBreakingNews/shortBreakingNews',
    { type: 'json', numOfRows: 30, pageNo: 1, search1: metadata.ko },
  )
  return extractItems(data)
    .filter((item) => isCountryRelevant(item, country))
    .slice(0, 2)
    .map((item) => {
      const title = titleOf(item)
      const body = bodyOf(item)
      return signal({
        source: 'KOTRA 단신속보 / Breaking News', sourceType: 'kotra', category: 'market',
        titleKo: title, titleEn: title, summaryKo: body, summaryEn: body,
        level: levelFromText(`${title} ${body}`), publishedAt: dateOf(item),
        url: urlOf(item), rawSourceName: '대한무역투자진흥공사_단신속보뉴스',
      })
    })
}
