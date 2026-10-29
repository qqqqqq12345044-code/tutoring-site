# GSC 성과 감사 (2026-10-29)

기준: Production/main `00fece6`, work `f88fc82`. 분석 전용 — 코드·title·content·색인 설정 변경 없음.

# Executive Summary
- **판정: HOLD (확장 보류) + INVESTIGATE (색인 진행)**. 성과 데이터가 판단하기에 너무 적다. 사이트 전체 기간(속성 데이터 시작 2026-09-27 ~ 10-26)이 **클릭 3 · 노출 36**이고, 클릭 3건은 모두 홈(9-28·29)이다. 페이지 노출은 실질적으로 **10-21~10-26 엿새**에만 있다.
- **지금의 병목은 순위·CTR이 아니라 색인이다.** GSC 색인 보고서(업데이트 **2026-10-23**)에서 색인 **173**, 미색인 400(그중 의도된 noindex 254)이다. 이 보고서는 10-26·10-27 batch(동 39곳, URL 234개)보다 먼저 만들어져 그 batch들은 아직 반영되지 않았다.
- **동×과목 template이 가장 먼저 작동하고 있다.** 색인 74/410(10-23 이전에 존재한 215개 중 74 = 34%). 노출 36 중 21이 이 template이고, 노출 페이지의 가중 평균 순위는 6.6이다. 반면 시·도 허브 0/3, 시·군·구 허브 2/19, 학교 허브 3/47만 색인됐고, 나머지 상당수는 "발견됨 – 현재 색인 생성 안 됨"에 머물러 있다.
- **Quick Win: 0건.** 노출이 가장 많은 페이지도 8회라, 순위 5~20 + CTR 개선 판단을 할 수 있는 페이지가 없다. title/description 수정 근거가 없다.
- **광역시 pilot(울산·대전): HOLD.** 서울·경기·인천 확장의 성과가 아직 측정되지 않았다.

# Data Source
- **Google Search Console 도메인 속성** `sc-domain:gyogwaseolgye.com`. 사용자 본인 Chrome에 이미 로그인된 세션으로 Search Console 화면을 **읽기만** 했다.
- 새 credential/OAuth client/token 생성 없음. 설정 변경·sitemap 제출·색인 요청·URL 검사 실행 없음. export 파일 저장 없음(화면 표를 읽어 scratch에 경로만 기록).
- repo·환경 확인 결과(값 미출력):
  - tutoring-site: GSC 연동 코드·export·cache 없음. `.env.example`에 Google 관련 키 없음. layout에는 `naver-site-verification`만 있다(Google 속성은 도메인 속성으로 확인된 상태).
  - ai-orchestrator: `src/seo/gsc.ts`·`google-auth.ts`·`google-oauth.ts`(scope `webmasters.readonly` + `analytics.readonly`)가 있다. 하지만 이 노트북에는 설정 디렉터리(`%APPDATA%/ai-orchestrator/seo`)와 env 값이 모두 없어 **API 경로는 미연결**이다.
  - gcloud 없음.
- 교차 분석용 내부 데이터: Production `sitemap.xml`(704 URL)을 `src/data`(dongs·regions·subjects·grades)로 route family 분류. 동별 추가 시점은 `src/data/dongs.ts` git blame과 최초 commit(의정부 2026-10-16 `2c80c8a`).

# Period
| 구간 | 날짜 | 클릭 | 노출 | CTR | 평균 순위 |
|---|---|---|---|---|---|
| A. 최근 28일 | 2026-09-29 ~ 10-26 | 1 | 34 | 2.9% | 11.9 |
| B. 이전 28일 | 2026-09-01 ~ 09-28 (속성 데이터 09-27 시작) | 2 | 2 | 100% | 2.0 |
| 최근 7일 (trend 참고) | 2026-10-20 ~ 10-26 | 0 | 33 | 0% | 약 12.2 (일별 가중) |
| 전체 기간 | 2026-09-27 ~ 10-26 | 3 | 36 | 8.3% | 11.3 |

