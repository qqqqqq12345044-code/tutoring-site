# 전국 학교→학년→과목 확장 Phase 2 (2026-11-02)

## Executive Summary

- **Phase 1 Production 반영**: 재검증(validate:full PASS)을 마친 `dc3ffbf`를 main에 fast-forward로 반영했다(force 없음). GitHub Production deployment 7484437128 success, Production smoke PASS. 롤백 지점은 `00fece6`(deployment 7403283723).
- **Phase 2 (work only)**: `/school/{slug}/{학년}`, `/school/{slug}/{학년}/{과목}` route를 추가했다. 기존 `/school/{slug}/{과목}` URL은 그대로라 URL migration은 없다.
- **Pilot 5교 + 지역→학교 연결**:
  - 잠실고(서울)·죽전고(경기)·계산중(인천)·무거중(울산)·대덕고(대전).
  - 학년×과목 54(전부 GREEN·색인), 학년 hub 12(GREEN 6 색인, AMBER 6 noindex).
  - 행정동 hub에 같은 동 PAGE_ONLY 학교 목록을 붙였다(14개 동, 33곳).
- **Evidence**:
  - 이번 콘텐츠는 모두 OFFICIAL(학교알리미 2026학년도 2학기 평가계획 원문)이다.
  - FIELD_ANALYSIS·CASE_BASED는 검증된 기록이 repo에 없어 0건이다. 타입·검사·화면 슬롯만 만들고, 기록이 없으면 섹션을 숨긴다.
- **수치 변화**:

  | 항목 | 이전 | 이후 |
  |---|---:|---:|
  | Routes | 13,141 | 13,207 |
  | Sitemap | 718 | 778 |
  | Noindex | 12,421 | 12,427 |
  | 정적 생성 | 1,923 | 1,989 |

  indexed RED 0, validate:full PASS.
- **부산·대구는 HOLD**(이번 batch에서 시도하지 않음, 아래 절 참고).

## Phase 1 Production Result

| 항목 | 결과 |
|---|---|
| 시작 상태 | work = origin/work = `dc3ffbf`, main = origin/main = `00fece6`, clean, ahead 3 / behind 0 |
| 재검증 | lint·typecheck PASS, test 11/11, validate:quick PASS, validate:full PASS (Routes 13,141 / Sitemap 718 / Noindex 12,421, broken 0, orphan 0, metadata dup 0, indexed RED 0) |
| diff 검토 | sitemap은 등록 학교만 순회하므로 PAGE_ONLY는 들어가지 않는다. `school-national`은 항상 NOT_INDEXED. PENDING·EXCLUDED·광주/전남/세종은 nationalSchools.json에 없어 404. Production sitemap(704)과 비교해 삭제 0, 추가 14(울산·대전 pilot)뿐 |
| 반영 | `git push origin dc3ffbf:main` (fast-forward) → main = origin/main = `dc3ffbf` |
| 배포 | GitHub deployment 7484437128 (Production) success |
| Smoke | 대표 27 URL 정책 일치: 서울·경기·인천 기존 색인, 울산·대전 신규 색인, 울산·대전 시·도 hub noindex, 색인 학교, PAGE_ONLY noindex, 전국 학교 과목 URL·PENDING·광주·잘못된 slug 404. canonical·H1 1·CTA·BreadcrumbList 확인, AggregateRating 없음 |
| sitemap 전수 | Production sitemap 718 URL 전부 200·index, 5xx 0 |

## Content/Evidence Policy

- `src/data/evidence.ts`의 `EvidenceKind = OFFICIAL | FIELD_ANALYSIS | CASE_BASED`와 `EvidenceRecord`:
  - 필드: id, kind, schoolCode?, grade?, subjectSlug?, period?, title, summary, sourceKind, verifiedAt, sampleSize?
- FIELD_ANALYSIS·CASE_BASED는 ALLOWED_WITH_EVIDENCE다.
  - 화면 슬롯 `EvidenceSection`은 일치하는 기록이 있을 때만 렌더링하고, 기록이 없으면 placeholder 없이 숨긴다.
- validate:quick `School grade content + evidence`가 검사하는 것:
  - **개인정보**: 전화번호·이메일·호수·학생 이름 패턴.
  - **회사명**: 동화세상·에듀코, "자체 고객 데이터" 표현.
  - **숫자**: %·등급·점·명·배가 있으면 sampleSize와 period가 필수.
  - **verifiedAt** 형식.
- 학년×과목 entry에서 금지하는 표현:
  - 난이도, 합격, 진학실적, 등급·성적 향상, 학원, 학군, "어려워하는/자주 막히는"
  - 광고성 최고·보장·후기
  - 원문 문구는 허용한다: 채점 "최고 단계", "인권 보장 장치", "조선 후기".
- 기존 `src/data/caseStudies.ts`(학생 유형 예시 5건)는 출처·집계가 없어 evidence로 쓰지 않는다. 이번 작업에서 수정하지 않았다.

## URL Architecture

| URL | 상태 |
|---|---|
| `/region/{province}/{city}/{dong}` | 기존 + 같은 동 PAGE_ONLY 학교 목록 |
| `/school/{slug}` | 기존 (등록 학교 + 전국 PAGE_ONLY hub) + 학년 링크 |
| `/school/{slug}/{subject}` | 기존 (URL 변화 없음) |
| `/school/{slug}/{1-6}` | 신규 학년 hub |
| `/school/{slug}/{1-6}/{subject}` | 신규 학년×과목 |

- **구현 방식**:
  - Next.js는 같은 깊이에 dynamic segment를 두 개 둘 수 없다. 그래서 app 폴더 `[subject]`를 `[segment]`로 이름만 바꿨고, URL은 그대로다.
  - 숫자 1~6은 학년 hub로, 과목 slug는 기존 학교×과목 페이지로 분기한다.
  - 학년×과목은 `[segment]/[subject]`에 둔다. 과목 slug는 숫자가 아니라 충돌하지 않는다.
  - 로직은 `src/lib/schoolGrade.ts`에 있다.
- **404 조건**(NO_DATA): 아래 중 하나라도 해당하면 404다.
  - 등록되지 않은 학교(전국 PAGE_ONLY 10,134곳 포함)
  - 학교급 범위 밖 학년(초 1~6, 중·고 1~3)
  - 게시된 entry가 없는 조합
  - `/school/x/math/korean` 같은 잘못된 중첩

## Route Projection

| 방식 | 학년 | 학년×과목 | 비고 |
|---|---:|---:|---|
| 무조건 생성(전국 PAGE_ONLY 10,134 × 학년 × 5과목) | 46,611 | 233,055 | 초 5,403·중 2,751·고 1,980 기준. 대부분 내용 없는 템플릿 → 금지 |
| 채택: 게시 entry가 있는 조합만 | 12 | 54 | 정적 생성 +66 (1,923 → 1,989) |

- sitemap은 GREEN 색인 페이지만 담아 +60(718 → 778)이다. 50,000 shard 한도와 거리가 멀다.
- 전국 hub의 학년 route는 0이다. 확장은 학교별 OFFICIAL entry를 추가해야만 늘어나므로 accidental combination이 생기지 않는다.
- build는 validate:full 안에서 통과했고, 메모리·시간 이상은 없었다.

## School Hub

- 등록 학교 hub에 "학년별 과목 평가 정보" 링크를 추가했다. 학년 hub가 있는 학교에만 보인다.
- 기존 hub 색인 gate(`schoolContent` published)는 바꾸지 않았다.
  - 그래서 무거중·대덕고 hub는 이전처럼 noindex, follow다. 아래 학년×과목 페이지는 GREEN이라 색인된다.
  - hub 색인 승격은 Phase 3에서 다룬다.
- 화면에 넣지 않은 섹션: 출제 경향·자주 막히는 영역·성적대별 전략·실제 사례. 근거 데이터가 없어서다.

## Grade Pages

- **내용**: 그 학년의 게시 entry로만 만든다.
  - intro는 과목 목록과 수행평가 비중 최대·최소를 계산해 쓴다.
  - 과목 카드: 과목·과목명, 시험%·수행%, 한 줄 요약, 수행평가 과제명(시기), 학년×과목 링크.
  - 다른 학년, 학교 hub, 행정동 링크와 상담 CTA를 둔다.
- **title**: `{학교명} {n}학년 과외 · 내신 학습 - 교과설계소`. 브랜드 구분자는 기존 layout template의 " - "를 따른다.
- **색인**: GREEN 6(잠실고 1·2, 죽전고 1·2, 대덕고 1·2), AMBER 6(무거중 1~3, 계산중 1~3).
  - AMBER 6은 `src/data/schoolGradeNoindex.ts`에 두어 noindex, follow로 남긴다.
  - AMBER 원인: 두 학교는 거의 모든 과목·학년이 같은 반영 비율 구조라서, 같은 학교 학년 hub끼리 이름 마스킹 유사도가 38~45%다. 기준을 낮추지 않고 보류했다.

## Grade Subject Pages

- **데이터**: `src/data/schoolGradeSubjectContent.ts`(54 entries, planTerm "2026-2").
  - `assessments`: 원문 반영 비율 표 행. 코스마다 합계 100이며 validator가 검사한다.
  - `notes`: 2~3개. 표가 시험 준비에 갖는 의미를 사실로 설명한다.
  - `sources`: 학교알리미 평가계획.
- **화면 순서**: 학교 → 학년 → 과목 H1 → intro → 평가 기준 안내 → 반영 비율(코스별 카드, 시험/수행 구분, 시기·방법) → "시험 준비에서 먼저 볼 점" → evidence 슬롯(현재 없음) → 상담 CTA(과목·지역·동 prefill) → 같은 학년 다른 과목, 학년 hub, 학교 hub, 행정동(×과목) 링크 → 출처.
- **title**: `{학교명} {n}학년 {과목}과외 · 시험 대비 - 교과설계소`. description은 화면의 intro를 쓴다.
- **schema**: BreadcrumbList가 화면 breadcrumb과 같다. 홈 → 지역 → 시·도 → 구 → 학교급 → 학교 → n학년 → n학년 과목. 학교를 Organization으로 만들지 않았고 AggregateRating도 없다.
- **원문 추출 방식**:
  - 학교별 subagent 4개가 HWP/HWPX 셀 주소 덤프에서 뽑았고, 모든 행의 파일:줄 근거를 로그로 남겼다(세션 scratch `p2/log-*.md`).
  - 직접 표본 대조한 값은 모두 일치했다: 잠실고 공통국어2 논증문 14%, 죽전고 미적분Ⅰ 76/24점·12/12/8/8%, 계산중 2학년 역사 20/20%.
- **원문 불일치로 쓰지 않은 값**(같은 계획서 안에서 표끼리 어긋남, 로그 Excluded):
  - 대덕고 2학년 확률과 통계: 과목 전체 제외(첫 수행평가 이름이 요약표와 상세표에서 다름).
  - 시기를 생략한 항목: 무거중 2학년 영어 예술 작품 감상, 무거중 3학년 수학 도형 문제 해결, 대덕고 독서와 작문 두 번째 과제, 계산중 1학년 사회 서술 및 발표, 계산중 3학년 영어 그래프 분석 글쓰기.
  - 계산중 1학년 과학 탐구 활동의 유형별 합계(110)는 쓰지 않았다.
  - 잠실고 영어 발표와 토론의 중간고사(0%) 행은 만들지 않았다.

## Region School Links

- **연결 방식**:
  - 행정동 hub의 학교 섹션은 기존처럼 등록 학교를 학교급별로 보여주고, 그 아래 "{동}의 다른 학교"로 같은 공식 행정동 코드의 PAGE_ONLY 학교를 이름과 학교급만 보여준다.
  - 매칭은 이름이 아니라 코드로 한다.
- **규모**: 84개 동 중 14곳, 총 33곳, 한 동 최대 6곳. 12k 전체를 나열하지 않는다.
- **노출하지 않는 정보**: CONTENT_READY 여부 같은 기술 상태는 화면에 보이지 않는다.
- **링크 구조**:
  - 학교 → 지역·학년·과목
  - 학년 → 과목
  - 과목 → 학교 hub·같은 학년 다른 과목·지역·상담
- **링크 비율**: index → noindex 링크 비율은 28.9% → 28.6%다(info).

## Quality Gate

- threshold는 바꾸지 않았다(RED > 60%, AMBER > 30%).
- 새 kind 두 개를 추가했다.
  - `school-grade-subject`: intro + summary + notes를 채점한다. 같은 kind끼리뿐 아니라 기존 학교×과목 63개와 행정동×과목 420개 텍스트와도 비교한다(더 엄격). 반영 비율 합계가 100이 아니면 RED다.
  - `school-grade`: 화면 intro + 과목 요약 + 과제명을 채점한다.
- 색인 규칙은 GREEN만 index다. `checkSchoolGradeNoindexSync`가 `schoolGradeNoindex.ts`와 non-GREEN 목록이 정확히 일치하는지, indexed non-GREEN이 0인지 검사한다.
- 결과: school-grade-subject GREEN 54 / AMBER 0 / RED 0, school-grade GREEN 6 / AMBER 6 / RED 0, indexed RED 0.
- 작성 중 조정한 것:
  - 무거중 영어 2·3학년이 30.0%로 AMBER가 나와, 3학년 문장을 사실은 그대로 두고 표현만 바꿨다.
  - 금지어 정규식 오탐(원문 문구)은 광고성 문맥만 잡도록 좁혔다.

## Pilot

| 지역 | 학교 | 학교급 | 학년 hub | 학년×과목 |
|---|---|---|---|---|
| 서울 송파 잠실4동 | 잠실고 | 고 | 1·2 (GREEN) | 1학년 5 + 2학년 국·영·수 3 (2학년은 과목당 2코스) |
| 경기 용인 죽전2동 | 죽전고 | 고 | 1·2 (GREEN) | 1학년 5 + 2학년 3 |
| 인천 계양 계산4동 | 계산중 | 중 | 1·2·3 (AMBER, noindex) | 15 |
| 울산 남구 무거동 | 무거중 | 중 | 1·2·3 (AMBER, noindex) | 15 |
| 대전 유성 신성동 | 대덕고 | 고 | 1·2 (GREEN) | 1학년 5 + 2학년 3 |

- 학교급 구성: 고등 3, 중등 2.
- 원문 파일:
  - 잠실고·죽전고: 이번에 학교알리미에서 받음(HWPX/HWP).
  - 계산중: 캐시된 zip 안의 과목별 HWP.
  - 무거중·대덕고: 25차 수집본.

## 부산/대구 여부

**HOLD — 이번 batch에서는 시도하지 않았다.**

- Phase 2 pilot은 PASS다. 다만 부산·대구는 Phase 1의 울산·대전과 같은 절차가 필요하다.
  - 첫 학교 등록(`--allow-new-city`)
  - 행정동 선정
  - 중·고 평가계획 HWP 확보 확인
  - 동 hub + 5과목 작성
  - QG
- 이 작업은 별도 batch 분량이다.
- 공식 source 확보 여부를 아직 확인하지 않았으므로 "조건 미충족"이 아니라 "미착수"로 기록한다. 다음 batch 1순위로 둔다.

## Validation

| 항목 | 결과 |
|---|---|
| lint · typecheck | PASS |
| test | 11/11 PASS |
| validate:quick | PASS (새 검사 2개 포함: School grade pages GREEN-only index, School grade content + evidence) |
| validate:full | PASS — Build, Routes 13,207, Sitemap 778, Noindex 12,427, Broken 0, Metadata dup 0, Orphans 0, Search/Consult smoke |
| 로컬 smoke (next start) | 29 URL 정책 일치: 학년·학년×과목 index/noindex, 범위 밖 학년·없는 과목·잘못된 중첩·전국 hub 학년·PENDING 404, canonical self, H1 1, CTA, sitemap 일치 |
| render 390/768/1440 | 동 hub, 학교 hub, 학년 hub, 학년×과목(단일·다중 코스), PAGE_ONLY, 404 × 3폭: 가로 넘침 0, 깨진 이미지 0, 콘솔 오류 0 |

## Holds

| 항목 | 상태 |
|---|---|
| Phase 2 main 반영 / Production | **금지(지시)** — work branch checkpoint까지만 |
| 부산·대구 | 미착수 HOLD (다음 batch) |
| 광주·전남 | 공식 시·도명 `전남광주통합특별시` 처리 결정 전까지 HOLD |
| 세종 | 구조 변경 없이 HOLD |
| PENDING 159 | 404 유지, 주소 추정하지 않음 |
| FIELD_ANALYSIS · CASE_BASED | 검증 데이터 0건 — 출제 경향·자주 막히는 영역·성적대별 전략·수업 사례 섹션은 숨김. 실제 집계 자료(기간·사례 수 포함)가 생기면 `evidenceRecords`에 추가 |
| 무거중·계산중 학년 hub | AMBER noindex — 학년별로 다른 사실(시험 일정·과제 시기)을 더 실어 GREEN이 되면 해제 |
| 무거중·대덕고 학교 hub 색인 | schoolContent 미작성 → noindex 유지 |
| 학년×과목 freshness | 2026-2 평가계획 기준. 2027-04-30까지 2027학년도 1학기 공시로 재확인 |

## Phase 3

1. 부산·대구 첫 동 pilot(동 hub + 5과목 + 학교 등록), 이어 울산 신정2동·대전 노은2동.
2. 학년×과목 rollout batch. 학교알리미 HWP가 있는 기존 색인 학교부터 batch당 5~10교, 같은 brief·QG 사용.
3. 학년 hub 고유성 개선(시험 일정 타임라인 등)과 학교 hub 색인 기준 재검토.
4. 실제 GSC 성과(2026-11-24 재측정) 기반 index 승격·보류 조정.
5. FIELD_ANALYSIS·CASE_BASED 자료 확보 시 evidenceRecords 등록. 개인정보 없는 집계만, 숫자는 sampleSize·period와 함께.

---

# Phase 2 Production

| 항목 | 결과 |
|---|---|
| 시작 상태 | work = origin/work = `6c41ce0`, main = origin/main = `dc3ffbf`, clean, ahead 1 / behind 0 |
| 재검증 | lint·typecheck PASS, test 11/11, validate:quick PASS, validate:full PASS (Routes 13,207 / Sitemap 778 / Noindex 12,427, broken 0, orphan 0, metadata dup 0, indexed RED 0) |
| URL regression | Production sitemap(718)과 비교해 삭제 0, 추가 60은 전부 `/school/{slug}/{학년}(/{과목})`. 기존 학교×과목 950 route 모두 prerender. `/school/x/math`·`/school/x/1`·`/school/x/1/math` 공존, `/9`·`/1/fake`·`/fake/1/math` 404 |
| 반영 | `git push origin 6c41ce0:main` (fast-forward, force 없음) → main = origin/main = `6c41ce0` |
| 배포 | GitHub deployment 7485137200 (Production) success. 롤백 지점 `dc3ffbf`(7484437128) |
| Smoke | 5개 pilot 학교 hub·학년·학년×과목 + 오류 URL + 서울·경기·인천·울산·대전 지역 39 URL: 200/404·robots·canonical·H1·BreadcrumbList·CTA 정책 일치 |
| sitemap 전수 | 778 URL 전부 200·index, 5xx 0 |

- `/school/gyeyang-middle-school/social`은 smoke 기대값 표에 index로 잘못 적었다. 실제로는 이전부터 품질 게이트 RED로 noindex였다(`dc3ffbf`의 qualityNoindex에 있음). 회귀가 아니다.

