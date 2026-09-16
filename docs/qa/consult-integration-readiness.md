# 상담폼 미래 연동 준비도(Integration Readiness) 검수 보고서

기준 Git 체크포인트: `4874c96` (working tree: `review-screenshots-brand/`, `scratch-audit/` 미추적 디렉터리 존재, 소스 변경 없음)
검수 방식: `src/components/ConsultForm.tsx`, `src/app/consult/page.tsx`, `src/components/ConsultCTA.tsx`, `src/app/api/consult/route.ts`, `src/data/grades.ts`, `src/data/subjects.ts`, `src/data/regions.ts` 정독. **코드 수정, 실제 연동(Google Sheets/이메일/CRM/카카오), 커밋은 수행하지 않았습니다. 분석 및 본 보고서 작성만 진행했습니다.**

---

## 0. 사전 정정 — "두 개의 폼"이 아니라 "하나의 폼"

작업 지시서는 "홈 미니 폼 vs `/consult` 전체 폼" 두 개의 별도 구현이 존재한다고 가정했지만, 실제 코드를 확인한 결과 **폼은 단 하나**입니다.

- `src/components/ConsultForm.tsx`가 유일한 `<form>` 컴포넌트이며, `src/app/page.tsx`(홈, 325번째 줄)와 `src/app/consult/page.tsx`(27번째 줄) 양쪽에서 **동일한 컴포넌트를 그대로 import해서 렌더링**합니다.
- `src/components/ConsultCTA.tsx`는 폼이 아니라 `/consult`로 이동시키는 버튼형 CTA(`<PrimaryButton href="/consult">`)입니다. 입력 필드가 없습니다.
- 코드베이스 전체에서 `<form>` 태그를 쓰는 곳은 `ConsultForm.tsx` 하나뿐입니다(`SearchBox.tsx`, `MobileMenu.tsx`, `FAQAccordion.tsx`는 폼이 아님).

**결론: 필드명/검증 규칙이 "두 폼 사이에서" 어긋날 위험은 현재 구조상 0입니다** — 같은 컴포넌트이므로 항상 동일합니다. 다만 이 사실 자체가 "지금은 안전하지만 구조적으로 취약하다"는 의미이기도 합니다: 만약 향후 누군가 홈페이지용 "미니 버전"(예: 이름+연락처만 받는 축약 폼)을 별도로 만들면, 그 시점부터는 이 보고서가 원래 가정했던 드리프트 위험이 실제로 발생합니다. 지금 필드/검증을 정리해두는 것은 바로 그 미래 시나리오에 대한 선제 대응이라는 점에서 이 작업은 여전히 유효합니다.

---

## 1. 필드 목록 (`ConsultForm.tsx`, 홈/`/consult` 공통)

| 필드명(name) | HTML 타입 | required | 검증/옵션 소스 | 라벨 |
|---|---|---|---|---|
| `grade` | `<select>` | ✅ | 하드코딩 배열 `gradeOptions` (컴포넌트 내부, `src/data/grades.ts` 미사용) | "학생 학년" |
| `subject` | `<select>` | ✅ | `src/data/subjects.ts`의 `subjects` 배열 + 하드코딩 옵션 "기타" 1개 추가 | "희망 과목" |
| `lessonType` | radio ×3 | ✅ | 하드코딩 배열 `lessonTypeOptions` (visit/online/any), 별도 data 파일 없음 | "수업 방식" |
| `province` | `<select>` | ✅ | `src/data/regions.ts`의 `getProvinces()` | "지역 (시/도)" |
| `cityDetail` | `text` | ❌ | 자유 입력, placeholder만 존재 | "시/군/구 또는 동 (직접입력)" |
| `contactName` | `text` | ✅ | 없음(빈 문자열만 방지) | "학생 이름 또는 보호자 이름" |
| `phone` | `tel` | ✅ | `pattern` 속성 없음, placeholder("010-0000-0000")만 존재 — 형식 강제 없음 | "연락처" |
| `availableTime` | `text` | ❌ | 자유 입력 | "상담 가능 시간" |
| `message` | `textarea` (rows=3) | ❌ | 없음 | "문의사항" |
| `agree` | `checkbox` | ✅ (native `required`) | 없음(체크 여부만) | 개인정보 수집·이용 동의 문구, `/privacy`로 링크 |

