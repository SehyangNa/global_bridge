import { loadEnvFile } from 'node:process'
import express from 'express'
import { XMLParser } from 'fast-xml-parser'

for (const envFile of ['.env.local', '.env']) {
  try {
    loadEnvFile(envFile)
  } catch {
    // Environment files are optional; deployed environments can inject variables.
  }
}

const app = express()
const port = Number(process.env.PORT) || 3001
const mofaEndpoint =
  'https://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList'
const countrySearchTerms = {
  Kenya: '케냐',
  Nigeria: '나이지리아',
  'South Africa': '남아공',
}
const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
})

function decodeServiceKey(serviceKey) {
  try {
    return decodeURIComponent(serviceKey)
  } catch {
    return serviceKey
  }
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function asArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function errorResponse(code, message) {
  return {
    ok: false,
    live: false,
    items: [],
    error: { code, message },
  }
}

app.get('/api/mofa-safety', async (request, response) => {
  const country = String(request.query.country ?? '')
  const searchTerm = countrySearchTerms[country]

  if (!searchTerm) {
    return response
      .status(400)
      .json(errorResponse('UNSUPPORTED_COUNTRY', 'Unsupported country.'))
  }

  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY?.trim()
  if (!serviceKey) {
    return response
      .status(503)
      .json(errorResponse('MISSING_SERVICE_KEY', 'The data.go.kr service key is not configured.'))
  }

  const url = new URL(mofaEndpoint)
  url.searchParams.set('serviceKey', decodeServiceKey(serviceKey))
  url.searchParams.set('numOfRows', '5')
  url.searchParams.set('pageNo', '1')
  url.searchParams.set('title', searchTerm)

  try {
    const apiResponse = await fetch(url, {
      headers: { Accept: 'application/xml, text/xml' },
      signal: AbortSignal.timeout(8000),
    })

    if (!apiResponse.ok) {
      throw new Error(`MOFA API responded with HTTP ${apiResponse.status}.`)
    }

    const xml = await apiResponse.text()
    const parsed = parser.parse(xml)
    const apiResult = parsed?.response
    const resultCode = String(apiResult?.header?.resultCode ?? '')

    if (resultCode && resultCode !== '00') {
      throw new Error(
        normalizeText(apiResult?.header?.resultMsg) || 'MOFA API returned an error.',
      )
    }

    const items = asArray(apiResult?.body?.items?.item)
      .map((item) => ({
        id: String(item.id ?? ''),
        countryName: normalizeText(item.countryName),
        countryEnName: normalizeText(item.countryEnName),
        title: normalizeText(item.title),
        description: normalizeText(item.content).slice(0, 360),
        lastUpdated: normalizeText(item.wrtDt),
      }))
      .filter((item) => item.title || item.description)

    return response.json({
      ok: true,
      live: items.length > 0,
      source: 'MOFA country safety information',
      country,
      items,
    })
  } catch (error) {
    console.error('MOFA safety proxy request failed:', error)
    return response
      .status(502)
      .json(errorResponse('MOFA_API_UNAVAILABLE', 'Live MOFA safety data is unavailable.'))
  }
})

app.listen(port, () => {
  console.log(`Global Bridge API proxy listening on http://localhost:${port}`)
})
