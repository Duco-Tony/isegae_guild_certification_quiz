import { Certification, Track, Recommendation, QuizState, NextStepRecommendation } from './types';
import {
  computeTrackScores,
  getTopTrack,
  getMainFundamentalsCert,
  getSubFundamentals,
  getSituationType,
  getCodingLevel,
  getTimeCommitment,
  getNextStepRecommendation,
  getContentHooks,
  getAIFundamentalsCert,
} from './scoring';
import { getPersona } from './personas';

// 노션 URL 상수 (사용자가 제공 예정, 현재는 플레이스홀더)
const NOTION_URLS = {
  // Fundamentals (8개)
  'AI-900': 'https://notion.so/ai-900-placeholder',
  'AI-901': 'https://notion.so/ai-901-placeholder',
  'AZ-900': 'https://notion.so/az-900-placeholder',
  'AB-900': 'https://notion.so/ab-900-placeholder',
  'DP-900': 'https://notion.so/dp-900-placeholder',
  'SC-900': 'https://notion.so/sc-900-placeholder',
  'MS-900': 'https://notion.so/ms-900-placeholder',
  'PL-900': 'https://notion.so/pl-900-placeholder',

  // Associate (10개)
  'AI-102': 'https://notion.so/ai-102-placeholder',
  'AI-103': 'https://notion.so/ai-103-placeholder',
  'AZ-104': 'https://notion.so/az-104-placeholder',
  'DP-700': 'https://notion.so/dp-700-placeholder',
  'PL-300': 'https://notion.so/pl-300-placeholder',
  'PL-100': 'https://notion.so/pl-100-placeholder',
  'PL-400': 'https://notion.so/pl-400-placeholder',
  'SC-200': 'https://notion.so/sc-200-placeholder',
  'SC-300': 'https://notion.so/sc-300-placeholder',
  'MS-102': 'https://notion.so/ms-102-placeholder',

  // Expert (5개)
  'AZ-305': 'https://notion.so/az-305-placeholder',
  'AZ-400': 'https://notion.so/az-400-placeholder',
  'SC-100': 'https://notion.so/sc-100-placeholder',
  'PL-600': 'https://notion.so/pl-600-placeholder',
};

