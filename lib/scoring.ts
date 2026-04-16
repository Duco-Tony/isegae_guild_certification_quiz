import {
  QuizState,
  ScoreResult,
  Track,
  TrackWeights,
  SituationType,
  CodingLevel,
  TimeCommitment,
  Barrier,
  Certification,
  NextStepCodes,
  NextStepRecommendation,
  Recommendation
} from './types';
import { questions } from './questions';
import { getPersona } from './personas';

// Q2-Q5만 트랙 점수에 기여 (Q1, Q6, Q7은 제외)
export function computeTrackScores(answers: QuizState): TrackWeights {
  const scores: TrackWeights = {
    AI: 0,
    Cloud: 0,
    Data: 0,
    Security: 0,
    M365: 0,
    PowerPlatform: 0,
    Copilot: 0,
  };

  // Q2-Q5만 점수에 기여 (인덱스 1-4)
  answers.forEach((answerId, index) => {
    const question = questions[index];

    // contributeToScore가 false면 스킵
    if (question.contributeToScore === false) {
      return;
    }

    const selectedOption = question.options.find((opt) => opt.id === answerId);

    if (selectedOption) {
      Object.keys(scores).forEach((track) => {
        scores[track as Track] += selectedOption.weight[track as Track];
      });
    }
  });

  return scores;
}

// 동점 처리를 위한 타이브레이커 (Q3 사용)
export function getTopTrack(scores: TrackWeights, q3Answer: string): Track {
  const maxScore = Math.max(...Object.values(scores));
  const topTracks = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([track, _]) => track as Track);

  // 동점이 없으면 바로 반환
  if (topTracks.length === 1) {
    return topTracks[0];
  }

  // Q3 가중치로 타이브레이킹
  const q3Question = questions[2]; // Q3는 인덱스 2
  const q3Option = q3Question.options.find(opt => opt.id === q3Answer);

  if (!q3Option) {
    return topTracks[0]; // 기본값
  }

  let maxTiebreakerScore = -Infinity;
  let winner: Track = topTracks[0];

  topTracks.forEach((track) => {
    const tiebreakerScore = q3Option.weight[track];
    if (tiebreakerScore > maxTiebreakerScore) {
      maxTiebreakerScore = tiebreakerScore;
      winner = track;
    }
  });

  return winner;
}

// 날짜 기반 AI 자격증 전환 (AI-900 → AI-901)
export function getAIFundamentalsCert(today: Date = new Date()): string {
  const switchDate = new Date('2026-06-30');
  return today > switchDate ? 'AI-901' : 'AI-900';
}

// 트랙별 Fundamentals 자격증 매핑
export function getMainFundamentalsCert(track: Track, today: Date = new Date()): string {
  const trackToFundamentals: Record<Track, string> = {
    AI: getAIFundamentalsCert(today),
    Cloud: 'AZ-900',
    Data: 'DP-900',
    Security: 'SC-900',
    M365: 'MS-900',
    PowerPlatform: 'PL-900',
    Copilot: 'AB-900', // Copilot and Agent Administration Fundamentals
  };

  return trackToFundamentals[track];
}

// 서브 Fundamentals 추천 (70% 임계값)
export function getSubFundamentals(
  mainTrack: Track,
  scores: TrackWeights,
  today: Date = new Date()
): string[] {
  const mainScore = scores[mainTrack];
  const threshold = mainScore * 0.7;
  const mainCert = getMainFundamentalsCert(mainTrack, today);
  const aiCert = getAIFundamentalsCert(today);

  const subTracks = Object.entries(scores)
    .filter(([track, score]) =>
      track !== mainTrack && score >= threshold
    )
    .sort(([, a], [, b]) => b - a)  // 점수 내림차순
    .slice(0, 2)  // 최대 2개
    .map(([track, _]) => track as Track);

  const subCerts = subTracks.map(track => getMainFundamentalsCert(track, today));

  // 메인 추천이 AI-900/AI-901이 아니면 AI-900/AI-901을 서브에 추가
  if (mainCert !== aiCert && !subCerts.includes(aiCert)) {
    subCerts.push(aiCert);
  }

  return subCerts;
}