- **A vs B는 비교하지 않는다.** B 구간에 있던 것은 홈 노출 2회뿐이고, 동 페이지는 대부분 10-16 이후 생겼다. "하락"이 아니다.
- 일별 노출: 10-21 1 · 10-22 1 · 10-23 2 · 10-24 3 · 10-25 10 · 10-26 16. 증가 시작 단계다.

# Data Limitations
- **표본이 매우 작다.** 페이지 단위 최대 노출이 8이다. 이 문서의 CTR·순위는 방향 참고일 뿐이고 통계적 결론이 아니다.
- **검색어는 대부분 익명 처리됐다.** 공개된 검색어는 2개(노출 각 1)뿐이고, 나머지 노출 34는 Google 개인정보 기준에 따라 검색어가 표시되지 않았다. 그래서 query intent·cannibalization 분석은 사실상 불가능하다.
- 페이지 표는 **22행 전체**를 읽었다(GSC 표시 "총 22행"). 페이지별 노출 합 38 ≠ 속성 합계 36인데, GSC의 페이지 집계와 속성 집계 방식 차이다.
- 색인 보고서는 **2026-10-23 snapshot**이다. 사유별 URL 목록(색인 173 / NOINDEX 254 / 발견됨 138 / 크롤링됨 7)은 페이지를 넘기며 **전체**를 읽었다(1,000행 표시 한도 이하). "리디렉션 포함" 1건은 목록을 읽지 않았다.
- Search Analytics 0 ≠ 미색인. 반대로 색인 snapshot은 10-23 기준이라 그 뒤 페이지는 판정하지 않는다.
- URL Inspection은 실행하지 않았다(개별 URL 실시간 상태 미확인).
- 동별 batch 날짜는 commit 날짜다. Production 반영 시각과 하루 정도 차이가 날 수 있다.

# Site Overview
| 항목 | 값 |
|---|---|
| 클릭 / 노출 / CTR / 평균 순위 (전체 기간) | 3 / 36 / 8.3% / 11.3 |
| 노출이 있는 페이지 | 22 (sitemap 704 중) |
| 공개 검색어 | 2 (`논술 과외` 노출 1·순위 20.0, `초등학생 과외` 노출 1·순위 46.0) |
| 기기 | 데스크톱 3/23 (CTR 13%, 순위 8.2) · 태블릿 0/7 (11.1) · 모바일 0/6 (23.3) |
| 국가 | 한국 3/33 (9.1%, 11.8) · 미국 0/2 · 싱가포르 0/1 |
| 색인 (10-23) | 색인 173 · 미색인 400 = NOINDEX 254 + 발견됨-미색인 138 + 크롤링됨-미색인 7 + 리디렉션 1 |
| Sitemap | `sitemap.xml` 제출 10-23, 마지막 읽음 **10-28**, 상태 성공, 발견 페이지 **692**(24차 12개 반영 전 숫자) |
| 기타 | HTTPS 23 / 비HTTPS 0, 탐색경로(Breadcrumb) 유효 22 / 오류 0, Core Web Vitals 데이터 없음(트래픽 부족) |
| 브랜드 검색어 `교과설계소` | **공개 검색어에 없음**. 홈 클릭 3건의 검색어는 익명 처리돼 확인 불가. 추정하지 않음 |

건강 지표:
- GSC NOINDEX 254개와 현재 sitemap의 교집합은 **0**이다. noindex로 남은 것은 의도된 학교·지역 학년 조합뿐이다.
- 크롤링됨-미색인 7개 중 sitemap URL은 5개다(신갈동 국어, 의정부2동 수학, 합정동 hub, 합정동 사회, 수능 가이드). 나머지는 favicon과 rss.xml이다.

# Page Family Performance
`색인` = GSC 색인 보고서(10-23)의 색인됨. 노출·클릭은 전체 기간 페이지 표 기준.

