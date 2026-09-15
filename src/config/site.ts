export const siteConfig = {
  brandName: "교과설계소",
  brandShortName: "교과설계소",
  tagline: "초·중·고 국영수사과 1:1 맞춤과외",
  slogan: "학생마다 다른 공부, 다르게 설계합니다.",
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
