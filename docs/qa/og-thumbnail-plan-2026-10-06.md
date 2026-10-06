# OG / 썸네일 구조 점검 및 준비 (2026-10-06)

결론: **코드는 변경하지 않았다.** 카테고리별 이미지 파일이 하나도 없어, 지금 코드를 바꾸면 존재하지 않는
이미지를 가리키거나 사용되지 않는 분기만 늘어난다. 아래 이미지 목록이 준비되면 그때 최소 패치(§4)를 적용한다.

## 1. 현재 구조 (확인 완료)

| 요소 | 위치 | 동작 |
|---|---|---|
| 에셋 존재 확인 | `src/lib/brand.ts` `publicAssetExists()` | `public/` 아래 실제 파일이 있을 때만 true |
| 사이트 공통 OG | `src/lib/metadata.ts` `ogImage` | `siteConfig.brand.ogImage`(`/assets/brand/og-default.png`)가 **존재할 때만** 1200×630 이미지 배열 생성, 없으면 `undefined` |
| 페이지 메타 | `buildMetadata()` (22개 `page.tsx`가 사용) | `openGraph.images`·`twitter.images`에 `ogImage`를 조건부로 삽입. 없으면 `images` 키 자체를 넣지 않음 |
| 루트 레이아웃 | `src/app/layout.tsx` | 같은 `ogImage`를 기본값으로 사용 |
| 실제 파일 | `public/assets/brand/og-default.png` | 존재, 1200×630 확인 |

- 존재하지 않는 이미지 URL이 생성되는 경로는 현재 **없다**(전부 `publicAssetExists` 게이트를 통과).
- 페이지별/카테고리별 이미지는 없다. 모든 페이지가 `og-default.png` 1장을 공유한다.
- `opengraph-image` / `twitter-image` 라우트 파일은 없다(`next/og` 생성도 미사용 — 한글 폰트 파일이 저장소에 없음).

## 2. 필요한 이미지 목록 (파일은 아직 없음 — 사용자/디자이너 준비 필요)

규격: PNG, **1200×630**, 하단/측면에 `교과설계소` 워드마크 안전영역, 텍스트는 최소화(제목은 페이지가 제공).
소재: **사람 사진 대신 공부 관련 이미지**(책, 연필, 노트, 책상·공부 공간, 문제집 등). 저작권이 명확한 자체 제작 또는 상업 이용 가능 라이선스만.

| 파일명 (`public/assets/og/`) | 적용 대상 | 소재 제안 |
|---|---|---|
| `subject-korean.png` | `/subject/korean`, 지역×국어, 학교×국어 | 펼친 책·원고지·펜 |
| `subject-english.png` | 영어 | 영어 단어장·노트·펜 |
| `subject-math.png` | 수학 | 격자 노트·자·연필 |
| `subject-social.png` | 사회 | 지도·지구본 느낌의 책상 소품 |
| `subject-science.png` | 과학 | 실험 노트·플라스크 일러스트 |
| `grade-elementary.png` | `/grade/elementary`, 초등 하위 학년 | 색연필·알림장 |
| `grade-middle.png` | 중등 | 교과서·형광펜 |
| `grade-high.png` | 고등 | 문제집·시간표·스탠드 |
| `program-coding.png` / `program-ged.png` / `program-korean-language.png` / `program-nonsul.png` | 프로그램 4종 | 각 주제 소품 |
| `guide.png` | `/guide`, `/guide/*` | 노트·메모 |
| `region.png` | 지역 허브·지역×과목·지역×학년×과목 | 지도 일러스트(특정 지역 사진 금지) |
| `school.png` | 학교·학교×과목 | 책상·교과서(학교 로고·교복 금지) |

합계 **16장**. 학교·지역별 개별 이미지는 만들지 않는다(조합 수만큼 늘어나 관리 불가).

## 3. 적용 규칙 (코드 반영 시)

1. 페이지는 자기 카테고리 이미지 경로를 `buildMetadata`에 넘긴다.
2. 해당 파일이 **실제로 있을 때만** 사용하고, 없으면 기존 `og-default.png`로 폴백한다(= 현재 동작과 동일, 이미지 없는 페이지에 잘못된 OG를 넣지 않음).
3. 이미지가 없는 카테고리는 아무 변경 없이 공통 이미지를 유지한다 → 이미지를 한 장씩 추가해도 안전하다.

## 4. 준비된 최소 패치안 (이미지 준비 후 적용 — 아직 미적용)

`src/lib/metadata.ts`의 변경은 약 10줄이다.

```ts
interface BuildMetadataInput {
  // ...기존 필드
  /** public 기준 카테고리 이미지 경로(예: "/assets/og/subject-math.png"). 파일이 없으면 공통 OG로 폴백. */
  image?: string;
}

function resolveOgImage(image?: string) {
  if (image && publicAssetExists(image)) return [{ url: image, width: 1200, height: 630, alt: "..." }];
  return ogImage; // 기존 공통 이미지(없으면 undefined)
}
```

그 뒤 `subject`·`grade`·`program`·`guide` 등 카테고리별 `page.tsx`에서 `image` 한 줄씩 넘긴다.
`generateMetadata`가 서버에서만 실행되므로 `fs` 기반 `publicAssetExists`를 그대로 쓸 수 있다.

## 5. 사용자가 할 일

- 위 16장(또는 우선순위 높은 `subject-*` 5장 + `grade-*` 3장부터) 이미지 준비 후 `public/assets/og/`에 저장.
- 준비되면 "OG 이미지 적용" 작업으로 §4 패치를 적용하고 카드 미리보기를 확인한다.

## 6. 재점검 (2026-10-06 3차)

`public/` 이미지는 여전히 브랜드 에셋(`og-default.png` 1200×630, 로고·파비콘)뿐이고, `opengraph-image`/`twitter-image` 라우트도 없다. 카테고리 이미지가 없어 **코드는 바꾸지 않았다.** §2 목록과 §4 패치안을 그대로 유지한다.
