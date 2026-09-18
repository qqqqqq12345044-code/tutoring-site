/**
 * School-specific content for a (school × subject) combination — the
 * school-level counterpart of regionGradeSubjectContent.ts, reusing the same
 * published-content-gate pattern.
 *
 * Key relationships (enforced by convention, not types):
 * - schoolSlug must be a School.slug from src/data/schools.ts.
 * - subjectSlug must be a Subject.slug from src/data/subjects.ts, and must
 *   appear in that school's availableSubjectSlugs.
 *
 * src/lib/indexability.ts's "school-subject" case gates on
 * isPublishedContent(): an entry only makes the combination index+sitemap
 * eligible once status is "published" AND schoolSpecificNotes is non-empty.
 * A "draft" entry, or one with no notes yet, is treated exactly like having
 * no entry at all — noindex, out of the sitemap, and not rendered on the page.
 */
export interface SchoolSubjectContent {
  schoolSlug: string;
  subjectSlug: string;
  status: "draft" | "published";
  intro: string;
  schoolSpecificNotes: { title: string; body: string }[];
}

export const schoolSubjectContents: SchoolSubjectContent[] = [
  {
    schoolSlug: "gangnam-middle-school",
    subjectSlug: "english",
    status: "published",
    intro:
      "대치중학교 학생이 영어과외를 찾는다면, 학교 내신 서술형 문항과 부교재 구성을 먼저 확인하고 취약한 영역부터 보완하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "대치중학교 학생 안내",
        body: "대치중학교에 재학 중이라면 지역별 과외 페이지(강남 중등 영어과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 영어 내신 대비 방향",
        body: "중학교 영어 내신은 학교마다 서술형 문항 배점과 유형이 달라, 재학 중인 학교의 최근 시험 형식을 기준으로 준비하는 것이 효과적입니다.",
      },
    ],
  },
  {
    schoolSlug: "gangnam-high-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "개포고등학교 학생이 수학과외를 찾는다면, 학교 내신 시험 범위와 모의고사 일정을 함께 고려해 학습 우선순위를 정하는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "개포고등학교 학생 안내",
        body: "개포고등학교에 재학 중이라면 지역별 과외 페이지(강남 고등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "고등학교 수학 내신·모의고사 병행",
        body: "개포고등학교를 포함한 고등학교는 학교 자체 내신 시험과 전국 단위 모의고사를 함께 준비해야 하므로, 두 일정을 모두 반영한 학습 계획이 필요합니다.",
      },
    ],
  },
  {
    schoolSlug: "yangcheon-middle-school",
    subjectSlug: "math",
    status: "published",
    intro:
      "목동중학교 학생이 수학과외를 찾는다면, 이전 학년에서 놓친 개념이 없는지 먼저 점검하고 학교 진도에 맞춰 학습을 이어가는 것이 중요합니다.",
    schoolSpecificNotes: [
      {
        title: "목동중학교 학생 안내",
        body: "목동중학교에 재학 중이라면 지역별 과외 페이지(양천 중등 수학과외)에서도 관련 안내를 함께 확인할 수 있습니다.",
      },
      {
        title: "중학교 수학 단원 연계 점검",
        body: "목동중학교를 포함한 중학교 수학은 단원 간 연결이 강한 과목이라, 재학 중인 학교의 진도표를 기준으로 이전 단원 개념부터 순서대로 점검합니다.",
      },
    ],
  },
];

export function getSchoolSubjectContent(
  schoolSlug: string,
  subjectSlug: string
): SchoolSubjectContent | undefined {
  return schoolSubjectContents.find((c) => c.schoolSlug === schoolSlug && c.subjectSlug === subjectSlug);
}

/** Whether a school-subject entry is complete enough to be shown/indexed. */
export function isPublishedContent(
  content: SchoolSubjectContent | undefined
): content is SchoolSubjectContent {
  return Boolean(content && content.status === "published" && content.schoolSpecificNotes.length > 0);
}
