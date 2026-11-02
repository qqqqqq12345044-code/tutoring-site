# 전국 학교·지역 페이지 확장 Phase 1 — readiness + 울산·대전 pilot (2026-11-02)

branch `work/uijeongbu-dong-seo`. 시작 시점 HEAD = origin/work = `54d486e`, main = origin/main = Production = `00fece6`, working tree clean, 다른 session 변경 없음(origin에 `work/lead-call-tracking`이 새로 보였지만 별도 브랜치이고 이 브랜치와 무관). main·Production은 변경하지 않았다.

# Executive Summary

- **전국 학교 hub 시스템 완성**: 공식 identity와 행정동 mapping이 확정되었지만 등록되지 않은 학교 **10,134곳**에 `/school/{slug}` fact-only hub를 연다(PAGE_ONLY). 이 hub는 **항상 `noindex, follow`이고 sitemap에서 빠지며**, 학교×과목 route가 없다(404). 정적 생성 없이 on-demand로 렌더하므로 **build 페이지 수 변화는 0**이다(1,901 → 1,901, 51초).
- PENDING·EXCLUDED·폐교 표기·지역 HOLD(광주·전남·세종) 학교와 잘못된 slug는 **404**다. 전국 12개 권역 smoke로 확인했다.
- **광역시 pilot**: 울산 남구 **무거동**과 대전 유성구 **신성동**을 추가했다. hub 2개와 동×과목 10개를 학교알리미 원문으로 작성했고 모두 **GREEN**이다(유사도 14.89~22.43%). 첫 광역시 학교 15곳도 등록했다.
- 최종 수치(전국 hub 포함): **Routes 13,141 / Sitemap 718 / Noindex 12,421**, region-dong 84/84, region-dong-subject 420/420 GREEN, **indexed RED 0**, `validate:full` PASS.
- 새로 색인되는 페이지는 14개다(동 hub 2 + 동×과목 10 + 구 hub 2: 울산 남구·대전 유성구). 시·도 hub인 울산·대전은 서로 이름 마스킹 유사도가 100%라 **noindex로 보류**했다(`src/data/regionNoindex.ts`). 기존 색인 URL의 삭제와 indexed→noindex는 0건이다.

# National Inventory

출처: `data/official/school-candidates.json`(12,059행, NEIS 학교기본정보 + 행정안전부 행정동 코드 2026-10-12 + 주소정보누리집). 원천 `national-school-dongs.json`은 12,091행(resolved 11,887 / pending 204)이고, 학교코드 없는 개교예정 행은 후보에서 빠진다.

| 분류 | 수 | 정의 / 처리 |
|---|---:|---|
| CONFIRMED (identity + 행정동 1곳) | 11,887 | 도로명주소 → 공식 행정동 1곳 |
| └ CONTENT_READY | 47 | 등록 학교 중 published schoolContent가 있어 hub가 색인됨(기존 정책 그대로) |
| └ READY(등록, 콘텐츠 없음) | 448 | 등록 495 − 색인 47. hub는 noindex. 이번 pilot 15곳 포함 |
| └ PAGE_ONLY | **10,134** | 미등록 CONFIRMED. 전국 hub(noindex), `src/data/nationalSchools.json` |
| └ 지역 HOLD (unmapped-region) | 1,260 | 광주 313 · 전남 843 · 세종 104 — 사이트 지역 노드로 표현 못 함 → route 없음 |
| └ 폐교 표기 | 1 | NEIS 학교명 "전곡초등학교적동분교장(폐교)" → 제외 |
| PENDING | 159 | 행정동 미확정(등록 3곳은 기존 수기 등록분) → 404, 추정 금지 |
| EXCLUDED | 13 | 주소 없음 7 · 미개교 6 → 404 |
| CONFLICT | **0** | slug 중복 0, NEIS 코드 중복 0, 등록 학교와 slug·code 충돌 0. 동명 학교 893쌍은 slug registry에서 지역 접미어로 이미 구분됨(예: `seongdeok-middle-school-daejeon-yuseong`) |

검증: CONFIRMED 11,887 = 등록(CONFIRMED) 492 + PAGE_ONLY 10,134 + 지역 HOLD 1,260 + 폐교 1. 등록 495 = 이 중 492 + PENDING 상태 수기 등록 3이다. `validate:quick`의 `checkNationalSchools`는 매 실행마다 다음을 다시 계산해 확인한다.
- 생성 파일이 candidates와 일치
- slug·code 충돌 없음
- city·district 노드 존재
- 색인 0, sitemap 0

