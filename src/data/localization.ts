import type {
  Country,
  Industry,
  PublicDataSignalLevel,
  Purpose,
  RiskCategory,
  RiskLevel,
  Urgency,
} from '../types/risk'

export type Language = 'ko' | 'en'

export const labels = {
  country: {
    Kenya: { ko: '케냐', en: 'Kenya' },
    Nigeria: { ko: '나이지리아', en: 'Nigeria' },
    'South Africa': { ko: '남아프리카공화국', en: 'South Africa' },
    Vietnam: { ko: '베트남', en: 'Vietnam' },
    India: { ko: '인도', en: 'India' },
    'United Arab Emirates': { ko: '아랍에미리트', en: 'United Arab Emirates' },
  } satisfies Record<Country, Record<Language, string>>,
  purpose: {
    'Business Trip': { ko: '출장', en: 'Business Trip' },
    Import: { ko: '수입', en: 'Import' },
    Export: { ko: '수출', en: 'Export' },
    Investment: { ko: '투자', en: 'Investment' },
    'Partner Research': { ko: '파트너 조사', en: 'Partner Research' },
  } satisfies Record<Purpose, Record<Language, string>>,
  industry: {
    Food: { ko: '식품', en: 'Food' },
    'Raw Materials': { ko: '원자재', en: 'Raw Materials' },
    IT: { ko: 'IT', en: 'IT' },
    Healthcare: { ko: '헬스케어', en: 'Healthcare' },
    Education: { ko: '교육', en: 'Education' },
    General: { ko: '일반', en: 'General' },
  } satisfies Record<Industry, Record<Language, string>>,
  urgency: {
    Low: { ko: '낮음', en: 'Low' },
    Medium: { ko: '보통', en: 'Medium' },
    High: { ko: '높음', en: 'High' },
  } satisfies Record<Urgency, Record<Language, string>>,
  riskLevel: {
    Critical: { ko: '매우 높음', en: 'Critical' },
    High: { ko: '높음', en: 'High' },
    Moderate: { ko: '보통', en: 'Moderate' },
    Managed: { ko: '관리 가능', en: 'Managed' },
  } satisfies Record<RiskLevel, Record<Language, string>>,
  signalLevel: {
    low: { ko: '낮음', en: 'Low' },
    medium: { ko: '보통', en: 'Medium' },
    high: { ko: '높음', en: 'High' },
  } satisfies Record<PublicDataSignalLevel, Record<Language, string>>,
  category: {
    political: { ko: '정치', en: 'Political' },
    security: { ko: '안보', en: 'Security' },
    logistics: { ko: '물류', en: 'Logistics' },
    health: { ko: '보건', en: 'Health' },
    business: { ko: '비즈니스', en: 'Business' },
  } satisfies Record<RiskCategory, Record<Language, string>>,
}

export const purposeRecommendations: Record<
  Purpose,
  Record<Language, string>
> = {
  'Business Trip': {
    ko: '각 이동 구간 전에 최신 안전정보와 여행경보 신호를 확인하세요.',
    en: 'Confirm current public safety and travel-alert signals before every trip segment.',
  },
  Import: {
    ko: '최종 원가를 확정하기 전에 KOTRA 무역 정보와 환율 변동을 교차 확인하세요.',
    en: 'Cross-check KOTRA trade guidance and exchange-rate movement before confirming landed cost.',
  },
  Export: {
    ko: '선적 전에 시장 진입 규정, 구매자 서류, 통화 조건을 검증하세요.',
    en: 'Validate market-entry rules, buyer documentation, and currency terms before shipment.',
  },
  Investment: {
    ko: '국가정보와 시장뉴스 신호를 활용해 측정 가능한 단계별 투자로 진행하세요.',
    en: 'Use country information and market-news signals to stage investment through measurable milestones.',
  },
  'Partner Research': {
    ko: '상대방의 자격을 검증하고 파트너의 주장을 공식 국가·시장 정보와 비교하세요.',
    en: 'Verify counterpart credentials and compare partner claims with official country and market information.',
  },
}

export const purposeWarningSignals: Record<Purpose, Record<Language, string>> = {
  Import: { ko: '통관 서류 변경, 공급자 납기 지연, 비정상적인 결제 요청', en: 'Customs-document changes, supplier delays, or unusual payment requests' },
  Export: { ko: '인증·시장진입 규정 변경, 바이어 서류 미비, 유통 계약 불일치', en: 'Certification or market-access changes, incomplete buyer records, or distribution-contract gaps' },
  'Business Trip': { ko: '이동로 주변 사건, 보건 경보, 현지 연락두절', en: 'Incidents near travel routes, health alerts, or loss of local contact' },
  Investment: { ko: '인허·정책 변경, 소유권 불투명성, 법률 실사 자료 누락', en: 'Licence or policy changes, opaque ownership, or missing legal due-diligence records' },
  'Partner Research': { ko: '레퍼런스 확인 거부, 소유권 불일치, 파일럿 계약 회피', en: 'Refusal of references, ownership inconsistencies, or avoidance of a pilot contract' },
}