| Family | sitemap URL | GSC 색인 | 노출 페이지 | 클릭 | 노출 | CTR | 가중 평균 순위 | 노출/URL | 클릭/URL |
|---|---|---|---|---|---|---|---|---|---|
| REGION_DONG_SUBJECT (동×과목) | 410 | 74 | 12 | 0 | 21 | 0% | 6.6 | 0.051 | 0 |
| HOME | 1 | 1 | 1 | 3 | 3 | 100% | 2.0 | 3.0 | 3.0 |
| SUBJECT (`/subject/*`) | 23 | 6 | 1 | 0 | 3 | 0% | 38.3 | 0.130 | 0 |
| CONTENT_GUIDE (`/guide/*`) | 19 | 13 | 2 | 0 | 3 | 0% | 7.3 | 0.158 | 0 |
| PROGRAM (`/program/*`) | 4 | 4 | 2 | 0 | 3 | 0% | 24.7 | 0.750 | 0 |
| SCHOOL_SUBJECT | 49 | 21 | 2 | 0 | 3 | 0% | 6.0 | 0.061 | 0 |
| GRADE (`/grade/*`) | 16 | 8 | 1 | 0 | 1 | 0% | 46.0 | 0.063 | 0 |
| REGION_GRADE_SUBJECT | 15 | 13 | 1 | 0 | 1 | 0% | 5.0 | 0.067 | 0 |
| REGION_DONG (동 hub) | 82 | 26 | 0 | 0 | 0 | – | – | 0 | 0 |
| SCHOOL (학교 hub) | 47 | 3 | 0 | 0 | 0 | – | – | 0 | 0 |
| REGION_CITY (시·군·구) | 19 | 2 | 0 | 0 | 0 | – | – | 0 | 0 |
| REGION_DISTRICT (수원 4구) | 4 | 0 | 0 | 0 | 0 | – | – | 0 | 0 |
| REGION_PROVINCE (시·도) | 3 | 0 | 0 | 0 | 0 | – | – | 0 | 0 |
| REGION_SUBJECT / REGION_PROGRAM | 2 / 5 | 1 / 0 | 0 | 0 | 0 | – | – | 0 | 0 |
| CONSULT / 목록·약관(`/regions` 등) | 1 / 4 | 0 / 1 | 0 | 0 | 0 | – | – | 0 | 0 |

핵심 비교 (동 hub vs 동×과목 vs 학교 hub vs 학교×과목):
- **동×과목**은 색인 비율(10-23 이전 존재분 74/215 = 34%)과 노출(21)이 모두 가장 높다. 노출 페이지 순위도 1~10위권이다.
- **동 hub**는 색인 26/43(60%)으로 색인은 잘 됐지만 노출이 0이다. 과목 없는 "동 + 과외" 검색 수요가 약하거나, 아직 노출될 시간이 없었을 수 있다. 데이터로 둘을 구분할 수 없다.
- **학교×과목**은 색인 21/49, 노출 3(반포초 영어 2, 연수고 수학 1)이다.
- **학교 hub**는 3/47만 색인됐다. 미색인 학교 hub 44개는 전부 "발견됨 – 현재 색인 생성 안 됨"이다(Google이 아직 크롤링하지 않음).
- **시·도·시·군·구 hub**도 대부분 "발견됨-미색인"이다(22개 + 시·도 3개). 2026-09 이전부터 있던 상위 hub가 10월에 만든 동×과목보다 덜 색인됐다.

# Region Performance
지역 family(시·도/시·군·구/동/동×과목/지역 학년·과목/지역 program)만 집계.

| 시·도 | sitemap URL | GSC 색인 | 노출 페이지 | 클릭 | 노출 | CTR | 노출/URL | 노출/색인 URL | 노출 페이지 순위 중앙값 |
|---|---|---|---|---|---|---|---|---|---|
| 경기 | 181 | 95 | 8 | 0 | 17 | 0% | 0.094 | 0.18 | 8.5 |
| 서울 | 291 | 19 | 5 | 0 | 5 | 0% | 0.017 | 0.26 | 5.0 |
| 인천 | 68 | 2 | 0 | 0 | 0 | – | 0 | 0 | – |

같은 시기(10-23 이전)에 만든 동 URL의 색인 비율:
| 시·도 | 동 URL (≤10-23) | 색인 | 비율 |
|---|---|---|---|
| 경기 (의정부 포함) | 126 | 83 | 66% |
| └ 의정부 (10-16 시작) | 90 | 56 | 62% |
| └ 경기 기타 6개 동 (10-19~21) | 36 | 27 | 75% |
| 서울 20개 동 (10-19~23) | 120 | 16 | 13% |
| 인천 2개 동 (10-19) | 12 | 1 | 8% |

