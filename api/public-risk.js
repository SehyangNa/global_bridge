import { buildPublicRiskResponse } from '../server/handlers/publicRiskHandler.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Use GET for this endpoint.' },
    })
  }

  response.setHeader('Cache-Control', 'no-store')
  const result = await buildPublicRiskResponse(request.query ?? {})
  return response.status(result.statusCode).json(result.body)
}
