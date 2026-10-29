# 교과설계소 프로젝트 체크포인트 (2026-10-27 작성 · 2026-10-29 갱신)

1차 완성 상태. 상세 근거는 `docs/qa/PROJECT_COMPLETION_AUDIT_2026-10-29.md`. 모르는 값은 "미확인"으로 적었다.

# 1. 현재 상태 (2026-10-29)
| 항목 | 값 |
|---|---|
| **Final verdict** | **COMPLETE_WITH_OWNER_INFO_HOLDS** |
| main = origin/main = **Production** | `00fece6` (24차 + candidates 정리 + 학교·시·도 허브 개선) — deployment `7403283723` success |
| work = origin/work | main + docs commit 1개(이 갱신, 배포 무영향) — main에서 fast-forward 가능 |
| 롤백 지점 | `fac51e7`(7403053891, 24차) → `e066805`(7352579088, 23차) |
| 규모 | Routes **2,926** / Sitemap **704** / Noindex **2,220**, region-dong 82/82 · dong-subject 410/410 GREEN, indexed RED 0 |
| 마지막 Production crawl | 2026-10-29 최종 배포 후: 704/704 200, 손실 0, 5xx 0, sitemap noindex 0, canonical 불일치 0, soft404 0 |
| candidates | 21~24차 반영 완료(`a906d56`): registered 480 · disclosed 364 · pending 156 |
| Vercel runtime logs | 미확인(이 노트북 MCP 403) — 공개 crawl로 대체 |
| Search Console | **NOT_CONNECTED** (repo export 없음, 연결 도구 없음) |

# 2. 완료된 것 (다시 하지 않음)
- 전국 동 SEO batch 13~24차(서울·경기·인천) — 전부 Production. batch별 근거 `docs/qa/national-dong-batch*.md`.
- SEO/GEO/AEO 최적화 1사이클(기준 표시·맥락 CTA·공통 섹션 압축), GAP audit, 광역시 architecture audit·표본.
- 얇은 색인 페이지: 학교 허브(평가계획 출처 동×과목 연결, 렌더 263·색인 18)와 시·도 허브(서울·경기·인천 동 요약) 개선.
- candidates 정리 17~24차.
- 로컬 캐시(`.cache/official/schoolinfo/`, `.cache/official/neis/national-13~24.json`)는 이 노트북에만 있다(gitignore).

# 3. HOLD (임의로 진행 금지)
- **BLOCKED_BY_OWNER_INFO**: 사업자명·등록번호·주소, 공개 이메일, 개인정보 보호책임자, 처리 위탁 구조, 개인정보처리방침 시행일, 상담 후 연락 시간, 방문/화상 범위, 선생님 매칭 방식. 값이 오기 전에는 작성하지 않는다.
- 광주 URL migration·공식 시·도명(`NEXT_TASK.md` 결정 2), 광역시 첫 학교 등록 정책(opt-in vs 수기), 인천 신설구 빈 조합 route 140개(결정 3).
- PENDING school→dong 추정 금지, 원문 불확실 동(잠실7동·목4동·오정동·귀인동·부림동·역곡1동·성산제2동, PDF 위주 동) 보류, PDF OCR 금지.
- indexed route 삭제·indexed→noindex 금지, Quality Gate threshold 변경 금지.
- 광역시(부산·대구·대전·울산)는 데이터 gap — 권장 첫 도시 울산(`metropolitan-route-architecture-audit-2026-10-27.md`). 그 audit의 "8곳 중 6곳 HWP/HWPX" 문장은 오기이고 정확한 값은 HWP/HWPX 5·zip 1·PDF 1·검색 불가 1.

# 4. 미래 유지보수
- **PLAN_TERM_RECHECK_BY = 2027-04-30**: 2027년 1차 공시 이후 동×과목 410 entry 평가계획 재검증(`validate:quick` 경고). 갱신 또는 status "draft".
- registered|unverified 119곳 operating — 해당 공시를 수집한 PC에서만 갱신.
- 평가계획 연결이 없는 색인 학교 허브 29곳 — 그 학교 공시를 쓰는 동×과목이 생기면 자동 보강.

# 5. 재개 우선순위
1. **owner info 확보 시 Trust**: footer·소개·개인정보처리방침·Organization JSON-LD·AEO 서비스 질문(매칭·범위·연락 시점).
2. **Search Console 연결(사용자 계정) 후 성과 분석**: impressions·clicks·CTR·평균 순위를 page(동 hub·동×과목·학교 허브)·query(동/학교/과목) 단위로 보고, 클릭이 생기는 지역 중심으로 확장 여부 결정.
3. 그다음 Batch25(P1 산곡1동·P2 풍산동, B 신봉동(수집 완료)·삼산2동·유림2동) 또는 울산 pilot — 성과 데이터 없이 규모만 키우지 않는다.

# 6. 재개 시 첫 명령
```
git status && git branch --show-current
git fetch origin && git log --oneline --decorate -8
git rev-parse HEAD origin/work/uijeongbu-dong-seo main origin/main
npm run validate:quick
npx tsx scripts/official/school-import.ts --summary   # 2926 · 704 · 2220이어야 정상
```
환경 함정: 이 노트북은 Python 없음(Node 수집기 재작성 필요), `school-import.ts --write`(전체 재생성)는 disclosed 덮어쓰기 위험 → `--promote … --write`만(`school-import-manifest-risk-2026-10-26.md`). 로컬 `next start`는 `node node_modules/next/dist/bin/next start -p <port>`로 띄우고 끝나면 해당 PID를 종료한다(남은 프로세스가 공유 `.next`에 옛 렌더를 쓸 수 있음).