# Busan Pilot

| 항목 | 값 |
|---|---|
| 동 | 부산 사하구 하단제2동 (`/region/busan/busan-saha/hadan2-dong`, 행정동 2638056200, 법정동 하단동) |
| 등록 | 5교: 건국고·부산여고·하단중·건국중·을숙도초 (`school-import.ts --promote 2638056200 --allow-new-city busan-saha --write`) |
| 내용 학교 | 건국고(HWPX), 하단중(HWP), 건국중(과목별 HWP, 동 비교에만 사용) |
| 원문 없음 | 부산여고(1학년 계획 PDF → OCR 금지) |

- **동 hub + 동×과목 5개**: 모두 GREEN·색인. 세 학교를 비교하는 글이다.
- **건국고**:
  - 학년 hub 1·2 (GREEN·색인)
  - 학년×과목 8: 1학년 국·영·수·과 + 사회(한국사2), 2학년 국어(독서와 작문·독서토론과 글쓰기), 수학(미적분Ⅰ), 영어(영어Ⅱ·영미문학 읽기)
- **하단중**:
  - 학년×과목 15(1~3학년 × 5과목, 2학년 사회과는 역사, 3학년은 사회+역사)
  - 학년 hub 1~3은 AMBER noindex. 1·2학년이 전 과목 같은 비율 구조라 학년 hub끼리 유사도가 38~50%다.
- **제외한 값**:
  - 건국고 통합사회2·미적분Ⅱ: 과목 전체 제외. 반영 비율 표와 세부 계획의 과제명이 다르다.
  - 건국고 영어 듣기 날짜(9/9 vs 학사일정 9/8)와 영어Ⅱ 시험 주차는 쓰지 않았다.
  - 건국고 미적분Ⅰ 단원명 칸은 다른 과목 단원이 들어가 있어 쓰지 않았다.

# Daegu Pilot

| 항목 | 값 |
|---|---|
| 동 | 대구 수성구 범어4동 (`/region/daegu/daegu-suseong/beomeo4-dong`, 행정동 2726054000, 법정동 범어동) |
| 등록 | 6교: 경신고·정화여고·동도중·경신중·정화중·대구경동초 |
| 내용 학교 | 정화여고(HWP), 경신중(과목별 HWP), 정화중(HWP/HWPX, 동 비교에만 사용) |
| 원문 없음·미사용 | 동도중(PDF), 경신고(이번 batch 범위 밖) |

- **동 hub + 동×과목 5개**: 모두 GREEN·색인.
- **정화여고**:
  - 학년 hub 1·2 (GREEN·색인)
  - 학년×과목 6: 1학년 수학·사회(통합사회2+한국사2)·과학, 2학년 국어(주제 탐구 독서)·영어(영어Ⅱ)·수학(확률과 통계+미적분Ⅱ)
- **경신중**:
  - 학년 hub 2·3 (GREEN·색인)
  - 학년×과목 7: 2학년 국어·수학·과학·사회(사회+역사), 3학년 수학·과학·사회(역사)
- **엄격 기준으로 만들지 않은 페이지**:
  - 정화여고 1학년 국어: 같은 계획서 안에서 표끼리 과제 비율이 30/10과 10/30으로 다르다.
  - 정화여고 1학년 영어: 계획서 제목이 1학기다.
  - 정화여고 2학년 화법과 언어: 과제명이 표마다 다르다.
  - 경신중 1학년 전 과목: 자유학기라 정기시험과 반영 비율이 없다.
  - 경신중 2학년 영어: 1학기 계획이 공시돼 있다.
  - 경신중 3학년 국어·영어: 받은 파일이 국어가 아니라 생활중국어 계획이다.
- 동×과목 글도 같은 기준을 적용했다. 위에서 뺀 과목, 그리고 제목이 1학기인 정화여고 공통영어2·정화중 3학년 수학의 사실은 쓰지 않았다.

# Route Delta

| 항목 | 6c41ce0 (Production) | 26차 (work) | 차이 |
|---|---:|---:|---:|
| Routes | 13,207 | 13,318 | +111 |
| Sitemap | 778 | 834 | +56 |
| Noindex | 12,427 | 12,482 | +55 |
| 전국 PAGE_ONLY hub | 10,134 | 10,123 | −11 (등록 학교로 이동, route 수 불변) |
| 학년×과목 (전부 GREEN·색인) | 54 | 90 | +36 |
| 학년 hub (색인/noindex) | 12 (6/6) | 21 (12/9) | +9 |
| 행정동 hub / 동×과목 | 84 / 420 | 86 / 430 | +2 / +10 |

- route +111의 구성:
  - busan-saha·daegu-suseong 조합 route 54: 첫 학교 등록으로 켜졌고 전부 noindex.
  - 동 12, 학년 hub 9, 학년×과목 36.
- sitemap +56의 구성:
  - 동 12, 학년×과목 36, 학년 hub 6
  - 구 hub 2(사하구·수성구, noindex → index)
- 시·도 hub 부산·대구는 `src/data/regionNoindex.ts`에 보류했다.
  - 울산·대전과 같은 이유다: 동이 1개뿐인 템플릿이다.
  - 원래 noindex였으므로 색인 → noindex 전환이 아니다.
- 예상(+120 안팎)과 일치하며 route 폭증은 없다.

# Nationwide Rollout Pipeline

한 batch는 시·도 1개, 행정동 1~3개, 학교 2~6곳이다. 순서와 명령은 다음과 같다(모두 기존 스크립트를 쓴다).

1. **동 선정**
   - `data/official/school-candidates.json`에서 같은 행정동에 중·고가 모두 있는 CONFIRMED 동을 고른다(PENDING 제외).
   - 학교 수가 적은 동을 우선한다.
2. **원문 확보**
   - 학교알리미 4-가 평가계획을 받는다(collect.mjs fetch). PDF·zip-only·NOTFOUND면 다른 동으로 바꾼다.
   - HWP/HWPX는 grid.mjs로 셀 주소 덤프를 만든다.
3. **학교 등록**
   - NEIS 단건 조회로 `.cache/official/neis/national-NN.json`을 만든다.
   - `school-import.ts --promote <dongCode> [--allow-new-city <city>]`로 dry run 후 `--write`한다.
   - candidates status/operating를 줄 단위로 동기화하고 `national-school-pages.ts --write`를 실행한다.
   - `dongs.ts`에 행을 추가한다(legalDongs는 admin-dongs.json 기준).
   - `sources.ts` SCHOOLINFO_IDS를 추가한다.
4. **콘텐츠 작성**
   - 학교별 학년×과목은 `p2/BRIEF.md` 기준으로 쓴다. 고는 1학년 5과목 + 2학년 국·영·수, 중은 1~3학년 × 5과목.
   - 동×과목 5개는 `p3/BRIEF-DONG.md` 기준으로 학교끼리 비교해 쓴다.
   - 엄격 규칙:
     - 표 합계가 100이 아니거나 표끼리 비율이 다르면 그 페이지를 만들지 않는다.
     - 과제명이 표마다 다르면 그 과목을 제외한다.
     - 제목이 1학기인 계획은 쓰지 않는다.
     - 자료 수집 상태를 설명하는 문장은 페이지에 쓰지 않는다.
5. **품질 게이트**
   - validate:quick로 확인한다. 학년×과목은 학교×과목·동×과목 텍스트와도 비교한다.
   - AMBER·RED 학년 hub는 `schoolGradeNoindex.ts`에 넣는다.
   - 동 hub가 하나뿐인 시·도 hub는 `regionNoindex.ts`에 넣는다.
6. **수치 갱신**: `baseline.ts`에 route·sitemap·noindex 변화와 구성 근거를 함께 적는다.
7. **검증**
   - validate:full을 돌린다.
   - 로컬 `next start`로 smoke(index·noindex·404)와 390/768/1440 render를 확인한다.
8. **work checkpoint commit/push**: main·Production은 별도 승인을 받는다.

- 자동화 범위:
  - 새 framework는 만들지 않았다.
  - 반복되는 판정은 validator에 들어 있다: 합계 100, 금지어, evidence 규칙, GREEN-only index sync, 전국 hub sync.
  - 원문 수집·덤프 도구(collect.mjs·grid.mjs)는 `cfb` 패키지가 필요해 아직 repo 밖(세션 scratch)에 있다. repo로 옮길지는 Phase 3 결정 사항이다(dev dependency 추가 필요).

# Next Regions

순서는 시·도별 CONFIRMED 학교 수가 많은 도시 순이다. 광주·전남·세종은 보류 정책을 그대로 따른다.

| 순서 | 시·도 | 첫 도시 후보 (CONFIRMED 학교 수) | 비고 |
|---|---|---|---|
| 1 | 경남 | 창원(224)·김해(118) | 학교 986, 중 269·고 195 |
| 2 | 충남 | 천안(133)·아산(88) | 학교 718 |
| 3 | 경북 | 포항(131)·구미(100) | 학교 911 |
| 4 | 충북 | 청주(184) | 학교 480 |
| 5 | 전북 | 전주(145)·익산(103) | 학교 741 |
| 6 | 강원 | 원주(90)·춘천(76) | 학교 629 |
| 7 | 제주 | 제주시(124)·서귀포(71) | 학교 195 |
| 보류 | 전남 | — | 광주 통합(`전남광주통합특별시`) 시·도명 문제와 묶여 있어 포함하지 않음 |

- 각 지역 첫 batch는 처음 등록하는 도시라 `--allow-new-city`가 필요하다.
- 시·도 hub는 동이 2개 이상이고 템플릿 유사도가 내려갈 때까지 보류한다.

# Holds (26차 기준 갱신)

| 항목 | 상태 |
|---|---|
| 26차(부산·대구) main 반영 / Production | **금지(지시)** — work checkpoint까지만 |
| 광주·전남 | 보류 — 시·도명 `전남광주통합특별시` 결정 전 |
| 세종 | 보류 — 구조 변경 없음 |
| PENDING 159 | 404 유지 |
| FIELD_ANALYSIS · CASE_BASED | 검증된 기록 0 — 섹션 숨김 유지, 만들지 않음 |
| 시·도 hub 울산·대전·부산·대구 | `regionNoindex.ts` 보류 (각 1개 동) |
| 학년 hub AMBER 9 | 무거중·계산중·하단중 1~3 — noindex |
| 학교 hub 색인 | 26차 신규 11교 포함 schoolContent 미작성 학교는 noindex (기존 gate 유지) |
| PDF 원문 학교 | 부산여고·동도중 등 — OCR 금지, 내용 없음 |
| 원문 수집 도구 repo 편입 | Phase 3 결정 (cfb dev dependency) |

---

# Busan/Daegu Production

| 항목 | 결과 |
|---|---|
| 시작 상태 | work = origin/work = `7aa4325`, main = origin/main = `6c41ce0`, clean, `diff --check` 문제 없음 |
| 재검증 | test 11/11, validate:full PASS (Routes 13,318 / Sitemap 834 / Noindex 12,482, broken 0, orphan 0, metadata dup 0, indexed RED 0) |
| URL regression | Production sitemap(778) 대비 삭제 0, 추가 56 |
| 반영 | `git push origin 7aa4325:main` (fast-forward) → main = `7aa4325` |
| 배포 | GitHub deployment 7485632758 success. 롤백 지점 `6c41ce0`(7485137200) |
| Smoke | 부산·대구 동 hub·동×과목·4개 학교 hub/학년/학년×과목·오류 URL + 서울·경기·인천·울산·대전 대표 32 URL: 정책 일치, 학교알리미 출처·기준 문구 표시 |
| sitemap 전수 | 834 URL 전부 200·index, 5xx 0 |

# Batch 27

경남과 강원에 각각 첫 행정동 1곳씩을 추가했다. 대상은 HWP/HWPX 평가계획이 있는 중·고교 조합이 있는 동만이다. **work only**(main·Production 반영 금지).

후보 선정 과정:

| 후보 동 | 고 | 중 | 판정 |
|---|---|---|---|
| 창원 봉암동 | 창신고 zip → 과목별 HWP | 창신중 과목별 HWP | **채택** |
| 창원 회원1동·웅천동·여좌동 | 무학여고 PDF / 웅천고 PDF / 진해고 zip | 무학여중 PDF / 웅천중 공시 없음 / 진해중 PDF | 중학교 원문 없음 |
| 원주 반곡관설동 | 영서고 zip → HWP/HWPX (원주여고·치악고 PDF) | 반곡중 HWPX (버들중 PDF) | **채택** |
| 원주 개운동·우산동·무실동 | 상지여고 zip / 진광고 PDF / 원주삼육고 PDF | 상지여중 PDF / 진광중 HWPX / 평원중 HWPX | 중·고 중 한쪽만 HWP |
| 춘천 교동·후평2동·동면 | 유봉여고 PDF / 사대부고 PDF / 강원고 HWP | 유봉여중 HWP / 봉의중 HWPX / 강원중 PDF | 중·고 중 한쪽만 HWP |

- 강원은 원주와 춘천 중 원주를 택했다. 춘천 후보는 모두 중·고 중 한쪽이 PDF였다(OCR 금지, PDF 표는 셀 대응을 보장할 수 없음).

# Gyeongnam

| 항목 | 값 |
|---|---|
| 도시·동 | 창원시 마산회원구 봉암동 (`/region/gyeongnam/changwon/bongam-dong`, 행정동 4812762000, 법정동 봉암동·양덕동) |
| 등록 | 창신고·창신중 (`--promote 4812762000 --allow-new-city changwon`) |
| 등록 제외 | 봉덕초 — 2026년 3차 공시 미확인 |
| 동 hub + 동×과목 5 | 전부 GREEN·색인 (중학교 학년과 고1 비교) |

- **창신고**
  - 학년 hub 1·2: GREEN·색인
  - 학년×과목 7:
    - 1학년: 수학(공통수학2), 영어(공통영어2), 과학(통합과학2), 사회(한국사2)
    - 2학년: 국어(화법과 언어·주제 탐구 독서), 수학(미적분Ⅰ), 영어(영어 독해와 작문·심화영어)
  - 제외:
    - 1학년 국어(공통국어2): 반영표 과제명 "진로 독서와 연계한 독서 포트폴리오 분석"과 세부 계획 "진로 독서를 확장한 심화 진로 포트폴리오 작성"이 다름
    - 기하: 반영표에 과제명 없이 "1회/2회"만 있고 성취기준도 표끼리 다름
- **창신중**
  - 학년×과목 11:
    - 1학년: 국어·수학·과학
    - 2학년: 국어·수학·영어·사회(역사)
    - 3학년: 국어·수학·영어·사회(사회+역사)
  - 학년 hub 1~3: AMBER(41~43%) noindex
  - 제외:
    - 1학년 영어: 반영표 영역 "말하기" vs 세부 "쓰기, 말하기"
    - 1학년 사회: 학습지 20% vs 30%, 과제명 불일치
    - 2·3학년 과학: "활동지2" vs "탐구보고서"
  - 시기를 생략한 항목: 1학년 국어 쓰기(9월 vs 11월), 3학년 수학 2차시험

# Gangwon

| 항목 | 값 |
|---|---|
| 도시·동 | 원주시 반곡관설동 (`/region/gangwon/wonju/bangokgwanseol-dong`, 행정동 5113067500, 법정동 관설동·반곡동) |
| 등록 | 8교: 영서고·원주여고·치악고·버들중·반곡중·관설초·단관초·봉대초 |
| 등록 제외 | 버들초·반곡초 — 공시 미확인 |
| 동 hub + 동×과목 5 | 전부 GREEN·색인 (반곡중 2·3학년과 영서고 1학년 비교) |

- **영서고**
  - 직업계 과정이 함께 있는 학교라 공통·일반 과목만 다뤘고, 학과·과정은 쓰지 않았다.
  - 학년×과목 8:
    - 1학년: 국·영·수·사(통합사회2)·과
    - 2학년: 국어(문학과 영상), 영어(세계 문화와 영어), 사회(한국사2)
  - 학년 hub 1·2: AMBER(32%) noindex. 모든 과목이 "2회고사 40% + 수행 2개 60%" 구조다.
- **반곡중**
  - 학년×과목 10: 2·3학년 × 5과목. 2학년 사회과는 역사, 3학년은 사회+역사다.
  - 학년 hub 2·3: GREEN·색인
  - 1학년: 자유학기(정기시험 없음, 수행 100%)라 페이지가 없다.
- 원주여고·치악고·버들중은 평가계획이 PDF라 내용에서 제외했다.
- 함정 기록:
  - 영서고 zip 안의 `.hwpx` 일부는 실제로는 HWP 5.0 바이너리였다. `.hwp`로 복사해 덤프했다.
  - 창신중 3학년 사회(.hwpx)는 바깥 표 한 칸 안에 모든 표가 들어 있는 구조였다.

# Route Delta (Batch 27)

| 항목 | 7aa4325 (Production) | Batch 27 (work) | 차이 |
|---|---:|---:|---:|
| Routes | 13,318 | 13,429 | +111 |
| Sitemap | 834 | 888 | +54 |
| Noindex | 12,482 | 12,539 | +57 |
| 전국 PAGE_ONLY hub | 10,123 | 10,113 | −10 (등록 학교로 이동) |
| 학년×과목 | 90 | 126 | +36 |
| 학년 hub (색인/noindex) | 21 (12/9) | 30 (16/14) | +9 |
| 행정동 hub / 동×과목 | 86 / 430 | 88 / 440 | +2 / +10 |

- **사전 예측**: +120 안팎 → 실측 +111.
- **Routes +111**: changwon·wonju 조합 54(noindex) + 동 12 + 학년 hub 9 + 학년×과목 36.
- **Sitemap +54**: 동 12 + 학년×과목 36 + 학년 hub 4 + 시 hub 2(changwon·wonju).
- **Noindex +57**: 조합 54 + AMBER hub 5 − 시 hub 2.
- **보류**: 시·도 hub 경남·강원은 `regionNoindex.ts`에 보류했다. 동이 1개뿐인 템플릿이고, 원래 noindex였다.
- **정적 생성**: 학년 경로는 게시된 entry만 생성한다. 전국 10k × 학년 × 과목은 생성하지 않는다.

# Quality Gate (누적)

| kind | GREEN | AMBER | RED | indexed RED |
|---|---:|---:|---:|---:|
| region-dong | 88 | 0 | 0 | 0 |
| region-dong-subject | 440 | 0 | 0 | 0 |
| school-grade | 16 | 14 | 0 | 0 |
| school-grade-subject | 126 | 0 | 0 | 0 |
| school-subject | 48 | 2 | 13 | 0 |

- threshold는 바꾸지 않았다(RED > 60%, AMBER > 30%).
- 학년×과목은 학교×과목·동×과목 텍스트와도 비교한다.
- AMBER 학년 hub 14개(무거중·계산중·하단중·창신중 각 1~3, 영서고 1·2)는 `schoolGradeNoindex.ts`에 있다. sync 검사 PASS.

# Validation (Batch 27)