# Province Coverage

| 시·도 | 전체 | CONFIRMED | PENDING | EXCLUDED | 지역 HOLD | registered | 공시 확인 | PAGE_ONLY hub | CONTENT_READY(색인 학교) | 색인 동 | 색인 동×과목 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 서울 | 1319 | 1301 | 18 | 0 | 0 | 250 | 241 | 1051 | 20 | 46 | 230 |
| 부산 | 615 | 586 | 28 | 1 | 0 | 0 | 0 | 586 | 0 | 0 | 0 |
| 대구 | 462 | 455 | 7 | 0 | 0 | 0 | 0 | 455 | 0 | 0 | 0 |
| 인천 | 554 | 538 | 15 | 1 | 0 | 68 | 60 | 470 | 18 | 10 | 50 |
| 광주 | 321 | 313 | 8 | 0 | 313 | 0 | 0 | 0 | 0 | 0 | 0 |
| 대전 | 307 | 305 | 2 | 0 | 0 | 8 | 8 | 297 | 0 | 1 | 5 |
| 울산 | 245 | 244 | 1 | 0 | 0 | 7 | 7 | 237 | 0 | 1 | 5 |
| 세종 | 105 | 104 | 1 | 0 | 104 | 0 | 0 | 0 | 0 | 0 | 0 |
| 경기 | 2582 | 2538 | 44 | 0 | 0 | 162 | 63 | 2378 | 9 | 26 | 130 |
| 강원 | 631 | 629 | 2 | 0 | 0 | 0 | 0 | 629 | 0 | 0 | 0 |
| 충북 | 483 | 480 | 3 | 0 | 0 | 0 | 0 | 480 | 0 | 0 | 0 |
| 충남 | 732 | 718 | 7 | 7 | 0 | 0 | 0 | 718 | 0 | 0 | 0 |
| 전북 | 743 | 741 | 2 | 0 | 0 | 0 | 0 | 741 | 0 | 0 | 0 |
| 전남 | 856 | 843 | 13 | 0 | 843 | 0 | 0 | 0 | 0 | 0 | 0 |
| 경북 | 916 | 911 | 5 | 0 | 0 | 0 | 0 | 911 | 0 | 0 | 0 |
| 경남 | 989 | 986 | 3 | 0 | 0 | 0 | 0 | 986 | 0 | 0 | 0 |
| 제주 | 199 | 195 | 0 | 4 | 0 | 0 | 0 | 195 | 0 | 0 | 0 |
| **합계** | 12059 | 11887 | 159 | 13 | 1260 | 495 | 379 | 10134 | 47 | 84 | 420 |

- 시·도 구분은 NEIS 교육청 코드 기준이다. "공시 확인"은 학교알리미 2026년 3차 공시 파일을 실제로 받은 학교 수다(candidates `operating`).
- 경기 PAGE_ONLY 2,378 = CONFIRMED 2,538 − 등록 CONFIRMED 159 − 폐교 표기 1.

# Mapping Quality

- school→dong: CONFIRMED 11,887 (98.6%), PENDING 159, EXCLUDED 13. 직전 기록과 같다.
- PENDING은 이번에도 추정하지 않았다. 전국 hub 생성기(`scripts/official/national-school-pages.ts`)가 `status === "candidate" && state === "CONFIRMED" && citySlug && dongCode`만 통과시킨다.
- 지역 HOLD 1,260곳은 mapping 문제가 아니다. 행정동은 확정되었지만 시·도 구조가 미결이다(광주·전남은 공식 시·도명 `전남광주통합특별시`, 세종은 시군구 없음).
- 행정동 페이지 연결은 이름이 아니라 **행정동 코드**로 한다(`nationalSchoolDong`). 이름이 같은 동이 다른 구에 있어도 잘못 이어지지 않는다.

# Content Availability

- 학교 hub 색인 조건은 기존 정책 그대로다(`getIndexability("school")`): 등록 + published schoolContent + editorial hold 아님 → 47곳.
- 새 종류 `"school-national"`은 항상 NOT_INDEXED다. 평가계획을 읽지 않은 학교에 고유 콘텐츠가 없기 때문이다.
- 학교×과목: 등록 학교의 `availableSubjectSlugs`에 있는 조합만 route가 된다(950개, 색인 49). 전국 hub와 이번 등록 15곳은 0이다(빈 템플릿 route 없음 → `/school/{slug}/{subject}` 404).
- 동×과목: 원문으로 작성한 조합만 route가 된다(`hasDongSubjectRoute`) → 420개 전부 GREEN.

