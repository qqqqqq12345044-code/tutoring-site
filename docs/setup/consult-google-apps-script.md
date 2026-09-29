# 상담 신청 → Google Sheets + 이메일 알림 설정

`src/lib/consult/googleSheetsPersistence.ts`가 상담 신청 1건마다 이 Apps
Script Web App에 한 번 POST합니다. 스크립트는 (1) Google Sheets에 행을
추가하고 (2) 같은 실행 안에서 관리자에게 이메일을 보냅니다. Next.js 쪽은
이 문서의 절차대로 배포한 뒤 URL과 secret, 관리자 이메일을 환경변수에
채우면 바로 동작합니다.

## 1. Google Sheets 준비

1. 새 Google Sheets 문서를 만듭니다 (또는 기존 문서를 사용).
2. 첫 번째 행에 헤더를 넣어둡니다 (선택 사항이지만 권장):
   `접수일시 | 학생이름 | 전화번호 | 학년 | 과목 | 지역(시도) | 지역상세 | 희망시간 | 문의내용 | 유입페이지 | 개인정보동의`

## 2. Apps Script 작성

해당 Sheets 문서에서 **확장 프로그램 → Apps Script**를 열고, 기본
`Code.gs` 내용을 아래 코드로 교체합니다.

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var expectedSecret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!expectedSecret || data.secret !== expectedSecret) {
      return respond(false, "unauthorized");
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.studentName || "",
      data.phone || "",
      data.grade || "",
      data.subject || "",
      data.province || "",
      data.cityDetail || "",
      data.availableTime || "",
      data.message || "",
      data.sourceUrl || "",
      data.agree ? "Y" : "N",
    ]);

    if (data.adminEmail) {
      MailApp.sendEmail({
        to: data.adminEmail,
        subject: "[교과설계소] 새 상담 신청 - " + (data.studentName || ""),
        body:
          "새 상담 신청이 접수되었습니다.\n\n" +
          "학생 이름: " + (data.studentName || "") + "\n" +
          "전화번호: " + (data.phone || "") + "\n" +
          "학년: " + (data.grade || "") + "\n" +
          "과목: " + (data.subject || "") + "\n" +
          "지역: " + (data.province || "") + " " + (data.cityDetail || "") + "\n" +
          "희망 시간: " + (data.availableTime || "") + "\n" +
          "문의사항: " + (data.message || "") + "\n" +
          "유입 페이지: " + (data.sourceUrl || "") + "\n" +
          "접수 시각: " + (data.submittedAt || "") + "\n\n" +
          "전체 내역은 Google Sheets에서 확인하세요.",
      });
    }

    return respond(true, "ok");
  } catch (err) {
    return respond(false, "error");
  }
}

