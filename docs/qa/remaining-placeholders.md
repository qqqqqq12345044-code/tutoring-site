# 남은 Placeholder 전수 조사

검색 범위: `src/` 전체(`.ts`/`.tsx`/`.css`) + `README.md`/`package.json`/`public/`. 검색어: `example`, `TODO`, `FIXME`, `placeholder`, `1588-0000`, `example-tutoring`, `_example`, `contact@example`(대소문자 무시).

마지막 갱신: 2026-09-30 운영 완성도 종합 점검 세션 (실제 전화번호 반영, 카카오 placeholder 제거).

## 실제 운영정보가 필요한 항목

| 필드 | 현재 값 | 용도 |
|---|---|---|
| `kakaoUrl` | `""`(빈 문자열) | 카카오톡 채널이 아직 없음. 모든 카카오 버튼(`ConsultForm`/`MobileBottomCTA`/`ConsultCTA`/Footer)은 값이 있을 때만 렌더링. 실제 채널 생성 후 URL만 채우면 버튼이 다시 나타나고, 모바일 하단 바는 전화 버튼 대신 카카오 버튼으로 돌아감. |
| `businessName` / `businessRegistrationNumber` / `businessAddress` | `""`(빈 문자열) | Footer 하단, 값이 있을 때만 조건부 렌더링(`{siteConfig.businessName && (...)}}`). 비어 있어도 화면이 깨지지 않음. 통신판매업 등 법적 고지가 필요해지면 채울 것. |
| `naverFormUrl` | `""` | 코드베이스 내 실제 참조처 없음. 현재 사용되지 않는 필드 — 향후 네이버 예약/폼 연동 시를 대비한 자리로 추정. |

## 해결됨

| 필드 | 이전 값 | 조치 |
|---|---|---|
| `phone` / `phoneDisplay` (2026-09-30) | `""` | 실제 번호 `010-2813-1821` 반영. 기존 노출 위치(Footer 상담 문의 — `tel:` 링크화, JSON-LD `telephone`)에 표시되고, 카카오 채널이 없는 동안 카카오를 안내하던 자리(모바일 하단 바, 상담폼 성공/실패 안내)를 전화로 대체. |
| `kakaoUrl` (2026-09-30) | `https://pf.kakao.com/_example` | 존재하지 않는 채널(카카오 프로필 API가 빈 객체 반환)로 연결되는 버튼이 전 페이지 모바일 하단 바 등 6곳에 노출되고 있었음 → `""`로 비우고 버튼을 조건부 렌더링. |
| `domain` | (과거 `www.example-tutoring.com`) | 이미 `https://gyogwaseolgye.com`로 반영되어 있었음(이전 세션에서 완료, 문서만 stale했음). |
| `phone` / `phoneDisplay` (2026-09-29) | `1588-0000`(작동하지 않는 가짜 번호) | Footer 상담 문의 문구와 `EducationalOrganization` JSON-LD `telephone`(`src/lib/schema.tsx`)에 실제처럼 노출되고 있었음. 실제 번호를 임의로 만들 수 없으므로, 기존 `businessName` 등과 동일한 조건부 렌더링 패턴을 살려 값을 `""`로 비움 — 두 곳 모두 자동으로 숨겨짐. 실제 번호 확보 시 값만 채우면 즉시 노출됨. |
| `email` | `contact@example-tutoring.com` | 코드베이스 내 실제 렌더링처가 없어(정의만 존재) 사용자 노출 위험은 없었지만, 값 자체가 가짜 도메인이라 다른 미사용 필드(`businessName` 등)와 통일해 `""`로 비움. |

## False positive (실제 placeholder 아님)

- `ConsultForm.tsx`, `SearchBox.tsx`의 `placeholder="..."` — HTML `<input>`의 표준 placeholder 속성(입력 힌트 텍스트). 실제 운영정보가 아니므로 교체 대상 아님.
- `placeholder:text-text-muted` — Tailwind의 `placeholder:` variant 클래스. 위와 동일.

## 요약

코드에 남은 가짜 운영정보는 없습니다. 전화번호는 실제 값이 반영됐고, `kakaoUrl`/`email`은 빈 값(해당 UI 자동 숨김)으로 실제 값이 생기면 채우면 됩니다. `businessName`/`businessRegistrationNumber`/`businessAddress`/`naverFormUrl`은 선택 항목(비어 있어도 정상 동작)입니다.
