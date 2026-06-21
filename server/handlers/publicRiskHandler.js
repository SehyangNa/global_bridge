import { aggregatePublicRisk } from '../publicRiskAggregator.js'
import {
  createFallbackSignals,
  fallbackCategories,
} from '../publicRiskFallback.js'
import { countries } from '../sources/common.js'

export function normalizePublicRiskQuery(query = {}) {
  return {
    country: String(query.country ?? ''),
    countryCode: String(query.countryCode ?? ''),
    purpose: String(query.purpose ?? ''),
    industry: String(query.industry ?? ''),
    language: query.language === 'en' ? 'en' : 'ko',
  }
}

function fallbackResponse(query, code, message, failedSources) {
  return {
    ok: true,
    country: query.country,
    signals: createFallbackSignals(query.country, fallbackCategories, query),
    failedSources,
    missingCategories: fallbackCategories,
    ksureRiskIndexUsed: false,
    ksureRiskScore: null,
    fallback: true,
    error: { code, message },
  }
}

export async function buildPublicRiskResponse(rawQuery = {}) {
  const query = normalizePublicRiskQuery(rawQuery)

  if (!countries[query.country]) {
    return {
      statusCode: 400,
      body: {
        ok: false,
        signals: [],
        failedSources: [],
        missingCategories: [],
        ksureRiskIndexUsed: false,
        ksureRiskScore: null,
        error: {
          code: 'UNSUPPORTED_COUNTRY',
          message: 'The selected country is not supported.',
        },
      },
    }
  }

  if (!process.env.DATA_GO_KR_SERVICE_KEY?.trim()) {
    return {
      statusCode: 503,
      body: fallbackResponse(
        query,
        'MISSING_DATA_GO_KR_SERVICE_KEY',
        'DATA_GO_KR_SERVICE_KEY is not configured on the server. MVP fallback signals are provided.',
        ['DATA_GO_KR_SERVICE_KEY'],
      ),
    }
  }

  try {
    const body = await aggregatePublicRisk(query)
    if (!process.env.KOREAEXIM_API_KEY?.trim()) {
      body.error = {
        code: 'MISSING_KOREAEXIM_API_KEY',
        message: 'KOREAEXIM_API_KEY is not configured on the server. The exchange-rate signal uses MVP fallback data.',
      }
    }
    return { statusCode: 200, body }
  } catch (error) {
    console.error('Public risk aggregation failed:', error)
    return {
      statusCode: 502,
      body: fallbackResponse(
        query,
        'PUBLIC_RISK_API_UNAVAILABLE',
        'Public-data APIs are unavailable. MVP fallback signals are provided.',
        ['public-risk-aggregator'],
      ),
    }
  }
}