| 항목 | 결과 |
|---|---|
| lint · typecheck | PASS |
| test | 11/11 PASS |
| build · validate:quick · validate:full | PASS — Routes 13,429 / Sitemap 888 / Noindex 12,539, broken 0, orphan 0, metadata dup 0, indexed RED 0, Search/Consult smoke PASS |
| 원문 표본 대조 | 창신고 공통수학2 30/30/20/20(과제명 일치), 반곡중 2학년 영어 35/35/10/20(선택형 85·논서술형 15점) 일치 |
| 로컬 smoke (next start) | 30 URL: 시·도 hub noindex, 시 hub·동·동×과목·GREEN 학년·학년×과목 index, AMBER 학년 noindex, 제외 페이지·전국 hub 학년·범위 밖 학년 404, canonical·H1·CTA·sitemap 일치 |
| render 390/768/1440 | 동·학교·학년·학년×과목 8페이지 × 3폭: 가로 넘침 0, 깨진 이미지 0, 콘솔 오류 0, breadcrumb·학교알리미 출처·CTA 표시. 24px 미만 터치 대상은 breadcrumb·footer 인라인 링크(기존 템플릿과 동일) |

# Nationwide Coverage

| 시·도 | 등록 학교 | 색인 학교 hub | 학년×과목 콘텐츠 학교 | 상태 |
|---|---:|---:|---:|---|
| 서울 | 250 | 20 | 1 | 운영 |
| 경기 | 162 | 9 | 1 | 운영 |
| 인천 | 68 | 18 | 1 | 운영 |
| 울산 | 7 | 0 | 1 | 운영 (시·도 hub 보류) |
| 대전 | 8 | 0 | 1 | 운영 (시·도 hub 보류) |
| 부산 | 5 | 0 | 2 | 운영 (시·도 hub 보류) |
| 대구 | 6 | 0 | 2 | 운영 (시·도 hub 보류) |
| 경남 | 2 | 0 | 2 | Batch 27 (work) |
| 강원 | 8 | 0 | 2 | Batch 27 (work) |
| 충북·충남·전북·경북·제주 | 0 | 0 | 0 | 전국 PAGE_ONLY hub만 |
| 광주·전남·세종 | — | — | — | 보류 (route 없음) |

- 합계:
  - 등록 516
  - 색인 학교 hub 47
  - 학년×과목 콘텐츠 학교 13 (학년×과목 126 전부 색인)
  - 전국 PAGE_ONLY hub 10,113 (noindex)
  - sitemap 888

# NEXT_BATCH_TEMPLATE

한 batch는 시·도 1~2개, 시·도마다 행정동 1곳, 학교 2~4곳이다. 아래 순서를 그대로 반복한다(새 framework 없이 기존 스크립트와 validator 사용).

```
0. 안전 확인   git status / fetch / rev-parse (work·origin/work·main·origin/main) — 예상과 다르면 STOP
1. 동 후보      school-candidates.json에서 시·도 첫 도시의 CONFIRMED 동 중 중·고(일반계)가 모두 있는 곳을 학교 수 오름차순으로 5~10개
2. 원문 확인    collect.mjs fetch <코드·학교명 tsv> → manifest에서 형식 확인
               채택: 같은 동에 HWP/HWPX(또는 zip 안 HWP) 중학교 1+ · 고등학교 1+
               PDF·공시 없음 → 다음 후보 (OCR 금지)
3. 등록         NEIS 단건 조회 → .cache/official/neis/national-NN.json
               school-import.ts --promote <dongCode,…> --allow-new-city <city,…>   (dry run → --write)
               sync-candidates.mjs <candidates> <codes.txt> "" --write
               national-school-pages.ts --write
               dongs.ts 행 추가(legalDongs = admin-dongs.json), sources.ts SCHOOLINFO_IDS 추가
4. 덤프         grid.mjs (zip은 collect.mjs extract 후). ".hwpx"가 HWP5면 .hwp로 복사해 덤프. 0바이트 덤프 확인
5. 콘텐츠       학교별: p2/BRIEF.md + p4/STRICT.md (고: 1학년 5과목 + 2학년 국·영·수, 중: 1~3학년 × 5과목)
               동별: p3/BRIEF-DONG.md + p4/STRICT.md (학교·학년 비교 5과목)
               append.mjs로 schoolGradeSubjectContent.ts / dongSubjectContent.ts 끝에 추가
6. 품질 게이트  validate:quick → AMBER/RED 학년 hub는 schoolGradeNoindex.ts, 동 1개 시·도 hub는 regionNoindex.ts
7. 수치         route inventory로 delta 확인(예측 ±15% 밖이면 원인 확인) → baseline.ts에 구성과 함께 기록
8. 검증         validate:full, 원문 표본 대조 2~4건, next start smoke(index/noindex/404), 390/768/1440 render
9. 문서·커밋    이 문서에 batch 절 추가 → work commit/push (main·Production은 별도 승인)
```

반복성 평가:
- 2~9단계는 기존 스크립트와 validator만으로 반복 가능함을 Batch 26·27에서 확인했다.
- 수작업으로 남는 부분은 세 가지다:
  - 2단계 형식 판정(PDF 비율이 높은 시·도는 후보를 더 받아야 함)
  - 5단계 원문 해석과 엄격 규칙 적용
  - 6단계 AMBER 보류 판단
- 원문 수집·덤프 도구(collect.mjs·grid.mjs, `cfb` 의존)와 brief 파일은 아직 세션 scratch에 있다. 다음 batch 전에 repo의 `scripts/official/`로 옮길지(dev dependency 추가) 결정이 필요하다. 옮기지 않으면 매 세션마다 이전 세션 scratch 경로를 찾아 써야 한다.

# Holds (Batch 27 기준)

| 항목 | 상태 |
|---|---|
| Batch 27 main 반영 / Production | **금지(지시)** — work checkpoint까지만 |
| 광주·전남 | 보류 — 시·도명 `전남광주통합특별시` 결정 전 |
| 세종 | 보류 — 구조 변경 없음 |
| PENDING 159 | 404 유지, 주소 추정 없음 |
| FIELD_ANALYSIS · CASE_BASED | 검증된 기록 0 — 섹션 숨김, 생성 없음 |
| 시·도 hub | 울산·대전·부산·대구·경남·강원 `regionNoindex.ts` 보류 (각 1개 동) |
| 학년 hub AMBER 14 | noindex |
| 신규 등록 학교 hub | schoolContent 미작성 → noindex (기존 gate) |
| PDF 원문 학교 | 내용 없음 (OCR 금지) |
| 원문 수집 도구 repo 편입 | 결정 필요 (cfb dev dependency) |

# 다음 Batch 순서

| Batch | 지역 | 첫 도시 후보 | 비고 |
|---|---|---|---|
| 28 | 충북 + 충남 | 청주(184) / 천안(133) | PDF 비율을 보고 2단계에서 후보를 넉넉히 받기 |
| 29 | 전북 + 경북 | 전주(145) / 포항(131) | |
| 30 | 경남 2차 + 제주 | 김해(118) 또는 창원 2번째 동 / 제주시(124) | 경남 2번째 동이 생기면 경남 시·도 hub 보류 재측정 |
| — | 광주·전남·세종 | — | 보류 해소 전 제외 |

---

# Batch 27 Production

| 항목 | 결과 |
|---|---|
| 시작 상태 | work = origin/work = `77af62c`, main = origin/main = `7aa4325`, clean |
| 재검증 | test 11/11, validate:full PASS (Routes 13,429 / Sitemap 888 / Noindex 12,539, broken 0, orphan 0, metadata dup 0, indexed RED 0) |
| URL regression | Production sitemap(834) 대비 삭제 0, 추가 54 |
| 반영 | `git push origin 77af62c:main` (fast-forward) → main = `77af62c` |
| 배포 | GitHub deployment 7486234788 success. 롤백 지점 `7aa4325`(7485632758) |
| Smoke | 경남·강원 동·학교·학년·학년×과목·오류 URL과 서울·경기·인천·울산·대전·부산·대구 대표 URL 32개: 정책 일치 |
| sitemap 전수 | 888 URL 전부 200·index, 5xx 0 |

# Batch 28–29 진행 방식

- **후보 조사**: 4개 시·도 후보 도시(청주·천안·아산·전주·포항·구미, 이어서 경주·경산·안동·김천·영주·영천)에서 중·고가 모두 있는 CONFIRMED 동을 학교 수가 적은 순서로 골랐다. 대상은 168개 학교다.
- **원문 수집**: 학교알리미 원문은 순차로 수집했다. 수집 도구가 manifest 하나를 쓰므로 병렬 수집은 하지 않았다.
- **형식 판정**: 파일 시그니처로 HWP/HWPX/PDF를 판정하는 `classify.mjs`를 썼다. zip 내부와 확장자가 잘못된 파일까지 판정한다.
- **원문 추출**: 학교 8곳과 동 4곳을 Sonnet subagent 10개에 병렬로 맡겼다.
- **통합**: 데이터 파일은 전북 → 경북 → 충북 → 충남 순서로 한 번에 한 곳씩 통합했다(`integrate.sh`). 순서는 원문 추출이 끝난 순서를 따랐고, 같은 파일을 동시에 고치지 않는다는 원칙은 지켰다.
- **시·도별 게이트**: 통합할 때마다 content 검사, 품질 게이트, noindex sync를 실행했다. 마지막에 validate:full을 돌렸다.
- **엄격 규칙 판정 기준**(이번 batch에서 명확히 함):
  - **제외**: 계획서 표지·학기 칸·평가 방침에 1학기 표기가 있는 경우(일신여중 영어, 전주신일중 영어), 시험 행이나 진도표 학기 표기가 1학기로 어긋난 경우(일신여중 수학, 병천중 3학년 국어).
  - **사용**: 범용 절 제목에만 남은 "1학기"(일신여중 국어 "1학기 성취율과 성취도").
  - **같은 과제로 인정**: 과제명이 접미어나 평가 방법 표기만 다른 경우("…발표 활동"↔"…발표하기", "쓰기"↔"논술·쓰기", "듣기평가"↔"듣기").
  - **제외**: 동사·대상이 달라 평가 범위가 바뀌는 경우("평가하기"↔"분석하기", "말하기"↔"쓰기, 말하기").
  - **학과별 계획**: 학과별로 따로 공시한 계획(병천고 미용과·조리과)은 "N학년 과목" 페이지에 쓰지 않는다. 대상이 학년 전체인 계획만 쓴다.

# Batch 28 Chungbuk

| 항목 | 값 |
|---|---|
| 도시·동 | 청주시 상당구 탑대성동 (`/region/chungbuk/cheongju/tapdaeseong-dong`, 4311162000, 법정동 탑동·대성동) |
| 선택 이유 | 청주 후보 6개 동 가운데 중·고 HWP 조합이 있는 동은 탑대성동·옥산면·금천동·모충동이었다. 학교가 2곳뿐인 가장 작은 동을 택했다 |
| 등록 | 일신여고·일신여중 |
| 동 hub + 동×과목 | hub + 국어·사회·과학 3 (GREEN·색인). 영어는 일신여중 영어가 1학기 표기, 수학은 일신여중 수학 제외로 비교 대상이 없어 만들지 않았다 |
| 일신여고 | 학년 hub 1·2 (GREEN), 학년×과목 8 (1학년 5, 2학년 국어·수학·영어) |
| 일신여중 | 학년 hub 2·3 (GREEN), 학년×과목 5 (2학년 국어·사회(역사①), 3학년 국어·사회(사회+역사②)·과학). 1학년은 자유학기, 2학년 과학은 과제명 불일치 |

# Batch 28 Chungnam

| 항목 | 값 |
|---|---|
| 도시·동 | 천안시 동남구 병천면 (`/region/chungnam/cheonan/byeongcheon-myeon`, 4413136000, 법정동 병천면과 9개 리) |
| 선택 이유 | 천안 후보 가운데 중·고 HWP 조합은 병천면·원성1동, 아산은 온양5동이었다. 지시서가 천안을 우선해 학교가 가장 적은 병천면을 택했다 |
| 등록 | 병천고·병천중·병천초 |
| 동 hub + 동×과목 | hub + 수학·사회·과학 3 (GREEN·색인). 국어는 1·2학년 구조가 같아 실질 note가 3개에 못 미쳤고, 영어는 비교 대상이 남지 않았다 |
| 병천고 | 학년 hub 1 (GREEN), 학년×과목 2 (1학년 사회·과학) |
| 병천중 | 학년 hub 1·2 AMBER(45%) noindex / 3 GREEN, 학년×과목 12 |

- **병천고 범위 축소**: 병천고는 학과별 계획을 따로 공시하는 학교다. 학년 전체 대상인 1학년 통합사회2·통합과학2만 사용했다. 학과·학교 유형은 어디에도 쓰지 않았다.
- **병천고 1학년 수학 제외**: 평가 방침 60/40과 반영표 40/60이 달라 제외했다.
- **병천중에서 제외한 과목**:
  - 2학년 수학·3학년 역사: 과제명 불일치
  - 3학년 영어: 비율 합 80%
  - 3학년 국어: 시험 행이 1학기로 표기됨

# Batch 29 Jeonbuk

| 항목 | 값 |
|---|---|
| 도시·동 | 전주시 완산구 노송동 (`/region/jeonbuk/jeonju/nosong-dong`, 5211160500, 법정동 중·남·서노송동) |
| 선택 이유 | 전주 후보 가운데 중·고 HWP 조합은 평화1동·노송동이었다. 평화1동은 완산중이 PDF라 HWP 학교가 3곳인 노송동을 택했다 |
| 등록 | 전주고·전주제일고·전주신일중·전주동초·전주풍남초 |
| 동 hub + 동×과목 | hub + 수학·사회·과학 3 (GREEN·색인). 국어는 동 비교글 작성 시점에 전주고 공통국어2를 보수적으로 제외했다(학교 페이지에서는 접미어 차이로 인정). 영어는 신일중 1학기 표기로 만들지 않았다 |
| 전주고 | 학년 hub 1·2 (GREEN), 학년×과목 8 |
| 전주신일중 | 학년×과목 7. 학년 hub 2·3은 RED(61%)라 noindex (`schoolGradeNoindex.ts`, index 금지) |

- 전주고에서 과목 전체를 뺀 것: 한국사2(평가하기/분석하기)와 영어Ⅰ(과제명 불일치), 그리고 기본수학2(비율 표끼리 다름).
- 전주신일중에서 뺀 것: 영어 전 학년(1학기 표기), 1학년(자유학기).

# Batch 29 Gyeongbuk

| 항목 | 값 |
|---|---|
| 도시·동 | 안동시 서구동 (`/region/gyeongbuk/andong/seogu-dong`, 4717058500, 법정동 8개) |
| 선택 이유 | 포항 6개 동·구미 6개 동은 모두 중·고 중 한쪽이 PDF였다. 경주·경산·안동·김천·영주·영천 24개 동을 추가로 받았고, 중·고 HWP 조합은 안동 서구동·영주1동·영천 금호읍뿐이었다. 그중 도시 규모가 큰 안동을 택했다 |
| 등록 | 안동여고·경안고·안동서부초·복주여중·안동여중·경안여중 (경안고·복주여중·안동여중은 PDF라 내용 없음) |
| 동 hub + 동×과목 | hub + 5과목 (GREEN·색인) |
| 안동여고 | 학년 hub 1·2 (GREEN), 학년×과목 8. 1학년 과학은 통합과학2를 과제명 불일치로 빼고 과학탐구실험2로 만들었다. 2학년 국어는 문학(주제탐구독서는 방침과 표가 다름) |
| 경안여중 | 학년 hub 1~3 (GREEN), 학년×과목 11 |

- 경안여중에서 뺀 것: 1학년 국어·수학·3학년 과학(과제명 불일치), 1학년 사회(합 90%), 3학년 역사(반영표 없음).
- 경안여중 2학년 국어 "광고 평가하기"는 평가 방법이 표마다 달라 method를 표시하지 않았다.

# National Coverage

| 시·도 | 등록 학교 | 색인 학교 hub | 학년×과목 콘텐츠 학교 | 상태 |
|---|---:|---:|---:|---|
| 서울 | 250 | 20 | 1 | Production |
| 경기 | 162 | 9 | 1 | Production |
| 인천 | 68 | 18 | 1 | Production |
| 울산 | 7 | 0 | 1 | Production (시·도 hub 보류) |
| 대전 | 8 | 0 | 1 | Production (시·도 hub 보류) |
| 부산 | 5 | 0 | 2 | Production (시·도 hub 보류) |
| 대구 | 6 | 0 | 2 | Production (시·도 hub 보류) |
| 경남 | 2 | 0 | 2 | Production (시·도 hub 보류) |
| 강원 | 8 | 0 | 2 | Production (시·도 hub 보류) |
| 충북 | 2 | 0 | 2 | work (Batch 28) |
| 충남 | 3 | 0 | 2 | work (Batch 28) |
| 전북 | 5 | 0 | 2 | work (Batch 29) |
| 경북 | 6 | 0 | 2 | work (Batch 29) |
| 제주 | 0 | 0 | 0 | 전국 PAGE_ONLY hub만 |
| 광주·전남·세종 | — | — | — | 보류 (route 없음) |

- 운영 시·도는 13곳이다. Production 9곳, work 4곳.
- 학교 수:
  - 등록 532
  - 학년×과목 콘텐츠가 있는 학교 21
  - 전국 PAGE_ONLY hub 10,097 (noindex)
- 페이지 수(work 기준):
  - 색인 URL 984
  - noindex route 12,647

# Route Delta (Batch 28–29)

| 항목 | 77af62c (Production) | 28–29 (work) | 차이 |
|---|---:|---:|---:|
| Routes | 13,429 | 13,633 | +204 |
| Sitemap | 888 | 984 | +96 |
| Noindex | 12,539 | 12,647 | +108 |
| 전국 PAGE_ONLY hub | 10,113 | 10,097 | −16 |
| 학년×과목 | 126 | 187 | +61 |
| 학년 hub (GREEN/비GREEN) | 30 (16/14) | 47 (29/18) | +17 |
| 행정동 hub / 동×과목 | 88 / 440 | 92 / 454 | +4 / +14 |

- **사전 예측**: +240 안팎(최대치 기준) → 실측 +204.
- **Routes +204**: 시 조합 route 108(noindex) + 동 4 + 동×과목 14 + 학년 hub 17 + 학년×과목 61.
- **Sitemap +96**: 동 18 + 학년×과목 61 + GREEN 학년 hub 13 + 시 hub 4(청주·천안·전주·안동).
- **Noindex +108**: 조합 108 + 비GREEN 학년 hub 4 − 시 hub 4.
- **보류**: 시·도 hub 충북·충남·전북·경북은 `regionNoindex.ts`에 보류했다. 1개 동 템플릿이고, 원래 noindex였다.
- **정적 생성**: 학년 경로는 게시된 entry만 생성한다. 전국 10k × 학년 × 과목은 생성하지 않는다.

# Quality Gate (누적, Batch 29 기준)

| kind | GREEN | AMBER | RED | indexed RED |
|---|---:|---:|---:|---:|
| region-dong | 92 | 0 | 0 | 0 |
| region-dong-subject | 454 | 0 | 0 | 0 |
| school-grade | 29 | 16 | 2 | 0 |
| school-grade-subject | 187 | 0 | 0 | 0 |
| school-subject | 48 | 2 | 13 | 0 |

- threshold는 바꾸지 않았다(RED > 60%, AMBER > 30%).
- 비GREEN 학년 hub 18개는 `schoolGradeNoindex.ts`에 있고 sync 검사 PASS다. RED 2개는 전주신일중 2·3학년이다.
- 학년 hub가 AMBER·RED가 되는 원인은 같다. 같은 학교의 과목·학년 구조가 거의 같으면 hub끼리 유사도가 올라간다. 학년×과목 페이지는 과제 내용이 달라 모두 GREEN이다.

