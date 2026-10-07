/**
 * School pages (/school/[schoolSlug]) held at noindex by an editorial decision
 * even though a published schoolContent entry exists. The page stays reachable
 * (HTTP 200, canonical and body unchanged); only robots becomes noindex and the
 * URL leaves sitemap.xml (src/lib/indexability.ts "school" case).
 *
 * - banpo-middle-school (반포중학교): 학교알리미에서 '휴교'로 표시되고 공시 자료가
 *   2023학년도가 마지막이다(docs/qa/seo-full-audit-2026-10-07.md §3). 현재 재학생을
 *   대상으로 하는 검색 의도가 거의 없어 휴교가 풀릴 때까지 색인하지 않는다.
 *   Its school×subject page is held in src/data/schoolSubjectNoindex.ts.
 *
 * Every slug must be a registered school (checked by validate:full's school gate).
 */
export const schoolNoindexSlugs = new Set<string>(["banpo-middle-school"]);
