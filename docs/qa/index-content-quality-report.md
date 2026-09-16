# Index 대상 페이지(60개) 콘텐츠 품질 감사 — 출시 전 하드닝

이 사이트는 페이지를 손으로 하나씩 작성하지 않고, 소수의 템플릿(`src/app/**/page.tsx`)이 데이터 파일(`src/data/*.ts`)을 읽어 렌더링하는 프로그래매틱 구조입니다. 따라서 "60개 페이지를 한 장씩 감사"하는 대신 **템플릿 단위로 감사**하고, 문제를 템플릿/데이터 레벨에서 고치는 방식이 60개(및 그 상위에 있는 271개 noindex 페이지) 전체에 동시에 적용됩니다. 이번 세션에서 실제로 읽은 템플릿과 데이터 파일: `src/app/page.tsx`, `subjects/page.tsx`, `subject/[slug]/page.tsx`, `grades/page.tsx`, `grade/[slug]/page.tsx`, `regions/page.tsx`, `region/[province]/page.tsx`, `region/[province]/[city]/page.tsx`, `region/[province]/[city]/[slug]/page.tsx`, `schools/page.tsx`, `school/[schoolSlug]/page.tsx`, `guide/page.tsx`, `guide/[slug]/page.tsx`, `lesson/visit`, `lesson/online`, `consult`, `not-found.tsx`, 그리고 `src/data/{subjects,grades,regions,schools,guide,regionSubjectContent,faqs}.ts`.

## 유형별 판정

| 유형 | 개수 | 판정 | 근거 |
|---|---|---|---|
| 홈 (`/`) | 1 | **양호** | Hero, WHY(4), 과목/학년/방식/프로세스/문제유형/케이스스터디/지역/FAQ(6) 등 섹션이 풍부하고, 각 섹션이 실제 내부 데이터를 사용. |
| `subject/[slug]` | 5 | **양호** | 과목별 `topics`(5~8개), `gradeStrategies`(3), `painPoints`(4), `process`(5단계), 과목별로 다른 `faqSlugs`까지 완비. 과목마다 문장이 실제로 다름(복사-붙여넣기 아님). |
| `grade/[slug]` | 3 | **양호** | `studyGoals`(4), `worries`(4), `subGrades`(3~6개, 학년별 note) 모두 학년마다 다른 실제 문장. FAQ는 원래도 없고 스키마도 없어(=중복 위험 자체가 없음) 그대로 유지. |
| 정적 허브 5개(`subjects`,`grades`,`regions`,`schools`,`guide`) | 5 | **양호** | 짧지만 목적이 분명한 리스트 페이지. 억지로 문장을 늘리지 않음(요구사항 준수). |
| `region/[province]`, `region/[province]/[city]`, district 단독 페이지 | 32 | **개선 완료** — 아래 "지역 허브" 섹션 참고 |
| `school/[schoolSlug]` | 2 | **개선 완료** — 아래 참고 |
| `region/[province]/[city]/[slug]`(subject, 지정 콘텐츠 보유) | 2 (수원 수학/영어) | **경계(B) — 유지** | `regionSubjectContent.ts`의 intro/학년별 섹션이 실제 존재하나, 문구 자체는 지역명만 붙인 일반론에 가까움. 실제 수원 지역 특성(학교 시험 경향 등)은 **추측 금지 항목**이라 임의로 채우지 않았음. 대신 실존하는 학교 데이터를 링크로 연결해 차별화(아래 참고). |
| `guide/[slug]` | 5 | **개선 완료** | 본문 자체(2~3 문단)는 양호하나 관련 subject/grade로의 내부링크가 전혀 없었음 → 추가(아래 "내부링크" 참고). |
| `lesson/visit`, `lesson/online`, `consult`, `privacy`, `terms` | 5 | **양호** | 장점/체크리스트/대상 명시 등 구체적. |

**결론**: thin content 문제가 실제로 있던 곳은 32개 지역 허브와 2개 학교 페이지뿐이었고, 나머지 index 대상 페이지는 이미 구조적으로 충분한 콘텐츠를 갖추고 있었습니다(과거 세션에서 이미 상당 부분 보강되어 있었음).

## 지역 허브 32개 — 상세 (별도 보고서 [region hub] 섹션과 중복 최소화)

기존 문제: province/city/district 세 템플릿 모두 "먼저 학생의 현재 개념 이해도와 학교 진도, 목표를 확인하는 것이 중요합니다" 류의 **지역명만 바뀐 동일 문장** + **완전히 동일한 FAQ 4문항**(`homeFaqSlugs.slice(0,4)`)을 32곳 모두에서 반복.

