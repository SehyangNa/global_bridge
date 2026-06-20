import type {
  Country,
  Industry,
  Purpose,
  RiskProfile,
  Urgency,
} from '../types/risk'

export const countries: Country[] = [
  'Kenya',
  'Nigeria',
  'South Africa',
  'Vietnam',
  'India',
  'United Arab Emirates',
]
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
    categoryExplanations: {
      political: 'Periodic demonstrations and election-cycle tension can interrupt city operations.',
      security: 'Exposure varies by county, route, and time of day.',
      logistics: 'Port clearance and inland corridors can create variable lead times.',
      health: 'Urban care is available, but access and response capacity vary outside major centers.',
      business: 'Licensing, tax, and supplier controls require local verification.',
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
    categoryExplanations: {
      political: 'Policy and foreign-exchange changes can affect commercial execution.',
      security: 'Risk differs materially by state and operating route.',
      logistics: 'Port congestion and documentation gaps can extend clearance times.',
      health: 'Medical access and preventive requirements vary by location.',
      business: 'Currency, payment, and counterparty verification need active controls.',
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
    categoryExplanations: {
      political: 'Policy continuity is balanced by labor and service-delivery pressures.',
      security: 'Urban crime and cargo theft require disciplined movement controls.',
      logistics: 'Power, port, rail, and road reliability can affect delivery schedules.',
      health: 'Major cities offer strong care, with uneven access elsewhere.',
      business: 'A mature legal system supports trade, though continuity planning remains important.',
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
  Vietnam: {
    country: 'Vietnam',
    region: 'Southeast Asia',
    summary: 'Vietnam is a major manufacturing and sourcing base with dense supplier networks and strong regional trade links. Execution planning should account for licensing, product compliance, supplier quality control, customs documentation, and capacity pressure around key industrial corridors.',
    scores: { political: 36, security: 28, logistics: 42, health: 34, business: 45 },
    categoryExplanations: {
      political: 'Policy direction is relatively stable, while administrative interpretation can vary.',
      security: 'Business districts are generally manageable with routine transport precautions.',
      logistics: 'Port and industrial-corridor capacity can tighten during peak periods.',
      health: 'Major cities provide capable care, with more limited access in secondary locations.',
      business: 'Licensing, contracts, product standards, and supplier controls need local validation.',
    },
    keyRisks: [
      'Supplier capacity or quality claims may not match production reality without factory checks.',
      'Customs classification, certificates of origin, and product rules can delay shipments.',
      'Peak-season port and trucking pressure can reduce schedule reliability.',
    ],
    recommendedActions: [
      'Audit supplier capacity, quality systems, subcontracting, and export experience.',
      'Validate HS codes, origin documents, testing, and labeling before production.',
      'Use inspection milestones and buffer time in initial purchase orders.',
    ],
    warningSignals: [
      'A supplier refuses a site audit or cannot document production capacity.',
      'Late changes to origin, invoice, or certification documents.',
      'Sharp increases in port dwell time or container availability constraints.',
    ],
    alternativeStrategy: 'Split the first order across a verified primary supplier and a smaller backup, then consolidate volume after quality and delivery performance are proven.',
    publicDataSignals: [
      { source: 'MOFA safety information', label: 'Urban movement planning', level: 'low', description: 'MVP mock signal — plan vetted transfers and emergency contacts for factory and site visits.', lastUpdated: '15 Jun 2026', category: 'security' },
      { source: 'KOTRA market news', label: 'Manufacturing supply-chain depth', level: 'low', description: 'MVP mock signal — broad manufacturing clusters create sourcing options across several sectors.', lastUpdated: '16 Jun 2026', category: 'market' },
      { source: 'KOTRA country information', label: 'Supplier capacity verification', level: 'medium', description: 'MVP mock signal — verify quality systems, subcontracting, and realistic lead times.', lastUpdated: '14 Jun 2026', category: 'business' },
      { source: 'KOTRA certification information', label: 'Origin and product compliance', level: 'medium', description: 'MVP mock signal — confirm classification, origin, testing, and labeling requirements before shipment.', lastUpdated: '13 Jun 2026', category: 'compliance' },
      { source: 'Korea Eximbank exchange-rate signal', label: 'Dong pricing monitor', level: 'medium', description: 'MVP mock signal — protect purchase-order margins with clear currency and repricing terms.', lastUpdated: '15 Jun 2026', category: 'fx' },
    ],
    officialLinks: [
      { label: 'U.S. Travel Advisory: Vietnam', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/vietnam-travel-advisory.html' },
      { label: 'Vietnam Trade Promotion Agency', url: 'https://vietrade.gov.vn/' },
      { label: 'Vietnam Customs', url: 'https://www.customs.gov.vn/' },
    ],
  },
  India: {
    country: 'India',
    region: 'South Asia',
    summary: 'India combines deep technology talent, large domestic demand, and mature service ecosystems with significant state-level variation. Partnership decisions should account for corporate verification, data and tax obligations, contracting detail, talent continuity, and infrastructure differences by city.',
    scores: { political: 43, security: 40, logistics: 48, health: 43, business: 49 },
    categoryExplanations: {
      political: 'National and state-level rules can create different operating conditions.',
      security: 'City, route, and event-specific conditions require routine monitoring.',
      logistics: 'Infrastructure quality and delivery performance vary across states and cities.',
      health: 'Strong private care exists in major cities, with uneven access and air-quality exposure.',
      business: 'Tax, data, employment, and contract details require careful structuring.',
    },
    keyRisks: [
      'A partner’s stated engineering capacity may depend heavily on subcontractors or key staff.',
      'Data handling, intellectual property, tax, and employment obligations can cross jurisdictions.',
      'State-level rules and infrastructure differences can change delivery assumptions.',
    ],
    recommendedActions: [
      'Verify registration, beneficial ownership, references, key staff, and audited delivery history.',
      'Define data location, access control, IP ownership, service levels, and exit assistance in writing.',
      'Begin with a milestone-based pilot and independent security or code review.',
    ],
    warningSignals: [
      'Unexplained turnover among the staff assigned to the engagement.',
      'Resistance to customer references, security review, or IP ownership clauses.',
      'Material delivery depends on unnamed affiliates or subcontractors.',
    ],
    alternativeStrategy: 'Use a limited, non-core pilot with staged access to systems and data, then scale only after service quality, security, and team continuity are verified.',
    publicDataSignals: [
      { source: 'MOFA safety information', label: 'City-level travel and health planning', level: 'medium', description: 'MVP mock signal — review local transport, air quality, weather, and emergency contacts before travel.', lastUpdated: '15 Jun 2026', category: 'security' },
      { source: 'KOTRA market news', label: 'Deep digital-services market', level: 'low', description: 'MVP mock signal — a broad technology ecosystem supports multiple partnership models.', lastUpdated: '16 Jun 2026', category: 'market' },
      { source: 'KOTRA country information', label: 'IT partner delivery validation', level: 'medium', description: 'MVP mock signal — confirm team ownership, subcontracting, references, and delivery governance.', lastUpdated: '14 Jun 2026', category: 'business' },
      { source: 'KOTRA certification information', label: 'Data, tax, and IP obligations', level: 'medium', description: 'MVP mock signal — obtain advice on applicable data, tax, employment, and IP requirements.', lastUpdated: '13 Jun 2026', category: 'compliance' },
      { source: 'Korea Eximbank exchange-rate signal', label: 'Rupee contract exposure', level: 'medium', description: 'MVP mock signal — define currency, tax treatment, and repricing triggers in service contracts.', lastUpdated: '15 Jun 2026', category: 'fx' },
    ],
    officialLinks: [
      { label: 'U.S. Travel Advisory: India', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/india-travel-advisory.html' },
      { label: 'Invest India', url: 'https://www.investindia.gov.in/' },
      { label: 'Ministry of Corporate Affairs', url: 'https://www.mca.gov.in/' },
    ],
  },
  'United Arab Emirates': {
    country: 'United Arab Emirates',
    region: 'Middle East',
    summary: 'The United Arab Emirates is a highly connected aviation, logistics, finance, and re-export hub with modern infrastructure and multiple mainland and free-zone regimes. Planning should focus on licensing scope, customs and re-export controls, sanctions screening, ownership checks, and cost differences between jurisdictions.',
    scores: { political: 24, security: 25, logistics: 25, health: 22, business: 36 },
    categoryExplanations: {
      political: 'The operating environment is stable, with policy and regional exposure still worth monitoring.',
      security: 'Day-to-day exposure is comparatively low, but regional contingency planning matters.',
      logistics: 'Infrastructure is strong, though routing, customs, and free-zone procedures must align.',
      health: 'High-quality medical services are widely available in major emirates.',
      business: 'Licence scope, jurisdiction, tax, sanctions, and ownership checks drive execution risk.',
    },
    keyRisks: [
      'A mainland or free-zone licence may not cover the planned activity or customer location.',
      'Re-export, dual-use, sanctions, and beneficial-ownership controls can affect transactions.',
      'Premium warehousing, staffing, and service costs can weaken hub economics.',
    ],
    recommendedActions: [
      'Map the exact activity, emirate, customs flow, and licence scope before selecting a structure.',
      'Screen counterparties, owners, goods, vessels, destinations, and payment routes.',
      'Model total landed and operating cost across at least two hub or free-zone options.',
    ],
    warningSignals: [
      'A provider cannot show that its licence covers the proposed logistics activity.',
      'Requests to obscure the end user, destination, ownership, or payment chain.',
      'Hub economics depend on undocumented customs or tax assumptions.',
    ],
    alternativeStrategy: 'Start with a licensed third-party logistics provider and a limited routing pilot before committing to a dedicated entity, warehouse, or long-term lease.',
    publicDataSignals: [
      { source: 'MOFA safety information', label: 'Regional travel contingency', level: 'low', description: 'MVP mock signal — maintain current routing and emergency-contact plans for regional disruption.', lastUpdated: '15 Jun 2026', category: 'security' },
      { source: 'KOTRA market news', label: 'Global logistics connectivity', level: 'low', description: 'MVP mock signal — strong air, sea, and re-export links support hub strategies.', lastUpdated: '16 Jun 2026', category: 'market' },
      { source: 'KOTRA country information', label: 'Free-zone and mainland fit', level: 'medium', description: 'MVP mock signal — compare licence scope, customer access, cost, and customs treatment.', lastUpdated: '14 Jun 2026', category: 'business' },
      { source: 'KOTRA certification information', label: 'Re-export and sanctions controls', level: 'medium', description: 'MVP mock signal — screen goods, end users, destinations, ownership, and payment routes.', lastUpdated: '13 Jun 2026', category: 'compliance' },
      { source: 'Korea Eximbank exchange-rate signal', label: 'Dollar-linked pricing exposure', level: 'low', description: 'MVP mock signal — model USD-linked costs and KRW conversion in hub economics.', lastUpdated: '15 Jun 2026', category: 'fx' },
    ],
    officialLinks: [
      { label: 'U.S. Travel Advisory: United Arab Emirates', url: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/united-arab-emirates-travel-advisory.html' },
      { label: 'UAE Ministry of Economy', url: 'https://www.moec.gov.ae/' },
      { label: 'UAE Federal Customs Authority', url: 'https://icp.gov.ae/' },
    ],
  },
}