# Route Projection

| 단계 | Routes | Sitemap | Noindex | 정적 생성 |
|---|---:|---:|---:|---:|
| 시작(`54d486e`) | 2,926 | 704 | 2,220 | 1,901 |
| ① 전국 PAGE_ONLY hub 10,149 추가(pilot 등록 전) | 13,075 | 704 | 12,369 | 1,901 |
| ② pilot 학교 15곳 등록(전국 hub → 등록 hub, 순증 0) + 조합 route 54 + 동 hub 2 + 동×과목 10 | 13,141 | 720 | 12,419 | — |
| ③ 울산·대전 시·도 hub 보류 | **13,141** | **718** | **12,421** | 1,923 (prerender-manifest: 학교 hub는 등록 495곳만, +15 등록 학교 + 새 구의 정적 조합 route) |

- **전국 hub를 정적 생성하지 않는 이유**: 12k 정적 생성이면 build 페이지가 약 1,900 → 12,000으로 6배가 된다. 그래서 `generateStaticParams`는 등록 학교만 그대로 두고, 전국 hub는 `dynamicParams` 기본값(true)으로 on-demand 렌더한다. 행정동 페이지가 이미 운영 중인 방식과 같다.
- 데이터는 tuple JSON 1.27 MB로, 학교 route의 server chunk 1개(1.26 MB)에만 들어간다. sitemap·indexability·지역 gate는 이 파일을 import하지 않는다.
- validate:full의 link-graph는 **색인 route만** fetch한다. 따라서 noindex hub 1만 개가 늘어도 검증 시간은 거의 그대로다(2분 44초).
- 부산·대구까지 같은 방식으로 pilot을 이어가면 늘어나는 것은 batch당 수십 route(조합 27 × 구 + 작성한 동×과목)다. 전국 hub 수는 등록할 때마다 같은 수만큼 등록 hub로 옮겨갈 뿐 늘지 않는다.
- sitemap 718은 50,000 한도와 거리가 멀다. 전국 hub는 sitemap에 들어가지 않으므로 shard 정책 변경도 필요 없다.
- **STOP 조건 점검**:
  - static params 폭증: 없음
  - build 메모리·시간: 51초, 이상 없음
  - accidental subject 조합: 0
  - sitemap 정책 변경: 불필요
  - → 통과

# Indexability Policy

| 대상 | robots | sitemap | 근거 |
|---|---|---|---|
| CONTENT_READY 학교 hub | index, follow | 포함 | published schoolContent (기존) |
| READY(등록·콘텐츠 없음) hub | noindex, follow | 제외 | 기존 |
| PAGE_ONLY 전국 hub | noindex, follow | 제외 | `"school-national"` 항상 NOT_INDEXED |
| PENDING / EXCLUDED / 지역 HOLD / 폐교 / 잘못된 slug | 404 | — | 데이터에 없음 |
| 학교×과목 콘텐츠 없음 | 404 | — | 기존 |
| 지역 hub(시·도·구) | 등록 학교 있으면 index | | 기존 gate + **editorial hold** `regionHubNoindexSlugs`(울산·대전 시·도) |

PAGE_ONLY hub에 표시하는 것은 다음뿐이다.
- 공식 학교명, 학교급, 소재 지역(시·도 > 시군구 > 구), 행정동
- 출처: NEIS 학교기본정보 단건 URL, 행정안전부 행정동 코드
- 기준 문장: "평가계획은 아직 정리하지 않음"
- "교과설계소는 학교와 별개" 안내, 상담 CTA

합격률·학군·난이도·후기는 넣지 않는다. 표시 요소의 근거는 이렇다.
- title: `{학교명} 과외 | {시·도 시군구} {행정동} {학교급}`. 동명 학교도 title이 갈린다.
- canonical: self.
- schema: Breadcrumb만 있다. 학교를 Organization으로 만들지 않는다. 전 페이지의 EducationalOrganization은 layout의 교과설계소 자신이다.
- breadcrumb의 학교급 링크: 조합 route가 있는 도시에서만 단다(`hasRegionComboRoutes`). 없는 도시에서 404로 가는 링크를 막기 위해서다.

# Quality Gate

