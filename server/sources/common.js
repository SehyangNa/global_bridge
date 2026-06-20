import { XMLParser } from 'fast-xml-parser'
import { cleanText, parseMofaDate, summarizeText } from '../mofaNormalizer.js'

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
})

export const countries = {
  Kenya: { code: 'KE', ko: '케냐', aliases: ['Kenya', '케냐'] },
  Nigeria: { code: 'NG', ko: '나이지리아', aliases: ['Nigeria', '나이지리아'] },
  'South Africa': {
    code: 'ZA',
    ko: '남아프리카공화국',
    aliases: ['South Africa', '남아프리카공화국', '남아공'],
  },
}

export function serviceKey() {
  const key = process.env.DATA_GO_KR_SERVICE_KEY?.trim()
  if (!key) throw new Error('DATA_GO_KR_SERVICE_KEY is not configured.')
  try {
    return decodeURIComponent(key)
  } catch {
    return key
  }
}

export async function fetchData(endpoint, params = {}, keyName = 'serviceKey') {
  const url = new URL(endpoint)
  url.searchParams.set(keyName, serviceKey())
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      url.searchParams.set(key, String(value))
    }
  })

  const response = await fetch(url, {
    headers: { Accept: 'application/json, application/xml, text/xml' },
    signal: AbortSignal.timeout(9000),
  })
  if (!response.ok) throw new Error(`Public data API returned HTTP ${response.status}.`)

  const body = await response.text()
  let parsed
  try {
    parsed = JSON.parse(body)
  } catch {
    parsed = parser.parse(body)
  }

  const resultCode = cleanText(
    parsed?.response?.header?.resultCode ?? parsed?.header?.resultCode,
    20,
  )
  if (resultCode && resultCode !== '0' && resultCode !== '00') {
    throw new Error(
      cleanText(parsed?.response?.header?.resultMsg ?? parsed?.header?.resultMsg) ||
        `Public data API error ${resultCode}.`,
    )
  }
  return parsed
}

export function asArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export function extractItems(payload) {
  const candidates = [
    payload?.response?.body?.items?.item,
    payload?.response?.body?.items,
    payload?.response?.body?.item,
    payload?.response?.body,
    payload?.body?.items?.item,
    payload?.body?.items,
    payload?.body?.item,
    payload?.data,
    payload?.items?.item,
    payload?.items,
    payload?.item,
  ]
  for (const candidate of candidates) {
    const items = asArray(candidate).filter(
      (item) => item && typeof item === 'object' && !Array.isArray(item),
    )
    if (items.length) return items
  }
  return []
}

export function pick(item, keys, maxLength = 600) {
  for (const key of keys) {
    const value = item?.[key]
    if (value !== undefined && value !== null && cleanText(value)) {
      return cleanText(value, maxLength)
    }
  }
  return ''
}

export function combinedText(item) {
  return cleanText(
    Object.values(item ?? {})
      .filter((value) => ['string', 'number'].includes(typeof value))
      .join(' '),
    12000,
  )
}

export function isCountryRelevant(item, country, assumeConstrained = false) {
  const metadata = countries[country]
  if (!metadata) return false
  const searchable = combinedText(item).toLocaleLowerCase()
  const matched = metadata.aliases.some((alias) =>
    searchable.includes(alias.toLocaleLowerCase()),
  )
  const countryCode = pick(item, [
    'country_iso_alp2', 'isoWd2CntCd', 'countryCode', 'country_code',
    'natnCd', 'cntyCd', 'COUNTRY_CODE',
  ], 20).toUpperCase()
  return matched || countryCode === metadata.code || assumeConstrained
}

export function parseDate(value) {
  return parseMofaDate(value)
}

export function statusFromDate(value, now = new Date()) {
  const date = value instanceof Date ? value : parseDate(value)
  if (!date) return 'archived'
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24)
  return date >= cutoff && date <= now ? 'live' : 'archived'
}

export function isoDate(value) {
  const date = value instanceof Date ? value : parseDate(value)
  return date ? date.toISOString().slice(0, 10) : null
}

export function levelFromText(value, fallback = 'medium') {
  const text = cleanText(value, 100).toLowerCase()
  const numberMatch = text.match(/(?:ri|level|단계)?\s*([1-5])/i)
  if (numberMatch) {
    const level = Number(numberMatch[1])
    if (level >= 4) return 'high'
    if (level <= 2) return 'low'
    return 'medium'
  }
  if (/high|severe|critical|위험|금지|출국권고/.test(text)) return 'high'
  if (/low|safe|정상|유의/.test(text)) return 'low'
  return fallback
}

export function shortSummary(value) {
  return summarizeText(value) || cleanText(value, 280)
}

export function signal({
  source,
  sourceType,
  category,
  titleKo,
  titleEn,
  summaryKo,
  summaryEn,
  level = 'medium',
  publishedAt = null,
  url = null,
  rawSourceName = source,
  status,
  riskScore,
}) {
  const normalizedDate = isoDate(publishedAt)
  return {
    source,
    sourceType,
    category,
    titleKo: cleanText(titleKo, 180),
    titleEn: cleanText(titleEn || titleKo, 180),
    summaryKo: shortSummary(summaryKo),
    summaryEn: shortSummary(summaryEn || summaryKo),
    level,
    status: status ?? statusFromDate(publishedAt),
    publishedAt: normalizedDate,
    url: url || null,
    rawSourceName,
    ...(Number.isFinite(riskScore) ? { riskScore } : {}),
  }
}

export function titleOf(item) {
  return pick(item, [
    'title', 'subject', 'newsTitl', 'news_title', 'titl', 'sj', 'TITLE',
    'authNm', 'certificationName', 'systemName',
  ], 220)
}

export function bodyOf(item) {
  return pick(item, [
    'txt_origin_cn', 'content', 'contents', 'body', 'description', 'summary',
    'cn', 'newsBdt', 'news_body', 'cont', 'dtlCn', 'systemContent', 'authCn',
  ], 6000) || combinedText(item)
}

export function dateOf(item) {
  return pick(item, [
    'wrt_dt', 'wrtDt', 'written_dt', 'reg_dt', 'regDt', 'publishedAt',
    'newsWrtDt', 'newsDt', 'createdAt', 'updDt', 'date', 'BASE_DT', 'baseDate',
  ], 80)
}

export function urlOf(item) {
  return pick(item, [
    'url', 'link', 'newsUrl', 'news_url', 'originUrl', 'detailUrl', 'file_url',
  ], 1000) || null
}