제출 방식: `FormData` → `Object.fromEntries()` → `JSON.stringify` → `POST /api/consult`. 클라이언트에서 생성하는 타임스탬프 필드는 없음.

---

## 2. 홈 폼 vs `/consult` 폼 비교

동일 컴포넌트이므로 **필드명, 타입, required, 옵션 소스, 검증 규칙 모두 완전히 동일**합니다(위 표 그대로). "차이"는 존재하지 않습니다. 다만 두 렌더 위치의 주변 텍스트(H2/설명 문구)는 거의 동일한 문구를 각자 하드코딩하고 있어(홈 `page.tsx` 317~321줄과 `/consult/page.tsx` 17~23줄이 문구까지 거의 똑같음) — 이는 폼 자체 이슈는 아니라 범위 밖이지만, 참고로 기록합니다.

---

## 3. `src/app/api/consult/route.ts` 페이로드 형태

- 입력: `request.json()`으로 받은 임의의 `Record<string, unknown>` — 타입/스키마 강제 없음(런타임 검증 라이브러리 없음, 필드 화이트리스트 없음).
- 필수값 검사: `body.contactName`, `body.phone`, `body.grade`, `body.subject` 4개만 존재 여부 확인(`!body.x`로 falsy 체크, 값 형식 검사는 없음).
- **검증되지 않는 required 필드**: 폼에서는 `lessonType`, `province`, `agree`도 `required`이지만, API는 이 3개를 전혀 검사하지 않습니다. 클라이언트 검증을 우회해 직접 POST하면 수업방식/지역/개인정보 동의 없이도 `ok: true`가 반환됩니다.
- 응답: `{ ok: true }` 또는 `{ ok: false, error: "..." }` (400). 저장/전달 로직 없음 — `console.log`로만 남기고 끝(코드 주석에 명시: "현재는 실제 백엔드 연동 전이므로 요청 내용을 로그로만 남기고 성공 응답을 반환").
- 필드명 일치 여부: API가 검사하는 4개 필드명(`contactName`, `phone`, `grade`, `subject`)은 폼이 실제로 보내는 이름과 정확히 일치합니다. 불일치 없음.

---

## 4. 목표 모델과의 갭 분석

목표 모델(작업 브리프 기준, 참고용 네이밍): `submittedAt, studentGrade, subject, lessonType, region, name, phone, availableTime, message, privacyConsent`

| 목표 필드 | 현재 대응 필드 | 상태 |
|---|---|---|
| `submittedAt` | **없음** | ❌ 누락 — 클라이언트/서버 어디에서도 제출 시각을 기록하지 않음 |
| `studentGrade` | `grade` | 있음, 이름만 다름 (스타일 차이) |
| `subject` | `subject` | 완전 일치 |
| `lessonType` | `lessonType` | 완전 일치 — **이미 존재함** (방문/화상/상관없음 라디오) |
| `region` | `province` (+ `cityDetail` 보조 필드) | 있음, 이름만 다름 — **이미 존재함**, 목표 모델보다 오히려 더 세분화(시/도 + 시/군/구 자유입력) |
| `name` | `contactName` | 있음, 이름만 다름 |
| `phone` | `phone` | 완전 일치 |
| `availableTime` | `availableTime` | 완전 일치 |
| `message` | `message` | 완전 일치 |
| `privacyConsent` | `agree` | 있음, 이름만 다름 + 값이 `"on"`(문자열)로 전송, API 서버측 필수 검증 없음 |

**핵심 확인 사항 (브리프의 구체적 질문에 대한 답):**
- "지역/region 필드가 있는가?" → **있습니다** (`province` + `cityDetail`).
- "수업방식(방문/화상) 필드가 있는가?" → **있습니다** (`lessonType`).
→ 즉 목표 모델 대비 "필드가 통째로 빠진" 경우는 `submittedAt` 하나뿐이고, 나머지는 전부 존재하되 이름만 다릅니다.

