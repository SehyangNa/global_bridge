export type Country = 'Kenya' | 'Nigeria' | 'South Africa'

export type Purpose =
  | 'Business Trip'
  | 'Import'
  | 'Export'
  | 'Investment'
  | 'Partner Research'

export type Industry =
  | 'Food'
  | 'Raw Materials'
  | 'IT'
  | 'Healthcare'
  | 'Education'
  | 'General'

export type Urgency = 'Low' | 'Medium' | 'High'

export type RiskCategory =
  | 'political'
  | 'security'
  | 'logistics'
  | 'health'
  | 'business'

export type RiskScores = Record<RiskCategory, number>

export type RiskLevel = 'Critical' | 'High' | 'Moderate' | 'Managed'

export type RiskTone = 'critical' | 'high' | 'moderate' | 'managed'

export type OfficialLink = {
  label: string
  url: string
}

export type PublicDataSignalLevel = 'low' | 'medium' | 'high'

export type PublicDataSignal = {
  source: string
  label: string
  level: PublicDataSignalLevel
  description: string
  lastUpdated: string
}

export type RiskProfile = {
  country: Country
  region: string
  summary: string
  scores: RiskScores
  keyRisks: string[]
  recommendedActions: string[]
  warningSignals: string[]
  alternativeStrategy: string
  publicDataSignals: PublicDataSignal[]
  officialLinks: OfficialLink[]
}

export type RiskRequest = {
  country: Country
  purpose: Purpose
  industry: Industry
  urgency: Urgency
}
