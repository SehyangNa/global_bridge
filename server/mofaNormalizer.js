export const countryAliases = {
  Kenya: ['Kenya', '케냐'],
  Nigeria: ['Nigeria', '나이지리아'],
  'South Africa': ['South Africa', '남아프리카공화국', '남아공'],
  Vietnam: ['Vietnam', 'Viet Nam', '베트남'],
  India: ['India', '인도'],
  'United Arab Emirates': ['United Arab Emirates', 'UAE', '아랍에미리트', '아랍에미리트연합', '두바이'],
}

export const countrySearchTerms = {
  Kenya: '케냐',
  Nigeria: '나이지리아',
  'South Africa': '남아공',
  Vietnam: '베트남',
  India: '인도',
  'United Arab Emirates': '아랍에미리트',
}

const namedEntities = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

function decodeCodePoint(value, radix) {
  const codePoint = Number.parseInt(value, radix)
  if (!Number.isFinite(codePoint) || codePoint <= 0) return ' '

  try {
    return String.fromCodePoint(codePoint)
  } catch {
    return ' '
  }
}

export function cleanText(value, maxLength = 360) {
  let decoded = String(value ?? '')

  for (let pass = 0; pass < 2; pass += 1) {
    decoded = decoded
      .replace(/&amp;/gi, '&')
      .replace(/&#x([0-9a-f]+);?/gi, (_, code) => decodeCodePoint(code, 16))
      .replace(/&#(\d+);?/g, (_, code) => decodeCodePoint(code, 10))
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&apos;|&#39;/gi, "'")
  }

  const cleaned = decoded
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&([a-z]+);/gi, (entity, name) => namedEntities[name.toLowerCase()] ?? ' ')
    .replace(/[\u00a0\u200b-\u200d\ufeff]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleaned.length <= maxLength) return cleaned
  return `${cleaned.slice(0, maxLength).trimEnd()}…`
}

export function summarizeText(value) {
  const cleaned = cleanText(value, 1600)
  if (!cleaned) return ''

  const sentences = cleaned.match(/[^.!?。！？]+[.!?。！？]+/g) ?? []
  const firstTwoSentences = sentences.slice(0, 2).join(' ').trim()
  return cleanText(firstTwoSentences || cleaned, 280)
}

export function parseMofaDate(value) {
  const text = cleanText(value, 80)
  if (!text) return null

  const yearFirst = text.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/)
  if (yearFirst) {
    return validUtcDate(yearFirst[1], yearFirst[2], yearFirst[3])
  }

  const dayFirst = text.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/)
  if (dayFirst) {
    return validUtcDate(dayFirst[3], dayFirst[2], dayFirst[1])
  }

  const compact = text.match(/^(\d{4})(\d{2})(\d{2})/)
  if (compact) {
    return validUtcDate(compact[1], compact[2], compact[3])
  }

  return null
}

function validUtcDate(yearValue, monthValue, dayValue) {
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}

function asArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function toPublicItem(item) {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    lastUpdated: item.lastUpdated,
  }
}

export function normalizeMofaItems(rawItems, country, now = new Date()) {
  const aliases = countryAliases[country] ?? []
  const normalizedAliases = aliases.map((alias) => alias.toLocaleLowerCase())
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 24)

  const relevantItems = asArray(rawItems)
    .map((item) => {
      const title = cleanText(item.title ?? item.subject, 180)
      const body = cleanText(
        item.txt_origin_cn ??
          item.content ??
          item.html_origin_cn ??
          item.contentHtml ??
          item.description,
        8000,
      )
      const searchableText = `${title} ${body}`.toLocaleLowerCase()
      const publishedAt = parseMofaDate(
        item.wrt_dt ??
          item.wrtDt ??
          item.updated_at ??
          item.updatedAt ??
          item.reg_dt,
      )

      if (
        !publishedAt ||
        !normalizedAliases.some((alias) => searchableText.includes(alias))
      ) {
        return null
      }

      return {
        id: String(item.sfty_notice_id ?? item.Id ?? item.id ?? ''),
        title,
        summary: summarizeText(body),
        lastUpdated: publishedAt.toISOString().slice(0, 10),
        publishedAt,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  const recent = relevantItems
    .filter((item) => item.publishedAt >= cutoff && item.publishedAt <= now)
    .map(toPublicItem)
  const archived = relevantItems
    .filter((item) => item.publishedAt < cutoff)
    .map(toPublicItem)

  return { recent, archived }
}