시·구별(동 family): 의정부 노출 15(90 URL, 색인 56). 마포 3(42/7), 양천 1(30/2), 강서 1(54/3), 용인 1(12/10). 강남·서초·송파·성남·고양·안양·부천·인천 전 구는 노출 0이다.

해석:
- 총합과 URL당 노출 모두 경기가 앞서지만, 대부분 **의정부(가장 오래된 동, 10-16)의 나이 효과**다.
- 색인된 URL 하나당 노출은 서울 0.26, 경기 0.18로 비슷하다.
- **같은 10-19 cohort**에서 서울 동은 3/24, 경기 동은 10/12가 색인됐다. 서울 동 색인이 느린 것은 표본이 작아도 눈에 띄는 차이라 INVESTIGATE 대상이다(원인 미확인).

# Subject Performance
동×과목 기준(과목 slug는 `src/data/subjects.ts`: korean·english·math·social·science).

| 과목 | 동×과목 URL | GSC 색인 (전체) | 색인 (≤10-23 존재 43개 중) | 노출 페이지 | 클릭 | 노출 | CTR | 가중 평균 순위 | 노출/URL |
|---|---|---|---|---|---|---|---|---|---|
| 과학 | 82 | 15 | 15/43 | 2 | 0 | 10 | 0% | 6.5 | 0.122 |
| 사회 | 82 | 21 | 21/43 | 3 | 0 | 4 | 0% | 7.8 | 0.049 |
| 영어 | 82 | 11 | 11/43 | 3 | 0 | 3 | 0% | 8.0 | 0.037 |
| 수학 | 82 | 22 | 22/43 | 3 | 0 | 3 | 0% | 6.0 | 0.037 |
| 국어 | 82 | 5 | 5/43 | 1 | 0 | 1 | 0% | 1.0 | 0.012 |

- 과학 노출 10 중 8이 한 페이지(송산1동 과학)다. 과목 우위로 해석하지 않는다.
- 학교×과목·지역 학년×과목까지 포함하면 영어 8, 수학 5, 과학 10, 사회 4, 국어 1이다.
- **국어 색인 비율(5/43 = 12%)이 수학(22/43 = 51%)·사회(49%)보다 확연히 낮다.** 원인은 미확인이다(예: 동별 국어 페이지 간 유사도). INVESTIGATE 대상이고 이번에는 수정하지 않는다.

# Query Intent
| Intent | 검색어 수 | 클릭 | 노출 | CTR | 순위 |
|---|---|---|---|---|---|
| 일반 과외 | 2 (`논술 과외`, `초등학생 과외`) | 0 | 2 | 0% | 20.0 / 46.0 |
| 지역 + 과외 | 0 공개 | – | – | – | – |
| 지역 + 과목 + 과외 | 0 공개 | – | – | – | – |
| 학교 + 과목 / 학교 + 시험·평가 | 0 공개 | – | – | – | – |
| 브랜드 (`교과설계소`) | 0 공개 | – | – | – | – |
| 익명 처리(분류 불가) | – | 3 | 34 | – | – |

검색어 대부분이 익명 처리돼 intent 분포를 말할 수 없다. 동×과목 페이지가 1~10위에 노출된 사실은 확인되지만, 어떤 검색어였는지는 이 데이터로 알 수 없다.

# Top Performing Pages
**Top by clicks**: 클릭이 있는 페이지는 홈 1개뿐이다(3 클릭 / 3 노출 / 100% / 2.0). 20개 표를 채울 데이터가 없다.

