# 전국 행정동 15차 batch — 방배4동 (2026-10-26)

## 경위
- 14차까지 처리한 뒤 남은 후보 중, 13차 조회에서 첨부가 교과별 파일로 정리돼 있던 방배4동(서문여고·서문여중·서울방배초)을 수집했다. 수집·표 읽기 방식은 13·14차 QA와 같다(Node 수집기 + HWP/HWPX 셀 주소 표 덤프, repo 미변경).
- **1개 동만 진행했다.** 같이 검토한 목4동(강서고 교과별 파일 11개, 서울정목초, 영도중)은 영도중에 평가 비율표가 없고 강서고는 한 파일이 4만~19만 자로 학년·과목이 섞여 있어, 이번에 표 대응을 확정할 수 있는 분량이 아니어서 보류했다. 숫자를 채우기 위해 근거가 약한 동을 넣지 않았다.

## 수집·분류 (3교, `JG_CHASU=3`)
| 학교 | 형식 | 분류 | 사용 |
|---|---|---|---|
| 서문여중 | hwp/hwpx 15(교과별) | READY | 국어·영어·수학·사회·역사·과학 1~3학년 |
| 서문여고 | hwp 45(과목별) | READY | **1학년 공통과목** 7개 파일(공통국어2·공통영어2·공통수학2·통합사회2·한국사2·통합과학2·과학탐구실험2). 2·3학년 선택과목 38개 파일은 읽지 않음 |
| 서울방배초 | hwp/hwpx 6(학년별) | READY | 6학년 |
- UNUSABLE 0, PDF_HEAVY 0. 방배4동은 초·중·고가 모두 있다.

## 등록
- 신규 3곳(학교 페이지만, noindex, 과목 route 0): 서문여고(`seomunyeoja-high-school`)·서문여중(`seomunyeoja-middle-school`)·서울방배초(`seoulbangbae-elementary-school`). 기존 slug·URL 변경 없음.
- `--promote --write`만 사용했고 **`school-import.ts --write`(전체 candidates 갱신)는 쓰지 않았다**(전체 manifest가 없어 다른 학교의 `operating` 표시를 지울 수 있음). NEIS 행은 키 없는 단건 조회 캐시(`.cache/official/neis/national-15.json`)를 썼다. 따라서 `school-candidates.json`의 이 3교 상태(candidate→registered)는 13차 이후 batch(14·15차)와 함께 아직 갱신되지 않았다 — 회사 PC에서 전체 manifest로 `--write`를 한 번 돌려 정리해야 한다.
- `sources.ts`에 학교알리미 학교 ID 3건, `dongs.ts`에 방배4동(공식 법정동 방배동).

## 사용한 값 / 제외한 값
- 사용: 정기시험·수행평가 비율, 수행평가 과제명·배점·시기, 6학년 단원별 월·평가 방법.
- 제외·주의
  - **서울방배초 6학년**: 영어 7단원은 "수업·평가 방법" 칸에 서답형, "평가 유형" 칸에 선택형으로 서로 다르게 적혀 있고, 과학 4단원도 서술형(수업·평가 방법)과 보고서(평가 유형)로 갈린다 → 두 단원은 평가 방법을 쓰지 않고(영어) 또는 수업·평가 방법 칸 표기로(과학) 썼다. 문서에 총 횟수 문구가 없다.
  - 서문여고 2·3학년·선택과목(38개 파일)과 서문여중의 도덕·한문·기술가정 등 5과목 밖 교과는 읽지 않았다.
  - 서문여고 한국사2의 과제별 만점(50점·50점)과 반영 비율(15%·35%)이 서로 비례하지 않아, 만점은 쓰지 않고 비율만 썼다.
- 난이도·성적·학군·학원 수·후기 등은 쓰지 않았다.

## 유사도 (이름 마스킹, 품질 게이트 계산값)
- 허브 23.40%. 동×과목: 국어 19.57 · 영어 20.49 · 수학 22.75 · 사회 16.18 · 과학 19.57 → 최대 22.75%. 첫 작성본부터 전부 GREEN(AMBER·RED 0). 기존 최대(27.79%)와 기존 페이지 GREEN에는 변화 없음.

## Routes / Sitemap / Noindex
- 사전 계산: 추가 9 = 색인 6(허브 1 + 동×과목 5) + noindex 3(신규 학교 페이지), 삭제 0, 플래그 변경 0, indexed→noindex 0, sitemap 누락·누수 0.
- 합계: Routes 2,668 → **2,677**, Sitemap 560 → **566**, Noindex 2,106 → **2,109**. 실측(validate:full)과 일치, `scripts/lib/baseline.ts` 갱신.

## 검증
- `validate:full` **PASS** — Lint·Typecheck·Config·콘텐츠·품질 게이트(region-dong GREEN 59/59, region-dong-subject GREEN 295/295, AMBER·RED 0, indexed RED 0)·Quick·Build·Routes 2,677·Sitemap 566·Noindex 2,109·Broken 0·Orphan 0·Metadata 중복 0·Search/Consult smoke. 실행 전 가용 메모리 4.4GB.
- 로컬 production 서버에서 신규 4페이지 + 대조군 2페이지(방배3동 허브, 염리동 수학) × 390/768/1024/1440 = 24건 이상 없음(가로 넘침·깨진 이미지·콘솔/네트워크 오류·'N곳' 배지 0, H1 1개, breadcrumb·canonical self·`index, follow`·OG·JSON-LD 있음, 큰 그래픽 수는 대조군과 같음). 미작성 조합(`…/bangbae4-dong/physics`)은 404·noindex.
- main/Production은 변경하지 않았다.
