// Run: npx tsx --test src/lib/consultContext.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { consultHref, resolveConsultPrefill } from "./consultContext";

test("no context keeps the plain /consult link and an empty prefill", () => {
  assert.equal(consultHref(), "/consult");
  assert.equal(consultHref({}), "/consult");
  assert.deepEqual(resolveConsultPrefill(""), {});
});

test("subject, city and 행정동 resolve to the form's option values", () => {
  assert.equal(consultHref({ subject: "math", region: "gangseo", dong: "hwagok4-dong" }), "/consult?subject=math&region=gangseo&dong=hwagok4-dong");
  assert.deepEqual(resolveConsultPrefill("?subject=math&region=gangseo&dong=hwagok4-dong"), { subject: "수학", province: "서울", cityDetail: "강서구 화곡제4동" });
  assert.deepEqual(resolveConsultPrefill("?region=goyang&dong=hwajeong1-dong"), { province: "경기", cityDetail: "고양시 화정1동" });
  assert.deepEqual(resolveConsultPrefill("?subject=science&region=michuhol&dong=gwangyo-dong"), { subject: "과학", province: "인천", cityDetail: "미추홀구 관교동" });
  assert.deepEqual(resolveConsultPrefill("?subject=math&region=yeonsu&dong=songdo1-dong"), { subject: "수학", province: "인천", cityDetail: "연수구 송도1동" });
  assert.deepEqual(resolveConsultPrefill("?region=anyang&dong=galsan-dong"), { province: "경기", cityDetail: "안양시 갈산동" });
});

test("province, city and district contexts", () => {
  assert.deepEqual(resolveConsultPrefill("?region=seoul"), { province: "서울" });
  assert.deepEqual(resolveConsultPrefill("?region=gangnam"), { province: "서울", cityDetail: "강남구" });
  assert.deepEqual(resolveConsultPrefill("?subject=english&region=yeongtong"), { subject: "영어", province: "경기", cityDetail: "수원 영통구" });
});

test("unknown or hostile values are dropped, never echoed", () => {
  assert.deepEqual(resolveConsultPrefill("?subject=physics"), {});
  assert.deepEqual(resolveConsultPrefill("?region=atlantis"), {});
  assert.deepEqual(resolveConsultPrefill("?subject=%3Cscript%3Ealert(1)%3C%2Fscript%3E&region=%22%3E%3Cimg"), {});
  assert.deepEqual(resolveConsultPrefill("?subject=__proto__&region=constructor&dong=toString"), {});
  // a 행정동 from another city is ignored; the city itself still applies
  assert.deepEqual(resolveConsultPrefill("?region=gangnam&dong=hwagok4-dong"), { province: "서울", cityDetail: "강남구" });
  // dong without region is meaningless
  assert.equal(consultHref({ dong: "hwagok4-dong" }), "/consult");
  assert.deepEqual(resolveConsultPrefill("?dong=hwagok4-dong"), {});
});
