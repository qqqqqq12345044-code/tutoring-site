# Decisions (확정 사항만)

- 브랜드명: 교과설계소 / 태그라인: "초·중·고 국영수사과 1:1 맞춤과외" / 슬로건: "학생마다 다른 공부, 다르게 설계합니다."
- 서비스 범위: 국·영·수·사·과 5과목 × 초/중/고, 방문과외·화상과외 병행
- 디자인 방향: 기존 브랜드 팔레트 유지. 대비 미달은 색상 자체 조정으로 해결(예: text-muted), 순수 장식 요소는 `aria-hidden` 처리로 충분하고 색상 변경 대상 아님.
- 로고: 심볼형 + 가로형 확정 적용. Footer의 흰 배경 chip 방식 유지, 다크 배경 전용 variant는 만들지 않기로 결정.
- index/noindex 정책: `src/lib/indexability.ts`가 단일 기준. subject/grade/school/region 계열은 index, region+grade·region+grade+subject·region+district+subject는 noindex, region+subject는 전용 콘텐츠(`regionSubjectContent.ts`)가 있을 때만 index.
- sitemap 정책: 정적/동적 라우트 조합 규칙 확정, URL 개수는 코드에서 계산(하드코딩 아님). 회귀 감지용 기준값만 `scripts/lib/baseline.ts`에 상수로 관리.
- 상담폼 구조: `route.ts → validate.ts → persistence.ts → notification.ts` seam 분리 확정. 실제 provider 연동 시 `route.ts`는 수정 불필요하도록 설계.
- validator 기준값: Routes 333 / Sitemap 60 / Noindex 271 / Broken links 0 (`scripts/lib/baseline.ts`, 의도적 콘텐츠 변경 시에만 갱신).

## 아직 확정하지 않은 것
- 실제 운영정보: 도메인, 전화번호, 카카오 채널 URL, 사업자정보, 이메일 (`src/config/site.ts`, 전부 placeholder)
- 상담 데이터 실제 저장소/알림 채널 (Sheets / DB / 이메일 / Slack 중 미결정)
- CSP 헤더 도입 여부 (외부 스크립트 도입 계획에 따라 결정 예정)
- 배포 환경/일정
