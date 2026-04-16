# Frontend Design Guide
## MS 자격증 추천 퀴즈 위젯

**Name**: ms-cert-quiz-widget
**Description**: Microsoft 자격증 추천 퀴즈 위젯 - 3분 안에 사용자에게 맞는 자격증을 추천하는 인터랙티브 프론트엔드 인터페이스. 노션 iframe 임베드 최적화.
**License**: Complete terms in LICENSE.txt

---

## 프로젝트 디자인 철학

이 프로젝트는 **신뢰감과 접근성을 동시에 제공하는 전문적이면서도 친근한 인터페이스**를 목표로 합니다. Microsoft 자격증이라는 다소 딱딱한 주제를 퀴즈 형식으로 부드럽게 풀어내며, 비개발자도 쉽게 접근할 수 있는 UX를 제공합니다.

---

## Design Thinking

### 1. Purpose (목적)
**문제**: Microsoft 자격증이 처음인 취준생·직장인·학생이 어떤 자격증부터 시작해야 할지 모른다.
**해결**: 7개 질문으로 개인 상황을 분석하고, 12개 자격증 중 가장 적합한 1-3개를 추천한다.

**핵심 사용자 플로우**:
```
랜딩 페이지 (3초 내 의사결정)
  ↓ "시작하기" 클릭
퀴즈 (7문항, 약 2분)
  ↓ 각 질문마다 즉각적인 피드백
결과 페이지 (개인화된 별명 + 추천)
  ↓ 링크 복사 & 공유
이메일 수집 (3개월 플래너 PDF 제공)
```

---

### 2. Tone (톤 & 분위기)

**선택된 디자인 방향**: **친근한 전문성 (Approachable Professionalism)**

- **NOT**: 딱딱한 기업 사이트 (corporate/enterprise)
- **NOT**: 지나치게 캐주얼한 게임 (playful/toy-like)
- **YES**: 신뢰할 수 있지만 접근하기 쉬운 (reliable yet welcoming)

**구체적 특징**:
- 색상: 차분한 파스텔 + 신뢰감을 주는 블루/퍼플 gradient
- 타이포그래피: 읽기 쉬우면서도 세련된 폰트 조합
- 애니메이션: 부드럽고 자연스러운 전환 (급격하지 않음)
- 레이아웃: 카드 중심의 모던한 구성 (한 번에 하나의 초점)

**감성 키워드**:
- 편안함 (Comfort)
- 명료함 (Clarity)
- 추진력 (Momentum) - "나도 할 수 있다"는 느낌

---

### 3. Constraints (기술적 제약사항)

#### 필수 요구사항
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (엄격한 타입 안정성)
- **Styling**: Tailwind CSS (utility-first)
- **Animation**: Framer Motion (선언적 애니메이션)

#### 임베드 환경 제약
- **노션 iframe**: 고정 높이 (최소 600px), 3rd-party 쿠키 차단
- **반응형 필수**: 모바일(320px+) ~ 데스크톱(1440px+)
- **다크모드 대응**: prefers-color-scheme 감지

#### 성능 요구사항
- **로딩 시간**: 2초 이내 (First Contentful Paint)
- **TTI**: 3초 이내 (Time to Interactive)
- **번들 사이즈**: 메인 JS 300KB 이하

#### 접근성 (a11y)
- **키보드 네비게이션**: Tab, Enter, Esc 지원
- **색맹 대응**: 색상 외 텍스트로도 정보 전달
- **터치 영역**: 최소 44x44px (모바일)

---

### 4. Differentiation (차별화 포인트)

**이 퀴즈를 기억에 남게 만드는 요소**:

1. **개인화된 별명 시스템**
   - 단순한 결과가 아닌 "AI 호기심 탐험가형" 같은 재미있는 네이밍
   - 공유하고 싶게 만드는 정체성 부여

2. **즉각적인 가치 제공**
   - 이메일 입력 없이도 결과 확인 가능
   - URL 공유로 친구에게 바로 보여줄 수 있음

3. **진행률 시각화**
   - 매 질문마다 "n/7" 표시 + 진행률 바
   - 이탈 방지 및 목표 의식 강화

4. **맥락 기반 추천**
   - "지금 봐야 하는 이유" (AI-900 은퇴 예정 등)
   - 타이밍 훅으로 긴박감 조성

