# AI Handoff

<!-- AUTO:CURRENT_STATE:START -->
## Current state
- Branch: master
- HEAD: 9abf456
- Working tree: dirty (9개 파일)
<!-- AUTO:CURRENT_STATE:END -->

## Completed task
- AI handoff 자동화 구조 신설: `docs/ai/{PROJECT_STATE,DECISIONS,AI_HANDOFF,NEXT_TASK}.md` 작성
- `scripts/update-ai-handoff.ts` + `scripts/lib/validation-cache.ts` 추가 — Git 상태는 기계적으로 갱신, 검증 결과는 캐시 파일에서만 반영(자동 재검증 없음)
- `scripts/validate-quick.ts` / `validate-full.ts`에 결과 캐시 기록 추가
- `scripts/copy-handoff.ps1` 추가 — Windows 클립보드 복사
- `package.json`에 `npm run handoff` / `npm run handoff:copy` 추가
- `CLAUDE.md`에 AI handoff 규칙 3줄 추가
- 사이트 기능/디자인/SEO 정책은 변경하지 않음

<!-- AUTO:VALIDATION:START -->
## Validation
- Quick: PASS — Lint PASS / Typecheck PASS / Config PASS
- Full: PASS — Routes 333 / Sitemap 60 / Noindex 271 / Broken links 0 / Build PASS
<!-- AUTO:VALIDATION:END -->

## Files changed
- `docs/ai/` (신규 4개 문서)
- `scripts/update-ai-handoff.ts`, `scripts/lib/validation-cache.ts`, `scripts/copy-handoff.ps1` (신규)
- `scripts/validate-quick.ts`, `scripts/validate-full.ts` (캐시 기록 추가)
- `package.json`, `CLAUDE.md`, `.gitignore`

## Issues / decisions needed
- 없음

## Recommended next task
- 상담폼 실제 저장/알림 채널 결정
- 실제 운영정보(도메인/전화번호 등) 확보

## Context for ChatGPT
교과설계소는 Next.js 16 기반 학원 과외 매칭 랜딩/SEO 사이트. index/noindex 정책과 sitemap 개수(60)는 `src/lib/indexability.ts` 기준으로 고정되어 있으니 라우팅/SEO 제안 전 이 정책부터 확인할 것. 상담폼은 mock 저장소(console)만 연결된 상태로 실제 서비스 연동 전. 실제 운영정보(도메인 등)는 전부 placeholder. 사이트 기능/디자인/SEO는 이번 세션에서 변경하지 않음.