# Validation (Batch 28–29)

| 항목 | 결과 |
|---|---|
| 시·도별 게이트 | 전북·경북·충북·충남 통합 때마다 content·품질 게이트·noindex sync 실행. 전북·경북 뒤에는 validate:quick까지 PASS |
| lint · typecheck · test | PASS · PASS · 11/11 |
| build · validate:quick · validate:full | PASS — Routes 13,633 / Sitemap 984 / Noindex 12,647, broken 0, orphan 0, metadata dup 0, indexed RED 0, Search/Consult smoke PASS |
| 원문 표본 대조 | 전주고 공통수학2 30/30/10/10/20(과제명·배점 일치), 안동여고 공통국어2 25×4(선다형 100점, 과제명 일치) |
| 로컬 smoke | 38 URL: 시·도 hub noindex, 시·동·동×과목·GREEN 학년·학년×과목 index, AMBER/RED 학년 noindex, 만들지 않은 과목·학년 404, 전국 PAGE_ONLY noindex, 기존 URL index |
| render | 4개 시·도 × (동·학교·학년·학년×과목) 16화면 × 390·1440 + 1세트 768 = 36건: 가로 넘침 0, 깨진 이미지 0, 콘솔 오류 0, H1 1, breadcrumb·CTA·canonical self |

# Next Batch Candidates

| Batch | 지역 | 미리 확인된 것 | 비고 |
|---|---|---|---|
| 30 | 제주 + 경남 2차 + 강원 2차 | 이번 batch에서 원문을 받지 않음 | NEXT_BATCH_TEMPLATE 1~2단계부터 |
| — | 충남 2차 | 천안 원성1동(천안중앙고·천안제일고·천안중·천성중 모두 HWP), 아산 온양5동(온양용화고·온양중 HWP) | 원문 캐시 있음 |
| — | 충북 2차 | 청주 금천동(금천고·금천중·청주동중 HWP), 옥산면(양업고·옥산중 HWP) | 원문 캐시 있음 |
| — | 전북 2차 | 전주 평화1동(완산여고·전주남중 HWP) | 원문 캐시 있음 |
| — | 경북 2차 | 영주1동(영광여고·영광여중 HWP), 영천 금호읍(포은고·금호여중 HWP) | 원문 캐시 있음 |

- 같은 시·도에 두 번째 동이 생기면 그 시·도 hub의 보류를 다시 측정한다.

# Holds (Batch 29 기준)

| 항목 | 상태 |
|---|---|
| Batch 28–29 main 반영 / Production | **금지(지시)** — work checkpoint까지만 |
| 광주·전남 | 보류 — 시·도명 `전남광주통합특별시` 결정 전 |
| 세종 | 보류 — 구조 변경 없음 |
| PENDING 159 | 404 유지 |
| FIELD_ANALYSIS · CASE_BASED | 검증된 기록 0 — 섹션 숨김, 생성 없음 |
| 시·도 hub | 울산·대전·부산·대구·경남·강원·충북·충남·전북·경북 `regionNoindex.ts` 보류 (각 1개 동) |
| 비GREEN 학년 hub 18 | noindex (RED 2 포함) |
| 신규 등록 학교 hub | schoolContent 미작성 → noindex (기존 gate) |
| 학과별 계획 학교 | 병천고는 학년 전체 대상 계획만 사용 |
| 원문 수집 도구 repo 편입 | 결정 필요 (cfb dev dependency) |

---

# Batch 28–29 Production

| 항목 | 결과 |
|---|---|
| 시작 상태 | work = origin/work = `9c3a863`, main = origin/main = `77af62c`, clean, ahead 1 / behind 0, `diff --check` 문제 없음 |
| 재검증 | lint·typecheck PASS, test 7/7(`operating.test.ts`·`national-school-pages.test.ts`), validate:full PASS (Routes 13,633 / Sitemap 984 / Noindex 12,647, broken 0, orphan 0, metadata dup 0, indexed RED 0, Search/Consult smoke PASS) |
| 추가 확인 | Production sitemap(888) 대비 삭제 0·추가 96, sitemap 중복 0, slug 중복 0, school code 중복 0(등록 412곳이 official code 보유, 등록∩전국 hub 0) |
| 반영 | `git push origin 9c3a863:main` (fast-forward, force 없음) → main = origin/main = `9c3a863` |
| 배포 | GitHub deployment 7508266275 (Production) success. 롤백 지점 `77af62c`(7486234788) |
| Smoke | 122 URL(충북·충남·전북·경북 신규 동·학교·학년·학년×과목, 서울·경기·인천·울산·대전·부산·대구·경남·강원 대표, 404 케이스): 200/404·robots·canonical·H1 1·BreadcrumbList·출처·CTA 정책 일치, BAD 0, 5xx 0 |
| sitemap 전수 | 984 URL 전부 200·index, 888 손실 0·추가 96 |
| robots.txt | `Allow: /`, `Disallow: /api/`, sitemap 선언 정상 |

# Batch 30 Jeju

**work only** (main·Production 반영 안 함).

| 항목 | 값 |
|---|---|
| 도시·동 | 제주시 한림읍 (`/region/jeju/jeju-si/hanrim-eup`, 행정동 5011025000, 법정동 한림읍 + 15개 리) |
| 구조 | 기존 province → city → 동(읍·면 포함) 모델에 그대로 들어간다(병천면 선례). `--allow-new-city jeju-si`만 사용했고 URL 구조 변경은 없다 |
| 등록 | 한림고·한림항공우주고·한림중·한림여중 (한림초 등 초등학교 5곳은 2026년 3차 공시 미확인이라 PAGE_ONLY 유지, 한림초비양분교장 제외) |
| 동 hub + 동×과목 | hub + 5과목 GREEN·색인 |
| 한림고 | 학년×과목 7 (1학년 국·수·사회(통합사회2+한국사2)·과학, 2학년 국·수·영). 학년 hub 2학년 GREEN, 1학년 AMBER(31%) noindex |
| 한림항공우주고 | 학년×과목 8 (1학년 5, 2학년 국·영·수). 학년 hub 1·2학년 AMBER(36%) noindex. 학과·과정 전용 계획은 쓰지 않았다 |
| 한림여중 | 학년×과목 13 (1학년 수·사·과·영, 2학년 국·사회(역사)·수·과, 3학년 5). 학년 hub 1~3 AMBER(33%) noindex |

**동 선정 과정** (선정 기준: mapping CONFIRMED, 중·고 같은 행정동, 2026 최신 평가계획, HWP/HWPX 판독, 고유성):

| 후보 | 고 | 중 | 판정 |
|---|---|---|---|
| 제주시 용담2동 | 사대부고 PDF | 사대부중 HWP | 고 PDF |
| 제주시 연동 | 남녕고 PDF | 제주중앙중 HWP, 제주서중 PDF | 고 PDF |
| 제주시 이도2동 | 제주중앙여고 (6개 중 HWP 1개) | 제주제일중·제주동여중 PDF | 중 PDF |
| 제주시 화북동 | 오현고 PDF | 제주동중 HWP, 오현중 PDF | 고 PDF |
| 제주시 노형동 | 제주제일고·제주고 PDF | 한라중·노형중 PDF | 전부 PDF |
| 제주시 아라동 | 제주여고·제주중앙고·영주고 HWPX | 아라중·신성여중·제주여중·탐라중 전부 PDF | 중 PDF |
| 제주시 한경면 | 한국뷰티고 HWP | 저청중 HWP, 고산중·신창중 공시 미확인 | 특성화고 위주 |
| 제주시 조천읍 | 함덕고 HWPX | 함덕중 1파일(HWPX)·조천중 PDF | 보류(대체 후보) |
| 제주시 애월읍 | 제주외고(특목) HWPX, 애월고 PDF | 애월중 HWP, 신엄중·귀일중 PDF | 보류 |
| 제주시 구좌읍 | 세화고 공시 미확인 | 김녕중·세화중 PDF | 제외 |
| **제주시 한림읍** | 한림고·한림항공우주고 HWPX | 한림여중 HWP (한림중 PDF) | **채택** |

서귀포시는 제주시에서 후보가 나와 검토하지 않았다. 제주 시·도 hub는 동이 1개라 `regionNoindex.ts`에 보류로 추가했다(원래 noindex).

# Chungbuk Wave 2

| 항목 | 값 |
|---|---|
| 동 | 청주시 상당구 금천동 (`geumcheon-dong`, 4311168000, 법정동 금천동) — 두 번째 동 |
| 등록 | 금천고·금천중·청주동중 (금천초·동주초는 공시 미확인으로 PAGE_ONLY 유지) |
| 동 hub + 동×과목 | hub + 5과목 GREEN·색인 |
| 금천고 | 학년×과목 8 (1학년 국·수·영·사회(한국사2)·과학, 2학년 국·영·수). 학년 hub 1·2 GREEN |
| 금천중 | 학년×과목 8 (2학년 국·영·수·과학, 3학년 국·영·사회(사회+역사)·과학). 학년 hub 2·3 GREEN. 1학년은 자유학기 |
| 청주동중 | 학년×과목 10 (2·3학년 × 5과목). 학년 hub 2·3 GREEN. 1학년은 자유학기 |
| 제외 | 금천중 3학년 수학·2학년 사회(진도표 과제명이 반영표·세부 기준과 평가 대상이 다르고, 사회는 평가 횟수 2에 시기 1개), 금천고 통합사회2(학년 표기 불일치), 2학년 독서토론과 글쓰기(5반 한정)·세계 문화와 영어 |

# Chungnam Wave 2

| 항목 | 값 |
|---|---|
| 동 | 천안시 동남구 원성1동 (`wonseong1-dong`, 4413153000, 법정동 문화동·원성동·유량동) — 두 번째 동 |
| 등록 | 천안중앙고·천안제일고·천안중·천성중 |
| 동 hub + 동×과목 | hub + 5과목 GREEN·색인 |
| 천안중앙고 | 학년×과목 8 (1학년 5, 2학년 국·수·영). 학년 hub 2학년 GREEN, 1학년 AMBER(31%) noindex |
| 천안중 | 학년×과목 15. 학년 hub 1~3 AMBER(36~41%) noindex |
| 천성중 | 학년×과목 15 중 10 색인 + 5 AMBER noindex(1·2학년 수학/과학, 3학년 과학, 33~39%). 학년 hub 1~3 AMBER(39~41%) noindex |
| 천안제일고 | 공시된 84개 파일이 모두 학과별 계획이라 쓸 수 있는 페이지 0 (병천고 선례). 학교 hub만 등록 |
| 제외 | 천안중앙고 2학년 기하(6·7반 한정, 수행 과제명·비율이 표마다 다름) |

# Jeonbuk Wave 2

| 항목 | 값 |
|---|---|
| 동 | 전주시 완산구 평화1동 (`pyeonghwa1-dong`, 5211169100, 법정동 평화동1가) — 두 번째 동 |
| 등록 | 완산여고·전주남중·완산중 (전주평화초는 공시 미확인) |
| 동 hub + 동×과목 | hub + 5과목 GREEN·색인 |
| 완산여고 | 학년×과목 6 (1학년 5과목, 2학년 수학(직무수학)). 학년 hub 1학년 GREEN, 2학년은 카드 1개(실질 note 1)라 AMBER noindex |
| 전주남중 | 학년×과목 8 (2학년 국·영·수·사회(역사), 3학년 국·영·수·과학). 학년 hub 2·3 AMBER(41%) noindex. 1학년은 자유학기 |
| 완산중 | 평가계획이 PDF라 내용 없음(OCR 금지). 학교 hub만 등록 |
| 제외 | 완산여고 한국사2·무역영어(표끼리 비율 불일치)·직무의사소통(진도표 1차 정기시험 행 불일치, 배점 표기 오기 추정), 전주남중 3학년 사회(수행 세부계획에 `학기 1 / 2025` 표기가 남아 있는 지난해 서식)·2학년 과학 |

# Gyeongbuk Wave 2

| 항목 | 값 |
|---|---|
| 동 | 영주시 영주1동 (`yeongju1-dong`, 4721055000, 법정동 영주동·하망동) — 영주 첫 동, 경북 두 번째 동 |
| 등록 | 영광여고·영광여중 (`--allow-new-city yeongju`; 영주초 공시 미확인, 영광중은 학교알리미 검색 결과 없음) |
| 동 hub + 동×과목 | hub + 4과목(영어·수학·사회·과학) GREEN·색인. 국어는 영광여고 국어가 제외돼 비교 대상이 없어 만들지 않았다 |
| 영광여고 | 학년×과목 6 (1학년 수·영·사회(한국사2)·과학, 2학년 수·영). 학년 hub 1·2 GREEN |
| 영광여중 | 학년×과목 12 (1학년 국·영·사회·과학, 2학년 국·사회(역사)·수·영, 3학년 국·영·수·과학). 학년 hub 1학년 GREEN, 2·3학년 AMBER(37%) noindex |
| 제외 | 영광여고 국어 1·2학년(반영표와 세부 계획의 과제명이 다르고 시기도 어긋남)·통합사회2(계획서 제목이 2025학년도)·과학탐구실험2, 영광여중 1학년 수학·2학년 과학·3학년 사회·역사 |

# Extraction Notes (Batch 30)

- 학교별 Sonnet subagent 14개가 원문(HWP/HWPX 셀 주소 덤프)에서 추출하고 행마다 파일:줄 근거를 로그에 남겼다. 동×과목 5개 agent는 **최종 확정된 학교 frag만** 근거로 썼다.
- 통합 단계에서 `STRICT` 규칙을 다시 적용해 agent가 남긴 경계 사례를 추가로 뺐다: 한림고 1학년 영어(intro와 note가 서로 모순)·한림고 2학년 영어 note 1개, 한림여중 1학년 국어·2학년 영어, 금천중 3학년 수학·2학년 사회, 전주남중 3학년 사회, 완산여고 2학년 국어.
- 원문 표본 대조 3건 일치: 한림항공우주고 1학년 수학 25/25/20/30(시기 10월 2주·12월 2주·11월·8월~12월), 완산여고 공통영어2 시험 20×2·듣기/말하기/쓰기 20씩, 천안중 3학년 과학 30/30/20/20(시기 포함).
- 수집 도구(`collect.mjs`·`dump`·`classify`·`integrate.sh`)는 세션 scratch의 것을 썼고 repo에 `cfb`를 추가하지 않았다. `package.json`·lock 변경 없음.

# Province Hub Re-evaluation

2번째 동이 생긴 충북·충남·전북·경북과 첫 동이 생긴 제주를 다시 측정했다. **동이 늘었다는 이유만으로 index 승격하지 않는다.**

| 시·도 | 시·군·구 | 동 링크 | 동×과목 | 등록 학교 | 가장 비슷한 시·도 (마스킹 유사도) | 판정 |
|---|---:|---:|---:|---:|---|---|
| 충북 | 11 | 2 | 8 | 5 | 전북 97% | noindex 유지 |
| 충남 | 15 | 2 | 8 | 7 | 전북 99% | noindex 유지 |
| 전북 | 14 | 2 | 8 | 8 | 충남 99% | noindex 유지 |
| 경북 | 22 | 2 | 9 | 8 | 강원 94% | noindex 유지 |
| 제주 | 2 | 1 | 5 | 4 | 대전 97% | noindex(신규 보류) |

- 측정 방법: `src/app/region/[province]/page.tsx`가 만드는 텍스트(히어로 문단·동네 요약 문단·동 링크·시군구·학년·과목 링크·CTA)를 같은 마스킹·`tokenSimilarity`로 계산했다. 렌더 crawl이 아니라 페이지 소스 기반 계산이다(서버 기동 불가, 아래 Validation 참고).
- 근거: 본문 틀이 시·도마다 같아서 이름만 마스킹하면 94~99%다. Quality Gate의 RED 기준(60%)을 크게 넘고, 새로 생긴 사실은 동 링크 2개와 숫자 3개뿐이다. 이미 색인 중인 서울·경기·인천 hub(88~92%)는 QG 대상이 아니라서 그대로 두었다.
- 시·도 hub는 동네 요약 문단에서 운영 행정동 수·학교 수·동×과목 페이지 수와 색인된 동 링크를 이미 데이터에서 계산해 보여준다. 새 사실이 없는 장문은 추가하지 않았다.
- 승격 조건: 시·도 hub 템플릿의 고유 본문을 만드는 별도 개선(Phase 3 과제) 또는 GSC 성과가 생긴 뒤.

# National Coverage

실제 데이터(`schools`·`dongs`·`schoolGradeSubjectContents`·route inventory)에서 계산했다.

| 시·도 | 등록 학교 | 학년×과목 콘텐츠 학교 | 학년×과목 페이지 | 색인 학교 hub | 동 | 색인 동×과목 | 시·도 hub | 환경 |
|---|---:|---:|---:|---:|---:|---:|---|---|
| 서울 | 250 | 1 | 8 | 20 | 46 | 230 | index | Production |
| 경기 | 162 | 1 | 8 | 9 | 26 | 130 | index | Production |
| 인천 | 68 | 1 | 15 | 18 | 10 | 50 | index | Production |
| 대전 | 8 | 1 | 8 | 0 | 1 | 5 | noindex | Production |
| 강원 | 8 | 2 | 18 | 0 | 1 | 5 | noindex | Production |
| 전북 | 8 | 4 | 29 | 0 | 2 | 8 | noindex | Production + work(평화1동) |
| 경북 | 8 | 4 | 37 | 0 | 2 | 9 | noindex | Production + work(영주1동) |
| 울산 | 7 | 1 | 15 | 0 | 1 | 5 | noindex | Production |
| 충남 | 7 | 5 | 52 | 0 | 2 | 8 | noindex | Production + work(원성1동) |
| 대구 | 6 | 2 | 13 | 0 | 1 | 5 | noindex | Production |
| 부산 | 5 | 2 | 23 | 0 | 1 | 5 | noindex | Production |
| 충북 | 5 | 5 | 39 | 0 | 2 | 8 | noindex | Production + work(금천동) |
| 제주 | 4 | 3 | 28 | 0 | 1 | 5 | noindex | work |
| 경남 | 2 | 2 | 18 | 0 | 1 | 5 | noindex | Production |
| **합계** | **548** | **34** | **311** | **47** | **97** | **478** | | |

- 운영 시·도 14곳: Production 13곳(서울·경기·인천·부산·대구·대전·울산·경남·강원·충북·충남·전북·경북), work 전용 1곳(제주). 광주·전남·세종은 보류.
- 학교: 등록 548(이전 532), 전국 PAGE_ONLY hub 10,081(이전 10,097), 학년×과목 콘텐츠 학교 34(이전 21), CONTENT_READY(색인 학교 hub) 47(변화 없음 — 신규 16교는 schoolContent가 없어 학교 hub는 noindex).
- 페이지: 색인 URL(sitemap) 1,146, noindex route 12,722. Production은 984 / 12,647.
- PENDING 159는 그대로 404.

# Route Delta (Batch 30)

