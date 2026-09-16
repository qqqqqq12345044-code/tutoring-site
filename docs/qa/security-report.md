# 런칭 전 보안 점검 보고서

기준 Git 체크포인트: `4874c96` (working tree에 `review-screenshots-brand/`, `scratch-audit/` 등 미추적 산출물 존재, 소스 변경 없음)
검수 방식: 코드 정독(`src/app/api/consult/route.ts`, `src/components/ConsultForm.tsx`, `src/app/consult/page.tsx`, `src/lib/schema.tsx`) + 저장소 전체 `grep` + `npm audit`. **코드 수정, 커밋, `npm install`/`npm audit fix`, 빌드 실행은 수행하지 않았습니다. 분석 및 본 보고서 작성만 진행했습니다.**

이 사이트는 현재 실제 백엔드/DB/외부 서비스 연동이 없는 목업 단계(`api/consult`가 로그만 남기고 200을 반환)이므로, 이번 점검에서 발견된 이슈 대부분은 "지금 당장 악용 가능한 취약점"이 아니라 "실제 백엔드 연동 시점에 반드시 막아야 할 구멍"입니다. 이 점을 감안해 심각도를 매겼습니다.

---

## 1. API 입력 검증 — `src/app/api/consult/route.ts`

전체 21줄, 로직은 다음과 같습니다.

```ts
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  if (!body.contactName || !body.phone || !body.grade || !body.subject) {
    return NextResponse.json({ ok: false, error: "missing required fields" }, { status: 400 });
  }
  console.log("[consult] new inquiry (mock, not persisted):", body);
  return NextResponse.json({ ok: true });
}
```

| 항목 | 상태 | 심각도 |
|---|---|---|
| JSON 파싱 실패(`request.json()` throw) | ✅ `try/catch`로 처리되어 400 반환. 크래시 없음 | 정보성 |
| 필수 필드 존재 여부(`contactName`, `phone`, `grade`, `subject`) | ✅ falsy 체크로 확인 | 정보성 |
| **타입 검증** | ❌ 없음 — `body.contactName`이 문자열이 아니라 객체/배열/숫자여도 falsy가 아니면 통과 | **중간(medium)** |
| **길이 제한** | ❌ 없음 — `message`, `contactName` 등에 수십 KB 문자열을 보내도 그대로 통과·로그에 기록됨 | **중간(medium)** — 목업 상태에서는 로그 폭탄/메모리 낭비 수준, 실제 DB 연동 시 저장소 낭비·DoS 벡터로 격상 |
| **전화번호 형식 검증** | ❌ 없음 — `phone` 필드는 존재만 확인, 숫자/하이픈 형식 검증 없음. `"010-0000-0000"`이 아닌 임의 문자열도 통과 | **낮음(low)** — 데이터 품질 문제, 보안 문제는 아님 |
| **Content-Type 검증** | ❌ 명시적 체크 없음. 단, `request.json()`이 파싱 불가 시 catch에서 처리되므로 실질적으로는 malformed body에 대해 안전하게 400 반환됨(예외 전파 없음) | 정보성 |
| **인젝션 위험(eval/쉘/SQL/HTML 재렌더링)** | ✅ 없음 — `body`는 `console.log`에만 전달되고, DB/쉘/템플릿 어디에도 전달되지 않음. `eval`, `exec`, SQL 문자열 조합 코드 전체 저장소에 존재하지 않음(별도 grep 확인) | 없음 |
| **HTTP 메서드 외 처리(GET 등)** | 정보성 — `GET`/`PUT` 등 미정의 메서드는 Next.js가 자동으로 405 처리(App Router 기본 동작), 별도 취약점 없음 | 정보성 |

**결론**: 인젝션 계열 위험은 없음. 가장 실질적인 갭은 **타입/길이 검증 부재**이며, 이는 지금은 로그 오염 정도지만 실제 DB/CRM 연동 시점에는 반드시 스키마 검증(zod 등)을 추가해야 함.

---

## 2. XSS 표면 — `dangerouslySetInnerHTML`

저장소 전체(`src/`)에서 발견된 유일한 사용처:

```
src/lib/schema.tsx:56:      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
```