**Top by impressions** (노출 있는 22개 전부, 전체 기간):
| # | 페이지 | Family | 클릭 | 노출 | CTR | 순위 |
|---|---|---|---|---|---|---|
| 1 | `/region/gyeonggi/uijeongbu/songsan1-dong/science` | 동×과목 | 0 | 8 | 0% | 5.6 |
| 2 | `/` | HOME | 3 | 3 | 100% | 2.0 |
| 3 | `/subject/english` | SUBJECT | 0 | 3 | 0% | 38.3 |
| 4 | `/school/banpo-elementary-school/english` | 학교×과목 | 0 | 2 | 0% | 5.0 |
| 5 | `/guide/suneung-preparation-timeline` | GUIDE | 0 | 2 | 0% | 7.0 |
| 6 | `/region/gyeonggi/uijeongbu/heungseon-dong/social` | 동×과목 | 0 | 2 | 0% | 9.0 |
| 7 | `/region/gyeonggi/uijeongbu/uijeongbu1-dong/science` | 동×과목 | 0 | 2 | 0% | 10.0 |
| 8 | `/program/nonsul` | PROGRAM | 0 | 2 | 0% | 20.5 |
| 9 | `/region/gyeonggi/uijeongbu/jageum-dong/korean` | 동×과목 | 0 | 1 | 0% | 1.0 |
| 10 | `/region/seoul/mapo/daeheung-dong/math` | 동×과목 | 0 | 1 | 0% | 2.0 |
| 11 | `/region/seoul/mapo/sinsu-dong/social` | 동×과목 | 0 | 1 | 0% | 4.0 |
| 12 | `/region/gyeonggi/seongnam/middle/math` | 지역 학년×과목 | 0 | 1 | 0% | 5.0 |
| 13 | `/region/seoul/gangseo/balsan1-dong/english` | 동×과목 | 0 | 1 | 0% | 5.0 |
| 14 | `/guide/performance-assessment` | GUIDE | 0 | 1 | 0% | 8.0 |
| 15 | `/region/gyeonggi/uijeongbu/songsan3-dong/math` | 동×과목 | 0 | 1 | 0% | 8.0 |
| 16 | `/region/seoul/yangcheon/sinjeong3-dong/math` | 동×과목 | 0 | 1 | 0% | 8.0 |
| 17 | `/school/yeonsu-high-school/math` | 학교×과목 | 0 | 1 | 0% | 8.0 |
| 18 | `/region/gyeonggi/uijeongbu/singok1-dong/english` | 동×과목 | 0 | 1 | 0% | 9.0 |
| 19 | `/region/seoul/mapo/hapjeong-dong/social` | 동×과목 | 0 | 1 | 0% | 9.0 |
| 20 | `/region/gyeonggi/yongin/jukjeon2-dong/english` | 동×과목 | 0 | 1 | 0% | 10.0 |
| 21 | `/program/coding` | PROGRAM | 0 | 1 | 0% | 33.0 |
| 22 | `/grade/elementary` | GRADE | 0 | 1 | 0% | 46.0 |

Rank improving 판단은 할 수 없다. 페이지별 노출이 1~8회라 추세선이 없다.

# Quick Wins
**P1 QUICK_WIN: 0건.**

보수 기준: 28일 노출 ≥ 50 AND 평균 순위 5~20 AND CTR이 같은 family 대비 낮음. 이 기준을 넘는 페이지가 없다(최대 8).

관찰 후보 (QUICK_WIN 아님, 다음 측정 때 먼저 볼 페이지):
| 페이지 | 클릭 | 노출 | CTR | 순위 | 메모 |
|---|---|---|---|---|---|
| 송산1동 과학 | 0 | 8 | 0% | 5.6 | 사이트에서 노출이 가장 많은 단일 URL. 노출이 50 이상으로 쌓이고 CTR이 계속 0이면 title/description 점검 |
| `/subject/english` | 0 | 3 | 0% | 38.3 | 순위 범위 밖. 경쟁이 큰 일반 검색어로 추정되나 검색어 미공개 |

# High Impression Low CTR
"노출 충분" 기준을 넘는 페이지가 없어 **해당 없음**. 동×과목 12개 페이지가 노출 21에 클릭 0이지만, 노출 21에서 클릭 0은 순위 6~7위의 정상 범위 안이다(1~2% CTR이면 기대 클릭 0.2~0.4). 원인 분석·title 수정을 하지 않는다.

# Zero / Low Impression
sitemap 704 중 노출 0은 682개다. URL별로 아래처럼 분류한다(색인 snapshot 10-23 기준). 무작정 noindex·삭제는 하지 않는다.