| 항목 | 9c3a863 (Production) | Batch 30 (work) | 차이 |
|---|---:|---:|---:|
| Routes | 13,633 | 13,870 | +237 |
| Sitemap | 984 | 1,146 | +162 |
| Noindex | 12,647 | 12,722 | +75 |
| 전국 PAGE_ONLY hub | 10,097 | 10,081 | −16 (등록 학교로 이동, route 수 불변) |
| 학년×과목 | 187 | 311 | +124 (색인 119 / AMBER 5) |
| 학년 hub | 47 | 77 | +30 (GREEN 12 / AMBER 18) |
| 행정동 hub / 동×과목 | 92 / 454 | 97 / 478 | +5 / +24 |

- 동별 delta (route / sitemap / noindex): 제주 +68 / +36 / +32, 청주 +38 / +38 / 0, 천안 +52 / +40 / +12, 전주 +24 / +21 / +3, 영주 +55 / +27 / +28.
- Routes +237 = 새 도시 조합 54(jeju-si·yeongju, noindex) + 동 5 + 동×과목 24 + 학년 hub 30 + 학년×과목 124.
- Sitemap +162 = 동 5 + 동×과목 24 + 학년×과목 119 + GREEN 학년 hub 12 + 시 hub 2(jeju-si·yeongju).
- Noindex +75 = 조합 54 + AMBER 학년 hub 18 + AMBER 학년×과목 5 − 시 hub 2.
- **사전 예측**: +240 안팎 → 실측 +237. route 폭증 없음.
- Production sitemap(984) 대비 **삭제 0**, 추가 162(시 hub 2·동 5·동×과목 24·학년×과목 119·학년 hub 12).

# Quality Gate (누적, Batch 30 기준)

| kind | GREEN | AMBER | RED | indexed RED |
|---|---:|---:|---:|---:|
| region-dong | 97 | 0 | 0 | 0 |
| region-dong-subject | 478 | 0 | 0 | 0 |
| school-grade | 41 | 34 | 2 | 0 |
| school-grade-subject | 306 | 5 | 0 | 0 |
| school-subject | 48 | 2 | 13 | 0 |

- threshold는 바꾸지 않았다(RED > 60%, AMBER > 30%).
- **새 학교가 기존 색인 hub를 AMBER로 만든 사례 2건**을 막았다. 한림항공우주고 2학년 hub와 청주동중 2학년 hub가 각각 `ilsinyeoja-high-school/2`(31%), `jukjeon-high-school/1`(31%)의 가장 가까운 이웃이 되면서 이미 색인 중인 두 hub가 임계값을 넘었다. 이 URL을 noindex로 내리면 색인 URL 손실이라, 새 학교 entry의 `summary` 문형(사실은 그대로)을 바꿔 유사도를 낮췄다. 두 hub는 29%·27%로 GREEN을 유지했다.
- 같은 방식으로 청주동중 hub 2·3, 한림항공우주고 수학 2건, 금천 쪽 hub를 GREEN으로 만들었다. 그래도 AMBER인 새 페이지는 `schoolGradeNoindex.ts`에서 noindex로 보류한다(학년 hub 18, 천성중 학년×과목 5). `checkSchoolGradeNoindexSync` PASS.
- 학년 hub가 AMBER가 되는 원인은 이전과 같다: 같은 학교의 과목·학년 구조가 거의 같으면 hub끼리 유사도가 올라간다. 학교 수가 늘수록 기존 hub의 이웃이 늘어 이 현상이 반복될 수 있어, hub 도입 문장 템플릿 개선이 필요하다(Next Priority).

# Validation (Batch 30)

| 항목 | 결과 |
|---|---|
| lint · typecheck · test | PASS · PASS · 7/7 |
| 동별 validate:quick | 제주·청주·천안·전주·영주 통합 직후마다 실행, 마지막 실행 PASS (indexed RED 0, `School grade pages GREEN-only index` PASS, `Plan freshness 2026-2` 478) |
| build | PASS |
| Routes · Sitemap · Noindex | 13,870 · 1,146 · 12,722 PASS (baseline 갱신 후 `validate:full`이 비교) |
| sitemap 비교 | Production 984 대비 삭제 0 · 추가 162, 중복 0, index→sitemap 불일치 0 |
| **validate:full** | **미완료.** build와 count 비교까지 PASS했고, 이어지는 서버 기동 단계에서 `Production server did not become ready on http://localhost:3100 within 20000ms`로 중단됐다. 같은 시점에 하네스가 시스템 메모리 부족(여유 0.7GB / 13.3GB)으로 백그라운드 셸을 종료했다. broken links·metadata duplicates·orphans·Search/Consult smoke는 이번 실행에서 확인하지 못했다 |
| 로컬 smoke · 390/768/1440 render | **미실행**(서버 기동 필요, 위와 같은 이유로 보류) |

메모리 여유가 확보되면 `npm run validate:full`을 다시 실행하고, 이어서 `next start` 로컬 smoke와 렌더 검수를 하면 된다.

# Holds (Batch 30 기준)

| 항목 | 상태 |
|---|---|
| Batch 30 main 반영 / Production | **금지(지시)** — work checkpoint까지만(아래 "Batch 30 최종 검증" 참고) |
| 광주·전남 | 보류 — 시·도명 `전남광주통합특별시` 결정 전 |
| 세종 | 보류 — 구조 변경 없음 |
| PENDING 159 | 404 유지 |
| FIELD_ANALYSIS · CASE_BASED | 검증된 기록 0 — 섹션 숨김, 생성 없음 |
| 시·도 hub | 울산·대전·부산·대구·경남·강원·충북·충남·전북·경북·제주 `regionNoindex.ts` 보류 (위 재평가 결과 유지) |
| 학년 hub / 학년×과목 AMBER·RED | 학년 hub 36(AMBER 34 + RED 2), 학년×과목 5 — noindex |
| 신규 등록 학교 hub | schoolContent 미작성 → noindex (기존 gate) |
| 학과별 계획 학교 | 천안제일고는 쓸 수 있는 페이지 0 |
| PDF 원문 학교 | 완산중·한림중 등 — OCR 금지, 내용 없음 |
| 원문 수집 도구 repo 편입 | 불필요했음 — scratch 도구로 충분, `cfb` 추가 없음 |

# Next Priority

실제 coverage와 검색 성과 기준의 판단:

- **A (1차 coverage 부족 시 추가 지역)**: 해당 없음. 광주·전남·세종을 뺀 14개 시·도가 모두 동 1곳 이상을 운영한다.
- **B (2차 동 확장)**: **권장.** 시·도당 동이 1~2개뿐이고(서울 46 / 경기 26 / 인천 10 제외) HWP 쌍 후보 원문이 이미 캐시에 있다: 충북 옥산면(양업고·옥산중), 충남 아산 온양5동(온양용화고·온양중), 경북 영천 금호읍(포은고·금호여중), 제주 조천읍(함덕고·함덕중 일부)·애월읍(애월중).
- **C (GSC 성과 기준 증설)**: 아직 불가. 마지막 측정(2026-10-29)이 클릭 3·노출 36이고 Quick Win이 0이다. 재측정은 2026-11-24 전후.
- **D (광주·전남·세종)**: 시·도명 매핑·세종 구조 변경이 필요하므로 구현하지 말고 **Opus 구조 검토 대상**으로 남긴다.

우선순위:

1. Batch 30 마무리: `validate:full` 재실행 → 로컬 smoke·렌더 검수 → work checkpoint commit/push → (승인 후) main 반영.
2. 학년 hub 도입 문장 템플릿 개선 검토(코드 수준, 많은 페이지에 영향 → Opus 검토 대상): 학교가 늘 때마다 기존 색인 hub가 AMBER 경계(29~31%)로 올라가는 문제를 구조적으로 줄인다.
3. B: 위 후보로 2차 동 확장.
4. 2026-11-24 GSC 재측정 후 성과 좋은 지역 우선 증설(C).
5. D: Opus 구조 검토.

# Batch 30 최종 검증 (2026-11-03)

첫 `validate:full` 재실행(메모리 확보 후)은 콘텐츠·route 수치는 모두 PASS였지만 **Orphans 1 FAIL**: `/school/wansanyeoja-high-school/2/math`.
완산여고 2학년은 공시 과목이 수학 하나라서 학년 hub `/2`가 AMBER(noindex)이고, 학교 hub도 schoolContent 미작성으로 noindex라 색인 페이지에서 들어오는 링크가 0이었다.

일반 규칙으로 해결(robots·sitemap·Quality Gate·threshold 변경 없음):

- `orphanRiskSchoolGradeSubjects()` (`src/lib/internalLinks.ts`): 색인 학년×과목 중 **학년 hub가 noindex이고 같은 학년의 색인 과목이 그 하나뿐인** 페이지(같은 학년 과목끼리는 서로 링크하므로 둘 이상이면 고아가 아니다). 학년 hub가 색인이면 기존 구조 유지.
- 연결 위치: ① 학교 hub가 색인이면 hub의 "학년별 과목 평가 정보"에 직접 링크 ② 같은 학교·같은 과목·다른 학년 학년×과목 페이지의 "관련 페이지"에 직접 링크.
- 전체 재계산: 위험 페이지 1개(완산여고 2/math), 추가 링크 1개(`/school/wansanyeoja-high-school/1/math` → `2/math`). link 폭증·hub 과밀 없음.

| 검증 | 결과 |
|---|---|
| lint / typecheck / test(node:test 11) / validate:quick | PASS |
| validate:full | **PASS** — Routes 13,870 / Sitemap 1,146 / Noindex 12,722, indexed RED 0, broken 0, metadata 중복 0, **orphan 0**, search·consult smoke PASS |
| 로컬 smoke (next start, 109 URL: Batch 30 동·동×과목·학교·학년·학년×과목 + 기존 Production 표본) | 정책 일치, 5xx 0, 색인 페이지 H1 1·canonical·BreadcrumbList·출처·상담 CTA 모두 있음 (영주1동 국어는 데이터가 없어 404가 맞음) |
| Render (390/768/1440, 제주 동·학교·학년·학년×과목 + 4개 지역 동·학년×과목) | 가로 overflow 0, 표 overflow 0, heading 건너뜀 0, H1 1. 24px 미만 링크는 breadcrumb·본문 인라인 링크뿐(기존 Production 동 페이지와 같은 패턴) |

# Batch 31 (2026-11-05) — 2차 동: 영천 금호읍·아산 온양5동·청주 옥산면

**work only** (main·Production 반영 안 함, 승인 대기).

| 항목 | 값 |
|---|---|
| 동 | 경북 영천시 금호읍 (`/region/gyeongbuk/yeongcheon/geumho-eup`, 4723025000) — 영천 첫 동 · 충남 아산시 온양5동 (`/region/chungnam/asan/onyang5-dong`, 4420061000, 법정동 기산·초사·신인·용화·점양동) — 아산 첫 동 · 충북 청주시 흥덕구 옥산면 (`/region/chungbuk/cheongju/oksan-myeon`, 4311332000) — 청주 3번째 동 |
| 등록 | 포은고·금호여중·경북휴먼테크고(금호읍), 온양용화고·온양중(온양5동), 양업고·옥산중(옥산면). `--allow-new-city yeongcheon,asan`. 초등학교·금호중은 2026년 3차 공시 미확인으로 candidate 유지 |
| 원문 | 학교알리미 2026년 3차 공시 4-가(노트북 `.cache/official/schoolinfo` 캐시의 `.txt` 추출본). 양업고는 zip 안 과목별 HWP. 경북휴먼테크고는 PDF뿐(전문계 특성화고) → 내용 없음, 학교 hub만 |
| NEIS | 7개교 `schoolInfo` 단건 조회(open.neis.go.kr, 공개 API) → `.cache/official/neis/national-30.json` |
| 동 hub + 동×과목 | 3곳 × (hub + 5과목) 전부 GREEN·색인 (최대 유사도 20%) |
| 포은고 | 학년×과목 7 (1학년 국·수·사회(통합사회2+한국사2)·과학, 2학년 국·수·영). 학년 hub 1·2 GREEN |
| 금호여중 | 학년×과목 15. 학년 hub 1~3 AMBER(38%, 세 학년 모두 정기시험 60%·수행 40% 구조) noindex |
| 온양용화고 | 학년×과목 7 (1학년 국·영·사회(통합사회2+한국사2)·과학, 2학년 국·수(미적분Ⅰ)·영). 학년 hub 1·2 GREEN |
| 온양중 | 학년×과목 14. 학년 hub 1~3 GREEN |
| 양업고 | 학년×과목 6 (1학년 수·영·과학, 2학년 국(화법과 언어)·영(영어Ⅱ)·수(미적분Ⅰ)). 학년 hub 1·2 GREEN |
| 옥산중 | 학년×과목 9 (2학년 수·영·과학·사회(역사), 3학년 5과목(사회=사회+역사)). 학년 hub 2·3 GREEN. 1학년은 자유학기(수행 100%) |

**제외 (STRICT)**

- 포은고 1학년 영어: 반영 비율 표의 수행 과제(전기문 작성)가 진도표의 수행평가 연계 과제와 다름.
- 온양용화고 1학년 수학: 분할점수 표에 다른 교과 과제명이 들어 있어 표마다 과제명이 다름. 2학년 기하: 선택 3개반 한정.
- 온양중 3학년 과학: 반영 비율 표("생식 세포 분열")와 진도표·세부 계획("감수 분열")의 과제명이 다름.
- 양업고 1학년 국어: 평가 방침 문장(정기 60%·수행 40%)과 반영 비율 표(40%·60%)가 다름. 1학년 통합사회2: 비율표는 정기시험 1회인데 진도표에 1차·2차 시험이 모두 있음.
- 옥산중 2학년 국어: 평가 방침(정기 40%·수행 60%)과 반영 비율 표(60%·40%)가 다르고, 진도표 수행 과제가 비율표에 없음.
- 시기 불일치 행은 timing 생략: 양업고 1학년 국어(제외됨)·통합사회2(제외됨), 온양용화고 한국사2 역사적 사고로 글쓰기·영어Ⅱ 진로 영어 기사 쓰기, 옥산중 3학년 국어 수행 3개, 금호여중 3학년 역사 사료 해석.
- 온양중 1학년 과학의 서·논술형 칸(24%·18%)은 행 합계와 맞지 않아 쓰지 않음. 옥산중 3학년 역사 시험 성취기준은 표 열 구분이 불명확해 쓰지 않음.

**추출·검증**

- 학교별 subagent 6개(원문 파일:줄 근거 log) → 동별 subagent 3개(확정 frag만 근거). 통합 때 위 STRICT 판정으로 2건 추가 제외.
- 원문 표본 대조 3건 일치: 포은고 1학년 공통수학2 30/30·8/7(시기 10월·12월), 옥산중 2학년 영어 3·4회 고사 30/30·인터뷰 12월 1주·본문 읽고 해석하기 9월 5주, 금호여중 2학년 역사 정기시험 1회(2회) 40%·과제 30/30.
- 품질 게이트: 옥산중 3학년 사회가 33%로 AMBER → intro와 note 1개를 사실 그대로 다시 써서 GREEN. 금호여중 학년 hub 3개는 `schoolGradeNoindex.ts`에 보류. **기존 색인 페이지 중 AMBER로 바뀐 것 0**.

| 항목 | Batch 30 (work 2cb183e) | Batch 31 | 차이 |
|---|---:|---:|---:|
| Routes | 13,870 | 14,014 | +144 |
| Sitemap | 1,146 | 1,235 | +89 |
| Noindex | 12,722 | 12,777 | +55 |

- Routes +144 = 새 도시 조합 54 + 동 3 + 동×과목 15 + 학년 hub 14 + 학년×과목 58. Sitemap +89 = 시 허브 2 + 동 3 + 동×과목 15 + 학년×과목 58 + GREEN 학년 hub 11. Noindex +55 = 조합 54 + AMBER hub 3 − 시 허브 2. 사전 예측과 일치, 삭제 0.
- `contentDates.ts` PATH_UPDATED_BY_DATE "2026-11-05"에 신규 sitemap 경로 89개(시 허브 2 포함).
- 시·도 hub 충북·충남·경북은 regionNoindex 보류 유지(재평가 안 함).

| 검증 | 결과 |
|---|---|
| lint · typecheck (`next typegen` 후) | PASS |
| validate:quick | PASS (indexed RED 0, GREEN-only index sync PASS) |
| validate:full | PASS — Build, Routes 14,014 / Sitemap 1,235 / Noindex 12,777, broken 0, orphan 0 |
| 로컬 smoke · 390/768/1440 render | 미실행 (템플릿 변경 없음, 데이터 추가만) |

# Batch 32 (2026-11-05) — 제주 조천읍·애월읍

**work only** (main·Production 반영 안 함, 승인 대기).

| 항목 | 값 |
|---|---|
| 동 | 제주시 조천읍 (`/region/jeju/jeju-si/jocheon-eup`, 5011025900, 법정동 조천읍 + 10개 리) · 제주시 애월읍 (`/region/jeju/jeju-si/aewol-eup`, 5011025300, 법정동 애월읍 + 30개 리) — 제주 2·3번째 동, 새 도시 없음 |
| 등록 | 함덕고·함덕중·조천중(조천읍), 제주외고·애월고·애월중·신엄중·귀일중(애월읍). 조천중·애월고·신엄중·귀일중은 PDF 공시뿐이라 학교 hub만(PDF 미사용 원칙). 초등학교 19곳은 2026년 3차 공시 미확인으로 candidate 유지 |
| 원문 | 학교알리미 2026년 3차 공시 4-가(노트북 `.cache/official/schoolinfo` 캐시의 `.txt` 추출본). 함덕고는 교과군별 HWPX 7개(음악과·일반과 계획 중 일반과만), 함덕중은 2학년 HWPX만(1·3학년 PDF), 애월중은 학년별 HWP/HWPX, 제주외고는 전과목 HWPX 1개 |
| NEIS | 8개교 `schoolInfo` 단건 조회(노트북 브라우저, open.neis.go.kr) → `.cache/official/neis/national-31.json` |
| 동 hub + 동×과목 | 2곳 × (hub + 5과목) 전부 GREEN·색인 |
| 함덕고 | 학년×과목 8 (1학년 5과목: 공통국어2·공통수학2·공통영어2·통합사회2·통합과학2, 2학년 화법과 언어·미적분Ⅰ·영어Ⅱ). 학년 hub 1·2 AMBER(42%, 두 학년 구조가 같음) noindex |
| 함덕중 | 2학년 5과목(사회=역사). 학년 hub 2 GREEN |
| 제주외고 | 학년×과목 7 (1학년 수·영·사회(한국사1)·과학(통합과학2), 2학년 국(화법과 언어)·수(미적분Ⅰ)·사회(한국사2)). 학년 hub 1·2 GREEN. 전공어·심화 영어·사회 선택과목은 특목 전용·선택이라 쓰지 않음 |
| 애월중 | 학년×과목 13 (IB MYP, 전 과목 기말 40%·수행 60%). 학년 hub 1~3 GREEN |

**제외 (STRICT)**