- threshold 변경 없음(RED > 60%, AMBER > 30%). 신규 동 hub·동×과목 12개는 모두 GREEN이다. 수치는 아래와 같다.
  - 무거동 hub 18.70%, 국어·영어 22.43%, 수학 19.69%, 사회 14.89%, 과학 17.46%
  - 신성동 hub 16.70%, 국어 17.58%, 영어·수학 21.16%, 사회 17.53%, 과학 17.46%
  - 전체 최대값(28.44%)은 변하지 않았다.
- 순서 검증: 학교만 등록하고 과목 콘텐츠를 넣기 전에는 두 동 hub가 **RED(indexed RED 2)**로 잡혀 `validate:quick`이 FAIL했다. 원문 콘텐츠를 넣은 뒤 GREEN이 되었다. 게이트가 의도대로 동작한다.
- **지역 hub 측정**: 지역 hub는 Quality Gate 종류가 아니어서 렌더된 `<main>`을 같은 방식(이름·숫자 마스킹 + token LCS)으로 따로 쟀다.
  - 새 시·도 hub인 울산과 대전은 서로 **100%** 같았다(기존 서울~경기는 90.5%) → 보류(noindex).
  - 새 구 hub인 울산 남구 83.3%, 대전 유성구 85.1%는 기존 색인 구 hub(78~87%)와 같은 등급이라 기존 정책대로 index다.
  - **기존 지역 hub 템플릿의 높은 유사도 자체는 이번 범위 밖의 기존 문제**로 Phase 2 과제로 남긴다.

# Pilot Cities

울산 기존 추천 동인 **옥동은 HOLD**했다. 중학교 원문이 없기 때문이다(옥동중 PDF, 신정중 학교알리미 NOTFOUND). 고교 1곳(울산제일고 hwp)과 초등만 남는다. 그래서 같은 남구의 **무거동**(중학교 3곳 hwp/hwpx)으로 바꿨다. 무거동도 "남구"라 구 이름 중복 해소를 함께 검증할 수 있다. 대전은 기존 추천대로 유성구 **신성동**으로 했다.

| 도시 | 동 | 원문 사용(OCR 없음) | 제외 | 등록 학교 |
|---|---|---|---|---|
| 울산 남구 | 무거동 `/region/ulsan/ulsan-nam/mugeo-dong` | 무거중 hwp·문수중 hwpx·옥현중 hwpx 1~3학년, 옥산초 6학년 hwp | 우신고·무거고·신복초 PDF, 월계초 NOTFOUND(미등록) | 7 |
| 대전 유성구 | 신성동 `/region/daejeon/daejeon-yuseong/sinseong-dong` | 성덕중 hwp 1~3, 대덕고 hwpx 1~3, 대덕소프트웨어마이스터고 hwp(일반 교과 1·2학년), 대덕초·대전자운초 6학년 hwp | 대덕중·대전자운중·대전전자디자인고 PDF; 금성초 NOTFOUND·대덕초도룡분교장 공시 차수 1(미등록) | 8 |

원문에서 쓰지 않은 값(불일치):
- 성덕중 2학년 수학: 표 머리 60/40인데 칸·본문은 70/30 → 전체 미사용.
- 문수중 2학년 역사: 학기 칸이 "1학기" → 미사용.
- 문수중 2학년 영어: 2학기 진도와 다른 Lesson 1~4 → 미사용.
- 대덕SW마이스터고 공통국어2: 시험 시기 12월/1월이 같은 학교의 다른 과목과 어긋남 → 시기만 미사용.
- 비율표 시기와 진도표가 어긋난 12개 항목: 시기 생략.
- 대전자운초 과학: 단원명 "물질의 연소"와 평가 내용 불일치 → 단원명 미사용.
- 대덕고 확률과 통계: 첫 과제 이름이 요약표와 상세표에서 다름 → 이름 미사용.

추출 근거(파일·줄 번호)는 세션 scratch의 draft-mugeo.md / draft-sinseong.md에 있고, 사실표는 각 동×과목 entry의 sources와 대응한다.

구현은 기존 batch 방식 그대로 했다. 새 시스템은 만들지 않았다.
1. 학교알리미 수집: 기존 Node collector. Python이 없는 노트북이다.
2. NEIS 단건 캐시: `.cache/official/neis/national-25.json`.
3. `school-import.ts --promote 3114059500,3020055000 --allow-new-city ulsan-nam,daejeon-yuseong --write`.
   - 새 opt-in 플래그다. 감사 문서에서 권장한 L284 게이트 우회 방식이며, 도시를 명시해야만 동작한다.
