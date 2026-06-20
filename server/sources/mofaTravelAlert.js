import {
  countries, dateOf, extractItems, fetchData, levelFromText, pick, signal,
} from './common.js'

export const sourceName = 'MOFA travel alerts'

export async function fetchMofaTravelAlert({ country, countryCode }) {
  const metadata = countries[country]
  if (!metadata) return []
  const data = await fetchData(
    'https://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2',
    {
      returnType: 'JSON', numOfRows: 20, pageNo: 1,
      'cond[country_iso_alp2::EQ]': countryCode || metadata.code,
    },
    'ServiceKey',
  )
  return extractItems(data).slice(0, 2).map((item) => {
    const alarm = pick(item, ['alarm_lvl', 'alarmLevel'], 40) || '—'
    const region = pick(item, ['region_ty', 'regionType'], 80)
    return signal({
      source: '외교부 여행경보 / MOFA Travel Alert', sourceType: 'mofa',
      category: 'travel',
      titleKo: `${metadata.nameKo} 여행경보 ${alarm}단계`,
      titleEn: `${country} travel alert level ${alarm}`,
      summaryKo: `${region || '국가·지역별'} 여행경보 단계와 이동 전 행동지침을 확인하세요.`,
      summaryEn: `Check the ${region || 'country and regional'} alert level and guidance before travel.`,
      level: levelFromText(alarm), publishedAt: dateOf(item),
      url: 'https://www.0404.go.kr/', rawSourceName: '외교부_국가∙지역별 여행경보',
    })
  })
}
