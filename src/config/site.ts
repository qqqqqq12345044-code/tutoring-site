export const siteConfig = {
  brandName: "스터디브릿지",
  brandShortName: "스터디브릿지",
  tagline: "초·중·고 국영수사과 1:1 맞춤 과외",
  description:
    "국어·영어·수학·사회·과학 1:1 과외. 학생의 현재 수준과 목표를 먼저 확인하고 방문·화상 수업을 연결합니다.",
  domain: "https://www.example-tutoring.com",
  phone: "1588-0000",
  phoneDisplay: "1588-0000",
  kakaoUrl: "https://pf.kakao.com/_example",
  naverFormUrl: "",
  businessName: "",
  businessRegistrationNumber: "",
  businessAddress: "",
  email: "contact@example-tutoring.com",
} as const;

export type SiteConfig = typeof siteConfig;
