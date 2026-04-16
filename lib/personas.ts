import { Track, SituationType, PersonaKey } from './types';

// 상황 타입 맵핑 (Q1 답변 → SituationType)
const situationMap: Record<string, SituationType> = {
  'q1_a': 'jobseeker',  // 취준생
  'q1_b': 'student',    // 재학생
  'q1_c': 'switcher',   // 직무전환
  'q1_d': 'nonIT',      // 비IT 직장인
  'q1_e': 'itWorker',   // IT 직장인
  'q1_f': 'exploring',  // 미정
};

// 42개 페르소나 (6개 상황 × 7개 트랙)
const personaMap: Record<PersonaKey, string> = {
  // ============ AI 트랙 (6개) ============
  jobseeker_AI: 'AI 시대 살아남는 신입형',
  student_AI: 'AI 리터러시 모범생형',
  switcher_AI: 'AI로 방향 트는 전환자형',
  nonIT_AI: 'AI 리터러시 직장인형',
  itWorker_AI: '코드로 AI 만드는 개발자형',
  exploring_AI: 'AI 호기심 탐험가형',

  // ============ Cloud 트랙 (6개) ============
  jobseeker_Cloud: '클라우드 입문 취준생형',
  student_Cloud: '클라우드 탐색형 재학생',
  switcher_Cloud: '클라우드로 점프하는 전환자',
  nonIT_Cloud: '클라우드 이해하는 직장인',
  itWorker_Cloud: '클라우드 인프라 실무자형',
  exploring_Cloud: '클라우드 기본기 탐색형',

  // ============ Data 트랙 (6개) ============
  jobseeker_Data: '데이터로 말하는 신입형',
  student_Data: '데이터 감각 키우는 재학생',
  switcher_Data: '데이터 직무 전환자형',
  nonIT_Data: '데이터로 말하는 기획자형',
  itWorker_Data: '데이터 엔지니어 지향형',
  exploring_Data: '데이터 감각 탐색형',

  // ============ Security 트랙 (6개) ============
  jobseeker_Security: '보안 사수를 꿈꾸는 취준생형',
  student_Security: '보안 관심 재학생형',
  switcher_Security: '보안으로 가는 전환자',
  nonIT_Security: '보안 감각 직장인',
  itWorker_Security: '보안 엔지니어 지향형',
  exploring_Security: '보안 관심 탐색형',

  // ============ M365 트랙 (6개) ============
  jobseeker_M365: 'M365 실무 준비생형',
  student_M365: 'M365 실무 체험형 재학생',
  switcher_M365: 'M365 운영 전환자',
  nonIT_M365: 'M365 실무 직장인',
  itWorker_M365: 'M365 시스템 관리자형',
  exploring_M365: 'M365 실용 탐색형',

  // ============ PowerPlatform 트랙 (6개) ============
  jobseeker_PowerPlatform: '로우코드 실용주의 취준생형',
  student_PowerPlatform: '자동화 실험하는 재학생',
  switcher_PowerPlatform: '로우코드 전환 실용주의자',
  nonIT_PowerPlatform: '업무 자동화 선도 직장인',
  itWorker_PowerPlatform: 'Power Platform 개발자형',
  exploring_PowerPlatform: '자동화 실용 탐색형',

  // ============ Copilot 트랙 (6개) ============
  jobseeker_Copilot: 'Copilot 리터러시 취준생형',
  student_Copilot: 'Copilot 얼리어답터 재학생',
  switcher_Copilot: 'Copilot 도입 전환자',
  nonIT_Copilot: 'Copilot 도입 선도형',
  itWorker_Copilot: 'Copilot 플랫폼 관리자형',
  exploring_Copilot: 'Copilot 시대 탐색형',
};

// 페르소나 생성 함수
export function getPersona(q1Answer: string, track: Track): string {
  const situation = situationMap[q1Answer] || 'exploring';
  const key: PersonaKey = `${situation}_${track}`;
  return personaMap[key] || `${track} 학습자형`;
}

// 상황별 설명 텍스트
export const situationDescriptions: Record<SituationType, string> = {
  jobseeker: '취업을 준비하는',
  student: '진로를 탐색하는',
  switcher: '직무 전환을 준비하는',
  nonIT: '업무 역량을 강화하는',
  itWorker: '실무를 증명하려는',
  exploring: '방향을 찾고 있는',
};

// 트랙별 핵심 메시지
export const trackMessages: Record<Track, string> = {
  AI: 'AI 시대를 선도하는 인재가 되세요',
  Cloud: '클라우드 전문가로 성장하세요',
  Data: '데이터로 가치를 창출하세요',
  Security: '보안의 핵심 인재가 되세요',
  M365: '협업과 생산성의 전문가가 되세요',
  PowerPlatform: '로우코드로 혁신을 만드세요',
  Copilot: 'AI 협업의 선두주자가 되세요',
};

