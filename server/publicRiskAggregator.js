import { fetchMofaSafety, sourceName as mofaSafetyName } from './sources/mofaSafety.js'
import { fetchMofaTravelAlert, sourceName as mofaTravelName } from './sources/mofaTravelAlert.js'
import { fetchKotraCountryInfo, sourceName as kotraCountryName } from './sources/kotraCountryInfo.js'
import { fetchKotraMarketNews, sourceName as kotraMarketName } from './sources/kotraMarketNews.js'
import { fetchKotraBreakingNews, sourceName as kotraBreakingName } from './sources/kotraBreakingNews.js'
import { fetchKotraCertificationInfo, sourceName as kotraCertificationName } from './sources/kotraCertificationInfo.js'
import { fetchKsureRiskIndex, sourceName as ksureName } from './sources/ksureRiskIndex.js'
import { createFallbackSignals, fallbackCategories } from './publicRiskFallback.js'
import { countries } from './sources/common.js'

const sources = [
  [mofaSafetyName, fetchMofaSafety],
  [mofaTravelName, fetchMofaTravelAlert],
  [kotraCountryName, fetchKotraCountryInfo],
  [kotraMarketName, fetchKotraMarketNews],
  [kotraBreakingName, fetchKotraBreakingNews],
  [kotraCertificationName, fetchKotraCertificationInfo],
  [ksureName, fetchKsureRiskIndex],
]

export async function aggregatePublicRisk(query) {
  if (!countries[query.country]) {
    throw new Error('Unsupported country.')
  }

  const settled = await Promise.allSettled(
    sources.map(([, loader]) => loader(query)),
  )
  const signals = []
  const failedSources = []

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      signals.push(...result.value)
    } else {
      failedSources.push(sources[index][0])
    }
  })

  const liveCategories = new Set(signals.map((item) => item.category))
  const missingCategories = fallbackCategories.filter(
    (category) => !liveCategories.has(category),
  )
  signals.push(...createFallbackSignals(query.country, missingCategories))

  const deduplicated = [...new Map(
    signals.map((item) => [
      `${item.rawSourceName}|${item.category}|${item.titleKo}`,
      item,
    ]),
  ).values()]
  const ksureSignal = deduplicated.find(
    (item) => item.sourceType === 'ksure' && Number.isFinite(item.riskScore),
  )

  return {
    ok: true,
    country: query.country,
    signals: deduplicated.slice(0, 18),
    failedSources,
    missingCategories,
    ksureRiskIndexUsed: Boolean(ksureSignal),
    ksureRiskScore: ksureSignal?.riskScore ?? null,
  }
}