export const industryRecommendations: Record<Industry, Record<Language, string>> = {
  Food: { ko: '위생·라벨링·유통기한·콜드체인 증빙을 확인하세요.', en: 'Verify hygiene, labeling, shelf-life, and cold-chain evidence.' },
  'Raw Materials': { ko: '품질 규격, 원산지, 선적 용량, 가격 조정 조항을 확인하세요.', en: 'Verify specifications, origin, shipping capacity, and price-adjustment clauses.' },
  IT: { ko: '데이터 접근, 보안 통제, IP 소유, 하청 구조를 확인하세요.', en: 'Verify data access, security controls, IP ownership, and subcontracting.' },
  Healthcare: { ko: '허가·임상·보관·유통 요건을 선적 전에 확인하세요.', en: 'Verify authorization, clinical, storage, and distribution requirements before shipment.' },
  Education: { ko: '인가, 학위·수료 인정, 개인정보, 현지 파트너 역할을 확인하세요.', en: 'Verify accreditation, credential recognition, privacy, and local-partner roles.' },
  General: { ko: '업종별 인허·세무·계약 요건을 현지 전문가와 확인하세요.', en: 'Confirm sector-specific licensing, tax, and contract requirements locally.' },
}

export const ui = {
  ko: {
    primaryNav: '주요 메뉴', riskCheck: '리스크 확인', eyebrow: '공공데이터 국가 인텔리전스',
    tagline: '공공데이터 기반 AI 국가 리스크 인텔리전스',
    intro: '새로운 국가에 진출하기 전에 시장, 출장, 물류, 보건, 파트너 리스크를 비교하세요. Global Bridge는 여러 국가 신호를 빠르게 움직이는 소규모 팀을 위한 실용적인 브리핑으로 정리합니다.',
    sourceIntro: '이 MVP는 외교부 해외안전정보와 여행경보, KOTRA 해외시장뉴스와 국가정보, 한국수출입은행 환율정보 등 공공데이터 활용을 전제로 설계되었습니다.',
    start: '리스크 확인 시작', preview: '공공데이터 브리핑 미리보기', mock: 'MVP 모의 데이터', riskScore: '리스크 점수',
    security: '안보', logistics: '물류', business: '비즈니스', high: '높음', watch: '주의', elevated: '상승',
    mockSignals: '모의 공공데이터 신호', previewSignals: '외교부 여행정보, KOTRA 시장뉴스, 환율 압력',
    riskInput: '리스크 입력', formTitle: '국가 리스크 브리핑 생성',
    formIntro: '국가, 목적, 산업, 긴급도를 선택하세요. 외교부 안전정보는 사용 가능할 때 실시간으로 가져오며, 나머지 출처는 MVP 모의 신호를 사용합니다.',
    country: '국가', purpose: '목적', industry: '산업', urgency: '긴급도', generateRisk: '리스크 브리핑 생성',
    countryHelper: '대상 국가를 선택하세요.', purposeHelper: '비즈니스 목적을 선택하세요.', industryHelper: '관련 산업을 선택하세요.', urgencyHelper: '의사결정 긴급도를 선택하세요.',
    demoPresets: '데모 시나리오', demoPresetsIntro: '경진대회 데모에 적합한 시나리오를 한 번에 적용하세요.',
    presets: { kenyaImport: '케냐 수입 리스크', nigeriaTrip: '나이지리아 출장 리스크', southAfricaPartner: '남아공 파트너 조사', vietnamSupplyChain: '베트남 공급망 리스크', indiaItPartner: '인도 IT 파트너십', uaeLogistics: 'UAE 물류 허브 검토' },
    briefingSuffix: '리스크 브리핑', urgencySuffix: '긴급도', copy: '요약 복사', copied: '복사 완료', copyFailed: '복사 실패', generate: '브리핑 생성',
    transparency: '실시간 공공데이터를 사용할 수 있으면 우선 표시하고, 선택 국가·목적·산업과 직접 관련된 데이터가 부족하면 MVP 모의 신호를 함께 표시합니다.',
    overallLevel: '종합 리스크 수준', overallScore: '종합 점수', urgencyAdjustment: '긴급도 조정', categoryScores: '리스크 항목별 점수',
    countrySummary: '국가 리스크 요약', keyRisks: '핵심 리스크', recommended: '권고 조치', warningSignals: '주의 신호', alternative: '대안 전략',
    categoryExplanation: '항목 해설',
    scopeNote: '현재 MVP는 6개 대표 국가를 대상으로 구현되었으며, 국가 매핑과 공공데이터 필터를 확장해 다른 지역으로 확대할 수 있습니다.',
    publicSignals: '공공데이터 신호', publicSignalsIntro: '연결된 공공데이터가 부족해 MVP 보완 신호를 표시합니다.', notLive: '모의 데이터 · 실시간 아님', lastUpdated: '최종 업데이트',
    livePublicData: '실시간 공공데이터',
    archivedPublicData: '과거 공공데이터',
    mockData: 'MVP 모의 데이터',
    publicSignalsLiveIntro: '외교부, KOTRA, 한국무역보험공사의 관련 신호를 출처별로 표시합니다.',
    publicSignalsArchivedIntro: '과거 공공데이터와 부족한 카테고리를 보완하는 MVP 모의 신호를 함께 표시합니다.',
    liveAvailabilityNote: '실시간 공공데이터를 사용할 수 있으면 우선 표시하고, 선택 국가·목적·산업과 직접 관련된 데이터가 부족하면 MVP 모의 신호를 함께 표시합니다.',
    liveFallbackNote: '선택한 국가와 직접 관련된 최근 외교부 안전정보를 찾지 못했습니다.',
    liveLoading: '실시간 외교부 안전정보를 확인하는 중입니다.',
    aggregateLoading: '승인된 공공데이터 출처를 통합 조회하는 중입니다.', aggregateFallbackNote: '공공데이터 프록시를 사용할 수 없어 로컬 MVP 보완 신호를 표시합니다.', failedSources: '응답하지 않은 출처', officialSourceLink: '공식 출처 확인',
    ksureApplied: 'K-SURE 국가·업종 위험지수가 비즈니스 및 종합 점수에 반영되었습니다.', ksureFallback: 'K-SURE 위험지수를 사용할 수 없어 기존 목적·산업 기반 점수를 유지합니다.',
    originalKorean: '외교부가 제공한 한국어 원문',
    officialSources: '공식 공공데이터 출처', officialSourcesIntro: '이 MVP가 연동하도록 설계된 공식 데이터 출처 링크입니다.', additionalLinks: '추가 국가 정보 링크',
    generated: 'AI 리스크 브리핑', primaryOutput: '핵심 의사결정 결과', generatedPlaceholder: '선택한 조건과 공공데이터 신호만 근거로 간결한 경영진용 브리핑을 생성합니다.',
    generating: 'AI 브리핑 생성 중…', generatingBriefing: 'AI 브리핑을 생성하는 중입니다...',
    generationMode: '생성 방식', aiGenerated: 'Groq AI', templateFallback: '기본 브리핑',
    situationSummary: '상황 요약', aiMainRisks: '주요 리스크', aiRecommendedActions: '실행 권고', aiAlternativeStrategy: '대안 전략', aiSourceReminder: '데이터 출처 안내', aiDecisionNote: '최종 의사결정 메모',
  },
  en: {
    primaryNav: 'Primary', riskCheck: 'Risk check', eyebrow: 'Public-data country intelligence',
    tagline: 'Public data-powered AI country risk intelligence',
    intro: 'Compare market, travel, logistics, health, and partner risks before entering a new country. Global Bridge turns country signals into a practical briefing for small teams that need to move fast without missing critical exposure.',
    sourceIntro: 'This MVP is designed around public sources including MOFA safety information and travel alerts, KOTRA market news and country information, and Korea Eximbank exchange-rate data.',
    start: 'Start Risk Check', preview: 'Public-data briefing preview', mock: 'MVP mock', riskScore: 'risk score',
    security: 'Security', logistics: 'Logistics', business: 'Business', high: 'High', watch: 'Watch', elevated: 'Elevated',
    mockSignals: 'Mock public-data signals', previewSignals: 'MOFA travel context, KOTRA market news, FX pressure',
    riskInput: 'Risk input', formTitle: 'Generate a country risk briefing',
    formIntro: 'Select the country, purpose, industry, and urgency. Live MOFA safety information is used when available; remaining sources use MVP mock signals.',
    country: 'Country', purpose: 'Purpose', industry: 'Industry', urgency: 'Urgency', generateRisk: 'Generate Risk Briefing',
    countryHelper: 'Select target market.', purposeHelper: 'Choose your business objective.', industryHelper: 'Select relevant sector.', urgencyHelper: 'Set decision timeline.',
    demoPresets: 'Demo scenarios', demoPresetsIntro: 'Apply a competition-ready scenario in one click.',
    presets: { kenyaImport: 'Kenya Import Risk', nigeriaTrip: 'Nigeria Business Trip Risk', southAfricaPartner: 'South Africa Partner Research', vietnamSupplyChain: 'Vietnam Supply Chain Risk', indiaItPartner: 'India IT Partnership', uaeLogistics: 'UAE Logistics Hub Review' },
    briefingSuffix: 'Risk Briefing', urgencySuffix: 'urgency', copy: 'Copy summary', copied: 'Copied', copyFailed: 'Copy failed', generate: 'Generate briefing',
    transparency: 'Live public data is shown when available. If country-, purpose-, or industry-specific data is insufficient, MVP mock signals are also shown.',
    overallLevel: 'Overall risk level', overallScore: 'Overall score', urgencyAdjustment: 'Urgency adjustment', categoryScores: 'Risk category scores',
    countrySummary: 'Country risk summary', keyRisks: 'Key risks', recommended: 'Recommended actions', warningSignals: 'Warning signals', alternative: 'Alternative strategy',
    categoryExplanation: 'Category context',
    scopeNote: 'The current MVP supports six demo countries and can be expanded to additional regions through country mappings and public data filters.',
    publicSignals: 'Public Data Signals', publicSignalsIntro: 'MVP fallback signals are shown where connected public data is insufficient.', notLive: 'Mock data · not live', lastUpdated: 'Last updated',
    livePublicData: 'Live public data',
    archivedPublicData: 'Archived public data',
    mockData: 'MVP mock data',
    publicSignalsLiveIntro: 'Relevant signals from MOFA, KOTRA, and K-SURE are grouped by source.',
    publicSignalsArchivedIntro: 'Archived public data is shown with MVP mock signals for missing categories.',
    liveAvailabilityNote: 'Live public data is shown when available. If country-, purpose-, or industry-specific data is insufficient, MVP mock signals are also shown.',
    liveFallbackNote: 'No recent country-specific MOFA safety information was found.',
    liveLoading: 'Checking live MOFA safety data.',
    aggregateLoading: 'Checking the approved public-data sources.', aggregateFallbackNote: 'The public-data proxy is unavailable, so local MVP fallback signals are shown.', failedSources: 'Unavailable sources', officialSourceLink: 'View official source',
    ksureApplied: 'The K-SURE country and industry risk index was applied to business and overall scores.', ksureFallback: 'The existing purpose- and industry-based score is retained because K-SURE data is unavailable.',
    originalKorean: 'Original Korean notice from MOFA',
    officialSources: 'Official public data sources', officialSourcesIntro: 'Reference links for the official sources this MVP is designed to use.', additionalLinks: 'Additional country links',
    generated: 'AI Risk Briefing', primaryOutput: 'Primary decision output', generatedPlaceholder: 'Generate a compact executive briefing grounded only in the selected context and public-data signals.',
    generating: 'Generating AI briefing…', generatingBriefing: 'Generating AI briefing...',
    generationMode: 'Generation mode', aiGenerated: 'Groq AI', templateFallback: 'Template fallback',
    situationSummary: 'Situation summary', aiMainRisks: 'Main risks', aiRecommendedActions: 'Recommended actions', aiAlternativeStrategy: 'Alternative strategy', aiSourceReminder: 'Source reminder', aiDecisionNote: 'Final decision note',
  },
}

