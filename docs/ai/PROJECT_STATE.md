# 교과설계소 Project State

- Branch: master
- HEAD: 9abf456
- Working tree: (실행 시점 기준 `git status`로 확인)
- Framework: Next.js 16.3.5 (App Router) + React 19 + Tailwind v4
- Brand: 교과설계소 — "초·중·고 국영수사과 1:1 맞춤과외"
- Build: PASS
- Lint: PASS
- Routes: 333
- Sitemap: 60
- Noindex: 271
- Broken links: 0
- Validation commands:
  - `npm run validate:quick`
  - `npm run validate:full`

## Current operational status
- 디자인: 브랜드 팔레트 고정, 접근성 하드닝(마크업/로직) 완료. `text-muted` 대비 조정 완료. 장식용 watermark 3건은 `aria-hidden` 처리된 순수 장식으로 판단해 의도적으로 미조정.
- 브랜드: 로고/파비콘/OG 이미지 적용 완료(`public/assets/brand/`).
- SEO: index/noindex 정책 고정(`src/lib/indexability.ts`). sitemap 60 / noindex 271 기준값은 `scripts/lib/baseline.ts`에서 관리.
- 상담폼: UI + API + 서버측 검증 구조 완성. 저장/알림은 mock(console 로그 / no-op) — 실제 연동 전.
- 배포: 아직 미배포. 로컬 빌드/검증만 통과한 상태.
- 도메인: 미확정(placeholder `example-tutoring.com`).

## Important paths
- site config: `src/config/site.ts`
- SEO policy: `src/lib/indexability.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`
- consult API: `src/app/api/consult/route.ts`, `src/lib/consult/*`
- validators: `scripts/validate-quick.ts`, `scripts/validate-full.ts`, `scripts/lib/*`