- `JsonLd` 컴포넌트 하나뿐이며, 인자로 들어가는 `data`는 `organizationSchema()`, `websiteSchema()`, `breadcrumbSchema()`, `faqSchema()`가 반환하는 **내부 하드코딩 데이터/설정값(`siteConfig`, 내부 `FAQ[]` 배열)** 조합입니다. 사용자 입력(`ConsultForm` 등)이 이 함수들의 인자로 흘러가는 경로는 코드베이스 전체에서 존재하지 않습니다(호출부 전체 확인 결과 breadcrumb/FAQ/조직 정보 모두 정적 데이터·라우트 파라미터 기반).
- 다만 `breadcrumbSchema`의 `items`에는 페이지별 breadcrumb 이름이 들어가는데, 이 이름들은 `src/data/*.ts`의 지역명/학교명 등 **저장소에 정적으로 커밋된 데이터**이며 사용자가 런타임에 주입할 수 있는 값이 아님(동적 라우트 slug 자체가 아니라 slug로 조회한 정적 데이터의 `name` 필드를 사용) — 확인 완료.
- `src/data/*.ts`를 렌더링하는 다른 컴포넌트들은 전부 JSX 텍스트 노드(`{value}`) 형태로 출력되며, `dangerouslySetInnerHTML`이나 그 외 raw-HTML 삽입 경로는 발견되지 않음.
- `insertAdjacentHTML`, `document.write`, `eval(`, `innerHTML =`, `new Function(` 등 동적 코드/DOM 실행 패턴을 저장소 전체에서 grep했으나 **일치 항목 없음**.

**결론**: XSS 표면은 JSON-LD 주입 1건뿐이며, 이는 사용자 입력이 아닌 내부 데이터만 다루므로 안전. 심각도 **없음(informational)**.

---

## 3. 폼 입력 처리 — `ConsultForm.tsx` / `consult/page.tsx`

- 제출 흐름: `FormData` → `Object.fromEntries` → `JSON.stringify` → `fetch("/api/consult")`. 성공/실패 여부만 `state`(`idle/loading/success/error`)로 관리하며, **사용자가 입력한 값을 화면에 그대로 되돌려 보여주는 로직 자체가 없음**(성공 화면은 고정 문구, 에러 화면도 고정 문구 `"신청 처리 중 오류가 발생했습니다..."`).
- `dangerouslySetInnerHTML`, `innerHTML`, 수동 DOM 조작 전부 없음 — 전부 표준 JSX 렌더링이므로 React의 기본 이스케이프가 적용됨.
- 입력 필드 자체의 클라이언트 검증은 `required`뿐이며 `maxLength`/`pattern`/`minLength` 속성은 어디에도 없음(grep 결과 없음) — 보안 이슈는 아니지만 사용성/서버 부하 측면에서 항목 1의 서버 측 길이 제한 부재와 함께 개선 여지.

**결론**: 반사형 XSS 경로 없음. 심각도 **없음(informational)**.

---

## 4. 외부 링크 — `target="_blank"`

전체 3건, 전부 `siteConfig.kakaoUrl`(카카오톡 상담 채널) 링크:

| 파일:줄 | `rel` 속성 |
|---|---|
| `src/components/layout/MobileBottomCTA.tsx:20` | ✅ `rel="noopener noreferrer"` |
| `src/components/ConsultForm.tsx:60` | ✅ `rel="noopener noreferrer"` |
| `src/components/ConsultForm.tsx:183` | ✅ `rel="noopener noreferrer"` |

**결론**: 3건 전부 안전하게 처리됨. reverse tabnabbing 위험 없음. 조치 불필요.

참고로 `siteConfig.kakaoUrl`(`src/config/site.ts:11`)는 현재 `"https://pf.kakao.com/_example"`(플레이스홀더)입니다. 보안 이슈는 아니지만, 실제 카카오톡 채널 URL로 교체되지 않으면 사용자가 상담 신청 후 존재하지 않는 채널로 연결될 수 있음 — **정보성**, 런칭 전 콘텐츠 점검 항목으로 별도 트래킹 권장(이 보안 감사 범위 밖).

---

## 5. 시크릿 / 환경변수 노출

