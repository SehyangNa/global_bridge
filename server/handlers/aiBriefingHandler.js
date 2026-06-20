import {
  createFallbackBriefing,
  generateGroqBriefing,
  normalizeBriefingInput,
} from '../aiBriefing.js'

function errorPayload(code, message, briefing) {
  return {
    error: { code, message },
    briefing,
  }
}

export async function buildAiBriefingResponse(body = {}) {
  const input = normalizeBriefingInput(body)
  const fallback = createFallbackBriefing(input)
  const apiKey = process.env.GROQ_API_KEY?.trim()

  if (!apiKey) {
    return {
      statusCode: 503,
      body: errorPayload(
        'MISSING_GROQ_API_KEY',
        'GROQ_API_KEY is not configured on the server.',
        fallback,
      ),
    }
  }

  try {
    return {
      statusCode: 200,
      body: await generateGroqBriefing(input, apiKey),
    }
  } catch (error) {
    console.error('Groq briefing generation failed:', error)
    return {
      statusCode: 502,
      body: errorPayload(
        'GROQ_API_UNAVAILABLE',
        'Groq briefing generation failed. A template fallback is provided.',
        fallback,
      ),
    }
  }
}