**UNFORGETTABLE 순간**:
> 결과 페이지 첫 로딩 시 **staggered reveal 애니메이션**으로 별명 → 메인 카드 → 서브 카드가 순차적으로 나타나며 "나를 위한 맞춤 추천"이라는 느낌을 극대화한다.

---

## Frontend Aesthetics Guidelines

### Typography (타이포그래피)

**현재 스택**: Geist Sans (Next.js 기본)

**개선 방향**:
- **Display Font** (제목):
  - 고려 옵션: Poppins, Outfit, Manrope, Satoshi
  - 특징: 둥근 끝, 현대적, 신뢰감

- **Body Font** (본문):
  - 고려 옵션: Inter Tight, DM Sans, Nunito Sans
  - 특징: 가독성 높음, 한글과 조화

- **Code/Badge** (코드/배지):
  - 현재: Geist Mono (유지)
  - 자격증 코드(AI-900 등) 표시용

**적용 예시**:
```css
/* 랜딩 페이지 제목 */
h1 {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em; /* 타이트한 자간 */
}

/* 퀴즈 질문 */
h2 {
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
}

/* 본문 및 선택지 */
p, button {
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
}
```

**타이포그래피 원칙**:
- 제목: 48-64px (모바일 32-40px)
- 본문: 16-18px (line-height: 1.6)
- 버튼: 16px (font-weight: 600)

---

### Color & Theme (색상 및 테마)

**현재 팔레트**:
```
Primary: blue-500 to blue-600
Secondary: purple-500 to purple-600
Gradient: from-blue-500 to-purple-600
```

**개선 방향** (더 개성 있는 컬러 선택):

#### Option A: Warm Professional (따뜻한 전문성)
```css
:root {
  --primary: #FF6B6B;      /* Coral Red */
  --secondary: #4ECDC4;    /* Teal */
  --accent: #FFE66D;       /* Soft Yellow */
  --background: #F7F9FC;   /* Cool White */
}
```

#### Option B: Tech Forward (기술 지향)
```css
:root {
  --primary: #667EEA;      /* Vibrant Blue */
  --secondary: #764BA2;    /* Royal Purple */
  --accent: #F093FB;       /* Soft Pink */
  --background: #FAFBFC;   /* Light Gray */
}
```

#### Option C: Nature Inspired (자연 영감)
```css
:root {
  --primary: #38B2AC;      /* Emerald */
  --secondary: #48BB78;    /* Green */
  --accent: #F6E05E;       /* Gold */
  --background: #F0FFF4;   /* Mint White */
}
```

**권장**: **Option B (현재 방향 유지 + 정교화)**
- Microsoft 브랜드 컬러와 조화
- 신뢰감과 혁신성 동시 표현
- 다크모드 전환 시 gradient 역전

**다크모드 설정**:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0F172A;   /* Slate 900 */
    --foreground: #F1F5F9;   /* Slate 100 */
    --primary: #818CF8;      /* Lighter Blue */
    --secondary: #A78BFA;    /* Lighter Purple */
  }
}
```

---

### Motion (애니메이션 & 인터랙션)

**Framer Motion 활용 전략**:

#### 1. 페이지 전환 (Page Transitions)
```typescript
// 질문 카드 전환
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

#### 2. Staggered Reveal (결과 페이지)
```typescript
// 결과 카드들이 순차적으로 나타남
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    delay: index * 0.15, // 0s, 0.15s, 0.3s
    duration: 0.4
  }}
>
```

#### 3. 버튼 Hover (미묘한 스케일)
```typescript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400 }}
>
```

