# FAQ 및 Schema 최종 정리 — 출시 전 하드닝

과거 감사(`docs/qa/indexability-report.md`)에서 지적된 "FAQPage 스키마가 83개 서로 다른 URL에서 완전히 동일하게 반복된다"는 문제를 이번 세션에서 근본 원인 단위로 재점검하고 정리했습니다.

## 검사 결과

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| FAQ 문구 중복 | `region`(province+city, 28개) + `region+subject`(55개) 전부 동일한 4문항(`subject-scope`,`lesson-type`,`elementary-tutoring`,`pricing`) 하드코딩 재사용 | `region` 허브(32개, province+city+district)는 FAQ 섹션/스키마 **제거**. `region+subject`(55개)는 과목별로 이미 존재하던 `subject.faqSlugs`(과목마다 3~4문항, 서로 다른 조합)를 사용하도록 교체 |
| 서로 다른 페이지에 동일 FAQPage schema 반복 | 32(region) + 55(region+subject) = 87개 URL이 완전히 동일한 스키마 | region 허브 32개는 스키마 자체가 없어짐(중복 대상에서 제외). region+subject 55개는 과목 5종 기준 최대 5가지 조합으로 분산(완전 제거는 아니지만 대폭 축소) |
| 실제 화면 FAQ와 schema 내용 불일치 | 없음(항상 일치) — 화면의 `<FAQAccordion items={faqs}>`와 `<JsonLd data={faqSchema(faqs)}>`가 같은 `faqs` 변수를 공유하는 구조라 애초에 불일치가 발생할 수 없는 설계 | 동일 |
| FAQ 없는 페이지에 FAQPage schema가 들어간 경우 | 0건 (grade, school 등은 원래 FAQ 자체가 없었음) | `school/[schoolSlug]`에 새로 FAQ(3문항, `subject-scope`/`lesson-type`/`pricing`)를 **추가**하면서 화면과 스키마를 함께 추가 — 불일치 없음. 학교가 2곳뿐이라 중복 스키마 리스크는 무시할 수준 |
| BreadcrumbList 오류 | `src/components/ui/Breadcrumb.tsx`가 모든 페이지 공통으로 `breadcrumbSchema()`를 자동 생성(개별 페이지가 직접 만들지 않음) → 구조적으로 오류 발생 여지가 적음 | 변경 없음(문제 없음 확인) |
| Article schema 오류 | `guide/[slug]`에는 애초에 Article류 JSON-LD가 없음(작성자/발행일 등 실제 메타데이터가 없어 이전 세션에서 의도적으로 보류) | 실제 발행일/작성자 정보가 없는 채로 Article 스키마를 새로 만드는 것은 허위 정보 생성에 해당할 수 있어 **이번에도 추가하지 않음** — 계속 보류 |
| Organization/WebSite schema 중복 | `src/app/layout.tsx`에서 전역으로 딱 1번씩만 렌더링(페이지마다 반복 아님) | 변경 없음(문제 없음 확인) |

## FAQ 원본 데이터 한계

`src/data/faqs.ts`에는 FAQ 항목이 6개뿐입니다(`subject-scope`, `lesson-type`, `elementary-tutoring`, `pricing`, `teacher-match`, `consult-commitment`). "FAQ 수를 억지로 늘리지 않는다"는 요구사항에 따라 **새 FAQ 문항을 만들지 않았고**, 기존 6개를 페이지 유형에 맞게 재배치하는 방식으로만 중복을 줄였습니다. 따라서 region+subject 55개 페이지는 여전히 과목이 같으면 FAQ가 동일합니다(예: 수학 관련 region+subject 11개는 모두 같은 4문항). 완전한 개별화를 원한다면 FAQ 풀 자체를 늘리는 콘텐츠 작업이 필요하며, 이는 "억지로 늘리지 않는다"는 제약과 상충되어 이번 세션에서는 진행하지 않았습니다.

## 수정한 파일

```
src/app/region/[province]/page.tsx                 FAQ 섹션/JsonLd(faqSchema) 제거
src/app/region/[province]/[city]/page.tsx          FAQ 섹션/JsonLd(faqSchema) 제거
src/app/region/[province]/[city]/[slug]/page.tsx   subject 분기: homeFaqSlugs.slice(0,4) → ctx.subject.faqSlugs
src/app/school/[schoolSlug]/page.tsx                FAQ 섹션/JsonLd(faqSchema) 신규 추가(3문항)
```

`src/lib/schema.tsx`(스키마 생성 함수 자체), `src/data/faqs.ts`(FAQ 원본 문항)는 수정하지 않았습니다.
