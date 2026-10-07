import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { guideArticles } from "@/data/guide";

/**
 * When each page's *content* last really changed (YYYY-MM-DD, KST) — the
 * source for sitemap.xml <lastmod>. Never derived from build or request time:
 * a redeploy without content changes must not move these dates.
 *
 * How to maintain:
 * - Guide articles carry their own updatedAt in src/data/guide.ts.
 * - Edit a data entry or a page template's visible content → bump the matching
 *   KIND_UPDATED date (template/whole-kind change) or add a PATH_UPDATED entry
 *   (single page). Link-list or breadcrumb tweaks are not content changes.
 * - Initial values come from git history: the last commit that touched each
 *   kind's page template or data file (`git log -1 --format=%cs -- <file>`),
 *   plus 2026-10-02 for the SEO content work done that day.
 */
export type ContentKind =
  | "home"
  | "static"
  | "subject"
  | "subject-topic"
  | "grade"
  | "sub-grade"
  | "guide"
  | "program"
  | "region-province"
  | "region-city"
  | "region-district"
  | "region-subject"
  | "region-grade"
  | "region-grade-subject"
  | "region-district-subject"
  | "region-program"
  | "school"
  | "school-subject";

const KIND_UPDATED: Record<ContentKind, string> = {
  home: "2026-09-29",
  static: "2026-09-28",
  subject: "2026-09-22",
  "subject-topic": "2026-09-28",
  grade: "2026-09-22",
  "sub-grade": "2026-09-28",
  guide: "2026-09-22",
  program: "2026-09-22",
  "region-province": "2026-09-21",
  "region-city": "2026-09-28",
  "region-district": "2026-09-22",
  // 2026-10-02: shared study-guide sections, local notes and region FAQs added to the template.
  "region-subject": "2026-10-02",
  "region-grade": "2026-09-22",
  "region-grade-subject": "2026-09-28",
  "region-district-subject": "2026-09-18",
  "region-program": "2026-09-28",
  school: "2026-09-28",
  "school-subject": "2026-09-28",
};