#### 4. 진행률 바 (Smooth Fill)
```css
.progress-bar {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**애니메이션 원칙**:
- **속도**: 0.2-0.4s (빠르지만 급격하지 않게)
- **Easing**: `ease-out` (자연스러운 감속)
- **목적**: 사용자의 시선을 유도, 상태 변화 전달

---

### Spatial Composition (공간 구성)

**레이아웃 철학**: **Centered Card Pattern**

#### 랜딩 페이지
```
┌──────────────────────────────────┐
│                                  │
│         ┌─────────────┐          │
│         │   Title     │          │
│         │  Subtitle   │          │
│         │             │          │
│         │ ┌─────────┐ │          │
│         │ │  Start  │ │          │
│         │ └─────────┘ │          │
│         └─────────────┘          │
│                                  │
└──────────────────────────────────┘
```

#### 퀴즈 페이지
```
┌──────────────────────────────────┐
│  [Progress Bar] 5/7              │
│                                  │
│    ┌──────────────────────┐     │
│    │   질문 텍스트        │     │
│    │                      │     │
│    │  [ 선택지 1 ]        │     │
│    │  [ 선택지 2 ]        │     │
│    │  [ 선택지 3 ]        │     │
│    │                      │     │
│    │  [← 이전]  [다음 →]  │     │
│    └──────────────────────┘     │
└──────────────────────────────────┘
```

#### 결과 페이지
```
┌──────────────────────────────────┐
│     당신은 "AI 호기심 탐험가형"   │
│                                  │
│  ┌─────────────────────────┐    │
│  │  🏆 메인 추천: AI-900   │    │
│  │  [배지 4개]             │    │
│  │  혜택 • • •             │    │
│  │  [상세 가이드] [모의고사] │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌──────────┐  ┌──────────┐     │
│  │ 서브 1   │  │ 서브 2   │     │
│  └──────────┘  └──────────┘     │
└──────────────────────────────────┘
```

**여백 원칙**:
- 섹션 간 간격: 48-64px (모바일 32px)
- 카드 내부 패딩: 32-48px (모바일 24px)
- 버튼 간 간격: 16px

---

### Backgrounds & Visual Details (배경 및 시각적 디테일)

#### 1. Gradient Backgrounds (그라데이션 배경)
```css
/* 랜딩 페이지 */
background: linear-gradient(135deg,
  #EBF4FF 0%,     /* Light Blue */
  #F3E8FF 50%,    /* Light Purple */
  #FCE7F3 100%    /* Light Pink */
);

/* 다크모드 */
@media (prefers-color-scheme: dark) {
  background: linear-gradient(135deg,
    #1E293B 0%,   /* Slate 800 */
    #4C1D95 50%,  /* Purple 900 */
    #1E293B 100%
  );
}
```

#### 2. Card Shadows (카드 그림자)
```css
/* 기본 카드 */
box-shadow:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* 메인 추천 카드 (강조) */
box-shadow:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04),
  0 0 0 4px rgba(99, 102, 241, 0.1); /* Gradient border effect */
```

#### 3. Micro-interactions (미세 상호작용)
```css
/* 선택지 버튼 호버 */
.option-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(99, 102, 241, 0.2);
}