- 함덕고 1학년 한국사2: 반영 비율 표 과제명("한국사 인물 가상 인터뷰 작성하기")과 분할점수 표("한국사 인물 인터뷰 기사 만들기")가 다름. 1학년 과학탐구실험2: 진도표에 과제명이 없어 대조 불가. 2학년 생명과학·지구과학·사회 선택과목: "3~6반 중 수강자" 선택 한정.
- 제주외고 1학년 공통국어2: 과제명이 표마다 다름("청중 맞춤 생활 기반 3분 스피치" vs "3분 스피치 소통 오디션"). 1학년 통합사회2: 같은 과제의 성취기준 코드가 비율표와 세부기준에서 다름 → 사회는 한국사1만. 1학년 과학탐구실험2: 기본점수 기준(20% vs 30점)이 다름. 2학년 영어·과학: 학년 전체 공통 과목 없음.
- 애월중 1학년 영어: 비율표 과제명·시기와 진도표가 다름. 3학년 영어: 진도표에 비율표에 없는 수행평가가 있음.
- 시기 불일치 행은 timing 생략: 함덕고 2학년 미적분Ⅰ 문제 재구성, 제주외고 1학년 공통수학2 수행 2개, 애월중 1학년 수학 작도·2학년 국어 기말·이야기 창작·3학년 수학 수행 2개.
- 함덕중 국어 note의 단원명 '이해하기 쉽게 발표하기'는 금지어 패턴(/쉽게/)에 걸려 인용하지 않음.

**추출·검증**

- 학교별 subagent 4개(원문 파일:줄 근거 log) → 동별 subagent 2개(확정 frag만 근거). 통합 때 제주외고 통합사회2 1건 추가 제외.
- 원문 표본 대조 일치: 함덕고 1학년 공통수학2 25/25/30/20(4.hwpx.txt 반영 비율 표), 애월중 2학년 영어 40/10/30/20·평가 방침 정기 40%·수행 60%(11.hwpx.txt).
- 품질 게이트: 함덕중 2학년 역사가 조천읍 사회 동 페이지와 겹쳐 AMBER → 동 페이지 함덕중 note 2개를 1개로 다시 써서 GREEN. 함덕고 학년 hub 2개는 `schoolGradeNoindex.ts`에 보류. 기존 색인 페이지 중 AMBER로 바뀐 것 0.

| 항목 | Batch 31 (4e25b59) | Batch 32 | 차이 |
|---|---:|---:|---:|
| Routes | 14,014 | 14,067 | +53 |
| Sitemap | 1,235 | 1,286 | +51 |
| Noindex | 12,777 | 12,779 | +2 |

- Routes +53 = 동 2 + 동×과목 10 + 학년 hub 8 + 학년×과목 33 (학교 hub는 전국 hub에서 이동, route 0). Sitemap +51 = 동 2 + 동×과목 10 + GREEN 학년 hub 6 + 학년×과목 33. Noindex +2 = 함덕고 AMBER hub 2. 사전 예측과 일치, sitemap 삭제 0.
- `contentDates.ts` PATH_UPDATED_BY_DATE "2026-11-05"에 신규 sitemap 경로 51개(같은 날 Batch 31 목록 뒤).
- 제주 시·도 hub는 regionNoindex 보류 유지(재평가 안 함).

# Batch 33 (2026-11-05) — 울산 남구 신정2동

**work only** (main·Production 반영 안 함, 승인 대기).

| 항목 | 값 |
|---|---|
| 동 | 울산 남구 신정2동 (`/region/ulsan/ulsan-nam/sinjeong2-dong`, 3114052000, 법정동 신정동) — 남구 2번째 동(무거동 다음), 새 도시 없음 |
| 등록 | 울산여고·학성고·울산서여중·학성중. 학성고(평가계획서 PDF, HWP는 진도표뿐)·울산서여중(PDF)은 학교 hub만. 신정고는 2026년 3차 공시 미확인으로 candidate 유지 |
| 원문 | 학교알리미 2026년 3차 공시 4-가(노트북 캐시 `.txt`). 울산여고는 학년별 평가계획서 HWP(10·11) + 교수학습 운영 계획 HWP(7·8, 진도표), 학성중은 학년별 전과목 HWPX(4·5·6) |
| NEIS | 5개교 단건 조회(노트북 브라우저) → `.cache/official/neis/national-32.json` |
| 동 hub + 동×과목 | hub + 5과목 GREEN·색인 |
| 울산여고 | 학년×과목 6 (1학년 국·수·사회(한국사2)·과학(통합과학2), 2학년 국(화법과 언어)·영(영어 독해와 작문)). 학년 hub 1·2 GREEN |
| 학성중 | 학년×과목 14 (1·2학년 5과목, 3학년 국·수·영·사회(사회+역사)). 학년 hub 3 GREEN, 1·2 AMBER(두 학년 모두 30·30·20·20 구조) noindex |

**제외 (STRICT)**

- 울산여고 1학년 공통영어2: 진도표 10월 4주에 비율표에 없는 "논설문 작성 수행평가 연계"가 있음(포은고 1학년 영어 선례). 1학년 통합사회2: 비율표 과제명("…헌법기반 해결방안 연구")과 세부 기준 제목("…헌법 기반 해결 방안 탐구")이 다름. 1학년 과학탐구실험2: 시기 대조 불가. 2학년 수학·사회·과학: 선택과목으로 나뉨.
- 학성중 3학년 과학: 평가 방침 문장은 정기고사만 적었는데 반영 비율 표는 정기 60%·수행 40%.
- 시기 불일치 행은 timing 생략: 울산여고 통합과학2 탄소중립 시나리오·화법과 언어 연설하기·영어 독해와 작문 제안서, 학성중 2학년 수학 일차방정식 그래프·2학년 영어 1차·3학년 국어 1차·3학년 영어 1차 정기시험.
- 학성중 여러 과목 표지가 "2026학년도 1학기"로 적혀 있으나 공시 제목·진도표(8월~1월)·시험 시기(10·12월)가 모두 2학기라 표지 오기로 보고 사용(판단 기록).

**추출·검증**

- 학교별 subagent 2개 → 동 subagent 1개. 원문 표본 대조 일치: 학성중 2학년 역사 30/30/20/20·타이포셔너리 9월 2주(4.hwpx.txt), 울산여고 1학년 공통국어2 30/30/20/20·모의재판 10월~11월(10.hwp.txt).
- 품질 게이트: 울산여고 1학년 통합과학2가 신정2동 과학 동 페이지와 겹쳐 AMBER → 동 페이지 울산여고 note 2개를 1개로 다시 써서 GREEN. 학성중 학년 hub 1·2는 `schoolGradeNoindex.ts` 보류.

| 항목 | Batch 32 (de8863f) | Batch 33 | 차이 |
|---|---:|---:|---:|
| Routes | 14,067 | 14,098 | +31 |
| Sitemap | 1,286 | 1,315 | +29 |
| Noindex | 12,779 | 12,781 | +2 |

- Routes +31 = 동 1 + 동×과목 5 + 학년 hub 5 + 학년×과목 20. Sitemap +29 = 동 1 + 동×과목 5 + GREEN hub 3 + 학년×과목 20. Noindex +2 = AMBER hub 2. 삭제 0.
- `contentDates.ts` "2026-11-05"에 신규 sitemap 경로 29개.

## Batch 34 — 대구 달서구 도원동 · 부산 동래구 사직제2동 (2026-11-06, 새 도시 2곳)

| 동 | 학교 (학년×과목) | hub만 |
|---|---|---|
| 도원동 (2729062800, daegu-dalseo) | 도원고 5 (1학년 국어·수학·사회, 2학년 국어·수학) · 대곡중 8 (2·3학년) · 도원중 8 (2·3학년) | 대곡고 (PDF) |
| 사직제2동 (2626059000, busan-dongnae) | 사직고 8 (1·2학년) · 사직중 12 (1~3학년) | 동인고 (zip) · 사직여고 (PDF) · 사직여중 (zip) |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest shl) + NEIS 학교기본정보 주소(도원동·사직동) — `.cache/official/neis/national-33.json`(노트북 브라우저 조회). 초등 6곳은 3차 공시 미확인으로 skip.

**제외 (STRICT)**

- 도원고: 2학년 영어Ⅱ(학교 발전 제안서 채점 문구가 다른 과제 문구와 같아 보임), 1학년 공통영어2(배점 50/20/30 vs 단계 최고점 30/30/40, 듣기 9.7. vs 9월 8일), 통합사회2(과제명 표마다 다름), 통합과학2·과학탐구실험2(과제명·시기 불일치), 2학년 사회·과학 선택과목.
- 대곡중: 1학년 자유학기(비율 없음), 2학년 과학·3학년 역사·3학년 과학(비율표와 진도표 과제명 다름).
- 도원중: 1학년(비율 없음), 3학년 수학·2학년 영어(과제명 표마다 다름).
- 사직고: 1학년 공통국어2(진도표에 비율표에 없는 수행평가 연계), 과학탐구실험2(대조 불가), 2학년 영어II(영역 불일치), 일부 반 한정 과목.
- 사직중: 1학년 수학(과제명·중간고사 시기 불일치), 1학년 과학(과제명 다름), 3학년 수학(1학기 과제명 혼재).
- 표끼리 시기가 다른 행은 timing 생략(도원중 2학년 수학 닮음·역사 기말·역사 일기, 3학년 사회 정책 제안, 사직고 일부 수행, 사직중 3학년 영어 2행 등). 판단 기록은 추출 log에 있음.
- 판단 포함: 도원고 2학년 국어·수학(원문 "기준 학급" 한 반 표기를 1학년 공통과목과 같은 대표 학급 표기로 봄, 교과당 과목 1개), 사직고 2학년 세포와 물질대사(담당학급 1~9반).

**추출·검증**

- 학교별 subagent 5개 → 동 subagent 2개. 원문 표본 대조 일치: 대곡중 2학년 "반어와 역설을 활용하여 시조 창작하기 (20%)"(7271020/1.hwp.txt), 사직고 2학년 "발효를 이용한 사례 탐구 보고서"(7150112/1.hwp.txt).
- 품질 게이트: 첫 실행에서 신규 학년 hub 10곳이 AMBER(30~39%)였고, 도원고 2학년 hub 때문에 기존 색인 페이지 2곳(제주외고 2학년·울산여고 2학년 hub)도 31~32%로 AMBER가 됨. 신규 37개 항목의 summary를 "중간·기말 각 30%" 반복 대신 과제명·시기 중심으로 다시 써서(사실 추가 없음) 신규 hub 11곳 전부 GREEN, 기존 페이지 영향 0. noindex 보류 추가 없음.

| 항목 | Batch 33 (bce32f8) | Batch 34 | 차이 |
|---|---:|---:|---:|
| Routes | 14,098 | 14,216 | +118 |
| Sitemap | 1,315 | 1,381 | +66 |
| Noindex | 12,781 | 12,833 | +52 |

- Routes +118 = 새 도시 조합 route 54(27×2, noindex) + 동 hub 2 + 동×과목 10 + 학년 hub 11 + 학년×과목 41. 학교 페이지 9곳은 기존 전국 학교 route(noindex 유지).
- Sitemap +66 = 신규 64 + 도시 hub 2(기존 noindex route → 색인). Noindex +52 = 54 − 2. 삭제 0.
- `contentDates.ts` "2026-11-06"에 신규 sitemap 경로 66개.

## Batch 35 — 전국 확장 10개 동 (2026-11-06, 새 도시 2곳)

사용자 지시 "가능한 곳은 전부 확장"에 따라, 클라우드 manifest에서 hwp·hwpx·zip 원문이 있는 미작업 동 중 10곳을 묶음. 확장 Batch는 validate:full PASS·indexed RED 0·예상 밖 급증 없음이면 바로 배포(11-06 사용자 결정).

| 동 (코드, city) | 학교 (학년×과목) | hub만 |
|---|---|---|
| 아라동 (5011063000, jeju-si) | 제주여고 6 · 제주중앙고 10 · 영주고 8 | 신성여고·아라중·신성여중·제주여중·탐라중 |
| 한경면 (5011031000, jeju-si) | 한국뷰티고 6 · 저청중 13 | — |
| 부림동 (4117356600, anyang) | 평촌경영고 4 · 부안중 12 | 부림초·안양부안초·부림중 |
| 탕정면 (4420033000, asan) | 한들물빛중 12 · 아산갈산중 14 | 충남삼성고·탕정중 |
| 오정동 (4119656000, bucheon) | 덕산고 8 · 덕산중 14 | 부천덕산초 |
| 모충동 (4311254000, cheongju) | 충북여중 7 | 운호고·충북여고·운호중 |
| 대현동 (3114062500, ulsan-nam) | 신선여고 2 (2학년) | 대현고·야음중 |
| 신봉동 (4146553000, yongin) | 용인홍천고 9 · 홍천중 14 | 신봉고·신리초·홍천초·용인신봉초·신봉중 |
| 후평2동 (5111061000, chuncheon 새 도시) | 후평중 5 · 봉의중 10 | — |
| 연일읍 (4711125300, pohang 새 도시) | 유강중 7 · 영일중 7 | 영일고 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest) + NEIS 학교기본정보 주소 — `.cache/official/neis/national-34.json`·`national-35.json`(노트북 브라우저 조회). 학교 41곳 등록. 강원대사대부고는 국립이라 `foundation` 타입("공립"|"사립")에 맞지 않아 등록 보류(candidate 유지).
- 대현동은 영어·과학 원문 결과가 없어 동×과목 3개(국어·수학·사회)만.

**제외 (STRICT, 학교별 상세는 추출 log)**

- 한국뷰티고 2학년 직무수학(성취기준 코드 불일치), 평촌경영고 2학년 영어(표 제목이 영어I), 유강중 1학년 수학(과제명 일부 누락), 영일중 3학년 전체(과목마다 비율표·진도표 불일치) 외 과제명·비율·시기가 표끼리 다른 과목은 모두 제외. 시기만 다른 행은 timing 생략.

**추출·검증**

- 학교별 subagent → 동 subagent. 품질 게이트 첫 실행에서 신규 학년 hub 15곳이 AMBER, 신선여고 2학년 hub 때문에 기존 색인 hub 2곳(제주외고 2·울산여고 2)도 AMBER. 36개 항목 summary를 과제명·시기 중심으로 다시 써서(사실 추가 없음) 해소.
- 과목 1개뿐인 학년 hub 2곳(평촌경영고 2·후평중 3)은 "실질 note 1개"로 구조상 AMBER → `schoolGradeNoindex.ts` 보류(그 아래 학년×과목은 다른 학년 같은 과목에서 링크되어 GREEN·색인). 신선여고 1학년 통합사회2는 hub를 보류하면 들어오는 색인 링크가 없고(orphan) GREEN 페이지는 noindex 목록에 넣을 수 없어 항목 자체를 이번 Batch에서 뺌(scratch 보관).

| 항목 | Batch 34 (d16531b) | Batch 35 | 차이 |
|---|---:|---:|---:|
| Routes | 14,216 | 14,540 | +324 |
| Sitemap | 1,381 | 1,651 | +270 |
| Noindex | 12,833 | 12,887 | +54 |

- Routes +324 = 새 도시 조합 route 54(noindex) + 동 hub 10 + 동×과목 48 + 학년 hub 44 + 학년×과목 168. 학교 페이지 41곳은 기존 전국 학교 route(noindex 유지).
- Sitemap +270 = 신규 268 + 도시 hub 2(춘천·포항, 기존 noindex route → 색인). Noindex +54 = 신규 56(조합 54 + 보류 hub 2) − 전환 2. 삭제 0(d16531b 대비 route diff 확인).
- `contentDates.ts` "2026-11-06"에 신규 sitemap 경로 270개.

## Batch 36 — 전국 확장 8개 동 (2026-11-06, 새 도시 없음)

| 동 (코드, city) | 학교 (학년×과목) | hub만 |
|---|---|---|
| 성산제2동 (1144073000, mapo) | 성사중 4 · 중암중 9 | — |
| 목4동 (1147054000, yangcheon) | 강서고 5 | 영도중(운영 계획만, 비율 없음) |
| 연동 (5011065000, jeju-si) | 제주중앙중 15 | 남녕고·제주서중 |
| 화북동 (5011060000, jeju-si) | 제주동중 15 | 오현고·오현중 |
| 옥동 (3114060000, ulsan-nam) | 울산제일고 5 | 성광여고·옥동중 |
| 삼산동 (3114057000, ulsan-nam) | 울산강남중 9 | 삼산고·대현중 |
| 문성동 (4413152000, cheonan) | 천안북중 10 | 복자여고·복자여중 |
| 무실동 (5113066000, wonju) | 평원중 12 | 원주삼육고·원주대성중·원주삼육중 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest) + NEIS 학교기본정보 주소(`.cache/official/neis/national-36.json`, 노트북 브라우저 조회, 중·고만) + `data/official/admin-dongs.json` 법정동. 학교 23곳 등록.
- 후보에서 뺀 동: 잠실7동(아주중 원문이 음악과뿐), 이도2동(제주중앙여고 hwp가 사회 1과목뿐 → 1학년 사회 1개는 hub noindex 시 orphan이라 제외, 나머지 교과는 PDF).

**제외 (STRICT, 학교별 상세는 추출 log)**

- 성사중 3학년 사회(세부기준 미응시 문구에 다른 과제명) → 3학년 영어도 hub 1과목·orphan이 되어 함께 제외. 울산제일고 2학년 법과 사회·세포와 물질대사·지구시스템과학(담당학급 확인 불가 선택과목, Batch 34 도원고·강서고 선례). 천안북중 3학년 사회(역사 과제명에 금지 패턴 /후기/가 있어 과제명을 바꿔야 하므로 제외). 그 외 과제명·비율·횟수가 표끼리 다른 과목은 모두 제외, 시기만 다른 행은 timing 생략.

**추출·검증**

- 학교별 subagent 9개 → 동 subagent 3개. 품질 게이트: 단일 학교 동(목4동·옥동)의 동×과목 5곳이 같은 학교 학년×과목과 31~40%로 겹쳐 동 쪽 intro/notes를 비교 관점으로 다시 씀. 성사중 1·중암중 1·2 학년 hub(31~32%)는 summary 재작성 → 26~29%. noindex 보류 추가 없음.

| 항목 | Batch 35 (ee32905) | Batch 36 | 차이 |
|---|---:|---:|---:|
| Routes | 14,540 | 14,693 | +153 |
| Sitemap | 1,651 | 1,804 | +153 |
| Noindex | 12,887 | 12,887 | 0 |

- +153 = 동 hub 8 + 동×과목 37 + 학년 hub 24 + 학년×과목 84. 삭제 0. `contentDates.ts` "2026-11-06"에 153개.

