# Google Sheets 데이터 수집 설정 가이드

## 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 첫 번째 행에 헤더 추가:
   ```
   A1: 타임스탬프
   B1: 이름
   C1: 전화번호
   D1: 이메일
   E1: 추천 자격증
   F1: 페르소나
   G1: 트랙
   ```

## 2단계: Apps Script 설정

1. 스프레드시트에서 **확장 프로그램 > Apps Script** 클릭
2. 기본 코드를 삭제하고 아래 코드 붙여넣기:

```javascript
function doPost(e) {
  try {
    // 스프레드시트 접근
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 새 행 추가
    sheet.appendRow([
      new Date(),           // 타임스탬프
      data.name || '',      // 이름
      data.phone || '',     // 전화번호
      data.email || '',     // 이메일
      data.certification || '', // 추천 자격증
      data.persona || '',   // 페르소나
      data.track || ''      // 트랙
    ]);

    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3단계: 웹앱으로 배포

1. **배포 > 새 배포** 클릭
2. 톱니바퀴 아이콘 클릭 → **웹앱** 선택
3. 설정:
   - **설명**: "이세계길드 리드 수집"
   - **실행 계정**: 나
   - **액세스 권한**: **모든 사용자** (중요!)
4. **배포** 클릭
5. **웹앱 URL 복사** (예: `https://script.google.com/macros/s/...../exec`)

## 4단계: URL을 Next.js에 설정

복사한 웹앱 URL을 다음 파일에 추가해야 합니다:
- `.env.local` 파일에 `NEXT_PUBLIC_GOOGLE_SHEETS_URL=복사한_URL` 추가

## 테스트 방법

Apps Script 편집기에서:
1. **doPost** 함수 옆 드롭다운에서 **doPost** 선택
2. **실행** 클릭
3. 권한 승인

또는 터미널에서 테스트:
```bash
curl -X POST "복사한_웹앱_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","phone":"010-1234-5678","email":"test@test.com"}'
```

## 보안 참고사항

✅ **안전한 이유:**
- API 키가 프론트엔드에 노출되지 않음
- Google이 호스팅하는 엔드포인트
- Apps Script에서 권한 제어

⚠️ **주의사항:**
- 웹앱 URL은 공개되지만, 스프레드시트 접근은 불가능
- Rate limiting은 자동으로 적용됨 (분당 약 30회)
- 스팸 방지가 필요하면 추가 검증 로직 가능

## 문제 해결

**403 에러가 나면:**
- "액세스 권한"이 "모든 사용자"로 설정되었는지 확인

**데이터가 안 들어오면:**
- Apps Script 실행 로그 확인 (보기 > 로그)
- 웹앱을 새 버전으로 재배포

**CORS 에러가 나면:**
- 정상입니다! Apps Script는 CORS를 지원하지 않지만, `no-cors` 모드로 해결됩니다.