/** Per-URL overrides — pages whose own content changed after their kind's date. */
const PATH_UPDATED: Record<string, string> = {
  "/subjects": "2026-09-15",
  "/grades": "2026-09-15",
  "/schools": "2026-09-18",
  "/guide": "2026-10-02", // 2026-10-02: article list expanded (5 new guides)
  // 2026-10-02 SEO content work
  "/subject/math": "2026-10-02",
  "/subject/english": "2026-10-02",
  "/subject/korean": "2026-10-02",
  "/subject/social": "2026-10-06", // 2026-10-06: 탐구 주제 설명 정리 (STEP 12)
  "/subject/science": "2026-10-06", // 2026-10-06: 탐구 주제 설명 정리 (STEP 12)
  "/grade/elementary/1": "2026-10-02",
  "/grade/elementary/2": "2026-10-02",
  "/grade/elementary/3": "2026-10-02",
  "/program/nonsul": "2026-10-02",
  // 2026-10-06 STEP 12: 2028학년도 수능 표현 점검 (탐구 주제 응시 학년도 구분, 주제 설명 정리)
  "/subject/social/social-tamgu": "2026-10-06",
  "/subject/science/science-tamgu": "2026-10-06",
  // 2026-10-06 3차: 학교×과목 공식 사실 보강, 남은 AMBER 재작성, 고등 영어 playbook, 마포중·서울개원초 데이터 정정
  "/region/gyeonggi/suwon/high/math": "2026-10-06",
  "/region/gyeonggi/goyang/middle/math": "2026-10-06",
  "/region/seoul/mapo/middle/english": "2026-10-06",
  "/region/gyeonggi/anyang/high/english": "2026-10-07",
  "/region/gyeonggi/seongnam/middle/math": "2026-10-07", // 2026-10-07 후속: 서현·이매·판교중 공시 수학 평가계획 비교
  "/region/gyeonggi/yongin/high/english": "2026-10-06",
  "/region/seoul/mapo/high/english": "2026-10-06",
  "/region/incheon/michuhol/high/english": "2026-10-06",
  "/region/incheon/gyeyang/high/english": "2026-10-06",
  "/school/gangnam-middle-school/english": "2026-10-07",
  "/school/yangcheon-middle-school/math": "2026-10-07",
  "/school/seocho-high-school/english": "2026-10-07",
  "/school/seocho-middle-school/english": "2026-10-07",
  "/school/songpa-high-school/english": "2026-10-07",
  "/school/yangcheon-high-school/math": "2026-10-07",
  "/school/yongin-high-school/math": "2026-10-07",
  "/school/goyang-high-school/math": "2026-10-07",
  "/school/anyang-high-school/math": "2026-10-07",
  "/school/jungdong-high-school/math": "2026-10-07",
  "/school/banpo-middle-school/math": "2026-10-07",
  "/school/seongsan-middle-school/math": "2026-10-07",
  "/school/hyundai-high-school/english": "2026-10-07",
  "/school/sungmun-high-school/english": "2026-10-07",
  "/school/michuhol-high-school/english": "2026-10-06",
  "/school/yeonsu-elementary-school/math": "2026-10-07",
  "/school/ganghwa-elementary-school/math": "2026-10-07",
  "/school/mapo-middle-school/english": "2026-10-07",
  "/school/michuhol-elementary-school/korean": "2026-10-07",
  "/school/mapo-middle-school/math": "2026-10-07",
  "/school/mapo-middle-school": "2026-10-06",
  "/school/gangnam-elementary-school": "2026-10-06",
  "/region/gyeonggi/bucheon/middle/english": "2026-10-06",
  // 2026-10-06 후속: 공식 출처 보강·"참고 자료" 표시·지역 사실 정정, 신규 GREEN 3건(수원·서초·양천 중등)
  "/region/seoul/gangseo/math": "2026-10-06",
  "/region/incheon/michuhol/english": "2026-10-06",
  "/region/gyeonggi/suwon/middle/math": "2026-10-06",
  "/region/seoul/seocho/middle/english": "2026-10-06",
  "/region/seoul/yangcheon/middle/math": "2026-10-06",
  // 2026-10-06 STEP 8: new region×grade×subject pages (quality gate GREEN)
  "/region/gyeonggi/seongnam/middle/english": "2026-10-06",
  "/region/gyeonggi/yongin/middle/math": "2026-10-06",
  "/region/gyeonggi/bucheon/middle/math": "2026-10-06",
  "/region/gyeonggi/anyang/middle/math": "2026-10-06",
  "/region/gyeonggi/goyang/high/math": "2026-10-06",
  "/region/seoul/songpa/middle/math": "2026-10-06",
  // 2026-10-07 SEO 전수 감사: 학교알리미 2026학년도 2학기 교과별 평가계획 기반 학교×과목 콘텐츠 보강(43), 반포중 휴교 정정, 안양 고등 영어 비교 note
  "/school/gangnam-middle-school/math": "2026-10-07",
  "/school/yangcheon-middle-school/english": "2026-10-07",
  "/school/songpa-middle-school/math": "2026-10-07",
  "/school/songpa-middle-school/english": "2026-10-07",
  "/school/yeongtong-middle-school/math": "2026-10-07",
  "/school/bucheon-middle-school/english": "2026-10-07",
  "/school/bucheon-middle-school/math": "2026-10-07",
  "/school/jamsil-high-school/math": "2026-10-07",
  "/school/sinseo-middle-school/math": "2026-10-07",
  "/school/jukjeon-high-school/math": "2026-10-07",
  "/school/pyeongchon-high-school/math": "2026-10-07",
  "/school/daechi-elementary-school/math": "2026-10-07",
  "/school/daechi-elementary-school/korean": "2026-10-07",
  "/school/munjeong-middle-school/english": "2026-10-07",
  "/school/eonnam-middle-school/english": "2026-10-07", // 2026-10-07 후속: 언남중 공시 평가계획(연도 표기 확인 후) 반영
  "/school/seongnam-middle-school/english": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/yeongtong-middle-school/english": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/gangnam-high-school/math": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/namdong-high-school/social": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/bupyeong-elementary-school/science": "2026-10-07", // 2026-10-07 후속: 보류(noindex) 페이지 공시 사실로 재작성 — noindex 유지
  "/school/sinmok-high-school/english": "2026-10-07",
  "/school/banpo-elementary-school/english": "2026-10-07",
  "/school/michuhol-middle-school/math": "2026-10-07",
  "/school/yeonsu-high-school/math": "2026-10-07",
  "/school/namdong-elementary-school/english": "2026-10-07",
  "/school/bupyeong-middle-school/english": "2026-10-07",
  "/school/bupyeong-high-school/math": "2026-10-07",
  "/school/gyeyang-high-school/english": "2026-10-07",
  "/school/ganghwa-high-school/korean": "2026-10-07",
  "/school/seongnam-middle-school/math": "2026-10-07",
};

const subjectSlugs = new Set(subjects.map((s) => s.slug));
const gradeSlugs = new Set(grades.map((g) => g.slug));

export function getContentKind(path: string): ContentKind {
  const seg = path.split("/").filter(Boolean);
  if (seg.length === 0) return "home";
  if (seg.length === 1) return "static";
  switch (seg[0]) {
    case "subject":
      return seg.length === 2 ? "subject" : "subject-topic";
    case "grade":
      return seg.length === 2 ? "grade" : "sub-grade";
    case "guide":
      return "guide";
    case "program":
      return "program";
    case "school":
      return seg.length === 2 ? "school" : "school-subject";
    case "region": {
      if (seg.length === 2) return "region-province";
      if (seg.length === 3) return "region-city";
      if (seg[3] === "program") return "region-program";
      if (seg.length === 4) {
        if (subjectSlugs.has(seg[3])) return "region-subject";
        if (gradeSlugs.has(seg[3])) return "region-grade";
        return "region-district";
      }
      return gradeSlugs.has(seg[3]) ? "region-grade-subject" : "region-district-subject";
    }
  }
  return "static";
}

/** Last real content change for a URL path, as YYYY-MM-DD. */
export function getContentUpdatedAt(path: string): string {
  if (path.startsWith("/guide/")) {
    const article = guideArticles.find((a) => `/guide/${a.slug}` === path);
    if (article) return article.updatedAt;
  }
  return PATH_UPDATED[path] ?? KIND_UPDATED[getContentKind(path)];
}
