import { countries, signal } from './sources/common.js'

const templates = {
  security: {
    titleKo: '지역별 치안 편차 점검', titleEn: 'Review local security variation',
    summaryKo: 'MVP 모의 신호 — 이동 지역과 시간대별 치안 노출을 공식 안전정보로 다시 확인하세요.',
    summaryEn: 'MVP mock signal — Recheck location- and time-specific security exposure against official safety information.',
    level: 'medium',
  },
  travel: {
    titleKo: '출장 동선 사전 확인', titleEn: 'Pre-check business travel routes',
    summaryKo: 'MVP 모의 신호 — 출발 전에 여행경보, 교통편, 현지 비상 연락망을 확인하세요.',
    summaryEn: 'MVP mock signal — Check travel alerts, transport, and local emergency contacts before departure.',
    level: 'medium',
  },
  business: {
    titleKo: '현지 파트너 검증 필요', titleEn: 'Local partner verification needed',
    summaryKo: 'MVP 모의 신호 — 법인 등록, 납세 상태, 실소유주와 거래 레퍼런스를 검증하세요.',
    summaryEn: 'MVP mock signal — Verify registration, tax standing, beneficial ownership, and trade references.',
    level: 'medium',
  },
  market: {
    titleKo: '시장·통관 변화 모니터링', titleEn: 'Monitor market and customs changes',
    summaryKo: 'MVP 모의 신호 — 가격, 수입 규정, 통관과 공급망 변화를 계약 전 재확인하세요.',
    summaryEn: 'MVP mock signal — Recheck pricing, import rules, customs, and supply-chain changes before contracting.',
    level: 'medium',
  },
  compliance: {
    titleKo: '인증·규제 요건 사전 검토', titleEn: 'Review certification requirements',
    summaryKo: 'MVP 모의 신호 — 품목별 인증, 라벨링, 시험과 서류 요건을 선적 전에 확인하세요.',
    summaryEn: 'MVP mock signal — Confirm product certification, labeling, testing, and documentation before shipment.',
    level: 'medium',
  },
  fx: {
    titleKo: '환율 변동성 관리', titleEn: 'Manage exchange-rate volatility',
    summaryKo: 'MVP 모의 신호 — 가격 유효기간과 환율 조항을 활용해 계약 마진을 보호하세요.',
    summaryEn: 'MVP mock signal — Protect contract margins with short quote validity and exchange-rate clauses.',
    level: 'medium',
  },
  industryRisk: {
    titleKo: '업종 위험지수 미연결', titleEn: 'Industry risk index unavailable',
    summaryKo: 'MVP 모의 신호 — K-SURE 실시간 지수가 없으므로 기존 목적·산업 기반 점수를 유지합니다.',
    summaryEn: 'MVP mock signal — The existing purpose- and industry-based score is retained because live K-SURE data is unavailable.',
    level: 'medium',
  },
}

const countryOverrides = {
  Kenya: {
    security: ['도시 시위와 이동 동선 점검', 'Urban demonstrations and route checks'],
    business: ['파트너 등록·세무 검증', 'Partner registration and tax verification'],
    compliance: ['통관·케냐 표준 요건 확인', 'Customs and Kenya standards checks'],
  },
  Nigeria: {
    security: ['주별 치안·이동 리스크 점검', 'State-level security and movement checks'],
    business: ['결제·실소유주 검증', 'Payment and beneficial-owner verification'],
    compliance: ['수입 허가·품목분류 확인', 'Import permits and classification checks'],
  },
  'South Africa': {
    security: ['도시 이동·화물 보안 점검', 'Urban movement and cargo security checks'],
    business: ['전력·공급업체 연속성 검증', 'Power and supplier continuity checks'],
    compliance: ['현지조달·인증 요건 확인', 'Local procurement and certification checks'],
  },
  Vietnam: {
    security: ['출장 동선·교통 리스크 점검', 'Business route and traffic risk checks'],
    business: ['공급업체 품질·생산역량 검증', 'Supplier quality and capacity verification'],
    compliance: ['통관·원산지·품목 인증 확인', 'Customs, origin, and product certification checks'],
  },
  India: {
    security: ['도시별 이동·보건 계획 점검', 'City-level movement and health planning'],
    business: ['IT 파트너 역량·레퍼런스 검증', 'IT partner capability and reference checks'],
    compliance: ['데이터·세무·계약 요건 확인', 'Data, tax, and contracting checks'],
  },
  'United Arab Emirates': {
    security: ['이동·비상연락 계획 점검', 'Movement and emergency-contact planning'],
    business: ['물류 파트너·프리존 인가 검증', 'Logistics partner and free-zone licence checks'],
    compliance: ['재수출·제재·실소유주 확인', 'Re-export, sanctions, and ownership checks'],
  },
}

const purposeContext = {
  Import: ['수입 물류, 통관, 공급자 신뢰성, 결제 조건을 우선 확인하세요.', 'Prioritize import logistics, customs, supplier reliability, and payment terms.'],
  Export: ['시장 진입, 인증, 규제, 현지 유통 조건을 우선 확인하세요.', 'Prioritize market access, certification, regulation, and local distribution.'],
  'Business Trip': ['치안, 보건, 현지 이동, 비상 연락망을 우선 확인하세요.', 'Prioritize security, health, local movement, and emergency contacts.'],
  Investment: ['규제, 정치 리스크, 법률 실사, 파트너 검증을 우선 확인하세요.', 'Prioritize regulation, political risk, legal due diligence, and partner validation.'],
  'Partner Research': ['법인·레퍼런스를 검증하고 시범 계약으로 이행력을 확인하세요.', 'Verify the company and references, then test delivery through a pilot contract.'],
}

export const fallbackCategories = Object.keys(templates)

export function createFallbackSignals(country, categories, context = {}) {
  const metadata = countries[country]
  if (!metadata) return []
  return categories.map((category) => {
    const template = templates[category]
    const override = countryOverrides[country]?.[category]
    const purposeNote = purposeContext[context.purpose]
    return signal({
      source: 'MVP fallback', sourceType: 'fallback', category,
      titleKo: `${metadata.nameKo}: ${override?.[0] ?? template.titleKo}`,
      titleEn: `${metadata.nameEn}: ${override?.[1] ?? template.titleEn}`,
      summaryKo: `${template.summaryKo}${purposeNote ? ` ${purposeNote[0]}` : ''}`,
      summaryEn: `${template.summaryEn}${purposeNote ? ` ${purposeNote[1]}` : ''}`,
      level: template.level, status: 'mock', publishedAt: null,
      rawSourceName: 'Global Bridge MVP fallback',
    })
  })
}