## Batch 37 — 전국 확장 24개 동 (2026-11-06, 새 도시 경주·구미·경산)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성: PDF·zip 등) |
|---|---|---|
| 문무대왕면 (4713031500, gyeongju) | 양북중 13 | 경주화랑고 |
| 풍산읍 (4717025000, andong) | 풍산중 8 | 풍산고 |
| 송하동 (4717066000, andong) | 경안중 8 | 경안여고 |
| 둔포면 (4420036000, asan) | 아산테크노중 7 | 아산충무고·둔포중 |
| 온양3동 (4420059000, asan) | 모종중 8 | 한올고·한올중 |
| 역곡1동 (4119257000, bucheon) | 역곡중 15 | 역곡고 |
| 봉명동 (4413155000, cheonan) | 천안계광중 9 | 천안고·천안서여중 |
| 교동 (5111052000, chuncheon) | 유봉여중 7 | 유봉여고 |
| 선산읍 (4719025000, gumi) | 선산중 15 | 선산고 |
| 진량읍 (4729025300, gyeongsan) | 신상중 9 | 진량고·진량중 |
| 불당2동 (4413356700, cheonan) | 천안불무중 8 (2학년 zip 제외) | 천안불당고 |
| 봉명2.송정동 (4311375600, cheongju) | 봉명중 8 | 봉명고 |
| 동면 (5111031000, chuncheon) | 강원고 6 | 춘천여고·강원중 |
| 산동읍 (4719025600, gumi) | 구미산동고 4 | 구미원당중 |
| 서부1동 (4729054100, gyeongsan) | 경산여고 3 | 경산여중 |
| 동부동 (4729056000, gyeongsan) | 사동중 15 | 경산고·사동고·경산중 |
| 풍남동 (5211153000, jeonju) | 전주성심여고 5 | 전주성심여중 |
| 중화산1동 (5211167100, jeonju) | 전주신흥고 3 | 전주신흥중 |
| 인후3동 (5211356000, jeonju) | 전주온고을중 10 | 전주중앙여고 |
| 구룡포읍 (4711125000, pohang) | 구룡포중 10 | 포항과학기술고 |
| 대이동 (4711159000, pohang) | 포항이동중 14 | 세명고·포항이동고 |
| 우산동 (5113060000, wonju) | 진광중 9 | 진광고 |
| 휴천1동 (4721059000, yeongju) | 대영고 2 | 영주중·대영중 |
| 가흥2동 (4721063000, yeongju) | 영주여중 11 | 영주제일고 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest) + NEIS 학교기본정보(`.cache/official/neis/national-37.json`·`national-37b.json`, 노트북 브라우저 조회, 중·고만) + admin-dongs 법정동. 학교 57곳 등록. 3차 공시 미확인 학교(전주여상·한국국제조리고·산동중·장산중)는 미등록.
- 이번 배치 판단 기준: 진도표에 과제명 표시가 없어도 비율표·세부 기준이 서로 맞고 진도표와 모순이 없으면 포함(학교별 log에 표시).

**제외 (STRICT, 학교별 상세는 추출 log)**

- 과제명·비율·횟수·성취기준 코드가 표끼리 다른 과목, 진도표에만 있는 수행평가, 과제명에 금지 패턴(/후기/, /쉽게/)이 있는 과목, 담당학급이 학년 전체로 확인되지 않는 선택과목은 제외. 자유학기 학년(반영 비율 없음)도 제외.
- 통합 단계 추가 제외: 모종중 2학년 역사(진도표 시험 회차 표기 오류), 전주성심여고 2학년 전체(화법과 언어·영어Ⅱ 담당학급 칸 비어 있음 → 미적분Ⅰ만 남아 hub 1과목), 전주신흥고 2학년 영어Ⅱ(hub 1과목, 평가방법 표기 뒤바뀜), 구미산동고 2학년 미적분Ⅰ(hub 1과목), 대영고 1학년(영어 발표와 토론 담당학급 미확인 → 과학 1과목 hub), 진광중 1학년 사회(hub 1과목), 구룡포중 3학년 수학(진도표 과제명 오타 추정).

**추출·검증**

- 학교별 subagent 24개 → 동 subagent 5개. 품질 게이트: 같은 학교 학년 hub끼리 31~42%, 새 hub가 기존 색인 hub(후평중 2·유강중 3)를 31~34%로 끌어올림 → 8개 학교 58개 summary 재작성 후 전부 30% 이하(최대 29%). noindex 보류 추가 없음.

| 항목 | Batch 36 (acdc409) | Batch 37 | 차이 |
|---|---:|---:|---:|
| Routes | 14,693 | 15,167 | +474 |
| Sitemap | 1,804 | 2,200 | +396 |
| Noindex | 12,887 | 12,965 | +78 |

- +474 = 새 도시 조합 81(noindex) + 동 hub 24 + 동×과목 106 + 학년 hub 56 + 학년×과목 207. 도시 hub 3개 noindex→색인. 삭제 0. `contentDates.ts` "2026-11-06"에 396개.

## Batch 38 — 전국 확장 10개 동 (2026-11-09, 새 도시 없음)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 가경동 (4311374700, cheongju) | 서원고 9·서경중 9 | 충북예술고·충북공업고·경덕중·서현중 |
| 원신흥동 (3020061000, daejeon-yuseong) | 대전체육고 4·대전도안고 6·대전체육중 12·대전봉명중 14·대전원신흥중 13 | - |
| 유림2동 (4146153600, yongin) | 고림고 6·덕영고 3·진덕고 5·고진중 15 | 고림중 |
| 관평동 (3020060000, daejeon-yuseong) | 대전용산고 8·대전관평중 15·대전동화중 12 | 중일고 |
| 오창읍 (4311425300, cheongju) | 청원고 4·양청고 6·양청중 10 | 오창고·각리중·오창중·생명중 |
| 율량.사천동 (4311454000, cheongju) | 충북상업정보고 6·주성중 10·청주중앙여중 9 | 청주여고·청주신흥고 |
| 성당동 (2729051500, daegu-dalseo) | 원화중 3·경암중 6 | 경화여고·원화여고·상서고(학과별 계획)·상서중 |
| 분평동 (4311256000, cheongju) | 청주하이텍고 6·원평중 8 | 남성중 |
| 명륜동 (2626054500, busan-dongnae) | 부산중앙여고 7·동래중 11·동해중 13 | - |
| 만촌1동 (2726055000, daegu-suseong) | 동문고 3·동원중 9·대구동부중 15 | - |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 11-06 수집분) + NEIS 학교기본정보(`.cache/official/neis/national-38.json`, 노트북 브라우저 조회, 중·고만) + admin-dongs 법정동. 학교 47곳 등록(국립 2곳 제외). 청주 서현중은 이름이 같은 기존 SCHOOLINFO_IDS 키와 겹쳐 학교 페이지만.
- 판단 기준은 Batch 37과 같음(진도표에 과제명 표시가 없어도 비율표·세부 기준 일치 + 진도표 모순 없으면 포함).

**제외 (STRICT, 학교별 상세는 추출 log)**

- 과제명·비율·횟수·성취기준 코드가 표끼리 다른 과목, 진도표에만 있는 수행평가, 과제명에 금지 패턴이 있는 과목, 담당학급이 학년 전체로 확인되지 않는 선택과목, 자유학기 학년(반영 비율 없음)은 제외.
- 통합 단계 추가 제외: 청주하이텍고 1학년 과학(서·논술 비율 행 칸 수 불일치), 동문고 2학년 전체(미적분Ⅱ·확률과 통계 담당학급 범위 없음 → 국어 1과목 hub), 서경중 2학년 수학, 청원고 2학년 국어·영어, 덕영고 2학년 국어·수학, 양청고 1학년 영어·사회, 대전동화중 2학년 사회·3학년 영어.

**추출·검증**

- 학교별 subagent 31개 → 동 subagent 10개. 품질 게이트: 같은 학교 학년 hub끼리 31~46%, 새 hub가 기존 색인 hub(한들물빛중 2·제주중앙중 1)를 31~32%로 끌어올림 → Batch 38 summary 재작성으로 전부 30% 이하. noindex 보류 추가 없음.
- 중간에 사용량 한도로 약 1시간 40분 중지 후 재개.

## Batch 39 — 전국 확장 10개 동 (2026-11-09, 새 도시 없음)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 장림제2동 (2638059000, busan-saha) | 장림여중 14·영남중 14 | - |
| 명장제2동 (2626076200, busan-dongnae) | 동신중 15·학산여중 6 | 대명여고·용인고·학산여고 |
| 용산2동 (2729057200, daegu-dalseo) | 성산고 5·성곡중 8 | 성산중(통합 단계에서 전부 제외)·성서고·경원고 |
| 노은2동 (3020054700, daejeon-yuseong) | 유성여고 8·대전지족고 7·대전하기중 14 | 대전지족중 |
| 노은3동 (3020054800, daejeon-yuseong) | 대전반석고 6·대전외삼중 12 | 대전새미래중 |
| 중4동 (4119266000, bucheon) | 중원고 8·중원중 9 | 경기예술고 |
| 중앙동 (4146151000, yongin) | 태성고 8·용신중 9·태성중 14 | 용인중 |
| 이동읍 (4146125600, yongin) | 용인바이오고 2·송전중 13·용천중 15 | - |
| 오송읍 (4311325000, cheongju) | 오송중 7·솔강중 9 | 오송고 |
| 청룡동 (4413158000, cheonan) | 천안여고 3·천안동중 15·천안가온중 11 | 천안청수고 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 11-06 수집분) + NEIS 학교기본정보 + admin-dongs 법정동. 학교 36곳 등록. 판단 기준은 Batch 37·38과 같음.

**제외 (STRICT)**

- 통합 단계 추가 제외: 오송중 1학년 사회(1과목 hub), 천안여고 2학년 사회(1과목 hub)·1학년 국어(진도표 성취기준 코드 불일치), 태성중 3학년 영어(정기시험 비율이 원문 칸 값이 아닌 계산값), 천안가온중 1·2학년 수학(과제명·회차 단원 표기 불일치), 성산고 2학년 수학(선택과목 학년 전체 미확인)·국어(1과목 hub), 학산여중 3학년 국어·영어(성취기준 코드 불일치)·사회(1과목 hub), 성곡중 2학년 사회(성취기준 범위 불일치).

**추출·검증**

- 학교별 subagent → 동 subagent 10개. 품질 게이트: 같은 학교 학년 hub끼리 30% 초과 → Batch 39 summary 133개 재작성으로 전부 27% 이하. noindex 보류 추가 없음.
- Routes 15557 → 15905(+348 = 동 hub 10 + 동×과목 50 + 학년 hub 56 + 학년×과목 232), sitemap 2590 → 2938, noindex 12965 유지. 삭제된 경로 없음.

## Batch 40 — 전국 확장 10개 동 (2026-11-09, 새 도시 없음)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 감천제1동 (2638062000, busan-saha) | 삼성여고 5·감천중 12·삼성중 11 | 부일전자디자인고 |
| 중1동 (4119263000, bucheon) | 부명고 6·경기국제통상고 4·부명중 13 | - |
| 두류1.2동 (2729053500, daegu-dalseo) | 구남중 9 | 대구보건고(통합 단계에서 전부 제외) |
| 온천2동 (3020054000, daejeon-yuseong) | 대전어은중 14·대전장대중 15 | 대전과학고 |
| 중앙동 (4311152500, cheongju) | 대성여상 7·청주중 7 | 청주공고 |
| 상현3동 (4146558500, yongin) | 상현고 7·상현중 11 | - |
| 화정2동 (4128162200, goyang) | 백양중 15·화정중 14 | 지도중 |
| 복대1동 (4311374100, cheongju) | 흥덕고 3·솔밭중 7 | 청주고·복대중 |
| 구즉동 (3020058000, daejeon-yuseong) | 대전두리중 15·대전둔곡중 12 | 대전송강중 |
| 전민동 (3020057000, daejeon-yuseong) | 대전전민고 8·대전전민중 15 | 대전문지중 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보 + admin-dongs 법정동. 학교 31곳 등록. 판단 기준은 Batch 37~39와 같음.

**제외 (STRICT)**

- 학교별 subagent 단계에서 표끼리 과제명·비율·성취기준·횟수 불일치, 학년 전체 수강 미확인(고2 선택과목·특성화고 학과별 계획), 금지 패턴 과제명(조선 후기), 계산값 필요 항목을 모두 제외(근거는 scratch log). 대구보건고는 학과별 계획뿐이라 항목 0개, 경기국제통상고 2학년은 1과목 hub라 제외.

**추출·검증**

- 동 단위 subagent 10개(학교 항목 + 동 항목). 품질 게이트: B40 학년 hub가 서로/기존 색인 hub(대전동화중 3·경안중 1·대전반석고 1·중원고 2·성사중 2)와 30% 넘게 겹침 → B40 summary 169개 재작성으로 B40 관련 쌍 최대 26.9%. noindex 보류 추가 없음.
- Routes 15905 → 16224(+319 = 동 hub 10 + 동×과목 49 + 학년 hub 50 + 학년×과목 210), sitemap 2938 → 3257, noindex 12965 유지. 삭제된 경로 없음.

## Batch 41 — 전국 확장 18개 동 (2026-11-09, 새 도시 없음)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 모현읍 (4146125300, yongin) | 모현중 11·도현중 14 | 용인한국외국어대학교부설고 |
| 산곡1동 (2823757000, bupyeong) | 산곡중 14 | 명신여자고·세일고·인천외국어고 |
| 부평1동 (2823751000, bupyeong) | 부원여자중 13·부원중 13 | 부평여자고 |
| 병목안동 (4117158300, anyang) | 신안중 13·안양서중 12 | - |
| 현도면 (4311232000, cheongju) | 청주IT과학고 5·현도중 9 | - |
| 송도4동 (2818585000, yeonsu) | 인천현송중 13 | 인천과학예술영재학교·인천예송중 |
| 월성1동 (2729060100, daegu-dalseo) | 월암중 9·조암중 2 | 월서중 |
| 신정3동 (3114053000, ulsan-nam) | 울산공업고 4·월평중 11 | - |
| 화전동 (4128166000, goyang) | 향동고 5·향동중 14 | 덕양중 |
| 다대제2동 (2638060200, busan-saha) | 다송중 14·두송중 15 | - |
| 용산1동 (2729057100, daegu-dalseo) | 성서중 7·용산중 9 | - |
| 목천읍 (4413125000, cheonan) | 목천중 8 | 목천고 |
| 효성1동 (2824560100, gyeyang) | 명현중 12·인천효성중 11 | 인천효성고 |
| 다대제1동 (2638060100, busan-saha) | 다대중 15·다선중 13 | 다대고 |
| 온천제3동 (2626057000, busan-dongnae) | 부산내성중 14·온천중 12 | - |
| 본리동 (2729059000, daegu-dalseo) | 대구제일여자상업고 2·성당중 7 | 새본리중 |
| 이곡1동 (2729057600, daegu-dalseo) | 이곡중 9·성지중 9 | - |
| 노은1동 (3020054600, daejeon-yuseong) | 대전노은고 8·대전노은중 15 | - |
- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보 + admin-dongs 법정동. 학교 46곳 등록. 외대부고·인천외고·인천과학예술영재학교는 원문 대상에서 제외(학교 페이지만). 판단 기준은 Batch 37~40과 같음.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준·횟수 불일치, '평가하지 않는 성취기준' 목록과 겹치는 과제, 학년 전체 수강 미확인(고2 선택과목·특성화고 학과별 계획), 금지 패턴 과제명(조선 후기), 계산값 필요 항목 제외(근거는 scratch log).
- 통합 단계 추가 제외: 목천고 2학년 전체(담당 칸 "1학년 ~4반" 오기로 학년 전체 미확인 → 1과목 hub), 향동고 2학년 전체(담당학급 표기 없음·진로선택 포함), 모현중 1학년 영어(반영비율 칸 % 값 없음), 조암중 3학년 과학(과제명 표끼리 다름), 월평중 3학년 국어(채점표 요소별 배점 불일치). 관련 동 항목은 해당 사실을 빼고 다시 씀.

**추출·검증**

- 동 단위 subagent 18개(학교 항목 + 동 항목). 품질 게이트: 같은 학교 학년끼리(부원중·부원여중 46%, 명현중·인천현송중·온천중 40%대, 다송·두송·다대·다선중)와 기존 hub(하단중·제주중앙중·대전체육고 등) 겹침 → B41 summary 245개 재작성으로 B41 관련 쌍 최대 26.9%. noindex 보류 추가 없음.
- Routes 16224 → 16756(+532 = 동 hub 18 + 동×과목 89 + 학년 hub 83 + 학년×과목 342), sitemap 3257 → 3789, noindex 12965 유지. 삭제된 경로 없음.

## Batch 42 — 전국 확장 16개 동 (2026-11-09, 새 도시 13)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 비전1동 (4122062000, pyeongtaek) | 평택고 8·비전고 7·비전중 10·배다리중 13·소사벌중 9 | - |
| 화서2동 (4111569000, suwon) | 영복여자고 6·영복여자중 10·율현중 15·정천중 14 | 숙지중 |
| 범서읍 (3171025900, ulsan-ulju) | 범서고 7·울산상업고 4·천상고 2·구영중 15·천상중 15 | - |
| 동삼제1동 (2620065000, busan-yeongdo) | 영도여자고 7·태종대중 15·해동중 14·영도제일중 15 | - |
| 소흘읍 (4165025000, pocheon) | 동남고 10·송우고 7·대경중 15·갈월중 10·송우중 12 | - |
| 향남읍 (4159125300, hwaseong) | 발안중 10·향남중 13·화성중 15·하길중 15·화성상신중 14 | - |
| 진천읍 (4375025000, jincheon) | 진천여자중 10·진천중 13 | 진천고·진천상업고 |
| 목동 (3014055000, daejeon-jung) | 충남여자고 6·충남여자중 14·대전대성중 15 | 대전대성고 |
| 관저2동 (3017059700, daejeon-seo) | 대전구봉고 10·대전구봉중 15·대전느리울중 12·대전봉우중 15 | - |
| 안중읍 (4122025300, pyeongtaek) | 경기물류고 4·안중중 11·현화중 12·안일중 11 | - |
| 은행동 (4139054000, siheung) | 은행고 3·소래고 6·소래중 10·시흥은행중 12 | - |
| 복현2동 (2723067200, daegu-buk) | 경상고 3·영진고 6·대구북중 9 | 성화중 |
| 평리3동 (2717064000, daegu-seo) | 대구서부고 4·평리중 9·대평중 10·서대구중 7 | - |
| 대방동 (1159066000, dongjak) | 성남중 4·영등포중 7 | 숭의여자중 |
| 삼성동 (3011069500, daejeon-dong) | 계룡디지텍고 5·보문중 15·한밭중 14 | - |
| 대흥동 (3014057500, daejeon-jung) | 대전고 6·대전여자중 14·대전중 12 | - |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보(노트북 브라우저 조회) + admin-dongs 법정동. 학교 66곳 등록, 콘텐츠 60곳·학년×과목 611. 새 도시 13곳(평택·화성·포천·시흥·진천·대전 중구/서구/동구·대구 북구/서구·부산 영도·울산 울주·서울 동작)은 `--allow-new-city`로 promote. 판단 기준은 Batch 37~41과 같음.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준 불일치, 학년 일부 학급만 수강하는 과목, 금지 패턴 과제명(후기·쉽게), 하위 칸 일부만 있는 시험 형식 제외(근거는 scratch log).
- 통합 단계 추가 제외: 대방동 성남중 2·3학년 국어·역사, 3학년 과학, 숭의여중 2·3학년 전부('수행평가' 1행 묶음 형식은 선례 없음 → 1과목 hub 연쇄 제외), 대구북중 3학년 영어(듣기 과제명 표마다 다름). 관련 동 항목은 해당 사실을 빼고 다시 씀.

**추출·검증**

- 동 단위 subagent 16개(학교 항목 + 동 항목). 품질 게이트: B42 hub 90개가 27% 초과 → summary 396개 재작성으로 27% 이하(최대 26.9%). 1차 validate:full에서 안일중·대전봉우중·구영중·하길중·화성중 학년끼리, 성남중 1학년 사회와 대방동 사회 페이지 겹침(30% 초과)과 note 1개 항목 2개가 걸려 intro·notes를 원문 사실로 다시 써 최대 20.9%로 낮춤.
- Routes 16756 → 17961(+1205), sitemap 3789 → 4656(+867 = 새 도시 hub 13 + 동 hub 16 + 동×과목 80 + 학년 hub 147 + 학년×과목 611), noindex 12965 → 13303(새 도시 지역×학년×과목 조합 351 noindex, 도시 hub 13 indexed 전환). 삭제된 경로 없음.

