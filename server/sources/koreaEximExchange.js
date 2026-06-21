import { countries, signal } from './common.js'

export const sourceName = 'Korea Eximbank exchange rates'

const endpoint =
  'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON'

const currencyByCountry = {
  Kenya: 'KES',
  Nigeria: 'NGN',
  'South Africa': 'ZAR',
  Vietnam: 'VND',
  India: 'INR',
  'United Arab Emirates': 'AED',
}

function compactDate(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('')
}

function isoDate(value) {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
}

function recentBusinessDates(now = new Date(), limit = 3) {
  const dates = []
  const cursor = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  ))

  while (dates.length < limit) {
    const day = cursor.getUTCDay()
    if (day !== 0 && day !== 6) dates.push(compactDate(cursor))
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return dates
}

async function fetchRates(authkey, searchdate) {
  const url = new URL(endpoint)
  url.searchParams.set('authkey', authkey)
  url.searchParams.set('searchdate', searchdate)
  url.searchParams.set('data', 'AP01')

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) {
    throw new Error(`Korea Eximbank API returned HTTP ${response.status}.`)
  }

  const payload = await response.json()
  if (!Array.isArray(payload)) {
    throw new Error('Korea Eximbank API returned an invalid response.')
  }
  const resultCode = Number(payload[0]?.result)
  if (resultCode === 3) throw new Error('KOREAEXIM_API_KEY is invalid or expired.')
  if (resultCode === 4) throw new Error('Korea Eximbank API daily limit is exhausted.')
  return payload.filter((item) => Number(item?.result) === 1)
}

function rateText(value) {
  return String(value ?? '').trim() || '—'
}

export async function fetchKoreaEximExchange({ country }) {
  const metadata = countries[country]
  if (!metadata) return []

  const apiKey = process.env.KOREAEXIM_API_KEY?.trim()
  if (!apiKey) throw new Error('KOREAEXIM_API_KEY is not configured.')

  let rates = []
  let rateDate = ''
  for (const searchdate of recentBusinessDates()) {
    rates = await fetchRates(apiKey, searchdate)
    if (rates.length > 0) {
      rateDate = searchdate
      break
    }
  }
  if (rates.length === 0) return []

  const localCurrency = currencyByCountry[country]
  const localRate = rates.find((item) => item.cur_unit === localCurrency)
  const selectedRate = localRate ?? rates.find((item) => item.cur_unit === 'USD')
  if (!selectedRate) return []

  const currency = selectedRate.cur_unit
  const baseRate = rateText(selectedRate.deal_bas_r)
  const receivingRate = rateText(selectedRate.ttb)
  const sendingRate = rateText(selectedRate.tts)
  const publishedAt = isoDate(rateDate)
  const isLocalCurrency = Boolean(localRate)
  const summaryKo = isLocalCurrency
    ? `${publishedAt} 기준 ${currency} 1단위당 원화 매매기준율은 ${baseRate}원입니다. 전신환 받으실 때 ${receivingRate}원, 보내실 때 ${sendingRate}원입니다.`
    : `${publishedAt} 기준 USD 1달러당 원화 매매기준율은 ${baseRate}원입니다. 현재 피드에 ${localCurrency} 환율이 없어 USD 결제 참고값을 표시합니다.`
  const summaryEn = isLocalCurrency
    ? `On ${publishedAt}, the KRW base rate for one ${currency} was ${baseRate}. Telegraphic transfer rates were ${receivingRate} for receipts and ${sendingRate} for payments.`
    : `On ${publishedAt}, the KRW base rate for one USD was ${baseRate}. ${localCurrency} is not available in the current feed, so this is shown as a USD settlement reference.`

  const normalizedSignal = signal({
    source: '한국수출입은행 환율 / Korea Eximbank Exchange Rates',
    sourceType: 'kexim',
    category: 'fx',
    titleKo: isLocalCurrency
      ? `${metadata.nameKo} ${currency}/KRW 매매기준율 ${baseRate}원`
      : `${metadata.nameKo} USD/KRW 결제 참고환율 ${baseRate}원`,
    titleEn: isLocalCurrency
      ? `${metadata.nameEn} ${currency}/KRW base rate KRW ${baseRate}`
      : `${metadata.nameEn} USD/KRW settlement reference KRW ${baseRate}`,
    summaryKo,
    summaryEn,
    level: 'low',
    publishedAt,
    url: 'https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C',
    rawSourceName: '한국수출입은행_현재환율 API',
  })

  return [{ ...normalizedSignal, summaryKo, summaryEn }]
}
