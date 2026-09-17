# 교과설계소 — 감사 정리 최종 검증 (2026-09-17)

`wip/tutoring-audit-20260916` 브랜치의 마지막 상태를 master 반영 전 최종 검증한 결과입니다. 기존 QA 리포트(`prelaunch-hardening-report.md` 등) 내용을 반복하지 않고, 이번 세션에서 실제로 재검증한 최종 상태만 기록합니다.

## 1. 색상 대비 처리 결과

`globals.css`의 `--color-text-muted`가 `#64748b`(4.37:1) → `#616f86`으로 이미 교체되어 있음을 확인. `src/` 전체에 구 색상값(`#64748b`) 잔여 참조 없음(grep 0건). Production 빌드로 홈(WHY 섹션), `/subject/math`, `/consult`에서 `text-muted` 사용 본문 텍스트가 정상적으로 렌더링되고 가독성 문제가 없음을 브라우저로 직접 확인.

## 2. 장식 watermark 판단

리포트에 남아있던 대비 미달 watermark 3건(홈 WHY 섹션 숫자, `GradeCard` 숫자, `subject/[slug]` 리스트 순번)을 코드로 재확인:

- 셋 다 `aria-hidden="true"` 적용됨(`src/app/page.tsx:137`, `src/components/GradeCard.tsx:12`, `src/app/subject/[slug]/page.tsx:88`).
- 셋 다 인접한 텍스트(항목 제목, 학년명, topic 제목)가 이미 같은 정보를 전달하며, 숫자 자체는 정보를 전달하지 않는 순수 장식용 배경 요소.
- 브라우저로 실제 렌더링 확인: 배경 대비가 낮지만 시각적으로 "장식"임이 명확하고 인접 텍스트가 충분한 대비로 정보를 전달함.

→ **WCAG 비텍스트 대비 기준(1.4.11)은 의미 있는 UI 컴포넌트/그래픽에 적용되며, `aria-hidden` 순수 장식 요소는 대상이 아님. 지시에 따라 이번 작업에서 디자인(색상)을 변경하지 않음.**

## 3. Security headers 상태

`next.config.ts`의 `headers()` 설정 문법 정상 확인. Production 빌드(`npm run build` → `npm run start`) 기동 후 실제 응답 헤더로 검증:

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

홈(`/`)과 홈이 아닌 페이지(`/consult`) 양쪽에서 동일하게 적용됨을 확인(`source: "/:path*"` 전역 매칭 정상 동작).

**CSP는 이번 작업에서 추가하지 않음** — 사유는 9절 참고.

## 4. 환경변수 준비 상태

`.env.example`은 문서화 목적으로만 존재(실제 값 없음, gitignore 예외 처리됨). `siteConfig.ts`를 env 기반으로 리팩터링하는 연결 작업은 **여전히 하지 않음** — 실제 운영값(도메인/전화번호/카카오URL 등)이 없어 지금 연결해도 검증 불가능하고, 이번 작업 범위(정리·검증)를 벗어남.

## 5. 상담 연동 준비 상태

`route.ts → validate.ts → persistence.ts → notification.ts` 흐름을 production 서버 기준으로 실제 브라우저 폼 제출 + API 직접 호출 양쪽으로 재검증:

- 정상 제출(브라우저 폼 실제 입력→제출) → `ok:true` 응답, 성공 화면 정상 표시.
- 필수 필드 누락 → `400 { error: "missing required fields" }`.
- 잘못된 JSON 본문 → `400 { error: "invalid body" }`.
- 필드 길이 초과(500자 초과) → `400 { error: "invalid field" }`.
- 서버 콘솔 로그: `contactName`, `phone`만 마스킹(`테****모`, `0***********8` 형태)되고 나머지 비민감 필드(학년/과목/지역 등)는 평문 — 설계대로 PII만 마스킹됨. **원문 PII 평문 노출 없음.**
- `persistence`/`notification`은 여전히 mock(console 로그 / no-op)이며, 실제 Google Sheets/이메일 연동은 **이번 작업에서도 하지 않음.**
- `route.ts`는 `ConsultPersistence`/`ConsultNotifier` 인터페이스로 seam이 분리되어 있어, 실제 provider 도입 시 `persistence.ts`/`notification.ts`의 export만 교체하면 되고 `route.ts` 자체는 수정할 필요가 없는 구조로 확인됨.

## 6. scratch-audit2 정리

`git rm -r --cached scratch-audit2` + 로컬 디렉터리 삭제로 저장소에서 제거. `.gitignore`에 `/scratch-audit2/` 추가(기존 `review-screenshots-*` 규칙은 그대로 유지, 변경 없음). 과거 커밋(`83ec227`) 이력은 rewrite하지 않고 그대로 둠 — 이번 정리는 후속 커밋으로만 반영.

## 7. lint/build 결과

| 검사 | 결과 |
|---|---|
| `npm run lint` | ✅ 0 에러 / 0 경고 |
| `npm run build` | ✅ 통과 — 62/62 페이지 생성, TypeScript 컴파일 통과 |
| `npm run start` (production 서버 기동 후 실검증) | ✅ 정상 기동, 대표 페이지 전부 200 |

## 8. 현재 미해결 운영정보

변경 없음(이전 리포트와 동일) — `siteConfig.domain`, `phone`/`phoneDisplay`, `kakaoUrl`이 여전히 placeholder(`example-tutoring.com`, `1588-0000`, `pf.kakao.com/_example`). 실제 운영정보 확보 전까지 배포 불가 항목으로 남아 있음.

## 9. CSP 보류 사유

Content-Security-Policy는 어떤 외부 스크립트(분석 도구, 카카오 SDK, 향후 실 연동 시 이메일/저장소 API 클라이언트 등)를 도입하느냐에 따라 `script-src`/`connect-src` 등의 허용 목록이 달라짐. 현재는 외부 스크립트 도입 계획이 확정되지 않아 CSP를 지금 작성하면 추후 재작성이 거의 확실 — 이번 작업(기존 기능 변경 금지, 실 연동 보류)의 범위와도 맞지 않아 **의도적으로 보류**. 기본 헤더 4종(3절)만 우선 적용.

## 10. 다음 작업 추천

1. 실제 운영정보(도메인/전화번호/카카오URL/사업자정보) 확보 → `siteConfig` 교체, 이후 `.env` 연결 리팩터링.
2. 상담 데이터 실제 저장소·알림 채널 확정 후 `persistence.ts`/`notification.ts` 구현 교체(구조는 이미 준비됨).
3. 외부 스크립트 도입 계획 확정 후 CSP 헤더 추가.
4. `guideCategories` 중 미작성 카테고리 콘텐츠 보강(콘텐츠 전략 판단 필요, 코드 작업 아님).
