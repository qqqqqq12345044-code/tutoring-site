export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  href: string;
  children: NavLink[];
}

export const mainNav: (NavGroup | NavLink)[] = [
  {
    label: "과외찾기",
    href: "/regions",
    children: [
      { label: "지역별 과외", href: "/regions" },
      { label: "학교별 과외", href: "/schools" },
      { label: "학년별 과외", href: "/grades" },
    ],
  },
  {
    label: "과목별 과외",
    href: "/subjects",
    children: [
      { label: "국어", href: "/subject/korean" },
      { label: "영어", href: "/subject/english" },
      { label: "수학", href: "/subject/math" },
      { label: "사회", href: "/subject/social" },
      { label: "과학", href: "/subject/science" },
    ],
  },
  { label: "학습가이드", href: "/guide" },
];

export function isNavGroup(item: NavGroup | NavLink): item is NavGroup {
  return "children" in item;
}