이번에 적용한 수정(실제 데이터에 기반, 지역 사실 추측 없음):
1. **FAQ 섹션/스키마 완전 제거** (province/city/district 허브 3개 템플릿) — 지역 허브는 링크 허브 역할이 목적이라 FAQ가 없어도 자연스럽고, 32곳 동일 스키마 반복 문제가 근본적으로 사라짐.
2. **실제 학교 데이터를 이용한 "관련 학교" 링크 추가** — city/district 페이지에서 `schools.ts`의 `regionSlug`가 해당 지역(또는 하위 지역)과 일치하는 학교를 찾아 링크. 예: 수원시 페이지 → 수원고등학교(수원 직속) + 영통중학교(수원의 하위 구인 영통구 소속). 이는 실제 데이터 관계이며 지역 특성을 새로 지어낸 것이 아님.

이 이상으로 "지역마다 다른 서술문"을 만드는 것은 실제 지역 정보(교육열, 학교 난이도 등)를 알아야 하며, 이는 이번 작업의 금지 항목이라 **의도적으로 건너뛰었습니다** (아래 "판단이 필요해 건너뛴 항목" 참고).

## 학교 페이지 2개 — 상세

기존 문제: (a) 학교급과 무관하게 초·중·고 학년 링크 3개를 전부 노출(관련성 약한 링크), (b) FAQ 없음.

수정:
- `school.level`(초등학교/중학교/고등학교) → 해당하는 학년 1개만 링크 (`영통중학교` → `중등`만).
- 일반 FAQ 3문항(`subject-scope`, `lesson-type`, `pricing`) 추가. 학교가 2개뿐이라 중복 스키마 리스크가 매우 작고, 이 3문항은 모든 상담 전 공통으로 유효한 정보라 "억지 콘텐츠"가 아님.

## 판단이 필요해서 건너뛴 항목 (실제 사실 확인 필요)

- **지역별 차별화 서술**: "경기도는 학군이 ~하다" 류의 문장은 실제 통계/여론조사 없이 쓸 수 없어 작성하지 않음.
- **학교별 시험 경향/난이도**: `schools.ts`에 그런 필드 자체가 없고, 만들려면 실제 기출 데이터가 필요해 보류.
- **region+subject(수원 2개)의 완전한 지역 특화 문구**: 현재도 "일반론 + 지역명" 수준. 수원 지역 실제 데이터(선호 학원가, 학교 시험 성향 등)가 없어 더 이상 구체화하지 않음.
- **guide 카테고리 10개 중 5개(국어/영어/사회/과학/수능 공부법)에 대응하는 글이 아직 없음** — `guideCategories`에는 있지만 `guideArticles`가 비어 있음. 새 글을 쓰는 것은 "실제 사실 확인이 필요 없는 범위"를 넘어서는 콘텐츠 제작 판단이라 이번 세션에서는 작성하지 않음. `/guide` 목록 페이지의 카테고리 필터 pill이 글 없는 카테고리도 그대로 보여주는 점만 기록.

## 수정한 파일 (콘텐츠/내부링크 관련)

```
src/app/region/[province]/page.tsx                 FAQ 섹션/스키마 제거
src/app/region/[province]/[city]/page.tsx          FAQ 섹션/스키마 제거, 관련 학교 링크 추가
src/app/region/[province]/[city]/[slug]/page.tsx   FAQ를 subject.faqSlugs 기반으로 교체(district/grade 분기는 FAQ 없음 유지), 관련 학교 링크 추가
src/app/school/[schoolSlug]/page.tsx                학년 링크를 학교급에 맞는 1개로 축소, FAQ 추가
src/app/guide/[slug]/page.tsx                       관련 subject/grade(및 방문/화상) 링크 추가
src/app/subject/[slug]/page.tsx                     관련 학습가이드 링크 추가(역방향)
src/app/grade/[slug]/page.tsx                        관련 학습가이드 링크 추가(역방향)
src/app/not-found.tsx                                주요 섹션 바로가기 링크 추가
src/data/guide.ts                                    guide↔subject/grade 매핑 헬퍼 추가(데이터 추가, 사실 왜곡 없음)
```

디자인, SEO index/noindex 정책, 라우팅, 브랜드명/슬로건/태그라인은 변경하지 않았습니다.
