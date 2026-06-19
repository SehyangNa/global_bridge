import type {
  Industry,
  Purpose,
  RiskCategory,
  RiskLevel,
  RiskScores,
  RiskTone,
  Urgency,
} from '../types/risk'

export const categoryLabels: Record<RiskCategory, string> = {
  political: 'Political',
  security: 'Security',
  logistics: 'Logistics',
  health: 'Health',
  business: 'Business',
}

export const categoryOrder: RiskCategory[] = [
  'political',
  'security',
  'logistics',
  'health',
  'business',
]

export const urgencyAdjustments: Record<Urgency, number> = {
  Low: 0,
  Medium: 5,
  High: 10,
}

const industryAdjustments: Record<Industry, Partial<RiskScores>> = {
  Food: {
    logistics: 5,
    health: 6,
    business: 2,
  },
  'Raw Materials': {
    security: 3,
    logistics: 8,
    business: 4,
  },
  IT: {
    security: 2,
    business: 3,
  },
  Healthcare: {
    logistics: 3,
    health: 8,
    business: 2,
  },
  Education: {
    political: 2,
    health: 2,
    business: 2,
  },
  General: {},
}

function capScore(score: number) {
  return Math.min(100, Math.max(0, Math.round(score)))
}

function applyCategoryAdjustments(
  scores: RiskScores,
  adjustments: Partial<RiskScores>,
) {
  categoryOrder.forEach((category) => {
    scores[category] = capScore(scores[category] + (adjustments[category] ?? 0))
  })
}

export function calculateScores(
  baseScores: RiskScores,
  purpose: Purpose,
  industry: Industry,
  urgency: Urgency,
) {
  const scores: RiskScores = { ...baseScores }

  if (purpose === 'Import') {
    scores.logistics = capScore(scores.logistics + 10)
    scores.business = capScore(scores.business + 5)
  }

  if (purpose === 'Business Trip') {
    scores.security = capScore(scores.security + 10)
    scores.health = capScore(scores.health + 5)
  }

  if (purpose === 'Export') {
    scores.business = capScore(scores.business + 10)
    scores.logistics = capScore(scores.logistics + 5)
  }

  applyCategoryAdjustments(scores, industryAdjustments[industry])

  const baseOverall =
    categoryOrder.reduce((total, category) => total + scores[category], 0) /
    categoryOrder.length

  return {
    categoryScores: scores,
    overallScore: capScore(baseOverall + urgencyAdjustments[urgency]),
  }
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 75) return 'Critical'
  if (score >= 60) return 'High'
  if (score >= 40) return 'Moderate'
  return 'Managed'
}

export function riskTone(score: number): RiskTone {
  if (score >= 75) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'moderate'
  return 'managed'
}