- `grep -rn "process.env" src/` → **일치 0건**. 클라이언트/서버 어디에도 환경변수를 참조하는 코드가 없음. 따라서 "서버 전용 변수가 클라이언트 컴포넌트에 잘못 쓰이는" 케이스 자체가 존재하지 않음.
- `.env`, `.env.local`, `.env.production` 등 디스크에 존재하는 파일 없음(`ls .env*` 결과 없음).
- `git ls-files | grep -i env` → **일치 0건**(git에 추적되는 env 파일 없음).
- `.gitignore`에 `.env*` 패턴이 포함되어 있어(주석: "env files (can opt-in for committing if needed)") 향후 env 파일이 생겨도 기본적으로 커밋되지 않음.
- `grep -i "api_key|secret|token|password|Bearer "` (전체 `src/`) → **일치 0건**. 하드코딩된 키/토큰/비밀번호 없음.

**결론**: 시크릿 노출 위험 없음. 심각도 **없음(informational)**. (단, 향후 실제 CRM/DB/카카오 API 연동 시 이 패턴이 깨지지 않도록 서버 전용 변수는 Route Handler/Server Component에서만 참조하고 `NEXT_PUBLIC_` 접두사 없는 변수를 클라이언트 컴포넌트에 넘기지 않는 규칙을 유지할 것.)

---

## 6. 에러 메시지 노출 — `api/consult/route.ts`

- 두 에러 경로(`invalid body`, `missing required fields`) 모두 **고정된 문자열 상수**를 반환하며, 실제 예외 객체(`error.message`, 스택트레이스)를 클라이언트에 전달하는 코드는 없음. `catch {}`에서 예외 변수를 바인딩조차 하지 않으므로 애초에 노출할 방법이 없음.
- 성공 경로도 `{ ok: true }`만 반환 — 내부 구현 세부사항 노출 없음.
- 저장소 내 다른 API 라우트는 `src/app/api/consult/route.ts` 1개뿐(확인 완료)이므로 추가 점검 대상 없음.

**결론**: 에러 메시지를 통한 정보 노출 없음. 심각도 **없음(informational)**.

---

## 7. PII 콘솔 로깅

```
src/app/api/consult/route.ts:18:  console.log("[consult] new inquiry (mock, not persisted):", body);
```

- **서버 측**에서 사용자가 제출한 전체 `body`(이름 `contactName`, 전화번호 `phone`, 학년, 과목, 상담 가능 시간, 문의사항 `message` 등 개인정보 포함)를 **가공 없이 통째로 `console.log`에 출력**하고 있음.
- Next.js 서버 사이드 `console.log`는 프로덕션에서 서버 프로세스의 표준출력(플랫폼 로그 수집기로 이어짐 — 예: Vercel 로그, PM2 로그 파일 등)에 그대로 적재됨. 로그 보관 정책/접근 통제가 없다면 개인정보가 평문으로 로그에 장기간 남게 됨.
- `ConsultForm.tsx`(클라이언트)에는 `console.log`/`console.error` 사용이 없음(grep 결과 0건) — 브라우저 콘솔로의 PII 노출은 없음.

**심각도: 중간(medium)** — 지금은 실제 DB가 없어 이 로그가 유일한 "저장" 경로이기도 하다는 점에서 오히려 이 로그가 사실상의 PII 저장소 역할을 하고 있음. 실제 개인정보처리방침(`ConsultForm.tsx`에 동의 문구가 있음: "이름, 연락처, 지역 정보가 수집되며...")과 맞물려, 로그 보관 기간·접근 권한에 대한 정책이 없다면 개인정보보호법상 리스크로 이어질 수 있음.

---

## 8. `npm audit` 결과

```
found 0 vulnerabilities
```

**요약**: Critical 0 / High 0 / Medium 0 / Low 0. 현재 의존성 트리에 알려진 취약점 없음. (참고: `package.json` 기준 `next@16.3.5`, `react@19.2.8`, `react-dom@19.2.8` — 최신 계열 사용 중)

---

## 9. 미들웨어 / 보안 헤더