// Q1 답변에서 SituationType 추출
export function getSituationType(q1Answer: string): SituationType {
  const situationMap: Record<string, SituationType> = {
    'q1_a': 'jobseeker',  // 취준생
    'q1_b': 'student',    // 재학생
    'q1_c': 'switcher',   // 직무전환
    'q1_d': 'nonIT',      // 비IT 직장인
    'q1_e': 'itWorker',   // IT 직장인
    'q1_f': 'exploring',  // 미정
  };

  return situationMap[q1Answer] || 'exploring';
}

// Q4 답변에서 CodingLevel 추출
export function getCodingLevel(q4Answer: string): CodingLevel {
  const codingMap: Record<string, CodingLevel> = {
    'q4_a': 'none',         // 최대한 피하고 싶어요
    'q4_b': 'beginner',     // 배울 마음은 있지만 두려워요
    'q4_c': 'intermediate', // Python·SQL 기본은 해요
    'q4_d': 'advanced',     // 실제 프로젝트·업무에서 써요
  };

  return codingMap[q4Answer] || 'none';
}

// Q6 답변에서 TimeCommitment 추출
export function getTimeCommitment(q6Answer: string): TimeCommitment {
  const timeMap: Record<string, TimeCommitment> = {
    'q6_a': 'fast',      // 2~3주
    'q6_b': 'moderate',  // 1~2개월
    'q6_c': 'deep',      // 3개월 이상
    'q6_d': 'flexible',  // 상황 따라 유동적
  };

  return timeMap[q6Answer] || 'flexible';
}

// Expert 추천 가능 여부 확인
export function canRecommendExpert(
  situation: SituationType,
  timeCommitment: TimeCommitment
): boolean {
  // IT 직장인은 항상 Expert 추천 가능
  if (situation === 'itWorker') {
    return true;
  }

  // 3개월 이상 시간 투자 가능하면 Expert 추천
  if (timeCommitment === 'deep') {
    return true;
  }

  return false;
}

// Associate/Expert 추천 로직
export function getNextStepRecommendation(
  track: Track,
  codingLevel: CodingLevel,
  situation: SituationType,
  timeCommitment: TimeCommitment,
  today: Date = new Date()
): NextStepCodes {
  const showExpert = canRecommendExpert(situation, timeCommitment);
  const nextStep: NextStepCodes = {};

  // 트랙별 Associate 매핑 (코딩 레벨 고려)
  const associateMap: Record<Track, Record<CodingLevel, string | null>> = {
    AI: {
      none: null,
      beginner: null,
      intermediate: today > new Date('2026-06-30') ? 'AI-103' : 'AI-102',
      advanced: today > new Date('2026-06-30') ? 'AI-103' : 'AI-102',
    },
    Cloud: {
      none: null,
      beginner: 'AZ-104',
      intermediate: 'AZ-104',
      advanced: 'AZ-104',
    },
    Data: {
      none: 'PL-300',  // Power BI (코딩 없음)
      beginner: 'PL-300',
      intermediate: 'DP-700',  // Fabric Data Engineer
      advanced: 'DP-700',
    },
    Security: {
      none: null,
      beginner: 'SC-200',
      intermediate: 'SC-200',
      advanced: 'SC-200',
    },
    M365: {
      none: 'MS-102',
      beginner: 'MS-102',
      intermediate: 'MS-102',
      advanced: 'MS-102',
    },
    PowerPlatform: {
      none: 'PL-100',  // App Maker (로우코드)
      beginner: 'PL-100',
      intermediate: 'PL-400',  // Developer
      advanced: 'PL-400',
    },
    Copilot: {
      none: null,
      beginner: null,
      intermediate: 'MS-102',
      advanced: 'MS-102',
    },
  };

  // Expert 매핑 (showExpert가 true이고 코딩 레벨이 충분할 때만)
  const expertMap: Record<Track, Record<CodingLevel, string | null>> = {
    AI: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: showExpert ? 'AZ-305' : null,  // 클라우드 아키텍트
    },
    Cloud: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: showExpert ? 'AZ-305' : null,
    },
    Data: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: null,  // 데이터 분야는 Expert 없음
    },
    Security: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: showExpert ? 'SC-100' : null,
    },
    M365: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: null,  // M365는 Expert 없음
    },
    PowerPlatform: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: showExpert ? 'PL-600' : null,
    },
    Copilot: {
      none: null,
      beginner: null,
      intermediate: null,
      advanced: null,  // Copilot은 Expert 없음
    },
  };

  const associateCert = associateMap[track][codingLevel];
  const expertCert = expertMap[track][codingLevel];

  if (associateCert) {
    nextStep.associate = associateCert;
  }

  if (expertCert) {
    nextStep.expert = expertCert;
  }

  return nextStep;
}

