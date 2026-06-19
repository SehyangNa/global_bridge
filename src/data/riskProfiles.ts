import type {
  Country,
  Industry,
  Purpose,
  RiskProfile,
  Urgency,
} from '../types/risk'

export const countries: Country[] = ['Kenya', 'Nigeria', 'South Africa']
export const purposes: Purpose[] = [
  'Business Trip',
  'Import',
  'Export',
  'Investment',
  'Partner Research',
]
export const industries: Industry[] = [
  'Food',
  'Raw Materials',
  'IT',
  'Healthcare',
  'Education',
  'General',
]
export const urgencies: Urgency[] = ['Low', 'Medium', 'High']

export const officialPublicDataLinks = [
  {
    label: 'MOFA safety information',
    url: 'https://www.0404.go.kr/dev/main.mofa',
  },
  {
    label: 'MOFA travel alerts',
    url: 'https://www.0404.go.kr/dev/country_view.mofa',
  },
  {
    label: 'KOTRA market news',
    url: 'https://dream.kotra.or.kr/kotranews/index.do',
  },
  {
    label: 'KOTRA country information',
    url: 'https://dream.kotra.or.kr/kotranews/cms/nation/actionNatIemList.do?MENU_ID=220',
  },
  {
    label: 'Korea Eximbank exchange-rate information',
    url: 'https://www.koreaexim.go.kr/ir/HPHKIR019M01',
  },
]