// 페르소나별 동기부여 메시지
export function getMotivationMessage(q1Answer: string, track: Track): string {
  const situation = situationMap[q1Answer] || 'exploring';

  const messages: Record<string, string> = {
    // 취준생
    'jobseeker_AI': '첫 직장에서 AI 활용 능력으로 차별화된 신입이 되세요.',
    'jobseeker_Cloud': '클라우드 자격증으로 IT 직무의 문을 열어보세요.',
    'jobseeker_Data': '데이터 분석 능력으로 어디서나 환영받는 인재가 되세요.',
    'jobseeker_Security': '보안 전문성으로 특별한 신입 지원자가 되세요.',
    'jobseeker_M365': 'M365 활용 능력으로 즉시 업무 투입 가능한 신입이 되세요.',
    'jobseeker_PowerPlatform': '로우코드 능력으로 실무형 인재임을 증명하세요.',
    'jobseeker_Copilot': 'Copilot 활용으로 AI 시대 준비된 신입이 되세요.',

    // 재학생
    'student_AI': '졸업 전에 AI 기초를 다져 경쟁력을 갖추세요.',
    'student_Cloud': '클라우드를 미리 경험하고 IT 진로를 구체화하세요.',
    'student_Data': '데이터 분석으로 어떤 분야든 진출할 수 있어요.',
    'student_Security': '보안 지식으로 차별화된 IT 인재가 되세요.',
    'student_M365': 'M365로 학업과 취업 준비를 동시에 하세요.',
    'student_PowerPlatform': '코딩 없이도 앱을 만드는 경험을 해보세요.',
    'student_Copilot': 'AI 네이티브 세대의 강점을 만드세요.',

    // 직무전환
    'switcher_AI': 'AI로 새로운 커리어 기회를 잡으세요.',
    'switcher_Cloud': '클라우드로 IT 직무 전환의 발판을 마련하세요.',
    'switcher_Data': '기존 경험에 데이터 역량을 더해 전문가가 되세요.',
    'switcher_Security': '보안으로 안정적인 IT 커리어를 시작하세요.',
    'switcher_M365': 'M365 전문가로 새로운 역할을 맡아보세요.',
    'switcher_PowerPlatform': '개발자가 아니어도 IT 전문가가 될 수 있어요.',
    'switcher_Copilot': 'AI 시대에 맞는 새로운 역할을 찾으세요.',

    // 비IT 직장인
    'nonIT_AI': '업무에 AI를 도입하는 선구자가 되세요.',
    'nonIT_Cloud': '클라우드를 이해하고 IT 부서와 소통하세요.',
    'nonIT_Data': '데이터 기반 의사결정으로 성과를 높이세요.',
    'nonIT_Security': '정보보호 의식으로 조직을 지키세요.',
    'nonIT_M365': 'M365 고급 기능으로 업무 효율을 극대화하세요.',
    'nonIT_PowerPlatform': '반복 업무를 자동화하고 시간을 아끼세요.',
    'nonIT_Copilot': 'Copilot으로 업무 생산성을 2배로 높이세요.',

    // IT 직장인
    'itWorker_AI': 'AI 엔지니어로 커리어를 업그레이드하세요.',
    'itWorker_Cloud': '클라우드 아키텍트로 성장하세요.',
    'itWorker_Data': '데이터 엔지니어 전문가가 되세요.',
    'itWorker_Security': '보안 전문가로 핵심 인재가 되세요.',
    'itWorker_M365': 'M365 관리자로 조직의 디지털 전환을 이끄세요.',
    'itWorker_PowerPlatform': '로우코드 플랫폼 전문가가 되세요.',
    'itWorker_Copilot': 'AI 플랫폼 관리의 선두주자가 되세요.',

    // 미정
    'exploring_AI': 'AI부터 시작해 IT 세계를 탐험하세요.',
    'exploring_Cloud': '클라우드로 첫 발을 내딛어보세요.',
    'exploring_Data': '데이터의 가치를 발견해보세요.',
    'exploring_Security': '보안의 중요성을 이해해보세요.',
    'exploring_M365': 'M365로 실용적인 시작을 해보세요.',
    'exploring_PowerPlatform': '코딩 없이 시작하는 IT 여정입니다.',
    'exploring_Copilot': 'AI 시대의 가능성을 탐색해보세요.',
  };

  const key = `${situation}_${track}`;
  return messages[key] || '새로운 기술로 성장의 기회를 만드세요.';
}