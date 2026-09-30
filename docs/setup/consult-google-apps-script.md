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
`Code.gs` 내용을 이 저장소의 **`docs/setup/consult-apps-script.gs` 파일 전체**로
교체합니다(스크립트 원본은 이 파일 하나만 관리합니다 — 문서에 코드를 복사해
두지 않습니다).

1단계 헤더에 두 열을 더 추가해 둡니다(v2부터 사용, 없어도 동작은 하지만
시트에서 알아보기 쉽도록): `... | 개인정보동의 | 접수ID | 알림메일`
(L열 = 접수ID, M열 = 알림메일 "Y").

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

**대응 (2026-09-30, v2 idempotency)**: 응답 유실 자체는 Google 쪽 문제라
막을 수 없으므로, "같은 요청이 여러 번 도착해도 결과는 1건"이 되도록 양쪽을
바꿨습니다.

- **submissionId**: `ConsultForm`이 제출마다 UUID를 만들고, 같은 폼에서
  *같은 내용*으로 다시 제출하면 같은 ID를 재사용합니다(내용이 하나라도 바뀌면
  새 ID). "이름+전화번호가 같으면 중복"으로 보지 않으므로, 같은 가족의 다른
  과목 신청 같은 실제로 다른 요청은 합쳐지지 않습니다. ID가 없는 구버전
  클라이언트 요청은 서버가 ID를 만들어 붙입니다.
- **Apps Script v2** (`consult-apps-script.gs`): `LockService` 스크립트 락으로
  "ID 조회 → 행 추가 → 메일 → 메일 표시"를 직렬화하고, 이미 처리한 ID는 행을
  추가하지 않고 `{"ok":true,"message":"duplicate"}`로 답합니다. 처리 여부의
  근거는 시트의 **접수ID 열**(영구)이고, `CacheService`는 빠른 응답용일 뿐입니다
  (최대 6시간·임의 축출 가능하므로 정확성의 근거로 쓰지 않음). 행은 저장됐는데
  메일 전에 실패한 경우, 재시도 때 메일만 보냅니다. `PropertiesService`는 용량
  (전체 500KB)이 작아 ID 저장소로 쓰지 않고 secret 보관에만 씁니다.
  락을 20초 안에 못 잡으면 아무것도 쓰지 않고 `busy`로 답합니다(재시도 안전).
- **Next.js 방어 계층 (유지)**: 같은 인스턴스에서 5분 안의 재제출은 Apps Script를
  다시 부르지 않고 성공 처리합니다. 키는 `submissionId`와 **입력 전체의 해시**
  입니다(이전: 이름+전화번호).
- **자동 재시도 (`CONSULT_WEBHOOK_IDEMPOTENT=true`일 때만)**: 애매한 실패
  (HTML 응답, 네트워크 오류, `ok:false`의 error/busy)면 같은 submissionId로 1회
  재시도합니다. v2 스크립트가 "duplicate"를 빠르게 돌려주므로, 위 장애 패턴이
  사용자 화면에서 **성공**으로 바뀝니다. 잘못된 secret(`unauthorized`)은 재시도하지
  않습니다. 이 모드에서는 실패한 요청을 5분 게이트로 막지 않아, 저장 전에 실패한
  신청도 사용자가 다시 제출할 수 있습니다.

로컬 검증(실제 Google 계정 없이, `.gs` 파일을 그대로 실행하는 모의 서비스 +
실제 `next start`): 정상/동일 요청 재전송/동시 중복/같은 이름·번호의 다른 요청/
잘못된 secret/저장 후 HTML 응답/저장 전 실패/메일 실패/소켓 끊김/구버전
요청(ID 없음) 시나리오에서 행·메일이 모두 1건(다른 요청은 각 1건)으로 확인됨.

## v2로 업그레이드하는 순서 (반드시 이 순서)

1. Sheets 1행 L1·M1에 `접수ID`, `알림메일` 헤더를 추가합니다(선택).
2. Apps Script 편집기에서 `Code.gs`를 `docs/setup/consult-apps-script.gs`로
   교체 → **배포 → 배포 관리 → 기존 배포 편집(연필) → 버전: 새 버전 → 배포**.
   (새 배포를 만들면 URL이 바뀝니다. 기존 배포를 새 버전으로 올리면 URL 유지.)
   v2는 submissionId가 없는 기존 요청도 v1과 똑같이 처리하므로, 이 단계만
   먼저 해도 운영에 영향이 없습니다.
3. 테스트 제출 1건으로 L열에 접수ID가 채워지고 M열이 `Y`가 되는지 확인합니다.
4. 그 다음에 Vercel 환경변수 `CONSULT_WEBHOOK_IDEMPOTENT=true`를 추가하고
   재배포합니다. **v2 배포 전에 이 값을 켜면 재시도가 중복 행/메일을 만듭니다.**

롤백: `CONSULT_WEBHOOK_IDEMPOTENT`를 지우고 재배포하면 재시도가 꺼집니다.
Apps Script는 "배포 관리"에서 이전 버전을 선택해 되돌릴 수 있습니다.