## Batch 43 — 전국 확장 18개 동 (2026-11-09, 새 도시 14)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 안성3동 (4155053000, anseong) | 안성고 4·안성중 14·안청중 10·비룡중 15 | 안성여자고 |
| 호암.직동 (4313058000, chungju) | 충주고 6·충주예성여자고 7·충주예성여자중 9·충주중 6 | 충주상업고·충주중산고·충주미덕중 |
| 비전2동 (4122063000, pyeongtaek) | 용죽고 5·평택중 12 | 신한고·한광고·한광여자고·동일공업고·평택여자중·한광여자중·한광중 |
| 약사동 (3111064000, ulsan-jung) | 학성여자고 4·약사고 4·무룡중 8 | 약사중 |
| 농소1동 (3120051000, ulsan-buk) | 호계고 3·농소중 12·호계중 12 | 매곡고 |
| 생연1동 (4125051000, dongducheon) | 한국문화영상고 4·한빛누리고 3·한빛누리중 9 | 동두천고·동두천여자중·동두천중 |
| 중화제1동 (1126060000, jungnang) | 중화고 5·장안중 7·중랑중 10 | - |
| 상일제1동 (1174052500, gangdong) | 강동고 3·한영중 15·상일중 5 | 상일여자고·한영고·한영외국어고·상일미디어고 |
| 혜화동 (1111065000, jongno) | 경신고 5·경신중 12·동성중 8 | 서울과학고·동성고·서울국제고 |
| 문화1동 (3014072000, daejeon-jung) | 대전국제통상고 8·대전동산중 4·대전문화여자중 13 | 대전동산고·대전글꽃중 |
| 망우본동 (1126065500, jungnang) | 이화여자대학교병설미디어고 6·동원중 12·봉화중 8 | 송곡고·송곡여자고·송곡관광고·영란여자중·송곡중 |
| 증포동 (4150051500, icheon) | 이천중 14 | 이천고·이천제일고·이현고·이천송정중·증포중 |
| 증평읍 (4374525000, jeungpyeong) | 증평중 10·형석중 6 | 형석고·증평공업고·충북비즈니스고·증평여자중 |
| 가양2동 (3011063000, daejeon-dong) | 대전가양중 14·동대전중 14 | 명석고 |
| 갈현제2동 (1138055200, eunpyeong) | 선정고 4·선정중 14 | 대성고·선일여자고·선정국제관광고·선일빅데이터고·대성중·선일여자중 |
| 수궁동 (1153079000, guro) | 예림디자인고 2·우신중 5 | 우신고·오류고·서서울생활과학고·세종과학고·서울공연예술고 |
| 독산제1동 (1154561000, geumcheon) | 가산중 13 | 세일중·안천중 |
| 둔내면 (5173033000, hoengseong) | 둔내고 5·현천고 2·둔내중 5 | - |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보(노트북 브라우저 조회, `.cache/official/neis/national-43.json`) + admin-dongs 법정동. 학교 100곳 등록, 콘텐츠 47곳·학년×과목 376. 새 도시 14곳(안성·충주·울산 중구/북구·동두천·서울 중랑/강동/종로/은평/구로/금천·이천·증평·횡성)은 `--allow-new-city`로 promote. 판단 기준은 Batch 37~42와 같음.
- 같은 이름 학교 출처 키: 경신중학교·동원중학교는 기존 SCHOOLINFO_IDS 키와 겹쳐 `"경신중학교(서울 종로)"`, `"동원중학교(서울 중랑)"`로 따로 둠.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준 불일치, 학년 일부 학급만 수강하는 과목, 금지 패턴 과제명, 하위 칸 일부만 있는 시험 형식 제외(근거는 scratch log).
- 통합 단계 추가 제외: 이천중 2학년 영어, 형석중 3학년 사회, 상일중 2학년 국어, 강동고 1학년 사회, 약사고 1학년 국어·2학년 전부, 둔내중 3학년 사회, 둔내고·명석고·선정고·호계고·한빛누리고·중화고·경신고 2학년(학년 전체 수강 미확인), 충주예성여고 2학년 수학, 장안중 2학년 과학, 중화고 과학탐구실험2. 안성 지역 합산 수행 비율은 원문 칸대로 나눔. 1과목만 남는 학년 hub는 연쇄 제외, 관련 동 항목은 해당 사실을 빼고 다시 씀.

**추출·검증**

- 동 단위 subagent 18개(학교 항목 + 동 항목). 품질 게이트: B43 hub 55개가 27% 초과 → summary 재작성으로 정리.
- Routes 17971 → 18931(+960), sitemap 4666 → 5262(+596 = 새 도시 hub 14 + 동 hub 18 + 동×과목 89 + 학년 hub 99 + 학년×과목 376), noindex 13303 → 13667(새 도시 지역×학년×과목 조합 378 noindex, 도시 hub 14 indexed 전환). 삭제된 경로 없음.

## Batch 44 — 전국 확장 17개 동 (2026-11-09, 새 도시 8)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 정자3동 (4111157300, suwon) | 천천고등학교(4), 대평중학교(12) | 경기체육고등학교, 대평고등학교, 천천중학교, 경기체육중학교 |
| 남목2동 (3117059000, ulsan-dong) | 현대고등학교(2), 현대중학교(3), 현대청운중학교(5) | 현대청운고등학교 |
| 농소2동 (3120052000, ulsan-buk) | 울산외국어고등학교(6), 매곡중학교(8), 이화중학교(9) | — |
| 광탄면 (4148035000, paju) | 광탄중학교(8) | 광탄고등학교, 한민고등학교 |
| 구암동 (2723074500, daegu-buk) | 운암고등학교(4), 함지고등학교(3), 동평중학교(6) | 구암고등학교, 운암중학교, 구암중학교, 강북중학교 |
| 논현고잔동 (2820071000, namdong) | 인천고잔고등학교(5), 인천고잔중학교(13) | 미추홀외국어고등학교, 인천송천고등학교, 인천사리울중학교 |
| 대송동 (3117054000, ulsan-dong) | 방어진고등학교(5), 대송중학교(12), 방어진중학교(8) | 울산생활과학고등학교, 대송고등학교 |
| 궁내동 (4141060000, gunpo) | 군포e비즈니스고등학교(5) | 경기폴리텍고등학교, 궁내중학교, 수리중학교 |
| 파주읍 (4148025300, paju) | 문산수억고등학교(2), 파주중학교(3) | 세경고등학교, 문산수억중학교 |
| 우제1동 (2635051000, busan-haeundae) | 해운대고등학교(3) | 부산기계공업고등학교, 해운대여자고등학교, 해운대관광고등학교, 해운대중학교, 해운대여자중학교 |
| 서대신제3동 (2614056000, busan-seo) | 부경고등학교(2), 부산중앙여자중학교(4) | 경성전자고등학교 |
| 정관읍 (2671025600, busan-gijang) | 정관고등학교(2), 부산중앙중학교(12), 정관중학교(11) | 신정고등학교, 신정중학교, 모전중학교 |
| 다사읍 (2771025600, daegu-dalseong) | 다사고등학교(3), 다사중학교(3), 심인중학교(6) | 심인고등학교, 서재중학교, 왕선중학교, 서동중학교 |
| 다운동 (3111061000, ulsan-jung) | 다운중학교(5), 울산제일중학교(7), 학성여자중학교(12) | 울산중앙고등학교, 다운고등학교 |
| 봉담읍 (4159325000, hwaseong) | 봉담고등학교(4), 봉담중학교(12) | 와우고등학교, 화담고등학교, 와우중학교, 화성동화중학교, 수현중학교, 화담중학교 |
| 취암동 (4423051000, nonsan) | 충남체육고등학교(2), 국방항공고등학교(3) | 논산고등학교, 논산여자고등학교 |
| 농소3동 (3120053000, ulsan-buk) | 달천중학교(4), 상안중학교(7), 천곡중학교(15) | 달천고등학교, 울산동천고등학교 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보(노트북 브라우저 조회, `.cache/official/neis/national-44.json`) + admin-dongs 법정동. 학교 85곳 등록, 콘텐츠 39곳·학년×과목 240. 새 도시 8곳(울산 동구·파주·군포·해운대·부산 서구·기장·달성·논산)은 `--allow-new-city`로 promote. 해운대 좌제3동은 원문 파일이 없어 이번 Batch에서 뺌. 판단 기준은 Batch 37~43과 같음.
- 같은 이름 학교 출처 키: 대평중학교·현대고등학교는 기존 SCHOOLINFO_IDS 키와 겹쳐 `"대평중학교(수원)"`, `"현대고등학교(울산 동구)"`로 따로 둠.
- NEIS 설립구분 "국립"(부산기계공업고) 대응으로 `OfficialSchoolRecord.foundation` 타입에 "국립" 추가.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준 불일치, 학년 일부 학급만 수강하는 과목, 금지 패턴 과제명, 하위 칸 일부만 있는 시험 형식 제외(근거는 scratch log).
- 통합 단계 추가 제외: 해운대여고 전부, 해운대고 1학년 영어·사회·과학 외 전부, 광탄중 3학년 수학, 다사중 2학년, 방어진고 2학년, 부산중앙중 2·3학년 사회, 울산외고 2학년 지구과학, 울산제일중 1학년 영어. 인천송천고·경성전자고·광탄고·경기체육고는 확정 항목 0. 1과목만 남는 학년 hub는 연쇄 제외, 관련 동 항목은 해당 사실을 빼고 다시 씀.

**추출·검증**

- 동 단위 subagent 17개(학교 항목 + 동 항목). 품질 게이트: B44 hub 37개가 27% 초과 → summary 재작성으로 정리.
- Routes 18931 → 19553(+622), sitemap 5262 → 5676(+414 = 새 도시 hub 8 + 동 hub 17 + 동×과목 78 + 학년 hub 71 + 학년×과목 240), noindex 13667 → 13875(새 도시 지역×학년×과목 조합 216 noindex, 도시 hub 8 indexed 전환). 삭제된 경로 없음.

## Batch 45 — 전국 확장 17개 동 (2026-11-10, 새 도시 7)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 설악면 (4182031000, gapyeong) | 설악고등학교(4), 설악중학교(13), 청심국제중학교(2) | 청심국제고등학교 |
| 중계2.3동 (1135062500, nowon) | 서울아이티고등학교(2), 상명중학교(8) | 대진여자고등학교, 상명고등학교, 중원중학교 |
| 국우동 (2723080000, daegu-buk) | 대구체육고등학교(6), 학남중학교(7), 대구체육중학교(5) | 학남고등학교, 대구국제고등학교 |
| 광천읍 (4480025300, hongseong) | 서해삼육고등학교(4), 충남드론항공고등학교(2), 한국K-POP고등학교(6) | — |
| 광정동 (4141062000, gunpo) | 산본고등학교(4), 산본중학교(14) | 도장중학교 |
| 과림동 (4139062100, siheung) | 한국조리과학고등학교(3), 경기자동차과학고등학교(4), 한국글로벌중학교(12) | — |
| 중앙동 (4122051000, pyeongtaek) | 장당중학교(12), 효명중학교(2) | 효명고등학교, 이충고등학교, 이충중학교 |
| 병점2동 (4159553000, hwaseong) | 안화고등학교(4), 병점중학교(13), 안화중학교(14) | 병점고등학교 |
| 동탄9동 (4159759000, hwaseong) | 창의고등학교(6), 동탄목동중학교(4) | 신동고등학교, 화성신동중학교, 바른중학교 |
| 안흥면 (5173032000, hoengseong) | 안흥고등학교(7), 안흥중학교(2) | 민족사관고등학교 |
| 신선동 (2620058500, busan-yeongdo) | 부산영선중학교(14), 신선중학교(9) | 부산영상예술고등학교, 남도여자중학교 |
| 청계동 (4143056000, uiwang) | 백운중학교(14), 백운호수중학교(3) | 덕장중학교 |
| 면목제3.8동 (1126057500, jungnang) | 면목고등학교(2), 면목중학교(4) | 중화중학교 |
| 철산3동 (4121061000, gwangmyeong) | 광명고등학교(4), 광명중학교(11), 철산중학교(11) | — |
| 사우동 (4157054000, gimpo) | 사우고등학교(3) | 김포고등학교, 김포여자중학교 |
| 월피동 (4127158000, ansan) | 광덕고등학교(8) | 안산공업고등학교, 성포중학교, 광덕중학교 |
| 호수동 (4127353500, ansan) | 양지고등학교(6), 송호중학교(15) | 고잔고등학교, 양지중학교 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보(노트북 브라우저 조회, `.cache/official/neis/national-45.json`) + admin-dongs 법정동. 학교 64곳 등록, 콘텐츠 38곳·학년×과목 264. 새 도시 7곳(가평·노원·홍성·의왕·광명·김포·안산)은 `--allow-new-city`로 promote. 해운대 좌제3동은 이번에도 원문 파일이 없어 뺌. 판단 기준은 Batch 37~44와 같음.
- 출처 키 `"한국K-POP고등학교"`는 하이픈 때문에 따옴표로 둠.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준 불일치, 방침 문장과 표 충돌, 학년 일부 학급만 수강하는 과목(고교 2학년 선택과목 대부분), 금지 패턴 과제명 제외(근거는 scratch log).
- 통합 단계 추가 제외: 부산영상예술고 전부, 안흥고 1학년 수학, 병점중 1학년 수학·2학년 국어(2단 머리표를 행 순서로 맞춰야 하는 칸 대응), 철산중 3학년 사회(성취기준 코드 불일치). 청심국제고·상명고·김포고·민족사관고·이충중은 확정 항목 0. 1과목만 남는 학년 hub는 연쇄 제외, 관련 동 항목은 해당 사실을 빼고 다시 씀.

**추출·검증**

- 동 단위 subagent 17개(학교 항목 + 동 항목). 품질 게이트: B45 hub 20개가 27% 초과 → summary 재작성으로 정리.
- Routes 19553 → 20176(+623), sitemap 5676 → 6117(+441 = 새 도시 hub 7 + 동 hub 17 + 동×과목 82 + 학년 hub 71 + 학년×과목 264), noindex 13875 → 14057(새 도시 지역×학년×과목 조합 189 noindex, 도시 hub 7 indexed 전환). 삭제된 경로 없음.

## Batch 46 — 전국 확장 16개 동 (2026-11-10, 새 도시 8)

| 동 (코드, 도시) | 콘텐츠 학교 (학년×과목) | 학교 페이지만 (콘텐츠 미작성) |
|---|---|---|
| 화도읍 (4136025600, namyangju) | 마석고등학교(3), 남양주고등학교(2), 화광중학교(10) | 심석고등학교, 마석중학교, 송라중학교, 심석중학교, 천마중학교 |
| 청북읍 (4122025900, pyeongtaek) | 청북중학교(10), 청옥중학교(15) | 청북고등학교 |
| 권선2동 (4111368000, suwon) | 곡정고등학교(3) | 곡선중학교, 남수원중학교, 규장중학교 |
| 소하2동 (4121065000, gwangmyeong) | 광휘고등학교(3) | 충현고등학교, 창의경영고등학교, 안서중학교, 충현중학교 |
| 상계9동 (1135071000, nowon) | 청원고등학교(4), 청원여자고등학교(3) | 상원중학교, 청원중학교 |
| 삼성동 (1162074500, gwanak) | 광신고등학교(3), 광신중학교(2) | 광신방송예술고등학교 |
| 행궁동 (4111574000, suwon) | 매향여자정보고등학교(6), 삼일고등학교(6) | 삼일공업고등학교, 삼일중학교 |
| 고덕제2동 (1174056000, gangdong) | 서울컨벤션고등학교(3), 고덕중학교(5) | 광문고등학교 |
| 주천면 (5175036000, yeongwol) | 주천고등학교(6), 주천중학교(6) | — |
| 진관동 (1138069000, eunpyeong) | 은평메디텍고등학교(2), 신도고등학교(7) | 진관고등학교, 하나고등학교, 신도중학교, 진관중학교 |
| 양구읍 (5180025000, yanggu) | 석천중학교(6), 양구중학교(6) | 강원외국어고등학교, 양구고등학교, 양구여자고등학교 |
| 옥천읍 (4373025000, okcheon) | 충북산업과학고등학교(3), 옥천중학교(5) | 옥천고등학교, 옥천여자중학교 |
| 동인천동 (2812556000, jemulpo) | 제물포고등학교(6) | 인일여자고등학교 |
| 내촌면 (5172033000, hongcheon) | 내촌중학교(7) | 팔렬고등학교, 팔렬중학교 |
| 대연제6동 (2629056000, busan-nam) | 세연고등학교(6), 해연중학교(12) | 부산중앙고등학교 |
| 동탄7동 (4159757000, hwaseong) | 이솔고등학교(6), 청림중학교(11) | 정현고등학교, 방교중학교, 화성세정중학교 |

- 등록 근거: 학교알리미 2026년 3차 공시(manifest, 노트북 수집분) + NEIS 학교기본정보(노트북 브라우저 조회, `.cache/official/neis/national-46.json`) + admin-dongs 법정동. 학교 64곳 등록, 콘텐츠 29곳·학년×과목 167. 새 도시 8곳(남양주·관악·영월·양구·옥천·제물포·홍천·부산 남구)은 `--allow-new-city`로 promote. 중랑 묵1동은 확정 항목 0이라 뺌. 판단 기준은 Batch 37~45와 같음.
- 출처 키: 서울 노원 청원고는 청주 청원고(기존 키 `청원고등학교`)와 학교알리미 ID가 달라 `"청원고등학교(서울 노원)"`로 따로 둠.

**제외 (STRICT)**

- 학교별 subagent 단계: 표끼리 과제명·비율·성취기준 불일치, 방침 문장과 표 충돌, 표 안 합계 불일치, 학년 일부 학급·학과만 수강하는 과목, 금지 패턴 과제명 제외(근거는 scratch log). 규장중·인일여고·팔렬중·원묵중·원묵고는 확정 항목 0. 청원여고 통합과학2(머리표 "통합과학1"), 석천중 2학년 영어(서·논술 칸 "30 (105%)") 제외.
- 통합 단계 추가 제외: 청림중 2학년 영어(평가요소 문구가 개요표와 세부기준에서 크게 다름, 1학년 영어 제외와 같은 기준)·3학년 수학(평가요소 개수 4 vs 3), 해연중 3학년 국어(hwp 추출 행 머리 밀림으로 행 순서 해석 필요). 이에 따라 동 항목 동탄7동 영어·수학, 대연제6동 국어도 뺌.

**추출·검증**

- 동 단위 subagent 17개(학교 항목 + 동 항목). 지역 허브 인트로는 B45에서 남녀공학 구성(NEIS 공식값) 문장 변형을 추가해 도시끼리 최대 56%로 유지.
- Routes 20176 → 20668(+492), sitemap 6117 → 6428(+311 = 새 도시 hub 8 + 동 hub 16 + 동×과목 67 + 학년 hub 53 + 학년×과목 167), noindex 14057 → 14238. 삭제된 경로 없음.
