import { QuizState } from './types';

/**
 * 퀴즈 답변을 URL 친화적인 숫자 문자열로 인코딩 (새로운 방식)
 * 예: ['q1_a', 'q2_b', 'q3_c', ...] → '1234567'
 */
export function encodeAnswers(answers: QuizState): string {
  return answers.map((answer) => {
    // 'q1_a' → '1', 'q2_b' → '2', 'q3_c' → '3', etc.
    const parts = answer.split('_');
    const letter = parts[1] || 'a';

    // Q1은 6개 옵션 (a-f), Q2는 7개 옵션 (a-g), Q3도 7개 옵션 (a-g) 가능
    // 문자를 숫자로 변환: a→1, b→2, c→3, d→4, e→5, f→6, g→7
    return (letter.charCodeAt(0) - 96).toString();
  }).join('');
}

/**
 * 인코딩된 문자열을 퀴즈 답변으로 디코딩 (숫자/문자 둘 다 지원)
 * 예: '1234567' → ['q1_a', 'q2_b', 'q3_c', ...]
 * 예: 'abcdefg' → ['q1_a', 'q2_b', 'q3_c', ...] (이전 버전 호환)
 */
export function decodeAnswers(encoded: string): QuizState | null {
  if (!encoded || encoded.length !== 7) {
    return null; // 7문항이 아니면 유효하지 않음
  }

  // 숫자로만 구성되었는지 확인 (새로운 방식)
  if (/^\d+$/.test(encoded)) {
    return decodeNumberBased(encoded);
  } else {
    // 문자가 포함되어 있으면 이전 방식으로 디코딩 (호환성)
    return decodeLetterBased(encoded);
  }
}

/**
 * 숫자 기반 디코딩 (새로운 방식)
 * '1234567' → ['q1_a', 'q2_b', 'q3_c', ...]
 */
function decodeNumberBased(encoded: string): QuizState | null {
  const answers: QuizState = [];

  for (let i = 0; i < 7; i++) {
    const num = parseInt(encoded[i], 10);

    // 유효한 범위 확인 (1-7)
    if (isNaN(num) || num < 1 || num > 7) {
      return null;
    }

    // 숫자를 문자로 변환: 1→a, 2→b, 3→c, 4→d, 5→e, 6→f, 7→g
    const letter = String.fromCharCode(96 + num);
    answers.push(`q${i + 1}_${letter}`);
  }

  return answers;
}

/**
 * 문자 기반 디코딩 (이전 방식, 호환성용)
 * 'abcdefg' → ['q1_a', 'q2_b', 'q3_c', ...]
 */
function decodeLetterBased(encoded: string): QuizState | null {
  const answers: QuizState = [];

  for (let i = 0; i < 7; i++) {
    const char = encoded[i];

    // 유효한 문자인지 확인 (a-g)
    if (!/[a-g]/.test(char)) {
      return null;
    }

    answers.push(`q${i + 1}_${char}`);
  }

  return answers;
}

/**
 * 현재 URL에서 답변 쿼리 파라미터를 추출
 */
export function getAnswersFromUrl(): QuizState | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('a');

  if (!encoded) return null;

  return decodeAnswers(encoded);
}

/**
 * 답변이 포함된 공유 URL 생성
 */
export function createShareUrl(answers: QuizState, baseUrl?: string): string {
  const encoded = encodeAnswers(answers);
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/result?a=${encoded}`;
}
