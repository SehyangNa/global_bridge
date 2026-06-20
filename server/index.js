import { loadEnvFile } from 'node:process'
import express from 'express'
import { XMLParser } from 'fast-xml-parser'
import {
  cleanText,
  countrySearchTerms,
  normalizeMofaItems,
} from './mofaNormalizer.js'
import {
  createFallbackBriefing,
  generateGroqBriefing,
  normalizeBriefingInput,
} from './aiBriefing.js'
import { aggregatePublicRisk } from './publicRiskAggregator.js'
import {
  createFallbackSignals,
  fallbackCategories,
} from './publicRiskFallback.js'

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
const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: true,
})

app.use(express.json({ limit: '100kb' }))

function decodeServiceKey(serviceKey) {
  try {
    return decodeURIComponent(serviceKey)
  } catch {
    return serviceKey
  }
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
  url.searchParams.set('numOfRows', '50')
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

    if (resultCode && resultCode !== '00' && resultCode !== '0') {
      throw new Error(
        cleanText(apiResult?.header?.resultMsg) || 'MOFA API returned an error.',
      )
    }

    const { recent, archived } = normalizeMofaItems(
      apiResult?.body?.items?.item,
      country,
    )
    const status = recent.length > 0 ? 'live' : archived.length > 0 ? 'archived' : 'fallback'
    const items = (recent.length > 0 ? recent : archived).slice(0, 2)

    return response.json({
      ok: true,
      live: status === 'live',
      status,
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

app.get('/api/public-risk', async (request, response) => {
  const query = {
    country: String(request.query.country ?? ''),
    countryCode: String(request.query.countryCode ?? ''),
    purpose: String(request.query.purpose ?? ''),
    industry: String(request.query.industry ?? ''),
    language: request.query.language === 'en' ? 'en' : 'ko',
  }

  try {
    return response.json(await aggregatePublicRisk(query))
  } catch (error) {
    console.error('Public risk aggregation failed:', error)
    const fallbackSignals = createFallbackSignals(
      query.country,
      fallbackCategories,
      query,
    )
    return response.json({
      ok: true,
      country: query.country,
      signals: fallbackSignals,
      failedSources: ['public-risk-aggregator'],
      missingCategories: fallbackCategories,
      ksureRiskIndexUsed: false,
      ksureRiskScore: null,
      fallback: true,
      error: {
        code: 'PUBLIC_RISK_FALLBACK',
        message: 'Public risk data is unavailable. MVP fallback signals are shown.',
      },
    })
  }
})

app.post('/api/ai-briefing', async (request, response) => {
  const input = normalizeBriefingInput(request.body)
  const fallback = createFallbackBriefing(input)
  const apiKey = process.env.GROQ_API_KEY?.trim()

  if (!apiKey) {
    return response.json(fallback)
  }

  try {
    const briefing = await generateGroqBriefing(input, apiKey)
    return response.json(briefing)
  } catch (error) {
    console.error('Groq briefing generation failed:', error)
    return response.json(fallback)
  }
})

app.listen(port, () => {
  console.log(`Global Bridge API proxy listening on http://localhost:${port}`)
})
