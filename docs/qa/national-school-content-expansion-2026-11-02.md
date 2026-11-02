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
