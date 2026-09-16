# 남은 Placeholder 전수 조사

검색 범위: `src/` 전체(`.ts`/`.tsx`/`.css`) + `README.md`/`package.json`/`public/`. 검색어: `example`, `TODO`, `FIXME`, `placeholder`, `1588-0000`, `example-tutoring`, `_example`, `contact@example`(대소문자 무시).

## 실제 운영정보가 필요한 항목 (전부 `src/config/site.ts`)

| 필드 | 현재 값 | 용도 |
|---|---|---|
| `domain` | `https://www.example-tutoring.com` | 전 페이지 canonical/OG/sitemap의 절대경로 기준. `metadataBase`로도 사용됨(`src/app/layout.tsx`). |
| `phone` / `phoneDisplay` | `1588-0000` | Footer 상담 문의 표시, `Organization` JSON-LD의 `telephone`(`src/lib/schema.tsx`). |
| `kakaoUrl` | `https://pf.kakao.com/_example` | Header 없음, `ConsultForm`/`MobileBottomCTA`의 "카카오톡으로 상담하기" 버튼 링크. |
| `email` | `contact@example-tutoring.com` | 현재 코드베이스 내 실제 렌더링처 없음(정의만 되어 있고 사용처 미검색됨 — `grep` 결과 `site.ts` 정의 외 참조 없음). 향후 사용 시를 대비해 값만 존재. |
| `businessName` | `""`(빈 문자열) | Footer 하단, 값이 있을 때만 조건부 렌더링(`{siteConfig.businessName && (...)}}`). 비어 있어도 화면이 깨지지 않음. |
| `businessRegistrationNumber` | `""` | 위와 동일 조건부 렌더링. |
| `businessAddress` | `""` | 위와 동일 조건부 렌더링. |
| `naverFormUrl` | `""` | 코드베이스 내 실제 참조처 없음(`grep` 결과 정의만 존재). 현재 사용되지 않는 필드로 보임 — 향후 네이버 예약/폼 연동 시를 대비한 자리로 추정. |

이 항목들은 실제 전화번호/사업자정보/카카오 채널 URL/도메인이 없어 **이번에도 추측해서 채우지 않았습니다.**

## 코드 내 TODO 마커

| 위치 | 내용 |
|---|---|
| `src/app/api/consult/route.ts:6` | "실제 운영 시 `src/lib/consult/persistence.ts`, `notification.ts`의 mock 구현을 실제 저장소/알림 채널로 교체" — 이번 세션에서 새로 분리한 구조를 가리키는 안내 주석(정상, 액션 아이템 아님). |

## False positive (실제 placeholder 아님, 검토 후 제외)

- `ConsultForm.tsx`, `SearchBox.tsx`의 `placeholder="..."` — HTML `<input>`의 표준 placeholder 속성(입력 힌트 텍스트, 예: "010-0000-0000", "예) 수원, 영통구, 영통중학교"). 실제 운영정보가 아니라 UI 힌트이므로 교체 대상 아님.
- `placeholder:text-text-muted` — Tailwind의 `placeholder:` variant 클래스(CSS 유사 선택자), 위와 동일한 이유로 대상 아님.

## 요약

실제 배포 전 채워야 하는 값은 `src/config/site.ts`의 **domain, phone, phoneDisplay, kakaoUrl** 4개가 핵심(전 페이지 metadata/JSON-LD/CTA에 직접 노출)이며, **email, businessName, businessRegistrationNumber, businessAddress, naverFormUrl**은 값이 없어도 사이트가 정상 동작하는 선택 항목입니다. `.env.example`(이번 세션에서 준비)에 이 값들을 환경변수로 옮기는 구조를 미리 정리해 두었습니다 — 실제 값이 확보되면 `.env.local`에 채우고 `siteConfig.ts`가 이를 읽도록 연결하는 작업이 다음 단계입니다(이번 세션에서는 값이 없어 그 연결 작업 자체는 수행하지 않았습니다).
