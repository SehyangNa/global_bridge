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

export const fallbackCategories = Object.keys(templates)

export function createFallbackSignals(country, categories) {
  const metadata = countries[country]
  if (!metadata) return []
  return categories.map((category) => {
    const template = templates[category]
    return signal({
      source: 'MVP fallback', sourceType: 'fallback', category,
      titleKo: `${metadata.ko}: ${template.titleKo}`,
      titleEn: `${country}: ${template.titleEn}`,
      summaryKo: template.summaryKo, summaryEn: template.summaryEn,
      level: template.level, status: 'mock', publishedAt: null,
      rawSourceName: 'Global Bridge MVP fallback',
    })
  })
}
