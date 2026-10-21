import type { OfficialSchoolRecord, School } from "@/data/schools";

/**
 * Schools registered from the national candidate list (scripts/official/school-import.ts --promote) — generated,
 * append-only; edit through the script. Each entry is a CONFIRMED NEIS school (도로명주소 → one official 행정동,
 * data/official/national-school-dongs.json) whose 학교알리미 2026년 3차 공시 was fetched (operating check).
 * availableSubjectSlugs is empty on purpose: no school×subject routes until written content exists.
 */
export const importedSchools: School[] = [
  imported("seoulsinseok-elementary-school", "서울신석초등학교", "mapo", undefined, "초등학교", "sinsu-dong", { code: "7031144", office: "B10", roadAddress: "서울특별시 마포구 대흥로 33", legalDong: "신수동", foundation: "공립", coed: "남녀공학", founded: "1964-03-10" }), // 마포구 신수동
  imported("sinsu-middle-school", "신수중학교", "mapo", undefined, "중학교", "sinsu-dong", { code: "7031200", office: "B10", roadAddress: "서울특별시 마포구 신수로 49", legalDong: "신수동", foundation: "공립", coed: "남녀공학", founded: "1986-12-15" }), // 마포구 신수동
  imported("gyeongbokyeoja-high-school", "경복여자고등학교", "gangseo", undefined, "고등학교", "deungchon3-dong", { code: "7010122", office: "B10", roadAddress: "서울특별시 강서구 화곡로63길 40", legalDong: "등촌동", foundation: "사립", coed: "여학교", highSchoolType: "일반고", founded: "1993-10-02" }), // 강서구 등촌제3동
  imported("deungchon-high-school", "등촌고등학교", "gangseo", undefined, "고등학교", "deungchon3-dong", { code: "7010700", office: "B10", roadAddress: "서울특별시 강서구 공항대로39길 115", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", highSchoolType: "자율고", founded: "2004-03-01" }), // 강서구 등촌제3동
  imported("gyeongbokbijeuniseu-high-school", "경복비즈니스고등학교", "gangseo", undefined, "고등학교", "deungchon3-dong", { code: "7010835", office: "B10", roadAddress: "서울특별시 강서구 화곡로 379", legalDong: "등촌동", foundation: "사립", coed: "남녀공학", highSchoolType: "특성화고", founded: "1972-10-02" }), // 강서구 등촌제3동
  imported("seouldeungmyeong-elementary-school", "서울등명초등학교", "gangseo", undefined, "초등학교", "deungchon3-dong", { code: "7081432", office: "B10", roadAddress: "서울특별시 강서구 강서로56나길 34", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1995-09-01" }), // 강서구 등촌제3동
  imported("seouldeungyang-elementary-school", "서울등양초등학교", "gangseo", undefined, "초등학교", "deungchon3-dong", { code: "7081434", office: "B10", roadAddress: "서울특별시 강서구 강서로56나길 140", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1994-11-30" }), // 강서구 등촌제3동
  imported("seouldeungwon-elementary-school", "서울등원초등학교", "gangseo", undefined, "초등학교", "deungchon3-dong", { code: "7081435", office: "B10", roadAddress: "서울특별시 강서구 화곡로65길 90", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1994-11-01" }), // 강서구 등촌제3동
  imported("seouldeunghyeon-elementary-school", "서울등현초등학교", "gangseo", undefined, "초등학교", "deungchon3-dong", { code: "7081437", office: "B10", roadAddress: "서울특별시 강서구 화곡로65길 124", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1995-01-10" }), // 강서구 등촌제3동
  imported("yuseok-elementary-school", "유석초등학교", "gangseo", undefined, "초등학교", "deungchon3-dong", { code: "7081483", office: "B10", roadAddress: "서울특별시 강서구 화곡로69길 9", legalDong: "등촌동", foundation: "사립", coed: "남녀공학", founded: "1965-12-03" }), // 강서구 등촌제3동
  imported("deungmyeong-middle-school", "등명중학교", "gangseo", undefined, "중학교", "deungchon3-dong", { code: "7081489", office: "B10", roadAddress: "서울특별시 강서구 공항대로39길 39", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1995-01-10" }), // 강서구 등촌제3동
  imported("deungwon-middle-school", "등원중학교", "gangseo", undefined, "중학교", "deungchon3-dong", { code: "7081490", office: "B10", roadAddress: "서울특별시 강서구 화곡로65길 50", legalDong: "등촌동", foundation: "공립", coed: "남녀공학", founded: "1995-05-04" }), // 강서구 등촌제3동
  imported("sangam-high-school", "상암고등학교", "mapo", undefined, "고등학교", "sangam-dong", { code: "7010806", office: "B10", roadAddress: "서울특별시 마포구 월드컵북로 445", legalDong: "상암동", foundation: "공립", coed: "남녀공학", highSchoolType: "일반고", founded: "2007-01-04" }), // 마포구 상암동
  imported("seoulsangam-elementary-school", "서울상암초등학교", "mapo", undefined, "초등학교", "sangam-dong", { code: "7031131", office: "B10", roadAddress: "서울특별시 마포구 월드컵북로 353", legalDong: "상암동", foundation: "공립", coed: "남녀공학", founded: "1972-07-10" }), // 마포구 상암동
  imported("seoulsangji-elementary-school", "서울상지초등학교", "mapo", undefined, "초등학교", "sangam-dong", { code: "7031132", office: "B10", roadAddress: "서울특별시 마포구 월드컵로42길 30", legalDong: "상암동", foundation: "공립", coed: "남녀공학", founded: "2007-06-05" }), // 마포구 상암동
  imported("sangam-middle-school", "상암중학교", "mapo", undefined, "중학교", "sangam-dong", { code: "7031189", office: "B10", roadAddress: "서울특별시 마포구 상암산로1길 26", legalDong: "상암동", foundation: "공립", coed: "남녀공학", founded: "2007-03-01" }), // 마포구 상암동
  imported("seoulhaneul-elementary-school", "서울하늘초등학교", "mapo", undefined, "초등학교", "sangam-dong", { code: "7031231", office: "B10", roadAddress: "서울특별시 마포구 월드컵북로 502-14", legalDong: "상암동", foundation: "공립", coed: "남녀공학", founded: "2011-03-01" }), // 마포구 상암동
  imported("seoulyonggang-elementary-school", "서울용강초등학교", "mapo", undefined, "초등학교", "daeheung-dong", { code: "7031155", office: "B10", roadAddress: "서울특별시 마포구 백범로17길 9", legalDong: "대흥동", foundation: "공립", coed: "남녀공학", founded: "1916-04-26" }), // 마포구 대흥동
  imported("seoulchangcheon-elementary-school", "서울창천초등학교", "mapo", undefined, "초등학교", "daeheung-dong", { code: "7031165", office: "B10", roadAddress: "서울특별시 마포구 백범로1길 56", legalDong: "노고산동", foundation: "공립", coed: "남녀공학", founded: "1940-01-29" }), // 마포구 대흥동
  imported("sungmun-middle-school", "숭문중학교", "mapo", undefined, "중학교", "daeheung-dong", { code: "7031197", office: "B10", roadAddress: "서울특별시 마포구 숭문길 99", legalDong: "대흥동", foundation: "사립", coed: "남학교", founded: "1906-04-01" }), // 마포구 대흥동
  imported("changcheon-middle-school", "창천중학교", "mapo", undefined, "중학교", "daeheung-dong", { code: "7031219", office: "B10", roadAddress: "서울특별시 마포구 백범로1길 56", legalDong: "노고산동", foundation: "공립", coed: "남녀공학", founded: "2009-03-01" }), // 마포구 대흥동
];

function imported(
  slug: string,
  name: string,
  cityRegionSlug: string,
  districtRegionSlug: string | undefined,
  level: School["level"],
  dongSlug: string,
  official: OfficialSchoolRecord,
): School {
  return { slug, name, cityRegionSlug, ...(districtRegionSlug ? { districtRegionSlug } : {}), level, availableSubjectSlugs: [], dataSource: "official", dongSlug, official };
}
