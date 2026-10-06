# Next Tasks

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
