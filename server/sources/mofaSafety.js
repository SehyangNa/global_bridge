import {
  bodyOf, countries, dateOf, extractItems, fetchData, isCountryRelevant,
  levelFromText, signal, titleOf, urlOf,
} from './common.js'

export const sourceName = 'MOFA safety information'

export async function fetchMofaSafety({ country }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList',
    { numOfRows: 50, pageNo: 1, title: metadata.nameKo },
  )
  return extractItems(data)
    .filter((item) => isCountryRelevant(item, country))
    .slice(0, 2)
    .map((item) => {
      const title = titleOf(item) || `${metadata.nameKo} 안전정보`
      const body = bodyOf(item)
      return signal({
        source: '외교부 해외안전정보 / MOFA Safety', sourceType: 'mofa',
        category: 'security', titleKo: title, titleEn: title,
        summaryKo: body, summaryEn: body, level: levelFromText(`${title} ${body}`),
        publishedAt: dateOf(item), url: urlOf(item), rawSourceName: '외교부_국가별 안전정보',
      })
    })
}