const certifications: Record<string, Certification> = {
  // ============ Fundamentals (8개) ============
  'AI-900': {
    code: 'AI-900',
    name: 'Azure AI Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '15-25시간',
    price: '109,000원',
    validity: '평생',
    retirementDate: new Date('2026-06-30'),
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'AI 기초 개념과 Azure AI 서비스 이해',
      '비개발자도 AI 프로젝트 기획 가능',
      'Copilot 활용의 기반 지식 습득',
    ],
    notionUrl: NOTION_URLS['AI-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/ai-900',
  },

  'AI-901': {
    code: 'AI-901',
    name: 'Azure AI Fundamentals (신규)',
    level: 'Fundamentals',
    difficulty: 3,
    studyHours: '25-35시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '생성형 AI와 Azure OpenAI 서비스 이해',
      'Copilot Studio 기초 지식 습득',
      '최신 AI 트렌드 반영된 내용',
    ],
    notionUrl: NOTION_URLS['AI-901'],
  },

  'AZ-900': {
    code: 'AZ-900',
    name: 'Azure Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '20-30시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '클라우드 컴퓨팅 기초 개념 이해',
      'Azure 서비스 전반 파악',
      '클라우드 경력의 첫 발판',
    ],
    notionUrl: NOTION_URLS['AZ-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/az-900',
  },

  'AB-900': {
    code: 'AB-900',
    name: 'Copilot and Agent Administration Fundamentals',
    level: 'Fundamentals',
    difficulty: 3,
    studyHours: '30-40시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Microsoft Copilot 전반적인 이해',
      'AI 에이전트 관리 기초 지식',
      '조직의 AI 도입 전략 수립',
    ],
    notionUrl: NOTION_URLS['AB-900'],
  },

  'DP-900': {
    code: 'DP-900',
    name: 'Azure Data Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '20-30시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '데이터 개념과 Azure 데이터 서비스 이해',
      '데이터 분석가/엔지니어 입문',
      'SQL, NoSQL, 빅데이터 기초 습득',
    ],
    notionUrl: NOTION_URLS['DP-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/dp-900',
  },

  'SC-900': {
    code: 'SC-900',
    name: 'Security, Compliance & Identity Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '20-30시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '보안, 컴플라이언스, 신원 관리 기초',
      'IT 관리자 필수 보안 지식',
      '정보보안 경력 전환 첫 단계',
    ],
    notionUrl: NOTION_URLS['SC-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/sc-900',
  },

  'MS-900': {
    code: 'MS-900',
    name: 'Microsoft 365 Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '15-25시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'M365 서비스 전반 이해 (Teams, SharePoint, Outlook)',
      '비개발자 직장인에게 가장 실용적',
      '스마트워크 도입 기획자 역할',
    ],
    notionUrl: NOTION_URLS['MS-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/ms-900',
  },

  'PL-900': {
    code: 'PL-900',
    name: 'Power Platform Fundamentals',
    level: 'Fundamentals',
    difficulty: 2,
    studyHours: '15-25시간',
    price: '109,000원',
    validity: '평생',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '노코드/로우코드로 앱 제작 기초',
      '비개발자도 업무 자동화 가능',
      'Power Apps, Power Automate 활용',
    ],
    notionUrl: NOTION_URLS['PL-900'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/pl-900',
  },

  // ============ Associate (10개) ============
  'AI-102': {
    code: 'AI-102',
    name: 'Azure AI Engineer Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '100-140시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Azure AI 서비스 실제 구현 능력 증명',
      'AI 애플리케이션 개발자로 경력 전환',
      '고급 AI 프로젝트 리드 가능',
    ],
    notionUrl: NOTION_URLS['AI-102'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/ai-102',
  },

  'AI-103': {
    code: 'AI-103',
    name: 'Azure AI App and Agent Developer Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '100-140시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '생성형 AI 앱 개발 전문성',
      'AI 에이전트 구축 능력',
      'Azure OpenAI 서비스 활용',
    ],
    notionUrl: NOTION_URLS['AI-103'],
  },

  'AZ-104': {
    code: 'AZ-104',
    name: 'Azure Administrator Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '80-120시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Azure 리소스 관리 실무 능력 증명',
      'IT 관리자 역할로 취업/이직 유리',
      'DevOps 엔지니어 전환 기반',
    ],
    notionUrl: NOTION_URLS['AZ-104'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/az-104',
  },

  'DP-700': {
    code: 'DP-700',
    name: 'Fabric Data Engineer Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '100-140시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Microsoft Fabric 플랫폼 전문성',
      '데이터 엔지니어링 실무 능력',
      '최신 데이터 플랫폼 활용',
    ],
    notionUrl: NOTION_URLS['DP-700'],
  },

  'PL-300': {
    code: 'PL-300',
    name: 'Power BI Data Analyst Associate',
    level: 'Associate',
    difficulty: 3,
    studyHours: '60-80시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Power BI로 데이터 시각화 전문가 인정',
      '기획자/마케터도 데이터 기반 의사결정',
      '대시보드 제작으로 실무 바로 활용',
    ],
    notionUrl: NOTION_URLS['PL-300'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/pl-300',
  },

  'PL-100': {
    code: 'PL-100',
    name: 'Power Platform App Maker Associate',
    level: 'Associate',
    difficulty: 3,
    studyHours: '60-90시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '로우코드로 비즈니스 앱 제작',
      '시민 개발자로 인정',
      '업무 프로세스 디지털화',
    ],
    notionUrl: NOTION_URLS['PL-100'],
  },

  'PL-400': {
    code: 'PL-400',
    name: 'Power Platform Developer Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '100-140시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'Power Platform 커스텀 솔루션 개발',
      '로우코드 개발자로 경력 전환',
      '기업 디지털 전환 프로젝트 리드',
    ],
    notionUrl: NOTION_URLS['PL-400'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/pl-400',
  },

  'SC-200': {
    code: 'SC-200',
    name: 'Security Operations Analyst Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '80-120시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '보안 위협 탐지 및 대응 능력 증명',
      'SOC 분석가 역할 수행 가능',
      '사이버 보안 전문가 경력 구축',
    ],
    notionUrl: NOTION_URLS['SC-200'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/sc-200',
  },

  'SC-300': {
    code: 'SC-300',
    name: 'Identity and Access Administrator Associate',
    level: 'Associate',
    difficulty: 4,
    studyHours: '80-120시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      '신원 및 접근 관리 전문성',
      'Azure AD 전문가',
      '제로 트러스트 보안 구현',
    ],
    notionUrl: NOTION_URLS['SC-300'],
  },

  'MS-102': {
    code: 'MS-102',
    name: 'Microsoft 365 Administrator Associate',
    level: 'Associate',
    difficulty: 3,
    studyHours: '60-100시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: [],
    koreanExam: true,
    benefits: [
      'M365 관리자 역할 수행 능력 증명',
      '기업 IT 관리자 필수 자격증',
      'Teams, Exchange, SharePoint 통합 관리',
    ],
    notionUrl: NOTION_URLS['MS-102'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/ms-102',
  },

  // ============ Expert (3개) ============
  'AZ-305': {
    code: 'AZ-305',
    name: 'Azure Solutions Architect Expert',
    level: 'Expert',
    difficulty: 5,
    studyHours: '120-180시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: ['AZ-104'],
    koreanExam: true,
    benefits: [
      'Azure 아키텍트로서 솔루션 설계 능력 증명',
      '대규모 클라우드 프로젝트 설계 리드',
      '고연봉 클라우드 아키텍트 포지션 지원',
    ],
    notionUrl: NOTION_URLS['AZ-305'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/az-305',
  },

  'AZ-400': {
    code: 'AZ-400',
    name: 'DevOps Engineer Expert',
    level: 'Expert',
    difficulty: 5,
    studyHours: '150-200시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: ['AZ-104 또는 AZ-204'],
    koreanExam: true,
    benefits: [
      'DevOps 엔지니어 전문성 인정',
      'CI/CD 파이프라인 구축 능력',
      '개발과 운영을 통합하는 역할',
    ],
    notionUrl: NOTION_URLS['AZ-400'],
    mockExamUrl: 'https://examtopics.com/exams/microsoft/az-400',
  },

  'SC-100': {
    code: 'SC-100',
    name: 'Cybersecurity Architect Expert',
    level: 'Expert',
    difficulty: 5,
    studyHours: '120-160시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: ['SC-200, SC-300, SC-401, AZ-500 중 1개'],
    koreanExam: true,
    benefits: [
      '사이버보안 아키텍트 전문성',
      '엔터프라이즈 보안 설계',
      '최고 수준의 보안 전문가 인정',
    ],
    notionUrl: NOTION_URLS['SC-100'],
  },

  'PL-600': {
    code: 'PL-600',
    name: 'Power Platform Solution Architect Expert',
    level: 'Expert',
    difficulty: 5,
    studyHours: '150-200시간',
    price: '약 24만원',
    validity: '1년 (무료 갱신)',
    prerequisites: ['PL-200 또는 PL-400'],
    koreanExam: true,
    benefits: [
      'Power Platform 솔루션 아키텍트',
      '기업 디지털 전환 설계',
      '로우코드 플랫폼 최고 전문가',
    ],
    notionUrl: NOTION_URLS['PL-600'],
  },
};

// AI-900 은퇴 카운트다운 적용
export function getCertificationWithUrgency(code: string, today: Date = new Date()): Certification {
  const cert = certifications[code];

  if (!cert) {
    throw new Error(`Certification ${code} not found`);
  }

  // AI-900 은퇴 카운트다운
  if (code === 'AI-900') {
    const switchDate = new Date('2026-06-30');
    const daysLeft = Math.floor(
      (switchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft > 0 && daysLeft <= 90) {
      return {
        ...cert,
        urgency: `2026년 6월 30일 응시 종료됩니다. AI-901로 전환 예정입니다.`,
        urgencyLink: 'https://notion.so/ai-900-retirement-post',  // TODO: 실제 포스팅 링크로 변경 필요
      };
    }
  }

  return cert;
}

// 새로운 추천 시스템
export function getRecommendation(
  answers: QuizState,
  today: Date = new Date()
): Recommendation {
  // 1. 트랙 점수 계산
  const scores = computeTrackScores(answers);

  // 2. 최고 트랙 결정 (동점 처리 포함)
  const topTrack = getTopTrack(scores, answers[2]);  // Q3로 타이브레이킹

  // 3. 메인 Fundamentals 자격증
  const mainCertCode = getMainFundamentalsCert(topTrack, today);
  const mainCert = getCertificationWithUrgency(mainCertCode, today);

  // 4. 서브 Fundamentals 자격증들
  const subCertCodes = getSubFundamentals(topTrack, scores, today);
  const subCerts = subCertCodes.map(code => getCertificationWithUrgency(code, today));

  // 5. 사용자 상황 파악
  const situation = getSituationType(answers[0]);  // Q1
  const codingLevel = getCodingLevel(answers[3]);  // Q4
  const timeCommitment = getTimeCommitment(answers[5]);  // Q6

  // 6. Associate/Expert 추천
  const nextStepCodes = getNextStepRecommendation(
    topTrack,
    codingLevel,
    situation,
    timeCommitment,
    today
  );

  const nextStep: NextStepRecommendation = {
    associate: nextStepCodes.associate
      ? getCertificationWithUrgency(nextStepCodes.associate, today)
      : undefined,
    expert: nextStepCodes.expert
      ? getCertificationWithUrgency(nextStepCodes.expert, today)
      : undefined,
  };

  // 7. 페르소나 생성
  const persona = getPersona(answers[0], topTrack);

  // 8. 콘텐츠 훅
  const contentHooks = getContentHooks(answers[6]);  // Q7

  return {
    main: mainCert,
    subFundamentals: subCerts,
    nextStep: nextStep,
    persona: persona,
    personaBadge: {
      situation: situation,
      track: topTrack,
    },
    contentHooks: contentHooks,
    studyTimeEstimate: timeCommitment,
  };
}

export { certifications };