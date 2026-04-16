export type Track = 'AI' | 'Cloud' | 'Data' | 'Security' | 'M365' | 'PowerPlatform' | 'Copilot';

// 새로운 타입 추가 (Q1 페르소나용)
export type SituationType =
  | 'jobseeker'     // 취준생
  | 'student'       // 재학생
  | 'switcher'      // 직무전환
  | 'nonIT'         // 비IT 직장인
  | 'itWorker'      // IT 직장인
  | 'exploring';    // 미정

// Q4 코딩 레벨
export type CodingLevel = 'none' | 'beginner' | 'intermediate' | 'advanced';

// Q6 시간 투자
export type TimeCommitment = 'fast' | 'moderate' | 'deep' | 'flexible';

// Q7 장벽
export type Barrier = 'time' | 'cost' | 'english' | 'knowledge' | 'direction' | 'motivation' | 'none';

export type QuizAnswer = string; // 선택지 ID (예: 'q1_a', 'q2_c')

export type QuizState = QuizAnswer[];

export interface Question {
  id: string;
  text: string;
  options: QuizOption[];
  contributeToScore?: boolean; // Q1, Q6, Q7은 점수에 기여하지 않음
}

export interface QuizOption {
  id: string;
  text: string;
  weight: TrackWeights;
}

export type TrackWeights = {
  [key in Track]: number;
};

export interface ScoreResult {
  track: Track;
  scores: TrackWeights;
  // ExperienceLevel 제거 (더 이상 사용하지 않음)
}

export interface Certification {
  code: string;
  name: string;
  level: 'Fundamentals' | 'Associate' | 'Expert';  // 새로운 필드
  difficulty: 1 | 2 | 3 | 4 | 5;  // 숫자로 변경 (★ 개수)
  studyHours: string;              // 새로운 필드 (예: "20-30시간")
  price: string;                   // 유지 (예: "109,000원")
  validity: string;                // 유지 (예: "영구" 또는 "1년")
  retirementDate?: Date;           // 새로운 필드 (AI-900용)
  prerequisites?: string[];        // 새로운 필드 (Expert 자격증용)
  koreanExam: boolean;             // 새로운 필드
  benefits: string[];
  urgency?: string;                // 유지 (은퇴 카운트다운 등)
  urgencyLink?: string;            // urgency 관련 포스팅 링크
  notionUrl: string;
  mockExamUrl?: string;
}

// For internal use - can be string or Certification
export interface NextStepCodes {
  associate?: string;
  expert?: string;
}

// For external use - always Certification objects
export interface NextStepRecommendation {
  associate?: Certification;
  expert?: Certification;
}

export interface Recommendation {
  main: Certification;
  subFundamentals: Certification[];  // 'subs'에서 변경 (0-2개, 70% 임계값)
  nextStep: NextStepRecommendation;  // 새로운 필드 (Associate/Expert 추천)
  persona: string;                    // 유지 (42개 페르소나 중 하나)
  personaBadge: {                     // 새로운 필드
    situation: SituationType;
    track: Track;
  };
  contentHooks: string[];             // 새로운 필드 (Q7 기반)
  studyTimeEstimate: TimeCommitment;  // 새로운 필드 (Q6 기반)
}

// 결과 페이지에서 사용할 전체 결과 데이터
export interface FinalResult {
  recommendation: Recommendation;
  userAnswers: {
    q1: string;  // 페르소나용
    q3: string;  // 타이브레이커용
    q4: string;  // 코딩 레벨용
    q6: string;  // 시간 투자용
    q7: string;  // 콘텐츠 훅용
  };
  shareUrl: string;
  encodedAnswers: string;
}

// 페르소나 키 타입
export type PersonaKey = `${SituationType}_${Track}`;