export const riskProfiles: Record<Country, RiskProfile> = {
  Kenya: {
    country: 'Kenya',
    region: 'East Africa',
    summary:
      'Kenya is a strong East African gateway with a mature services sector, improving digital infrastructure, and active regional trade links. Planning should account for periodic political tension, variable county-level security, and logistics pressure around ports and main corridors.',
    scores: {
      political: 48,
      security: 55,
      logistics: 46,
      health: 42,
      business: 39,
    },
    keyRisks: [
      'Election cycles and public demonstrations can disrupt urban operations.',
      'Cargo movement through Mombasa and inland corridors may face congestion or documentation delays.',
      'Supplier quality, tax compliance, and county-level licensing requirements vary by sector.',
    ],
    recommendedActions: [
      'Validate partner registrations, tax standing, and references before committing funds.',
      'Build route buffers for port clearance, inland freight, and last-mile delivery.',
      'Use local counsel or a chamber referral for contracts, permits, and county requirements.',
    ],
    warningSignals: [
      'Sudden calls for demonstrations in Nairobi, Mombasa, or key transport corridors.',
      'Unexpected requests to change payment channels or bypass standard customs documentation.',
      'Fuel shortages, port slowdown notices, or major weather alerts affecting freight routes.',
    ],
    alternativeStrategy:
      'Stage commitments through a pilot shipment or limited-scope engagement, then expand after the local partner demonstrates delivery quality and documentation discipline.',
    publicDataSignals: [
      {
        source: 'MOFA safety information',
        label: 'Urban demonstrations watch',
        level: 'medium',
        description:
          'MVP mock signal — periodic demonstrations may affect central Nairobi and major transport routes.',
        lastUpdated: '12 Jun 2026',
      },
      {
        source: 'MOFA travel alert',
        label: 'Regional travel caution',
        level: 'medium',
        description:
          'MVP mock signal — use enhanced route planning outside established business districts and tourist corridors.',
        lastUpdated: '10 Jun 2026',
      },
      {
        source: 'KOTRA market news',
        label: 'Digital trade momentum',
        level: 'low',
        description:
          'MVP mock signal — market reporting points to continued opportunity in digital services and trade enablement.',
        lastUpdated: '14 Jun 2026',
      },
      {
        source: 'KOTRA country information',
        label: 'Customs process variability',
        level: 'medium',
        description:
          'MVP mock signal — import documentation and county-level requirements warrant local validation.',
        lastUpdated: '08 Jun 2026',
      },
      {
        source: 'Korea Eximbank exchange-rate signal',
        label: 'Shilling volatility monitor',
        level: 'medium',
        description:
          'MVP mock signal — allow pricing headroom for potential KRW/KES movement during the engagement.',
        lastUpdated: '15 Jun 2026',
      },
    ],
    officialLinks: [
      {
        label: 'U.S. Travel Advisory: Kenya',
        url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/kenya-travel-advisory.html',
      },
      {
        label: 'Kenya Investment Authority',
        url: 'https://invest.go.ke/',
      },
      {
        label: 'Kenya Revenue Authority',
        url: 'https://www.kra.go.ke/',
      },
    ],
  },
  Nigeria: {
    country: 'Nigeria',
    region: 'West Africa',
    summary:
      'Nigeria offers major market scale, deep entrepreneurial networks, and strong demand across consumer, energy, technology, and industrial sectors. Risk management needs to be active, with attention to security variation by state, foreign exchange exposure, regulatory complexity, and logistics reliability.',
    scores: {
      political: 62,
      security: 72,
      logistics: 66,
      health: 48,
      business: 64,
    },
    keyRisks: [
      'Security conditions differ sharply between Lagos, Abuja, oil-producing regions, and northern states.',
      'Currency volatility and payment delays can affect pricing, margins, and contract performance.',
      'Customs, port congestion, and documentation gaps can create unpredictable clearance timelines.',
    ],
    recommendedActions: [
      'Limit travel plans to vetted routes, secure transport, and confirmed local contacts.',
      'Price contracts with currency, payment milestone, and delay clauses.',
      'Run enhanced due diligence on partners, beneficial owners, sanctions exposure, and litigation history.',
    ],
    warningSignals: [
      'Rapid exchange-rate movement or new foreign exchange restrictions.',
      'Security incidents near planned travel routes, ports, warehouses, or project sites.',
      'Partner pressure for upfront payment without verifiable documentation or references.',
    ],
    alternativeStrategy:
      'Use a Lagos- or Abuja-based distributor, agent, or implementation partner for an initial market test before establishing direct operations or long-dated exposure.',
    publicDataSignals: [
      {
        source: 'MOFA safety information',
        label: 'State-level security variation',
        level: 'high',
        description:
          'MVP mock signal — security exposure varies significantly by state, route, and operating location.',
        lastUpdated: '13 Jun 2026',
      },
      {
        source: 'MOFA travel alert',
        label: 'Enhanced travel planning',
        level: 'high',
        description:
          'MVP mock signal — vetted transport, confirmed contacts, and location-specific checks are recommended.',
        lastUpdated: '11 Jun 2026',
      },
      {
        source: 'KOTRA market news',
        label: 'Large-market demand',
        level: 'low',
        description:
          'MVP mock signal — consumer scale and technology demand support opportunity despite execution risk.',
        lastUpdated: '14 Jun 2026',
      },
      {
        source: 'KOTRA country information',
        label: 'Import compliance complexity',
        level: 'high',
        description:
          'MVP mock signal — customs classification, permits, and local documentation need early verification.',
        lastUpdated: '09 Jun 2026',
      },
      {
        source: 'Korea Eximbank exchange-rate signal',
        label: 'Naira volatility pressure',
        level: 'high',
        description:
          'MVP mock signal — protect margins with currency clauses, milestones, and shorter pricing windows.',
        lastUpdated: '15 Jun 2026',
      },
    ],
    officialLinks: [
      {
        label: 'U.S. Travel Advisory: Nigeria',
        url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/nigeria-travel-advisory.html',
      },
      {
        label: 'Nigerian Investment Promotion Commission',
        url: 'https://www.nipc.gov.ng/',
      },
      {
        label: 'Nigeria Customs Service',
        url: 'https://customs.gov.ng/',
      },
    ],
  },
  'South Africa': {
    country: 'South Africa',
    region: 'Southern Africa',
    summary:
      'South Africa is one of the continent’s most developed commercial hubs, with sophisticated finance, legal, logistics, and professional services. The main planning issues are electricity reliability, crime exposure, labor disruption, and uneven infrastructure performance outside major business corridors.',
    scores: {
      political: 45,
      security: 58,
      logistics: 50,
      health: 35,
      business: 44,
    },
    keyRisks: [
      'Power supply interruptions can affect meetings, warehousing, production, and service delivery.',
      'Crime risk requires disciplined travel, lodging, and cargo security planning.',
      'Labor action, port disruption, or road freight issues can affect supply chain timing.',
    ],
    recommendedActions: [
      'Confirm backup power, connectivity, and contingency procedures with venues and suppliers.',
      'Use secure airport transfers, vetted lodging, and documented cargo handover points.',
      'Build contract timelines around potential port, rail, and power disruption.',
    ],
    warningSignals: [
      'New load-shedding schedules affecting planned operating hours.',
      'Strike notices in transport, ports, mining, utilities, or public services.',
      'Cargo theft alerts or increased incidents near planned transport corridors.',
    ],
    alternativeStrategy:
      'Base the first phase around established hubs such as Johannesburg, Cape Town, or Durban, with remote partner validation before expanding into secondary locations.',
    publicDataSignals: [
      {
        source: 'MOFA safety information',
        label: 'Urban crime precautions',
        level: 'medium',
        description:
          'MVP mock signal — secure transfers and disciplined movement planning remain important in major cities.',
        lastUpdated: '12 Jun 2026',
      },
      {
        source: 'MOFA travel alert',
        label: 'Business travel caution',
        level: 'medium',
        description:
          'MVP mock signal — review neighborhood and road conditions before meetings or site visits.',
        lastUpdated: '10 Jun 2026',
      },
      {
        source: 'KOTRA market news',
        label: 'Established commercial gateway',
        level: 'low',
        description:
          'MVP mock signal — mature finance and professional services support regional market entry.',
        lastUpdated: '13 Jun 2026',
      },
      {
        source: 'KOTRA country information',
        label: 'Infrastructure continuity watch',
        level: 'medium',
        description:
          'MVP mock signal — confirm power, rail, port, and supplier contingency arrangements.',
        lastUpdated: '08 Jun 2026',
      },
      {
        source: 'Korea Eximbank exchange-rate signal',
        label: 'Rand movement monitor',
        level: 'medium',
        description:
          'MVP mock signal — use current quotations and contract buffers for KRW/ZAR exposure.',
        lastUpdated: '15 Jun 2026',
      },
    ],
    officialLinks: [
      {
        label: 'U.S. Travel Advisory: South Africa',
        url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/south-africa-travel-advisory.html',
      },
      {
        label: 'InvestSA',
        url: 'https://www.investsa.gov.za/',
      },
      {
        label: 'South African Revenue Service',
        url: 'https://www.sars.gov.za/',
      },
    ],
  },
}