**갭 개수 요약**: 완전 누락 1건(`submittedAt`), 이름만 다른 필드 4건(`grade`↔`studentGrade`, `contactName`↔`name`, `province`↔`region`, `agree`↔`privacyConsent`), 완전 일치 4건, API 서버측 검증 누락 3건(`lessonType`/`province`/`agree` 미검사).

---

## 5. `privacyConsent`(현재 `agree`) 체크 상세

- 네이티브 `required` 속성: ✅ 있음 (`ConsultForm.tsx` 153번째 줄).
- `/privacy` 링크: ✅ 있음 (`<Link href="/privacy">개인정보처리방침</Link>`, `next/link` 사용).
- 제출 페이로드 포함 여부: ✅ 포함됨 — `name="agree"`이므로 체크된 상태로 제출 시 `FormData`에 `"on"`으로 들어가고 JSON에도 포함됩니다. **단, 체크박스가 unchecked인 상태로 FormData를 만들면 그 키 자체가 payload에서 사라집니다**(HTML 표준 동작). 지금은 `required`가 브라우저 제출을 막아주므로 정상 흐름에서는 문제없지만, API가 이 필드를 검사하지 않으므로 향후 실제 백엔드가 "동의를 받았다는 증거"를 신뢰하려면 서버측에서도 `agree`(또는 개명 후 `privacyConsent`)의 존재/값을 검사해야 합니다. 현재는 그렇지 않습니다.

---

## 6. 제안 — "안전한 이름 통일 / 최소 구조 정리" (동작 변화 없음, additive/rename만)

이 항목들은 결과 HTML·검증 동작·사용자 경험을 바꾸지 않고 순수하게 이름 정리 또는 소스 통합만 하는 것들입니다. 실행 여부와 실제 리네이밍은 오케스트레이터 판단에 맡깁니다.

1. **`grade` 옵션을 `src/data/grades.ts`에서 파생**: 현재 `ConsultForm.tsx`의 `gradeOptions` 하드코딩 배열(초1~초6, 중1~중3, 고1~고3, 기타)은 `grades.ts`의 각 `Grade.subGrades[].label`을 모두 합친 것과 **글자 하나까지 동일**합니다. `grades.flatMap(g => g.subGrades.map(sg => sg.label))` + `"기타"`로 파생시키면 결과가 100% 동일하면서, 앞으로 학년 데이터가 바뀔 때 폼이 자동으로 동기화됩니다. 지금 그대로 두면 "두 번째 폼"이 생기는 순간 이미 존재하는 진짜 드리프트 위험군(subject/region은 이미 공유 소스를 쓰는데 grade만 예외)입니다.
2. **필드명 통일 (스타일 차원, 배관 연결 시점에 한 번에 처리 권장)**: `grade`→`studentGrade`, `contactName`→`name`, `province`→`region`, `agree`→`privacyConsent`. API route.ts의 필수값 체크(`body.contactName`, `body.grade` 등)도 동시에 갱신 필요. 순수 rename이며 폼 UI/검증 로직은 변하지 않습니다.
3. **API에서 `submittedAt` 추가**: 클라이언트가 보내는 것보다, 서버(`route.ts`)가 요청을 받는 시점에 `new Date().toISOString()`으로 채워서 로그/향후 저장 페이로드에 포함시키는 방식이 신뢰도가 높습니다(클라이언트 시각은 조작 가능). Additive 필드라 기존 동작을 깨지 않습니다.
4. **API 필수값 검사에 `lessonType`, `province`(또는 개명 후 `region`), `agree`(또는 `privacyConsent`) 추가**: 폼이 이미 `required`로 강제하는 필드들을 서버도 검사하도록 맞추는 것 — 폼 동작은 그대로, API의 방어선만 강화. 특히 `privacyConsent`는 법적으로 "동의를 받았다는 증거"가 중요하므로 서버측 강제가 additive-safe하면서도 의미 있는 개선입니다.
5. **체크박스 값을 boolean으로 정규화**: 현재 `"on"` 문자열이 그대로 JSON에 들어갑니다. API 쪽에서 `Boolean(body.agree)`로 받아 저장/전달 시 boolean으로 정규화하면 향후 Sheets/CRM 스키마에 "동의여부(boolean)" 컬럼을 깔끔하게 매핑할 수 있습니다. 폼 자체는 변경 없음.