4. candidates는 15줄의 status/operating만 갱신했다(`--write` 전체 재생성은 쓰지 않음).
5. `dongs.ts` 2행 추가(행정안전부 코드·법정동 구성 그대로).
6. `sources.ts`에 학교알리미 ID 9개 추가.
7. `dongSubjectContent.ts`에 10개 entry 추가.
8. 구 이름 중복 해소: 동 페이지 title·H1·본문의 지역 표기를 `getRegionTitleName`으로 바꿨다. 기존 동 도시 17곳은 값이 같아 출력 변화가 0이고(스크립트로 전수 확인), `ulsan-nam`만 "남구" → "울산 남구"가 된다.

Render(로컬 production server):
- 신규 12페이지: 200 · `index, follow` · canonical 일치 · H1 1 · BreadcrumbList · 학교알리미 출처 · 기준/별개 서비스 안내 · 맥락 CTA(`dong=`).
- Playwright 390/768/1440 × 10페이지(울산 hub + 수학·사회, 대전 hub + 국어·과학, CONTENT_READY 강화고·송파고, noindex 무거중·PAGE_ONLY 남창고): 가로 넘침 0, 깨진 이미지 0, H1 1, 콘솔 오류 0.
- 24px 미만 터치 대상 수(동 페이지 21~33)는 대조군(중2동·송도3동 21~30)과 같다. 기존 템플릿 특성이다.

전국 hub smoke(12개 권역 + 상태별):
- 서울·부산·대구·인천·대전·울산·경기·강원·충북·충남·전북·경북·경남·제주의 CONFIRMED 학교: 200 + `noindex, follow` + canonical.
- 모든 시·도의 PENDING, 부산·인천·충남·제주의 EXCLUDED, 광주·전남·세종: 404.
- 잘못된 slug: 404. 전국 학교의 `/math`: 404.

# Holds

- **광주·전남(1,156교)**: 공식 시·도 `전남광주통합특별시` 결정(URL migration 여부) 전까지 route 없음. 구현하지 않았다.
- **세종(104교)**: 시군구 없는 단층 구조라 현재 city 모델과 충돌. 구조 변경 없음.
- **PENDING 159 / EXCLUDED 13 / 폐교 표기 1**: 404 유지. 추정 금지.
- **울산 옥동**: 중학교 원문 없음(PDF·NOTFOUND).
- **울산·대전 시·도 hub 색인**: `regionNoindex.ts`. 동이 늘어 본문이 서로 달라지면 다시 측정해 해제한다.
- **candidates operating-only diff 47건**: 원문을 받았지만 등록하지 않은 학교다. 울산 신정2동·삼산동·대현동 probe 학교 등이 해당한다. 기존 정책대로 해당 동을 등록할 때 함께 반영한다.
- 공식 원문 불확실(위 불일치 목록): 해당 값 미사용.

# Recommended Rollout

1. **work → main 반영 판단**(사용자 승인 필요). 이번 commit은 Production 미반영이다. 배포하면 다음이 바뀐다.
   - sitemap 704 → 718: 신규 12 + 구 hub 2
   - 전국 hub 10,134가 on-demand 404 → 200(noindex)으로 바뀜
2. **Phase 2 — 부산 → 대구**(같은 batch 방식, 도시당 2~3동). 부산은 이름이 겹치는 구가 많다(중·서·동·남·북·강서). 이번 `getRegionTitleName` 적용으로 동 페이지 title 모호성은 이미 해결되었다.
3. **울산·대전 추가 동**: 울산 신정2동(울산여고 hwp·학성고 hwp·학성중 hwpx, 수집 완료), 삼산동(울산강남중 hwp). 대전 노은2동·관평동(미수집). 동이 2~3곳 이상이 되면 시·도 hub 보류를 재측정한다.
4. **지역 hub 템플릿 유사도**(기존 문제): 시·도·구 hub 본문을 동 요약 중심으로 바꾸는 별도 작업.
5. **GSC 성과 기반 승격**: PAGE_ONLY → 등록 → schoolContent 작성 순서다. 노출이 생기는 학교부터 진행한다. 다음 측정은 2026-11-24 전후다(기존 계획).
6. 2027-04-30: 2026-2 평가계획 재검증(동×과목 420 entry).