| 분류 | 대상 | URL 수(약) | 근거 | 조치 |
|---|---|---|---|---|
| **NEW_WAIT** | 10-26·10-27 batch 동 39곳의 hub·동×과목 | 234 | 색인 snapshot(10-23)보다 나중에 생김. sitemap은 10-28에 읽혔지만 발견 692는 24차 전 숫자 | 기다림. 11월 하순 재측정 |
| **NEW_WAIT** | 10-19~10-23 동 중 색인됐지만 노출 0 | 약 88 | 색인 후 경과 1주 내외 | 기다림 |
| **INVESTIGATE** | 10-23 이전 동 URL 중 미색인 (특히 서울 20개 동 104/120, 동×과목 국어 38/43) | 158 | 같은 cohort에서 경기 동과 색인률 차이가 큼 | 다음 색인 보고서 갱신 후, 대표 URL 몇 개를 URL 검사로 확인 |
| **INVESTIGATE** | 시·도 3, 시·군·구 17, 수원 구 4, 학교 hub 44, 학교×과목 28, `/subject/*` 16 등 "발견됨 – 현재 색인 생성 안 됨" 138 | 138 | 오래된 상위 hub가 크롤링 대기 중 | 크롤링 우선순위·내부 링크 깊이 점검(분석만) |
| **INVESTIGATE (경미)** | 크롤링됨-미색인 5개 sitemap URL (합정동 hub·사회, 신갈동 국어, 의정부2동 수학, 수능 가이드) | 5 | 크롤링했지만 색인 보류. 합정동 사회·수능 가이드는 노출이 1~2회 있었음(보고서 시점 차이) | 다음 갱신 때 재확인 |
| IMPROVE | – | 0 | 데이터로 개선 대상을 특정할 수 없음 | – |

# Cannibalization
**확인 불가 / 신호 없음.** 공개 검색어가 2개뿐이고, 둘 다 한 페이지에만 노출됐다. 동 hub와 동×과목이 같은 검색어에서 경쟁하는지 판단할 데이터가 없다. canonical·route 변경 불필요.

# Expansion Decision
**HOLD (서울·경기·인천 신규 확장 보류) + INVESTIGATE (색인).**

| 선택지 | 조건 충족 | 근거 |
|---|---|---|
| A. EXPAND | ✗ | 실제 클릭을 만든 지역·과목 cluster 없음(비홈 클릭 0) |
| B. IMPROVE | ✗ | 노출이 충분한 페이지 없음(최대 8) |
| **C. HOLD** | ✓ | 동 URL 492 중 234(48%)가 색인 snapshot 이후 생겼고, 노출 데이터는 엿새치 |
| D. STOP EXPANSION | ✗ (아직) | "충분한 관찰 기간"이 지나지 않았음. 확장 중단이 아니라 측정 대기 |

- Batch25(산곡1동·풍산동·신봉동·삼산2동·유림2동)는 HOLD한다. 지금 추가하면 측정할 수 없는 URL만 늘어난다.
- **재개 gate (제안)**: 아래 두 가지를 모두 충족하면 재평가한다.
  - GSC 색인 보고서가 10-27 batch 이후로 갱신되고, 10-23 이전 동 URL 색인율이 확인될 것
  - 최근 28일 동×과목 노출 ≥ 300 또는 비홈 클릭 ≥ 5
- 동×과목 template이 다른 template보다 먼저 색인·노출된다는 점은, 확장이 재개될 때 **동×과목 중심 구조를 유지할 근거**가 된다.

# Metropolitan Decision
**광역시 pilot(울산·대전 포함 부산·대구·대전·울산): HOLD.** 서울·경기·인천 확장의 성과가 아직 측정되지 않았다(비홈 클릭 0, 동 노출 21). 기존 architecture audit의 "구조 gap 없음, 데이터 gate 이슈" 판단은 그대로 둔다. 광주 tooling/URL 이슈도 손대지 않는다. 재개 gate를 통과한 뒤 첫 후보는 기존 audit대로 울산이다.