- `middleware.ts`(루트/`src/`) — **존재하지 않음**.
- `next.config.ts` — 현재 내용:
  ```ts
  const nextConfig: NextConfig = {
    /* config options here */
  };
  ```
  `headers()` 설정 없음. CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` 등 **어떤 보안 헤더도 명시적으로 설정되어 있지 않음**(Next.js 기본값 외 추가 헤더 없음).

**심각도: 정보성(informational) / 정책·인프라 판단 필요** — 지금 당장 악용되는 취약점이 있다는 뜻은 아니지만(현재 페이지 대부분이 정적 콘텐츠 + 폼 1개), 클릭재킹 방어(`X-Frame-Options`/`frame-ancestors`)와 CSP는 런칭 전 제품/인프라 판단으로 도입 여부를 결정할 항목. 배포 플랫폼(예: Vercel)이 일부 기본 헤더를 자동 주입하는 경우도 있으므로, 실제 배포 환경에서의 응답 헤더를 별도로 확인 권장.

---

## 종합 요약

### 심각도별 건수

| 심각도 | 건수 | 항목 |
|---|---|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | ①API 입력 타입/길이 검증 부재(§1), ②서버 로그에 PII 평문 기록(§7) |
| Low | 1 | 전화번호 형식 검증 부재(§1) |
| Informational | 5 | JSON-LD 안전성 확인(§2), 반사형 XSS 없음 확인(§3), 외부링크 3건 전부 안전 확인(§4), 시크릿/env 노출 없음 확인(§5), 에러 메시지 노출 없음 확인(§6) |
| 정책/인프라 판단 필요 | 1 | 보안 헤더/미들웨어 부재(§9) |

`npm audit`: **0 vulnerabilities** (critical/high/medium/low 전부 0).

### 안전하게 즉시 수정 가능 (설계/동작 변경 없음)

이번 점검에서 "지금 코드를 바로 고쳐도 사용자 경험이나 설계에 영향 없는" 항목은 다음과 같습니다. (외부 링크의 `rel="noopener noreferrer"`는 이미 3건 전부 적용되어 있어 수정 대상 없음.)

1. **`src/app/api/consult/route.ts:14`** — 필드 존재 체크(`!body.contactName` 등)를 `typeof body.contactName === "string" && body.contactName.trim().length > 0 && body.contactName.length <= <합리적 상한>` 형태로 강화. 타입/길이 검증 추가는 기존 성공/실패 응답 스키마(`{ ok: true }` / `{ ok: false, error }`)를 바꾸지 않고 유효성 기준만 넓히는 것이므로 안전하게 적용 가능.
2. **`src/app/api/consult/route.ts:18`** — `console.log`에 `body` 전체(PII 포함)를 그대로 출력하는 부분을 이름/전화번호 등 민감 필드는 마스킹(예: 전화번호 뒷자리만, 이름은 길이만 로그)하거나 필드명만 로그하도록 축소. 로그 포맷만 바꾸는 것이므로 사용자 대면 동작 변화 없음.
3. **`src/components/ConsultForm.tsx`**의 `phone`(줄 137), `contactName`(줄 134), `message`(줄 146) 입력에 `maxLength` 속성 추가 — 서버 측 길이 제한과 짝을 맞추는 순수 방어적 조치, 폼 동작/스타일 변화 없음.

### 정책/인프라 판단 필요

1. **보안 헤더 도입**(§9) — CSP, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security` 등을 `next.config.ts`의 `headers()` 또는 `middleware.ts`로 추가할지 여부. CSP는 특히 이후 외부 스크립트(분석 도구, 카카오 SDK 등) 추가 계획에 따라 정책이 달라지므로 제품 결정 필요.
2. **PII 로그 보관 정책**(§7) — 실제 백엔드/CRM 연동 전까지 `console.log`가 유일한 상담 신청 기록 경로로 기능하고 있음. 로그 보관 기간, 접근 권한, 실제 DB 연동 시점 등은 인프라/개인정보보호 정책 결정 필요.
3. **`siteConfig.kakaoUrl` 플레이스홀더**(§4) — 보안 이슈는 아니나 런칭 전 실제 채널 URL로 교체 필요(콘텐츠/운영 판단, 이 보고서 범위 밖이나 발견 사항으로 기록).

이번 세션에서는 위 권장사항을 **실제로 적용하지 않았습니다**. 코드 수정, 헤더 추가, 로그 변경은 모두 오케스트레이터 승인 후 별도 작업으로 진행되어야 합니다.
