/**
 * A reference shown to visitors (SourceList) and counted by the quality gate
 * (scripts/lib/quality-gate.ts). Only list a source whose page was actually
 * opened and whose content backs the sentence it sits under.
 */
export interface ContentSource {
  label: string;
  url: string;
}

/**
 * 교육부 NEIS 교육정보 개방 포털의 '학교기본정보'(schoolInfo) — 시·도교육청 코드와
 * 학교 표준코드로 지정한 1개 학교의 공식 기록(소재지·설립 구분·남녀공학 구분·설립일 등).
 * 이름 검색은 부분 일치라 동명·유사명 학교가 섞이므로 코드로 지정한다(2026-10-06 확인:
 * 아래 모든 URL이 인증키 없이 정확히 1건을 반환). 새 학교를 쓰려면 코드를 먼저 조회해 추가할 것.
 */
const NEIS_SCHOOL_INFO = "https://open.neis.go.kr/hub/schoolInfo";

type SidoCode = "B10" | "E10" | "J10"; // 서울 / 인천 / 경기

const NEIS_SCHOOLS = {
  // 경기 성남·용인·부천·안양·고양
  서현중학교: ["J10", "7551020"],
  이매중학교: ["J10", "7551032"],
  판교중학교: ["J10", "7551159"],
  신갈중학교: ["J10", "7751033"],
  죽전중학교: ["J10", "7751040"],
  수지중학교: ["J10", "7751032"],
  부천중학교: ["J10", "7581026"],
  상동중학교: ["J10", "7581028"],
  소사중학교: ["J10", "7581033"],
  안양중학교: ["J10", "7569065"],
  평촌중학교: ["J10", "7569072"],
  호계중학교: ["J10", "7569073"],
  행신고등학교: ["J10", "7530135"],
  일산고등학교: ["J10", "7530852"],
  고양국제고등학교: ["J10", "7530977"],
  // 경기 수원
  영통중학교: ["J10", "7541037"],
  매향중학교: ["J10", "7541059"],
  수원북중학교: ["J10", "7541028"],
  화홍중학교: ["J10", "7541047"],
  // 서울 송파·강서·서초·양천
  가락중학교: ["B10", "7130165"],
  잠실중학교: ["B10", "7130202"],
  문정중학교: ["B10", "7130176"],
  서울양천초등학교: ["B10", "7081463"],
  마포고등학교: ["B10", "7010157"],
  세화여자중학교: ["B10", "7091452"],
  반포중학교: ["B10", "7091429"],
  언남중학교: ["B10", "7091441"],
  목동중학교: ["B10", "7081491"],
  신목중학교: ["B10", "7081502"],
  신서중학교: ["B10", "7081503"],
  // 인천 미추홀
  인천숭의초등학교: ["E10", "7321035"],
  관교중학교: ["E10", "7321070"],
  인천고등학교: ["E10", "7310057"],
} as const satisfies Record<string, readonly [SidoCode, string]>;

export function neisSchoolSource(name: keyof typeof NEIS_SCHOOLS): ContentSource {
  const [sido, code] = NEIS_SCHOOLS[name];
  return {
    label: `교육부 NEIS 학교기본정보 — ${name}`,
    url: `${NEIS_SCHOOL_INFO}?Type=json&ATPT_OFCDC_SC_CODE=${sido}&SD_SCHUL_CODE=${code}`,
  };
}
