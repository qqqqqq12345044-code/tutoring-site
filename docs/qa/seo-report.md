# SEO 자동 감사 리포트

프로덕션 빌드된 333개 HTML 페이지 전수(정적 페이지 + `subject`/`grade`/`region` 전 조합 + `school`/`guide`)를 대상으로 자동 검사했습니다. 원본 데이터: [`crawl-results.json`](./crawl-results.json).

## 요약

| 항목 | 결과 |
|---|---|
| title 누락 | 0건 |
| title 중복 | 0건 (333개 페이지 모두 고유) |
| description 누락 | 0건 |
| description 중복 | 0건 |
| canonical 누락 | 0건 (HTML 페이지 기준) |
| canonical 오류 (다른 페이지 URL을 가리킴) | 0건 |
| Open Graph 누락 (og:title/description/url 중 하나라도) | 0건 |
| noindex 오삽입 | 0건 |
| sitemap 커버리지 | **문제 발견 → 수정 완료** (routes-report.md 참고) |
| H1 누락/중복 | 0건 |

## 동적 페이지 metadata 슬러그별 실제 차별화 확인

`subject`, `grade`, `region`, `region+subject`, `region+grade`, `region+district`, `school`, `guide` 각 타입에서 슬러그가 바뀔 때 title/description/canonical이 실제로 달라지는지 표본 확인:

| 페이지 | title | canonical |
|---|---|---|
| `/` | 스터디브릿지 \| 초·중·고 1:1 맞춤 과외 | `https://www.example-tutoring.com` |
| `/subject/math` | 수학과외 \| 초·중·고 1:1 맞춤 수업 - 스터디브릿지 | `.../subject/math` |
| `/region/gyeonggi/suwon/math` | 수원 수학과외 \| 초·중·고 1:1 맞춤 수업 - 스터디브릿지 | `.../region/gyeonggi/suwon/math` |
| `/school/yeongtong-middle-school` | 영통중학교 과외 \| 학교 진도에 맞춘 1:1 수업 - 스터디브릿지 | `.../school/yeongtong-middle-school` |
| `/guide/math-weak-unit` | 수학 취약 단원, 어디서부터 다시 시작해야 할까요 - 스터디브릿지 | `.../guide/math-weak-unit` |

333개 페이지 전수에서 title/description 중복이 0건이므로, `buildMetadata()`가 모든 동적 세그먼트에서 실제로 값을 주입하고 있음을 확인했습니다.

또한 홈페이지 title(`스터디브릿지 | 초·중·고 1:1 맞춤 과외`)이 루트 레이아웃의 `title.template`(`%s - 스터디브릿지`)과 중복 결합되어 "스터디브릿지 - 스터디브릿지"처럼 겹치지 않는 것도 실제 렌더링 HTML로 확인했습니다(Next.js가 홈페이지 title을 `default`로 처리).

## JSON-LD / Schema 검사

333개 페이지에서 렌더링된 모든 `<script type="application/ld+json">` 블록을 파싱해 검사했습니다.

| 항목 | 결과 |
|---|---|
| JSON 문법 오류 | **0건** (333개 페이지 전수 파싱 성공) |
| `@type`별 등장 횟수 | `EducationalOrganization` 331, `WebSite` 331, `BreadcrumbList` 330, `FAQPage` 89 |
| required property 누락 | 없음 (`Organization`은 name/url, `BreadcrumbList`는 itemListElement, `FAQPage`는 mainEntity가 모든 인스턴스에 존재) |
| URL 생성 오류 | 없음 (breadcrumbSchema/canonical이 만드는 절대경로 URL이 모두 `siteConfig.domain` 기준으로 정상 조립됨) |
| 페이지 성격과 맞지 않는 Schema | 없음 (Article 스키마는 애초에 코드에 존재하지 않음 — `/guide/[slug]`가 아티클 페이지이지만 Article 스키마 대신 Organization/WebSite만 상속되는 상태. 아티클 전용 스키마가 없는 것 자체는 버그는 아니나, 아래 참고) |
| BreadcrumbList 누락 페이지 | 1개 (`/` 홈페이지 — 자기 자신을 가리키는 breadcrumb이 필요 없어 정상) |

**참고 (수정하지 않음):** `/guide/[slug]` 아티클 페이지들은 Article/BlogPosting류의 전용 JSON-LD가 없습니다. 추가할지 여부는 콘텐츠 운영 전략(작성자, 발행일 등 실제 메타데이터 존재 여부) 판단이 필요해 임의로 추가하지 않았습니다.

## 발견했지만 수정하지 않은 항목 (판단 필요)

### FAQPage JSON-LD 중복 콘텐츠

`/region/[province]` (17개)와 `/region/[province]/[city]` (11개), 총 28개 페이지가 지역과 무관하게 동일한 `homeFaqSlugs.slice(0, 4)` 4문항을 그대로 FAQPage 스키마로 노출합니다. 완전히 동일한 구조화 데이터가 28개의 서로 다른 URL에 반복 게시되는 상태입니다.

- 기술적으로는 오류가 아니며 Google이 페널티를 주는 항목도 아니지만, 지역별로 차별화된 FAQ 콘텐츠를 만들지, 상위 레벨(지역 목록형) 페이지에서는 FAQPage 스키마 자체를 빼는 것이 나을지는 콘텐츠 전략 판단이 필요해 수정하지 않았습니다.

### 사업자 정보 placeholder

`siteConfig.phone = "1588-0000"`, `businessName/businessRegistrationNumber/businessAddress`는 모두 비어 있거나 placeholder 형태입니다. `organizationSchema()`가 `telephone` 필드에 이 placeholder 번호를 그대로 실어 보냅니다. 실제 사업자 정보가 없어 임의로 채우지 않았습니다(요청사항의 "허위 데이터 추가 금지"에 해당) — 실제 배포 전 실제 정보로 교체가 필요합니다.