// Q7 답변 기반 콘텐츠 훅
export function getContentHooks(q7Answer: string): string[] {
  const barrierToHook: Record<string, string[]> = {
    'q7_a': [  // 비전공 용어
      '📖 비전공자 용어집 PDF',
      '🎥 기초 개념 동영상 강의',
    ],
    'q7_b': [  // 비용 부담
      '💰 학생 할인(Certiport) 정보',
      '🎁 합격 보장 패키지 할인',
    ],
    'q7_c': [  // 실무 활용 의문
      '💼 자격증 우대 채용 공고 모음',
      '✨ 합격자 취업 성공 후기',
    ],
    'q7_d': [  // 자소서 작성법
      '📝 자격증 → 자소서 작성 템플릿',
      '🎯 면접 예상 질문 가이드',
    ],
    'q7_e': [  // 시간 부족
      '⏱ 주말 2시간 루틴 플래너',
      '🚀 2주 속성 합격 전략',
    ],
    'q7_f': [  // 동기 부족
      '👥 100일 챌린지 참여',
      '💬 스터디 커뮤니티 가입',
    ],
    'q7_g': [  // 방향 모름
      '🗺 입문자 로드맵',
      '🆓 무료 강의 1강 체험',
    ],
  };

  return barrierToHook[q7Answer] || [];
}

// 메인 추천 계산 함수
export function calculateRecommendation(
  answers: QuizState,
  today: Date = new Date()
): Recommendation {
  // 1. 트랙 점수 계산
  const scores = computeTrackScores(answers);

  // 2. 최고 트랙 결정 (동점 처리 포함)
  const topTrack = getTopTrack(scores, answers[2]);  // Q3로 타이브레이킹

  // 3. 메인 Fundamentals 자격증
  const mainCertCode = getMainFundamentalsCert(topTrack, today);

  // 4. 서브 Fundamentals 자격증들
  const subCertCodes = getSubFundamentals(topTrack, scores, today);

  // 5. 사용자 상황 파악
  const situation = getSituationType(answers[0]);  // Q1
  const codingLevel = getCodingLevel(answers[3]);  // Q4
  const timeCommitment = getTimeCommitment(answers[5]);  // Q6

  // 6. Associate/Expert 추천
  const nextStep = getNextStepRecommendation(
    topTrack,
    codingLevel,
    situation,
    timeCommitment,
    today
  );

  // 7. 페르소나 생성
  const persona = getPersona(answers[0], topTrack);

  // 8. 콘텐츠 훅
  const contentHooks = getContentHooks(answers[6]);  // Q7

  // 9. Recommendation 객체 생성 (실제 Certification 객체는 certifications.ts에서 가져와야 함)
  // 여기서는 코드만 반환하고, 실제 Certification 객체는 호출하는 쪽에서 처리
  return {
    main: null as any, // 실제로는 certifications[mainCertCode]
    subFundamentals: [], // 실제로는 subCertCodes.map(code => certifications[code])
    nextStep: nextStep,
    persona: persona,
    personaBadge: {
      situation: situation,
      track: topTrack,
    },
    contentHooks: contentHooks,
    studyTimeEstimate: timeCommitment,
  } as Recommendation;
}

// 기존 함수와의 호환성을 위한 래퍼 (나중에 제거 예정)
export function calculateScore(answers: QuizState): ScoreResult {
  const scores = computeTrackScores(answers);
  const topTrack = getTopTrack(scores, answers[2]);

  return {
    track: topTrack,
    scores,
  };
}