import { buildAiBriefingResponse } from '../server/handlers/aiBriefingHandler.js'

function parsedBody(request) {
  if (typeof request.body !== 'string') return request.body ?? {}
  try {
    return JSON.parse(request.body)
  } catch {
    return {}
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST for this endpoint.' },
    })
  }

  response.setHeader('Cache-Control', 'no-store')
  const result = await buildAiBriefingResponse(parsedBody(request))
  return response.status(result.statusCode).json(result.body)
}