# Recommended Next Actions
**P1 — 11월 하순 GSC 재측정**
- Impact: High · Effort: Low · Risk: Low
- Evidence: 노출 일별 1→16(10-21→10-26) 증가 시작. 색인 snapshot이 10-23이라 234 URL 미반영
- Action: 2026-11-24 전후에 이 문서와 같은 절차를 반복한다(28일 = 10-27~11-23, 이전 28일은 약 9-29~10-26). family·시·도·과목 표를 갱신하고 재개 gate를 판정한다.

**P1 — 색인 갱신 확인 (INVESTIGATE, 읽기 전용)**
- Impact: High · Effort: Low · Risk: Low
- Evidence: 색인 173 / sitemap 704. 서울 동(≤10-23) 16/120 vs 경기 기타 동 27/36. 국어 동×과목 5/43
- Action: 색인 보고서가 10-27 이후로 갱신되면 다음을 다시 센다.
  - 10-26·27 batch 색인 수
  - 서울 동 색인률
  - 국어 페이지 색인률
- 차이가 계속되면 대표 URL 3~5개(서울 동×과목, 국어 동×과목)를 사용자가 URL 검사로 확인한다. 색인 요청 여부는 사용자가 결정한다.

**P2 — 상위 hub "발견됨-미색인" 원인 점검 (INVESTIGATE)**
- Impact: Medium · Effort: Low~Medium · Risk: Low
- Evidence: 시·도 0/3, 시·군·구 2/19, 학교 hub 3/47. 미색인 138은 전부 "발견됨"
- Action: 분석만 한다.
  - 색인된 동×과목 → 상위 hub로 가는 내부 링크 수와 깊이
  - 해당 hub의 sitemap lastmod
  - 서버 응답(전 URL 200 확인됨)
- 코드 변경은 다음 측정에서도 같은 상태일 때만 검토한다.

**P2 — 송산1동 과학 관찰**
- Impact: Low · Effort: Low · Risk: Low
- Evidence: 노출 8 / CTR 0% / 순위 5.6
- Action: 노출 ≥ 50이 되면 검색어(공개분)와 title·description·H1 정합을 점검한다. 지금은 수정하지 않는다.

**P3 — Batch25·광역시 pilot HOLD 유지**
- Impact: Medium · Effort: – · Risk: 확장하면 측정 불능 URL이 늘어남
- Evidence: 비홈 클릭 0, 동 URL의 48%가 색인 snapshot 이후 생성
- Action: 재개 gate 충족 전까지 신규 batch·지역을 만들지 않는다.

**P3 — owner info(Trust) 대기 유지**
- Impact: Medium · Effort: Low(값만 있으면) · Risk: Low
- Evidence: GSC와 무관. `PROJECT_COMPLETION_AUDIT_2026-10-29.md` BLOCKED_BY_OWNER_INFO 8항목
- Action: 사용자가 값을 주면 반영한다.

# NEXT_IMPLEMENTATION_SCOPE
지금 바로 구현할 항목은 **없다**. 아래는 재측정 결과에 따라 Claude Code에 넣을 조건부 후보다.

1. **(조건: 11월 재측정에서도 상위 hub 대부분이 "발견됨-미색인")** 색인된 동×과목 → 시·군·구·시·도 hub로 가는 내부 링크 경로 보강. 새 route·새 사실 없음, indexability·canonical 변경 없음, template 1곳.
2. **(조건: 어떤 동×과목 페이지가 28일 노출 ≥ 50, 순위 5~20, CTR이 family 평균보다 낮음)** 해당 cluster의 title/description 표현 조정. 공개 검색어 근거가 있을 때만, metadata 중복 0 유지.
3. **(조건: 국어 동×과목 색인률이 다른 과목보다 계속 낮음)** 국어 페이지 간 본문 유사도 측정(읽기 전용 scratch)을 먼저 하고, 차별화가 필요한 경우에만 기존 평가계획 사실 안에서 문단 조정.

# Do Not Touch
- indexed route 삭제, indexed→noindex, canonical 변경, URL migration
- Quality Gate threshold
- title/description 일괄 수정(근거 데이터 없음)
- Batch25·광역시 pilot·광주 route(재개 gate 전)
- GSC 설정·sitemap 재제출·색인 요청 대량 실행(사용자 계정 행위, 이번 범위 밖)
- 새 Google credential/OAuth client 생성
