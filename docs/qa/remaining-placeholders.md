# 남은 Placeholder 전수 조사

검색 범위: `src/` 전체(`.ts`/`.tsx`/`.css`) + `README.md`/`package.json`/`public/`. 검색어: `example`, `TODO`, `FIXME`, `placeholder`, `1588-0000`, `example-tutoring`, `_example`, `contact@example`(대소문자 무시).

마지막 갱신: Production 최종 운영 준비 점검 세션 (`src/config/site.ts` 재확인).

## 실제 운영정보가 필요한 항목

| 필드 | 현재 값 | 용도 |
|---|---|---|
| `kakaoUrl` | `https://pf.kakao.com/_example` | `ConsultForm`/`MobileBottomCTA`/`ConsultCTA`/Footer의 "카카오톡으로 상담하기" 버튼 링크. **카카오톡 채널이 아직 없어 의도적으로 유지** — 실제 채널 생성 후 URL만 교체하면 됨. |
| `businessName` / `businessRegistrationNumber` / `businessAddress` | `""`(빈 문자열) | Footer 하단, 값이 있을 때만 조건부 렌더링(`{siteConfig.businessName && (...)}}`). 비어 있어도 화면이 깨지지 않음. 통신판매업 등 법적 고지가 필요해지면 채울 것. |
| `naverFormUrl` | `""` | 코드베이스 내 실제 참조처 없음. 현재 사용되지 않는 필드 — 향후 네이버 예약/폼 연동 시를 대비한 자리로 추정. |

## 해결됨 (이번 세션)

| 필드 | 이전 값 | 조치 |
|---|---|---|
| `domain` | (과거 `www.example-tutoring.com`) | 이미 `https://gyogwaseolgye.com`로 반영되어 있었음(이전 세션에서 완료, 문서만 stale했음). |
| `phone` / `phoneDisplay` | `1588-0000`(작동하지 않는 가짜 번호) | Footer 상담 문의 문구와 `EducationalOrganization` JSON-LD `telephone`(`src/lib/schema.tsx`)에 실제처럼 노출되고 있었음. 실제 번호를 임의로 만들 수 없으므로, 기존 `businessName` 등과 동일한 조건부 렌더링 패턴을 살려 값을 `""`로 비움 — 두 곳 모두 자동으로 숨겨짐. 실제 번호 확보 시 값만 채우면 즉시 노출됨. |
| `email` | `contact@example-tutoring.com` | 코드베이스 내 실제 렌더링처가 없어(정의만 존재) 사용자 노출 위험은 없었지만, 값 자체가 가짜 도메인이라 다른 미사용 필드(`businessName` 등)와 통일해 `""`로 비움. |

## False positive (실제 placeholder 아님)

- `ConsultForm.tsx`, `SearchBox.tsx`의 `placeholder="..."` — HTML `<input>`의 표준 placeholder 속성(입력 힌트 텍스트). 실제 운영정보가 아니므로 교체 대상 아님.
- `placeholder:text-text-muted` — Tailwind의 `placeholder:` variant 클래스. 위와 동일.

## 요약

실제 배포 전 채워야 하는 값은 **`kakaoUrl`(카카오 채널 생성 후 교체)** 하나만 남았습니다. `phone`/`phoneDisplay`/`email`은 가짜 값 대신 빈 문자열로 정리해, 실제 값이 확보되는 대로 채우면 되는 상태입니다. `businessName`/`businessRegistrationNumber`/`businessAddress`/`naverFormUrl`은 선택 항목(비어 있어도 정상 동작)입니다.
