# Next Tasks

## 현재 상태 (2026-10-09, 미커밋 — commit/push/배포 NO)
- HEAD/Production `38cc67a`. 사수 오더 1~6 + 빈 지역 조합 route 정리가 working tree에만 있음.
- Routes 1,697 / Index 211 / Noindex 1,484 / Sitemap 211 (HEAD 1,482 / 202 / 1,278 / 202, 정리 전 7,259 / 211 / 7,046 / 211).
- Quality Gate GREEN 65 / AMBER 2 / RED 34, indexed RED 0. Broken 0 · Orphan 0 · Metadata dup 0.
- lint · validate:quick · validate:full · build PASS. 상세: `docs/qa/region-route-cleanup-2026-10-09.md`
- 이번 정리: 학교 없는 신규 지역 206곳은 허브만 생성, 조합 route 5,562개 미생성(`src/lib/regionRoutes.ts`; 전체 목록 파일은 211KB라 저장소에 포함하지 않음 — 신규 지역 206곳 × 조합 27종으로 재생성 가능).
  학교 등록 시 자동 생성. 기존 지역 route는 그대로.

## 사용자가 결정할 것
1. 현재 미커밋 변경 커밋 여부(사수 오더 1~6 + route 정리 일괄).
2. 전남광주통합특별시 URL migration 진행 여부·시점(설계: 시·도 slug 1개로 통합, `/region/gwangju(/*)`·`/region/jeonnam(/*)` → 신규 slug로 permanent redirect, 하위 27개 시·군·구 slug 유지, 신규 URL self-canonical, 학교 등록 전까지 sitemap 제외).
3. 인천 제물포·영종·검단·서해구·옹진군의 기존 빈 조합 route 140개 유지/정리(이미 공개된 URL — 정리 시 404 또는 redirect 정책 필요).

## 사수 오더 일괄 적용 후속 (2026-10-09)
1. [HIGH] 광주광역시·전라남도 → 2026-07-01 「전남광주통합특별시」(법률 제21446호) 통합 반영 — 위 결정 2. 현재 URL 변경 없음.
2. [HIGH] 대구·경북 행정통합: 국가법령정보센터·행안부·정책브리핑에서 특별법 공포/시행 미확인(2026-10-09 재확인). 기존 시·도 노드 유지.
3. [MEDIUM] 신규 206개 시·군·구는 학교 미등록 → 허브만 noindex로 존재. 색인하려면 NEIS/학교알리미로 학교를 검증 등록(`src/data/schools.ts`)하고 품질 게이트를 통과시킬 것. 일반구(화성·창원 등)는 학교 등록 시 district로 추가.
4. [MEDIUM] Index→noindex 링크 비율 17.9% → 20.6%(정보 지표). 서울·경기 시·도 허브 → 신규 구·시 허브 44개 + 학교가 있는 학교급 허브 링크. 빈 학교급 허브 링크는 0. 학교 데이터가 늘면 자연 감소.
4-1. [LOW] 행안부 「지방자치단체 행정구역 및 인구현황」 원문과 229개 지역 행 단위 대조(유형별 개수는 일치). 기존 경기 6개 시 fullName("수원시")과 신규("경기 의정부시") 표기 통일 여부.
5. [LOW] OG/카드 썸네일 17종은 자체 제작 도형 SVG→PNG(`npx tsx scripts/generate-og-images.ts`). 디자이너 이미지로 교체 시 `public/assets/og/<motif>.png`만 덮어쓰면 됨.
6. [LOW] "학습 후기" 콘텐츠는 실제 후기 데이터가 없어 만들지 않음(허위 후기 금지). 실제 동의받은 후기가 생기면 별도 구조로 추가.

## SEO (2026-10-06 기준)
1. [HIGH] 로컬 SEO 품질 보강분 커밋·배포 (보호 파일 2개 제외) → 배포 직전 `npx tsx scripts/indexnow.ts prepare`
2. [HIGH] 학교×과목 RED 후보 9개 noindex 적용 여부 결정 (`docs/qa/school-subject-amber-analysis-2026-10-06.md` §6)
3. [MEDIUM] IndexNow 키 생성·키 파일 배포 후 `status` READY 확인 → 승인 시 `submit --send` (`docs/setup/indexnow.md`)
4. [MEDIUM] 네이버 서치어드바이저·Google Search Console 등록 및 sitemap/RSS 제출 (사용자 계정)
5. [LOW] OG 카테고리 이미지 준비 후 적용 (`docs/qa/og-thumbnail-plan-2026-10-06.md`)
6. [LOW] AMBER 지역×학년×과목 4개(수원 고등 수학·안양 고등 영어 31%, 성남 중등 수학, 부천 중등 영어) 새 공식 사실 확보 시 재검토

## 기존 목록 (작성 당시 기준 — 일부는 완료되었을 수 있음)

1. [HIGH] 상담폼 실제 저장/알림 연동 (Sheets/DB + 이메일/Slack 중 채널 결정 후 `persistence.ts`/`notification.ts` 구현 교체)
2. [HIGH] 실제 운영정보 확보 및 `siteConfig` 교체 (도메인/전화번호/카카오채널/사업자정보)
3. [MEDIUM] 배포 환경 결정 및 최초 배포
4. [MEDIUM] 외부 스크립트 도입 계획 확정 후 CSP 헤더 추가
5. [LOW] `guideCategories` 중 미작성 카테고리 콘텐츠 보강