function respond(ok, message) {
  var output = ContentService.createTextOutput(JSON.stringify({ ok: ok, message: message }));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

## 3. Secret 설정

Apps Script 편집기에서 **프로젝트 설정(톱니바퀴) → 스크립트 속성 →
속성 추가**로 이동해 다음을 추가합니다.

- 속성: `WEBHOOK_SECRET`
- 값: 직접 생성한 임의의 긴 문자열 (예: `openssl rand -hex 32` 결과물).
  이 값을 그대로 Next.js의 `CONSULT_WEBHOOK_SECRET` 환경변수에도 넣습니다.
  **두 값은 반드시 동일해야 합니다.**

## 4. 배포 (Web App)

1. Apps Script 편집기에서 **배포 → 새 배포**를 클릭합니다.
2. 유형: **웹 앱**을 선택합니다.
3. "액세스 권한이 있는 사용자": **모든 사용자**로 설정합니다 (secret 검증이
   실제 인증 역할을 하므로 이렇게 해야 서버가 호출할 수 있습니다).
4. 배포 후 발급되는 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec`)을
   복사합니다.

## 5. 환경변수 채우기

`.env.local`(git에 커밋되지 않음)에 다음 세 값을 채웁니다.

```
CONSULT_GOOGLE_SHEETS_WEBHOOK_URL=<4단계에서 복사한 웹 앱 URL>
CONSULT_WEBHOOK_SECRET=<3단계에서 만든 값과 동일한 문자열>
CONSULT_ADMIN_EMAIL=<상담 알림을 받을 관리자 이메일>
```

Vercel 등 배포 환경에도 동일한 세 값을 프로젝트 환경변수로 등록합니다.

## 6. 확인

값을 채운 뒤 실제 사이트의 `/consult` 폼으로 테스트 신청을 한 번 제출해
Google Sheets에 행이 추가되고 관리자 이메일이 도착하는지 확인합니다.
값이 비어 있거나 잘못된 경우, 사용자에게는 "일시적인 오류가 발생했습니다"
안내만 나가고 서버 로그에는 실패 종류(config/network/webhook)만 남습니다
(개인정보는 로그에 남지 않습니다).

## 스크립트 속성을 바꾸거나 재배포할 때

`WEBHOOK_SECRET`을 바꾸면 Next.js 쪽 `CONSULT_WEBHOOK_SECRET`도 함께
바꿔야 합니다. Apps Script를 코드만 수정하고 "새 배포"를 만들지 않은 채
"배포 관리"에서 기존 배포를 업데이트하면 URL이 바뀌지 않습니다 — 새
배포를 만들면 URL이 바뀌므로 그 경우에만 `CONSULT_GOOGLE_SHEETS_WEBHOOK_URL`도
갱신하세요.

## 알려진 이슈: Apps Script가 가끔 JSON 대신 HTML을 반환함 (2026-09 발견)

Production 상담폼에서 "관리자 이메일은 도착했는데 사용자 화면에는 오류가
표시됨" 현상이 발생해 조사한 결과, 원인은 이 저장소의 Next.js 코드가 아니라
**Google Apps Script Web App 응답 전달 계층의 간헐적 오작동**으로 확인됐습니다.

실측(`src/lib/consult/googleSheetsPersistence.ts`의 진단 로그로 확인):

- 정상 케이스: 약 1.5~6초 내에 `{"ok":true,...}` JSON 응답.
- 실패 케이스: 19~35초가 걸린 뒤, `ContentService`가 반환해야 할 JSON 대신
  Google의 내부 뷰어/인터스티셜로 보이는 HTML(`window['ppConfig'] = ...`로
  시작)이 status 200 또는 404와 함께 돌아옴.
- 이 HTML은 스크립트가 만든 응답이 아니며, `doPost()`의 `appendRow`/
  `MailApp.sendEmail` 실행 자체는 이미 끝난 뒤 응답만 유실되는 것으로 보임
  (실제로 이메일은 정상 발송됨) — 즉 **저장/알림은 성공했는데 호출자
  (Next.js)만 그 사실을 확인하지 못하는 상태**.
- 실행이 느릴수록(약 20초 이상) 이 증상이 나타나는 경향이 있어, 동시 실행
  경합(같은 스크립트/시트에 짧은 시간 안에 여러 요청이 몰릴 때)이 계기일
  가능성이 있으나 Google 인프라 내부 동작이라 이 저장소에서 완전히
  통제할 수는 없습니다.

**현재 Next.js 쪽 대응** (`src/app/api/consult/route.ts`,
`src/lib/consult/rateLimit.ts`): 이런 애매한 응답("webhook" 종류 실패)을
받으면 사용자에게는 정직하게 실패를 알리되, 같은 학생이름+전화번호로
5분 안에 재제출하면 Apps Script를 다시 호출하지 않고 조용히 성공 처리해
**중복 행/중복 메일을 방지**합니다. 단, 이 방법은 "중복 저장 방지"이지
"첫 시도의 실패 표시 자체를 없애는" 근본 해결책은 아닙니다.

**더 근본적인 해결(선택, 이 저장소에서 직접 배포는 불가능 — Apps Script는
Google 쪽 리소스라 Claude Code 세션에서 수정할 수 없습니다)**: 위 2번
섹션의 `doPost` 스크립트에 요청마다 고유 ID(Next.js가 생성해 함께 보내는
`submissionId` 등)를 받아 `CacheService.getScriptCache()`에 짧은 TTL(예:
10분)로 기록하고, 이미 처리한 ID가 재수신되면 `appendRow`/`sendEmail`을
건너뛰고 바로 `respond(true, "ok")`를 반환하도록 하면, Next.js 쪽에서
안전하게 자동 재시도를 붙일 수 있게 됩니다. 필요하면 이 스크립트 수정을
요청해주세요 — Next.js 쪽 코드도 함께 맞춰 변경합니다.