/* 선택된 상태 */
.option-button.selected {
  background: linear-gradient(135deg, #667EEA, #764BA2);
  color: white;
  transform: scale(1.02);
}
```

#### 4. Loading States (로딩 상태)
```typescript
// 스켈레톤 UI (결과 페이지 로딩 중)
<div className="animate-pulse">
  <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
  <div className="h-64 bg-slate-200 rounded mb-4"></div>
</div>
```

---

## Avoiding Generic AI Aesthetics

### ❌ NEVER (절대 금지)
- **Inter/Roboto/Arial 단독 사용** → 개성 없는 기본 폰트
- **Purple gradient on white** (현재 사용 중이지만 개선 필요) → 식상한 AI 웹사이트 클리셰
- **동일한 카드 크기/간격** → 예측 가능한 레이아웃
- **Cursor: pointer만 사용** → 인터랙션 단서 부족

### ✅ DO (권장)
- **폰트 조합**: Display + Body 2종 이상
- **색상 실험**: 파스텔 + 비비드 조합, 또는 모노크롬 + 1개 강조색
- **비대칭 레이아웃**: 메인 카드 크게, 서브 카드 작게
- **커스텀 커서**: 클릭 가능한 영역에 시각적 힌트

### 🎨 Creative Directions (창의적 방향)

#### Option 1: **Soft Pastel Minimalism** (현재 방향 개선)
- 배경: 아주 옅은 gradient (거의 white에 가까운)
- 카드: 부드러운 그림자, 둥근 모서리 (16-24px)
- 애니메이션: 느리고 우아한 전환 (0.5s)
- 포인트: 메인 카드에만 gradient border

#### Option 2: **Brutalist Tech** (대담한 전환)
- 배경: 순백 또는 순흑
- 카드: 예리한 모서리, 두꺼운 border (4px solid)
- 타이포: 고딕체, 큰 사이즈, 높은 대비
- 애니메이션: 빠르고 기계적 (0.2s cubic-bezier)

#### Option 3: **Organic Flow** (자연스러운 흐름)
- 배경: 물결 패턴, blob 모양
- 카드: 불규칙한 둥근 모서리 (border-radius: 30% 70%)
- 타이포: 유기적 곡선 폰트 (Comfortaa, Quicksand)
- 애니메이션: 부드러운 bounce (spring physics)

**현재 프로젝트 권장**: **Option 1 (Soft Pastel Minimalism)**
→ 타겟 사용자(취준생·직장인)에게 친근하면서도 전문적

---

## Implementation Checklist

### Phase 1: Typography Upgrade
- [ ] Google Fonts에서 Display + Body 폰트 선택
- [ ] `app/layout.tsx`에 폰트 import
- [ ] Tailwind config에 폰트 family 추가
- [ ] 모든 제목, 본문, 버튼에 적용

### Phase 2: Color Refinement
- [ ] `globals.css`에 CSS 변수 정의
- [ ] 다크모드 변수 분리
- [ ] Gradient 방향 실험 (135deg, 90deg, 45deg)
- [ ] 배경 노이즈/텍스처 추가 (선택적)

### Phase 3: Animation Enhancement
- [ ] 결과 페이지 staggered reveal 구현
- [ ] 버튼 hover/tap 효과 개선
- [ ] 페이지 전환 easing 조정
- [ ] 로딩 스켈레톤 UI 추가

### Phase 4: Layout Refinement
- [ ] 카드 크기 차별화 (메인 vs 서브)
- [ ] 여백 조정 (섹션 간 일관성)
- [ ] 모바일 breakpoint 테스트
- [ ] 터치 영역 최소 크기 검증

### Phase 5: Visual Details
- [ ] 카드 그림자 깊이 실험
- [ ] Gradient border 효과 추가
- [ ] 배지 아이콘 디자인 통일
- [ ] 공유 버튼 아이콘 추가

---

## Design System (디자인 시스템)

### Spacing Scale
```typescript
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
}
```

### Border Radius
```typescript
const borderRadius = {
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  '2xl': '2rem',  // 32px
  full: '9999px'
}
```

### Font Weights
```typescript
const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
}
```

---

## Performance Budget

### 애니메이션 성능
- **60 FPS 유지**: transform, opacity만 애니메이션
- **Layout Shift 최소화**: CLS < 0.1
- **Reflow 방지**: position, margin 변경 금지

### 번들 최적화
- **Framer Motion**: tree-shaking으로 사용하는 기능만 import
- **Tailwind**: PurgeCSS로 미사용 클래스 제거
- **폰트**: woff2 format, subset으로 용량 감소

---

## Accessibility (접근성)

### 색맹 대응
```typescript
// 선택된 상태를 색상 외에 아이콘으로도 표시
{selected && <CheckIcon className="ml-2" />}
```

### 키보드 네비게이션
```typescript
// 선택지에 Tab 포커스 가능
<button
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(option.id);
    }
  }}
>
```

### 스크린 리더
```jsx
<button aria-label="다음 질문으로 이동">
  다음 →
</button>
```

---

## Inspiration & References

### 유사 프로젝트
- **Typeform**: 인터랙티브 폼, 부드러운 전환
- **Linear**: 미니멀한 디자인, 빠른 애니메이션
- **Stripe**: 신뢰감 있는 gradient, 명확한 CTA

### 디자인 리소스
- **Fonts**: Google Fonts, Adobe Fonts
- **Colors**: Coolors.co, Happy Hues
- **Gradients**: UI Gradients, Mesh Gradients
- **Icons**: Heroicons, Lucide Icons

---

## Remember

> "The best interface is the one that disappears."
> 사용자는 퀴즈를 풀고 결과를 얻는 데 집중해야 하며, 디자인은 그 과정을 **자연스럽고 즐겁게** 만드는 보조 역할을 한다.

**핵심 가치**:
1. **명료함** (Clarity) - 헷갈리지 않는 UI
2. **신뢰감** (Trust) - 전문성 있는 비주얼
3. **즐거움** (Delight) - 미세한 애니메이션으로 경험 향상

---

**현재 상태**: MVP 완료 (기본 gradient + Geist 폰트)
**다음 단계**: Typography Upgrade + Color Refinement
**최종 목표**: 사용자가 공유하고 싶어지는 시각적 경험 제공