## 7. "정책 판단 필요" (동작/스코프 변경, 오케스트레이터·기획 판단 필요)

1. **`region`(시/도) 필드를 폼에 추가할지 여부는 이미 해결됨(추가할 필요 없음)** — 브리프가 던진 질문에 대한 답: 이미 `province` + `cityDetail`로 존재합니다. 다만 "시/도만 select, 시/군/구는 자유 텍스트"인 현재 하이브리드 구조를 유지할지, 아니면 `regions.ts`의 계층 구조(`getChildren()`)를 활용해 시/군/구도 완전히 select 드롭다운화할지는 UX/데이터 정합성 판단이 필요합니다(자유 텍스트는 오타·표기 불일치로 향후 CRM 필터링 시 지저분해질 수 있음).
2. **`lessonType` 옵션 소스를 `src/data/`로 분리할지 여부**: 지금은 `visit`/`online`/`any` 3개가 컴포넌트에 하드코딩되어 있고 `/lesson/visit`, `/lesson/online` 라우트 슬러그와 우연히 일치합니다. 별도 `src/data/lessonTypes.ts`를 만들어 라우트 슬러그와 폼 값을 같은 소스로 묶을지는 이 정도 규모(옵션 3개)에서 오버엔지니어링인지 아닌지 판단이 필요한 정책적 선택입니다.
3. **홈 화면에 "미니 폼"(축약형)을 별도로 만들지, 지금처럼 풀폼을 그대로 재사용할지**: 현재 구조(동일 컴포넌트 재사용)가 UX상 최선인지, 혹은 스크롤 유도 전 진입장벽을 낮추기 위해 홈에는 이름+연락처만 받는 진짜 "미니 폼"을 넣고 나머지는 `/consult`로 유도할지는 전환율/기획 판단이며 코드 정리로 해결할 문제가 아닙니다.
4. **API 필드명 리네이밍(`grade`→`studentGrade` 등)을 실제 연동 전에 할지, 연동 시점에 한 번에 할지**: 리네이밍 자체는 안전하지만 "언제 하느냐"는 다른 병렬 작업(다른 감사 에이전트, 동시 진행 중인 브랜드 작업)과의 충돌 가능성을 고려한 스케줄링 판단입니다.

## 8. 낮은 우선순위 / 취향 차이로 분류한 것 (수정 불필요, 참고만)

- `phone` vs `phoneNumber`: 목표 모델도 이미 `phone`이라 현재 코드와 일치. 논쟁 자체가 없음.
- `province` vs `region`: 목표 모델은 `region`을 쓰지만, 이 코드베이스는 라우트(`/region/[province]/...`)와 데이터 모델(`RegionNode`, `getProvinces()`) 전체에서 이미 "province"라는 용어를 일관되게 쓰고 있습니다. 오히려 지금의 `province`가 기존 도메인 모델과 더 잘 맞고, `region`으로 바꾸면 `RegionNode.level: "province"`와 이름이 충돌해 혼란을 줄 수 있습니다. 이건 "고쳐야 할 불일치"가 아니라 "브리프의 예시 이름이 이 코드베이스 사정과 안 맞는 경우"로 봐야 합니다 — 바꾸지 않는 쪽을 권장하되 최종 판단은 정책 판단 항목(7-4)과 함께 오케스트레이터가 결정.
- `cityDetail`, `phone`의 `pattern` 속성 부재: 형식 강제(정규식)를 걸지 않은 것은 사용자가 다양한 표기(하이픈 유무 등)로 입력할 수 있게 한 의도적 선택일 수 있어, "버그"로 분류하지 않았습니다. 연동 시점에 서버 정규화(하이픈 제거 등)로 처리하는 것이 폼에 `pattern`을 강제하는 것보다 사용자 경험상 나을 수 있다는 점만 기록합니다.