type KoreanProfile = {
  region: string
  summary: string
  categoryExplanations: Record<RiskCategory, string>
  keyRisks: string[]
  recommendedActions: string[]
  warningSignals: string[]
  alternativeStrategy: string
  signals: Array<{ source: string; label: string; description: string; lastUpdated: string }>
  officialLinkLabels: string[]
}

export const koreanProfiles: Record<Country, KoreanProfile> = {
  Kenya: {
    region: '동아프리카',
    summary: '케냐는 성숙한 서비스 산업, 개선되는 디지털 인프라, 활발한 역내 교역망을 갖춘 동아프리카의 주요 관문입니다. 주기적인 정치적 긴장, 지역별 치안 편차, 항만과 주요 운송로의 물류 부담을 계획에 반영해야 합니다.',
    categoryExplanations: { political: '시위와 선거 주기의 긴장이 도시 운영을 방해할 수 있습니다.', security: '지역·동선·시간대에 따라 노출이 달라집니다.', logistics: '항만 통관과 내륙 운송로에서 리드타임 편차가 발생합니다.', health: '도시 진료는 가능하지만 주요 도시 밖은 접근성이 다릅니다.', business: '인허·세무·공급업체를 현지에서 검증해야 합니다.' },
    keyRisks: ['선거 주기와 대규모 시위가 도시 운영을 방해할 수 있습니다.', '몸바사항과 내륙 운송로의 화물은 혼잡 또는 서류 지연을 겪을 수 있습니다.', '공급업체 품질, 세무 준수, 지역별 인허가 요건이 산업마다 다릅니다.'],
    recommendedActions: ['자금 투입 전 파트너 등록, 납세 상태, 레퍼런스를 검증하세요.', '통관, 내륙 운송, 라스트마일 배송 일정에 여유를 두세요.', '계약과 인허가에는 현지 법률 전문가 또는 상공회의소 추천을 활용하세요.'],
    warningSignals: ['나이로비, 몸바사 또는 주요 운송로의 갑작스러운 시위 예고', '결제 경로 변경이나 표준 통관 서류 우회를 요구하는 요청', '연료 부족, 항만 작업 둔화 또는 주요 기상 경보'],
    alternativeStrategy: '시험 선적이나 제한된 범위의 협업으로 시작하고, 현지 파트너가 납품 품질과 서류 처리 역량을 입증한 뒤 확대하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '도심 시위 주의', description: 'MVP 모의 신호 — 주기적인 시위가 나이로비 중심부와 주요 교통로에 영향을 줄 수 있습니다.', lastUpdated: '2026. 6. 12.' },
      { source: '외교부 여행경보', label: '지역별 여행 주의', description: 'MVP 모의 신호 — 주요 업무·관광 지역 밖에서는 강화된 이동 계획이 필요합니다.', lastUpdated: '2026. 6. 10.' },
      { source: 'KOTRA 해외시장뉴스', label: '디지털 교역 성장세', description: 'MVP 모의 신호 — 디지털 서비스와 무역 지원 분야에서 기회가 이어지고 있습니다.', lastUpdated: '2026. 6. 14.' },
      { source: 'KOTRA 국가정보', label: '통관 절차 편차', description: 'MVP 모의 신호 — 수입 서류와 지역별 요건을 현지에서 확인해야 합니다.', lastUpdated: '2026. 6. 8.' },
      { source: '한국수출입은행 환율 신호', label: '실링 변동성 모니터링', description: 'MVP 모의 신호 — 계약 기간 중 원/케냐실링 변동에 대비한 가격 여유가 필요합니다.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 케냐', '케냐 투자청', '케냐 국세청'],
  },
  Nigeria: {
    region: '서아프리카',
    summary: '나이지리아는 거대한 시장 규모, 깊은 창업 네트워크, 소비재·에너지·기술·산업 분야의 강한 수요를 보유하고 있습니다. 주별 치안 편차, 환율 노출, 규제 복잡성, 물류 신뢰성을 적극적으로 관리해야 합니다.',
    categoryExplanations: { political: '정책과 외환 제도 변화가 상업 실행에 영향을 줍니다.', security: '주와 운영 동선별 리스크 차이가 큽니다.', logistics: '항만 혼잡과 서류 미비가 통관을 지연시킬 수 있습니다.', health: '지역별 의료 접근성과 예방 요건이 다릅니다.', business: '환율·결제·거래상대방을 능동적으로 관리해야 합니다.' },
    keyRisks: ['라고스, 아부자, 산유 지역, 북부 주 사이의 치안 상황이 크게 다릅니다.', '통화 변동성과 결제 지연이 가격, 마진, 계약 이행에 영향을 줄 수 있습니다.', '통관, 항만 혼잡, 서류 미비로 반출 일정이 불확실해질 수 있습니다.'],
    recommendedActions: ['검증된 이동 경로, 안전한 교통편, 확인된 현지 연락처로 출장 범위를 제한하세요.', '환율, 단계별 결제, 지연 조항을 계약 가격에 반영하세요.', '파트너, 실소유주, 제재 노출, 소송 이력에 대해 강화된 실사를 수행하세요.'],
    warningSignals: ['급격한 환율 움직임 또는 새로운 외환 규제', '예정 이동로, 항만, 창고, 프로젝트 현장 주변의 치안 사건', '검증 가능한 서류나 레퍼런스 없이 선결제를 요구하는 파트너'],
    alternativeStrategy: '직접 운영이나 장기 투자를 시작하기 전에 라고스 또는 아부자 기반의 유통사·에이전트·실행 파트너를 활용해 시장을 시험하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '주별 치안 편차', description: 'MVP 모의 신호 — 주, 이동 경로, 운영 위치에 따라 치안 노출이 크게 다릅니다.', lastUpdated: '2026. 6. 13.' },
      { source: '외교부 여행경보', label: '강화된 출장 계획', description: 'MVP 모의 신호 — 검증된 교통편, 확인된 연락처, 지역별 사전 점검이 권고됩니다.', lastUpdated: '2026. 6. 11.' },
      { source: 'KOTRA 해외시장뉴스', label: '대형 시장 수요', description: 'MVP 모의 신호 — 실행 리스크에도 불구하고 소비시장 규모와 기술 수요가 기회를 뒷받침합니다.', lastUpdated: '2026. 6. 14.' },
      { source: 'KOTRA 국가정보', label: '복잡한 수입 규정', description: 'MVP 모의 신호 — 품목 분류, 허가, 현지 서류를 조기에 검증해야 합니다.', lastUpdated: '2026. 6. 9.' },
      { source: '한국수출입은행 환율 신호', label: '나이라 변동성 압력', description: 'MVP 모의 신호 — 환율 조항, 단계별 결제, 짧은 가격 유효기간으로 마진을 보호하세요.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 나이지리아', '나이지리아 투자진흥위원회', '나이지리아 관세청'],
  },
  'South Africa': {
    region: '남아프리카',
    summary: '남아프리카공화국은 금융, 법률, 물류, 전문 서비스가 발달한 아프리카의 대표적인 상업 허브입니다. 전력 공급 안정성, 범죄 노출, 노동 분쟁, 주요 상업권 외 지역의 인프라 편차가 핵심 고려사항입니다.',
    categoryExplanations: { political: '정책 연속성과 노동·공공서비스 부담을 함께 봐야 합니다.', security: '도시 범죄와 화물 절도에 체계적인 동선 관리가 필요합니다.', logistics: '전력·항만·철도·도로의 신뢰성이 일정에 영향을 줍니다.', health: '주요 도시의 진료 여건은 좋지만 지역별 편차가 있습니다.', business: '성숙한 법제가 교역을 지원하지만 업무 연속성 계획이 필요합니다.' },
    keyRisks: ['전력 공급 중단이 회의, 창고, 생산, 서비스 제공에 영향을 줄 수 있습니다.', '출장, 숙박, 화물 보안에 체계적인 범죄 예방 계획이 필요합니다.', '노동 쟁의, 항만 중단, 도로 화물 문제가 공급망 일정에 영향을 줄 수 있습니다.'],
    recommendedActions: ['장소와 공급업체의 비상 전력, 통신, 비상 절차를 확인하세요.', '안전한 공항 이동, 검증된 숙소, 문서화된 화물 인계 지점을 이용하세요.', '항만, 철도, 전력 중단 가능성을 계약 일정에 반영하세요.'],
    warningSignals: ['예정 운영 시간에 영향을 주는 새로운 순환정전 일정', '운송, 항만, 광업, 공공 서비스 분야의 파업 예고', '예정 운송로 주변의 화물 절도 경보 또는 사건 증가'],
    alternativeStrategy: '요하네스버그, 케이프타운, 더반 같은 기존 허브를 중심으로 1단계를 운영하고, 원격으로 파트너를 검증한 뒤 보조 지역으로 확대하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '도시 범죄 예방', description: 'MVP 모의 신호 — 주요 도시에서 안전한 이동편과 체계적인 동선 관리가 중요합니다.', lastUpdated: '2026. 6. 12.' },
      { source: '외교부 여행경보', label: '출장 주의', description: 'MVP 모의 신호 — 미팅이나 현장 방문 전에 지역과 도로 상황을 확인하세요.', lastUpdated: '2026. 6. 10.' },
      { source: 'KOTRA 해외시장뉴스', label: '검증된 상업 관문', description: 'MVP 모의 신호 — 성숙한 금융·전문 서비스가 역내 시장 진출을 지원합니다.', lastUpdated: '2026. 6. 13.' },
      { source: 'KOTRA 국가정보', label: '인프라 연속성 주의', description: 'MVP 모의 신호 — 전력, 철도, 항만, 공급업체의 비상 대책을 확인하세요.', lastUpdated: '2026. 6. 8.' },
      { source: '한국수출입은행 환율 신호', label: '랜드화 움직임 모니터링', description: 'MVP 모의 신호 — 원/랜드 노출에 대비해 최신 견적과 계약상 여유를 활용하세요.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 남아프리카공화국', 'InvestSA', '남아프리카공화국 국세청'],
  },
  Vietnam: {
    region: '동남아시아',
    summary: '베트남은 다층적인 공급업체 네트워크와 역내 교역망을 갖춘 주요 제조·조달 거점입니다. 인허, 제품 적합성, 공급업체 품질, 통관 서류와 산업단지의 용량 부담을 확인해야 합니다.',
    categoryExplanations: { political: '정책 방향은 비교적 안정적이지만 행정 해석은 달라질 수 있습니다.', security: '통상적인 이동 주의로 주요 상업지를 관리할 수 있습니다.', logistics: '성수기에 항만과 산업 운송로의 용량이 빡빡해집니다.', health: '주요 도시와 2차 지역의 진료 접근성이 다릅니다.', business: '인허·계약·제품 표준·공급업체를 현지에서 검증해야 합니다.' },
    keyRisks: ['공장 확인 없이는 공급업체의 생산역량과 품질 주장을 확인하기 어렵습니다.', '품목분류, 원산지 증명, 제품 규정이 선적을 지연시킬 수 있습니다.', '성수기 항만·육상운송 부담이 일정 신뢰성을 낮출 수 있습니다.'],
    recommendedActions: ['공급업체의 생산역량, 품질체계, 하청, 수출 경험을 실사하세요.', '생산 전에 HS코드, 원산지, 시험, 라벨링을 검증하세요.', '첫 발주에 검수 마일스톤과 일정 여유를 두세요.'],
    warningSignals: ['공급업체가 현장 실사를 거부하거나 생산역량을 증빙하지 못함', '원산지·인보이스·인증 서류의 늦은 변경', '항만 장치 시간이나 컨테이너 부족의 급증'],
    alternativeStrategy: '첫 주문을 검증된 주 공급업체와 예비 공급업체에 나누고, 품질과 납기가 입증된 후 물량을 통합하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '도시 이동 계획', description: 'MVP 모의 신호 — 공장 방문을 위해 검증된 교통편과 비상 연락망을 마련하세요.', lastUpdated: '2026. 6. 15.' },
      { source: 'KOTRA 해외시장뉴스', label: '제조 공급망 깊이', description: 'MVP 모의 신호 — 다양한 제조 클러스터가 조달 선택지를 제공합니다.', lastUpdated: '2026. 6. 16.' },
      { source: 'KOTRA 국가정보', label: '공급업체 역량 검증', description: 'MVP 모의 신호 — 품질체계, 하청, 실제 리드타임을 확인하세요.', lastUpdated: '2026. 6. 14.' },
      { source: 'KOTRA 해외인증정보', label: '원산지·제품 적합성', description: 'MVP 모의 신호 — 선적 전에 품목분류, 원산지, 시험, 라벨링을 확인하세요.', lastUpdated: '2026. 6. 13.' },
      { source: '한국수출입은행 환율 신호', label: '동화 가격 모니터링', description: 'MVP 모의 신호 — 통화와 재견적 조건으로 마진을 보호하세요.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 베트남', '베트남 무역진흥청', '베트남 관세청'],
  },
  India: {
    region: '남아시아',
    summary: '인도는 깊은 기술 인재풀, 거대한 내수 시장, 성숙한 서비스 생태계와 함께 주별 편차가 큰 시장입니다. 법인 검증, 데이터·세무 의무, 계약 세부사항, 인력 연속성을 확인해야 합니다.',
    categoryExplanations: { political: '중앙과 주 규정이 서로 다른 운영 조건을 만들 수 있습니다.', security: '도시·동선·행사별 상황을 일상적으로 점검해야 합니다.', logistics: '주와 도시별 인프라·납기 성능의 편차가 큽니다.', health: '주요 도시는 우수한 민간의료와 대기질 리스크가 공존합니다.', business: '세무·데이터·고용·계약을 정교하게 구조화해야 합니다.' },
    keyRisks: ['파트너의 개발 역량이 하청사나 핵심 인력에 과도하게 의존할 수 있습니다.', '데이터, 지식재산, 세무, 고용 의무가 여러 관할을 걸칠 수 있습니다.', '주별 규정과 인프라 차이가 납품 가정을 바꿀 수 있습니다.'],
    recommendedActions: ['법인, 실소유주, 레퍼런스, 핵심 인력, 납품 이력을 검증하세요.', '데이터 위치, 접근권, IP 소유, SLA, 종료 지원을 명시하세요.', '마일스톤 기반 파일럿과 독립적인 보안·코드 검토로 시작하세요.'],
    warningSignals: ['배정 인력의 이유 없는 잔은 교체', '고객 레퍼런스·보안 검토·IP 조항에 대한 거부', '핵심 납품이 공개되지 않은 관계사·하청사에 의존'],
    alternativeStrategy: '핵심이 아닌 범위의 파일럿에서 시스템·데이터 접근을 단계화하고, 품질·보안·인력 연속성을 검증한 후 확대하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '도시별 출장·보건 계획', description: 'MVP 모의 신호 — 이동, 대기질, 기상, 비상연락망을 확인하세요.', lastUpdated: '2026. 6. 15.' },
      { source: 'KOTRA 해외시장뉴스', label: '깊은 디지털 서비스 시장', description: 'MVP 모의 신호 — 다양한 IT 파트너십 모델을 선택할 수 있습니다.', lastUpdated: '2026. 6. 16.' },
      { source: 'KOTRA 국가정보', label: 'IT 파트너 이행력 검증', description: 'MVP 모의 신호 — 팀 소속, 하청, 레퍼런스, 납품 거버넌스를 확인하세요.', lastUpdated: '2026. 6. 14.' },
      { source: 'KOTRA 해외인증정보', label: '데이터·세무·IP 의무', description: 'MVP 모의 신호 — 적용되는 데이터, 세무, 고용, IP 요건에 조언을 받으세요.', lastUpdated: '2026. 6. 13.' },
      { source: '한국수출입은행 환율 신호', label: '루피 계약 노출', description: 'MVP 모의 신호 — 계약서에 통화, 세금, 재견적 기준을 명시하세요.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 인도', '인도 투자청', '인도 기업부'],
  },
  'United Arab Emirates': {
    region: '중동',
    summary: '아랍에미리트는 현대적 인프라와 본토·프리존 체계를 갖춘 항공·물류·금융·재수출 허브입니다. 인가 범위, 통관·재수출 통제, 제재 스크리닝, 실소유주, 관할별 비용 차이를 확인해야 합니다.',
    categoryExplanations: { political: '안정적인 운영 환경이지만 정책과 역내 변수를 모니터링해야 합니다.', security: '일상 노출은 비교적 낮지만 역내 비상계획은 필요합니다.', logistics: '인프라는 우수하나 통관·프리존 절차와 동선이 맞아야 합니다.', health: '주요 에미리트에서 우수한 의료서비스를 이용할 수 있습니다.', business: '인가 범위·관할·세무·제재·소유권 검증이 핵심입니다.' },
    keyRisks: ['본토·프리존 인가가 계획한 활동과 고객 지역을 다 커버하지 못할 수 있습니다.', '재수출, 이중용도, 제재, 실소유주 통제가 거래에 영향을 줍니다.', '고가의 창고·인력·서비스 비용이 허브 경제성을 낮출 수 있습니다.'],
    recommendedActions: ['구조를 정하기 전에 활동, 에미리트, 통관 흐름, 인가 범위를 매핑하세요.', '거래상대, 소유주, 물품, 선박, 목적지, 결제 경로를 스크리닝하세요.', '최소 두 개의 허브·프리존 선택지에 대해 총 비용을 모델링하세요.'],
    warningSignals: ['제공업체가 인가 범위를 증빙하지 못함', '최종 사용자·목적지·소유권·결제 경로를 숨기려는 요청', '허브 경제성이 문서화되지 않은 통관·세무 가정에 의존'],
    alternativeStrategy: '법인·전용 창고·장기 임대에 앞서 인가된 3PL과 제한된 운송 파일럿으로 시작하세요.',
    signals: [
      { source: '외교부 해외안전정보', label: '역내 이동 비상계획', description: 'MVP 모의 신호 — 역내 변수에 대비한 최신 운송 동선과 비상연락망을 유지하세요.', lastUpdated: '2026. 6. 15.' },
      { source: 'KOTRA 해외시장뉴스', label: '글로벌 물류 연결성', description: 'MVP 모의 신호 — 항공·해운·재수출 네트워크가 허브 전략을 지원합니다.', lastUpdated: '2026. 6. 16.' },
      { source: 'KOTRA 국가정보', label: '프리존·본토 적합성', description: 'MVP 모의 신호 — 인가 범위, 고객 접근, 비용, 통관 처리를 비교하세요.', lastUpdated: '2026. 6. 14.' },
      { source: 'KOTRA 해외인증정보', label: '재수출·제재 통제', description: 'MVP 모의 신호 — 물품, 최종사용자, 목적지, 소유주, 결제 경로를 스크리닝하세요.', lastUpdated: '2026. 6. 13.' },
      { source: '한국수출입은행 환율 신호', label: '달러 연동 비용 노출', description: 'MVP 모의 신호 — 달러 연동 비용과 원화 환산을 허브 경제성에 반영하세요.', lastUpdated: '2026. 6. 15.' },
    ],
    officialLinkLabels: ['미국 여행주의보: 아랍에미리트', 'UAE 경제부', 'UAE 연방 관세 기관'],
  },
}

export const officialPublicDataLabels: Record<Language, string[]> = {
  ko: ['외교부 해외안전정보', '외교부 여행경보', 'KOTRA 해외시장뉴스', 'KOTRA 국가정보', '한국수출입은행 환율정보'],
  en: ['MOFA safety information', 'MOFA travel alerts', 'KOTRA market news', 'KOTRA country information', 'Korea Eximbank exchange-rate information'],
}
