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
    presets: { kenyaImport: '케냐 수입 리스크', nigeriaTrip: '나이지리아 출장 리스크', southAfricaPartner: '남아공 파트너 조사' },
    briefingSuffix: '리스크 브리핑', urgencySuffix: '긴급도', copy: '요약 복사', copied: '복사 완료', copyFailed: '복사 실패', generate: '브리핑 생성',
    transparency: '이 MVP는 사용 가능한 경우 외교부 실시간 안전정보를 사용합니다. KOTRA와 환율정보를 포함한 나머지 공공데이터 신호는 아직 MVP 모의 데이터입니다.',
    overallLevel: '종합 리스크 수준', overallScore: '종합 점수', urgencyAdjustment: '긴급도 조정', categoryScores: '리스크 항목별 점수',
    countrySummary: '국가 리스크 요약', keyRisks: '핵심 리스크', recommended: '권고 조치', warningSignals: '주의 신호', alternative: '대안 전략',
    publicSignals: '공공데이터 신호', publicSignalsIntro: '향후 API 연결을 고려해 구조화한 5개의 MVP 모의 신호입니다.', notLive: '모의 데이터 · 실시간 아님', lastUpdated: '최종 업데이트',
    livePublicData: '실시간 공공데이터',
    archivedPublicData: '과거 공공데이터',
    mockData: 'MVP 모의 데이터',
    publicSignalsLiveIntro: '최신 외교부 안전정보는 실시간 데이터이며, 나머지 출처는 MVP 모의 신호입니다.',
    publicSignalsArchivedIntro: '선택한 국가의 외교부 과거 안전정보와 MVP 모의 신호를 함께 표시합니다.',
    liveAvailabilityNote: '실시간 공공데이터를 사용할 수 있으면 우선 표시하고, 선택 국가와 직접 관련된 최신 데이터가 없으면 MVP 모의 신호를 표시합니다.',
    liveFallbackNote: '선택한 국가와 직접 관련된 최근 외교부 안전정보를 찾지 못했습니다.',
    liveLoading: '실시간 외교부 안전정보를 확인하는 중입니다.',
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
    presets: { kenyaImport: 'Kenya Import Risk', nigeriaTrip: 'Nigeria Business Trip Risk', southAfricaPartner: 'South Africa Partner Research' },
    briefingSuffix: 'Risk Briefing', urgencySuffix: 'urgency', copy: 'Copy summary', copied: 'Copied', copyFailed: 'Copy failed', generate: 'Generate briefing',
    transparency: 'This MVP uses live MOFA safety information when available. Remaining public-data signals, including KOTRA and exchange-rate information, are still MVP mock data.',
    overallLevel: 'Overall risk level', overallScore: 'Overall score', urgencyAdjustment: 'Urgency adjustment', categoryScores: 'Risk category scores',
    countrySummary: 'Country risk summary', keyRisks: 'Key risks', recommended: 'Recommended actions', warningSignals: 'Warning signals', alternative: 'Alternative strategy',
    publicSignals: 'Public Data Signals', publicSignalsIntro: 'Five MVP mock signals structured for future API connections.', notLive: 'Mock data · not live', lastUpdated: 'Last updated',
    livePublicData: 'Live public data',
    archivedPublicData: 'Archived public data',
    mockData: 'MVP mock data',
    publicSignalsLiveIntro: 'The latest MOFA safety notices are live; remaining sources are MVP mock signals.',
    publicSignalsArchivedIntro: 'Archived MOFA safety information for the selected country is shown with MVP mock signals.',
    liveAvailabilityNote: 'Live public data is shown when available. If no recent country-specific data is available, MVP mock signals are shown.',
    liveFallbackNote: 'No recent country-specific MOFA safety information was found.',
    liveLoading: 'Checking live MOFA safety data.',
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
}

export const officialPublicDataLabels: Record<Language, string[]> = {
  ko: ['외교부 해외안전정보', '외교부 여행경보', 'KOTRA 해외시장뉴스', 'KOTRA 국가정보', '한국수출입은행 환율정보'],
  en: ['MOFA safety information', 'MOFA travel alerts', 'KOTRA market news', 'KOTRA country information', 'Korea Eximbank exchange-rate information'],
}
