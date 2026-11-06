/**
 * Known-good SEO scope snapshot, used only to flag *unexpected* drift in
 * validate:full. Real counts are always computed from live code/data
 * (see route-inventory.ts) — this is a regression tripwire, not the source
 * of truth. Update these numbers deliberately (single place) whenever a
 * content/indexing change intentionally moves the scope, e.g. adding a
 * region, subject, school, or regionSubjectContent entry.
 */
export const BASELINE = {
  // 2026-10-09: +206 시·군·구 노드(src/data/regions.ts, 지역 누락 보완) — 학교 미등록이라 허브 1개씩만 생성(noindex).
  // 조합 route(과목·학년·학년×과목·프로그램)는 학교가 등록될 때만 생김(src/lib/regionRoutes.ts) → 미생성 5,562개.
  // 가이드 9편 추가로 sitemap +9. 실측(validate:full): 1482 → 1697, sitemap 202 → 211, noindex 1278 → 1484.
  // 2026-10-16: 의정부 파일럿 — 학교 70곳 등록(NEIS, 행정동 매핑) → 의정부 허브 색인(+1 sitemap), 조합 route 27,
  // 학교 70 + 학교×과목 350, 행정동 허브 15 + 행정동×과목 75 (전부 noindex: 콘텐츠 미작성 또는 품질 게이트 RED).
  // 실측: 1697 → 2234, sitemap 211 → 212, noindex 1484 → 2020.
  // 2026-10-19 전국 1차 행정동 batch: 합정동(마포)·신갈동(용인)·강화읍(강화) 허브 3 + 작성된 동×과목 15 = +18 route,
  // 전부 GREEN·색인(빈 동×과목 route는 만들지 않음 → noindex 증가 0): 2234 → 2252, sitemap 302 → 320.
  // 2026-10-19 전국 2차 batch: 반포본동(서초)·송파2동·잠실4동(송파)·죽전2동(용인)·부평4동(부평) 허브 5 + 동×과목 25
  // = +30 route, 전부 GREEN·색인 → 2252 → 2282, sitemap 320 → 350, noindex 변화 0.
  // 2026-10-20 전국 3차 batch: 이매1동(성남)·마두1동(고양)·신정2동(양천) 허브 3 + 동×과목 15 = +18 route,
  // 전부 GREEN·색인 → 2282 → 2300, sitemap 350 → 368, noindex 변화 0.
  // 2026-10-20 전국 4차 batch: 신수동·대흥동·상암동(마포)·등촌제3동(강서) 허브 4 + 동×과목 20 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 21곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +45 → 2300 → 2345, sitemap 368 → 392, noindex 1930 → 1951.
  // 2026-10-21 전국 5차 batch: 방화제1동·발산제1동(강서)·성산제1동(마포) 허브 3 + 동×과목 15 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 27곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +45 → 2345 → 2390, sitemap 392 → 410, noindex 1951 → 1978.
  // 2026-10-21 전국 6차 batch: 서현1동(성남)·관양동(안양)·등촌제2동(강서) 허브 3 + 동×과목 15 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 11곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +29 → 2390 → 2419, sitemap 410 → 428, noindex 1978 → 1989.
  // 2026-10-23 전국 7차 batch: 방화제3동(강서)·신정3동(양천) 허브 2 + 동×과목 10 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 15곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +27 → 2419 → 2446, sitemap 428 → 440, noindex 1989 → 2004.
  // 2026-10-23 전국 8차 batch: 풍납2동(송파)·목5동(양천) 허브 2 + 동×과목 10 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 13곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +25 → 2446 → 2471, sitemap 440 → 452, noindex 2004 → 2017.
  // 2026-10-23 전국 9차 batch: 신월3동(양천)·서초3동(서초)·염리동(마포) 허브 3 + 동×과목 15 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 16곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +34 → 2471 → 2505, sitemap 452 → 470, noindex 2017 → 2033.
  // 2026-10-26 전국 10차 batch: 대치1동(강남)·세곡동(강남)·오륜동(송파)·위례동(송파) 허브 4 + 동×과목 20 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 24곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +48 → 2505 → 2553, sitemap 470 → 494, noindex 2033 → 2057.
  // 2026-10-26 전국 11차 batch: 오금동·장지동·잠실2동(송파) 허브 3 + 동×과목 15 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 19곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +37 → 2553 → 2590, sitemap 494 → 512, noindex 2057 → 2076.
  // 2026-10-26 전국 12차 batch: 도곡2동·개포2동(강남) 허브 2 + 동×과목 10 (GREEN·색인) + 전국 후보에서
  // 등록한 학교 11곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +23 → 2590 → 2613, sitemap 512 → 524, noindex 2076 → 2087.
  // 2026-10-26 전국 13차 batch(새 학교알리미 수집): 방배3동(서초)·반포1동(서초)·청담동(강남) 허브 3 + 동×과목 15 (GREEN·색인) +
  // 등록한 학교 11곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +29 → 2613 → 2642, sitemap 524 → 542, noindex 2087 → 2098.
  // 2026-10-26 전국 14차 batch(새 학교알리미 수집): 가양제3동(강서)·아현동(마포)·신정4동(양천) 허브 3 + 동×과목 15 (GREEN·색인) +
  // 등록한 학교 8곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0; 신서고·서울아현초는 이미 등록되어 dongSlug만 연결) = +26 → 2642 → 2668, sitemap 542 → 560, noindex 2098 → 2106.
  // 2026-10-26 전국 15차 batch(새 학교알리미 수집): 방배4동(서초) 허브 1 + 동×과목 5 (GREEN·색인) + 등록한 학교 3곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0)
  // = +9 → 2668 → 2677, sitemap 560 → 566, noindex 2106 → 2109.
  // 2026-10-26 전국 16차 batch(새 학교알리미 수집, 첫 경기 동): 상동(부천) 허브 1 + 동×과목 5 (GREEN·색인) + 등록한 학교 3곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0)
  // = +9 → 2677 → 2686, sitemap 566 → 572, noindex 2109 → 2112.
  // 2026-10-27 전국 17차 batch(새 학교알리미 수집): 화곡제4동·가양제1동(강서), 반포3동(서초) 허브 3 + 동×과목 15 (GREEN·색인) + 등록한 학교 9곳의 학교 페이지
  // (콘텐츠 전 noindex, 과목 route 0; 기등록 서울양천초는 dongSlug만 연결) = +27 → 2686 → 2713, sitemap 572 → 590, noindex 2112 → 2121.
  // 2026-10-27 전국 18차 batch(새 학교알리미 수집): 개포1동·삼성1동(강남), 화정1동(고양) 허브 3 + 동×과목 15 (GREEN·색인) + 등록한 학교 11곳의 학교 페이지
  // (콘텐츠 전 noindex, 과목 route 0; 기등록 서울개원초는 dongSlug만 연결) = +29 → 2713 → 2742, sitemap 590 → 608, noindex 2121 → 2132.
  // 2026-10-27 전국 19차 batch(새 학교알리미 수집, 첫 인천 미추홀구 동 포함): 역삼2동(강남)·염창동(강서)·관교동(인천 미추홀) 허브 3 + 동×과목 15
  // (GREEN·색인) + 등록한 학교 13곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0; 기등록 역삼중·관교중은 dongSlug만 연결)
  // = +31 → 2742 → 2773, sitemap 608 → 626, noindex 2132 → 2145.
  // 2026-10-27 전국 20차 batch(새 학교알리미 수집, 첫 인천 연수구·안양 갈산동): 용현5동(인천 미추홀)·송도1동(인천 연수)·갈산동(안양) 허브 3
  // + 동×과목 15 (GREEN·색인) + 등록한 학교 18곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0)
  // = +36 → 2773 → 2809, sitemap 626 → 644, noindex 2145 → 2163.
  // 2026-10-27 전국 21차 batch(새 학교알리미 수집): 수서동(강남)·서초2동(서초) 허브 2 + 동×과목 10 (GREEN·색인) + 등록한 학교 6곳의 학교 페이지
  // (콘텐츠 전 noindex, 과목 route 0; 기등록 양재고는 dongSlug만 연결) = +18 → 2809 → 2827, sitemap 644 → 656, noindex 2163 → 2169.
  // 2026-10-27 전국 22차 batch(새 학교알리미 수집): 신사동(강남)·계산4동(인천 계양)·연수3동(인천 연수) 허브 3 + 동×과목 15 (GREEN·색인)
  // + 등록한 학교 11곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0; 기등록 현대고·계산중·연수중은 dongSlug만 연결)
  // = +29 → 2827 → 2856, sitemap 656 → 674, noindex 2169 → 2180.
  // 2026-10-27 전국 23차 batch(새 학교알리미 수집): 송도3동(인천 연수)·부개3동(인천 부평)·계양2동(인천 계양) 허브 3 + 동×과목 15 (GREEN·색인)
  // + 등록한 학교 23곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +41 → 2856 → 2897, sitemap 674 → 692, noindex 2180 → 2203.
  // 2026-10-27 전국 24차 batch(새 학교알리미 수집): 성남동(성남 중원)·중2동(부천 원미) 허브 2 + 동×과목 10 (GREEN·색인)
  // + 등록한 학교 17곳의 학교 페이지(콘텐츠 전 noindex, 과목 route 0) = +29 → 2897 → 2926, sitemap 692 → 704, noindex 2203 → 2220.
  // 2026-11-02 전국 학교 hub 계층(PAGE_ONLY) + 25차 batch = 광역시 pilot (docs/qa/national-school-expansion-readiness-2026-11-02.md):
  // ① 등록되지 않은 CONFIRMED 학교 10,149곳의 /school/[slug] hub(src/data/nationalSchools.json, on-demand 렌더, 전부 noindex·sitemap 제외)
  // → 2926 → 13075, noindex 2220 → 12369, sitemap 변화 0, 정적 생성 페이지 수 변화 0.
  // ② 울산 무거동(남구)·대전 신성동(유성구) 허브 2 + 동×과목 10 (GREEN·색인) + 학교 15곳 등록(전국 hub에서 등록 학교로 이동, route 수 0)
  // + 첫 학교로 켜진 ulsan-nam·daejeon-yuseong 조합 route 54(전부 noindex) + 시·도/구 허브 4곳(울산·울산 남구·대전·대전 유성구) noindex→index
  // = +66 → 13075 → 13141, sitemap 704 → 720, noindex 12369 → 12419.
  // ③ 시·도 허브 울산·대전은 동 1곳뿐이라 서로 이름 마스킹 100% 동일 → src/data/regionNoindex.ts 보류(원래 noindex였음): sitemap 720 → 718, noindex 12419 → 12421.
  // 2026-11-02 Phase 2 학교→학년→과목 pilot (docs/qa/national-school-content-expansion-2026-11-02.md): 잠실고·죽전고·계산중·무거중·대덕고
  // 학년×과목 54 (학교알리미 평가계획 OFFICIAL, 전부 GREEN·색인) + 학년 hub 12 (GREEN 6 색인, 무거중·계산중 AMBER 6 noindex,
  // src/data/schoolGradeNoindex.ts) = +66 → 13141 → 13207, sitemap 718 → 778, noindex 12421 → 12427. 전국 10,134 hub에는 학년 route 없음.
  // 2026-11-02 26차 = 부산 하단제2동(사하구)·대구 범어4동(수성구), 첫 부산·대구 동: 학교 11곳 등록(전국 hub에서 이동, route 0)
  // + 첫 학교로 켜진 busan-saha·daegu-suseong 조합 route 54(noindex) + 동 hub 2 + 동×과목 10(GREEN·색인) + 학년 hub 9(GREEN 6 색인,
  // 하단중 AMBER 3 noindex) + 학년×과목 36(GREEN·색인) = +111 → 13207 → 13318. 구 허브 busan-saha·daegu-suseong noindex→index,
  // 시·도 허브 부산·대구는 regionNoindex.ts 보류(울산·대전과 같은 1개 동 템플릿) → sitemap 778 → 834, noindex 12427 → 12482.
  // 2026-11-02 27차 = 경남 창원 봉암동·강원 원주 반곡관설동, 첫 경남·강원 동: 학교 10곳 등록(전국 hub에서 이동, route 0)
  // + changwon·wonju 조합 route 54(noindex) + 동 hub 2 + 동×과목 10(GREEN·색인) + 학년 hub 9(GREEN 4 색인, 창신중·영서고 AMBER 5
  // noindex) + 학년×과목 36(GREEN·색인) = +111 → 13318 → 13429. 시 허브 changwon·wonju noindex→index, 시·도 허브 경남·강원은
  // regionNoindex.ts 보류(1개 동 템플릿) → sitemap 834 → 888, noindex 12482 → 12539.
  // 2026-11-02 28~29차 = 충북 청주 탑대성동·충남 천안 병천면·전북 전주 노송동·경북 안동 서구동(각 시·도 첫 동): 학교 16곳 등록
  // (전국 hub에서 이동, route 0) + 4개 시 조합 route 108(noindex) + 동 hub 4 + 동×과목 14(GREEN·색인) + 학년 hub 17(GREEN 13 색인,
  // 전주신일중 RED 2·병천중 AMBER 2 noindex) + 학년×과목 61(GREEN·색인) = +204 → 13429 → 13633. 시 허브 4곳 noindex→index,
  // 시·도 허브 충북·충남·전북·경북은 regionNoindex.ts 보류(1개 동 템플릿) → sitemap 888 → 984, noindex 12539 → 12647.
  // 2026-11-03 Batch 30 = 제주 제주시 한림읍(제주 첫 동) + 청주 금천동·천안 원성1동·전주 평화1동·경북 영주1동(영주 첫 동, 각 시·도 2번째 동):
  // 학교 16곳 등록(전국 hub에서 이동, route 0) + 새 도시 조합 route 54(jeju-si·yeongju, noindex) + 동 hub 5 + 동×과목 24(GREEN·색인) +
  // 학년 hub 30(GREEN 12 색인, AMBER 18 noindex) + 학년×과목 124(GREEN 119 색인, 천성중 AMBER 5 noindex) = +237 → 13633 → 13870.
  // 시 허브 jeju-si·yeongju noindex→index, 시·도 허브 제주는 regionNoindex.ts 보류 → sitemap 984 → 1146(+동 5 +동×과목 24 +학년×과목 119
  // +학년 hub 12 +시 허브 2), noindex 12647 → 12722(+조합 54 +AMBER hub 18 +AMBER 학년×과목 5 −시 허브 2).
  // 2026-11-05 Batch 31 = 경북 영천 금호읍(영천 첫 동)·충남 아산 온양5동(아산 첫 동)·충북 청주 옥산면(청주 3번째 동): 학교 7곳 등록
  // (전국 hub에서 이동, route 0; 경북휴먼테크고는 PDF 공시라 hub만) + 새 도시 조합 route 54(yeongcheon·asan, noindex) + 동 hub 3 +
  // 동×과목 15(GREEN·색인) + 학년 hub 14(GREEN 11 색인, 금호여중 AMBER 3 noindex) + 학년×과목 58(GREEN·색인) = +144 → 13870 → 14014.
  // 시 허브 yeongcheon·asan noindex→index → sitemap 1146 → 1235(+동 3 +동×과목 15 +학년×과목 58 +학년 hub 11 +시 허브 2),
  // noindex 12722 → 12777(+조합 54 +AMBER hub 3 −시 허브 2). Production sitemap 대비 삭제 0.
  // 2026-11-05 Batch 32 = 제주 제주시 조천읍·애월읍(제주 2·3번째 동): 학교 8곳 등록(전국 hub에서 이동, route 0; 조천중·애월고·신엄중·
  // 귀일중은 PDF 공시라 hub만, 함덕중은 HWPX인 2학년만) + 동 hub 2 + 동×과목 10(GREEN·색인) + 학년 hub 8(GREEN 6 색인, 함덕고 AMBER 2
  // noindex) + 학년×과목 33(GREEN·색인) = +53 → 14014 → 14067. 새 도시 없음. sitemap 1235 → 1286(+51), noindex 12777 → 12779(+2).
  // 2026-11-05 Batch 33 = 울산 남구 신정2동(남구 2번째 동): 학교 4곳 등록(학성고·울산서여중은 PDF 평가계획이라 hub만) + 동 hub 1 +
  // 동×과목 5(GREEN·색인) + 학년 hub 5(GREEN 3 색인, 학성중 1·2 AMBER noindex) + 학년×과목 20(GREEN·색인) = +31 → 14067 → 14098.
  // sitemap 1286 → 1315(+29), noindex 12779 → 12781(+2).
  // 2026-11-06 Batch 34 = 대구 달서구 도원동 + 부산 동래구 사직제2동(둘 다 새 도시, --allow-new-city): 학교 9곳 등록(전국 학교 route가
  // 이미 있어 route 수 변화 없음, 대곡고·사직여고 PDF·동인고·사직여중 zip이라 hub만) + 새 도시 조합 route 54(27×2, noindex) + 동 hub 2 +
  // 동×과목 10 + 학년 hub 11 + 학년×과목 41(신규 색인 64) = +118 → 14098 → 14216. 도시 hub 2개는 기존 noindex route가 색인으로 전환.
  // sitemap 1315 → 1381(+66 = 신규 64 + 도시 hub 2), noindex 12781 → 12833(+52 = 신규 54 − 전환 2).
  // 2026-11-06 Batch 35 = 전국 확장 10개 동(제주 아라동·한경면, 안양 부림동, 아산 탕정면, 부천 오정동, 청주 모충동, 울산 대현동,
  // 용인 신봉동, 새 도시 춘천 후평2동·포항 연일읍): 학교 41곳 등록(전국 학교 route 기존) + 새 도시 조합 route 54(noindex) + 동 hub 10 +
  // 동×과목 48(대현동 영어·과학 없음) + 학년 hub 44(과목 1개 hub 2곳 noindex) + 학년×과목 168 = +324 → 14216 → 14540.
  // 신선여고 1학년 통합사회2는 hub 보류 시 orphan이라 항목을 넣지 않음. sitemap 1381 → 1651(+270 = 신규 268 + 도시 hub 2 전환),
  // noindex 12833 → 12887(+54 = 신규 56(조합 54 + 보류 hub 2) − 전환 2).
  // 2026-11-06 Batch 36 = 전국 확장 8개 동(마포 성산제2동, 양천 목4동, 제주 연동·화북동, 울산 옥동·삼산동, 천안 문성동, 원주 무실동,
  // 새 도시 없음): 학교 23곳 등록(전국 학교 route 기존) + 동 hub 8 + 동×과목 37 + 학년 hub 24 + 학년×과목 84 = +153 → 14540 → 14693.
  // sitemap 1651 → 1804(+153, 전부 색인), noindex 12887 유지.
  // 2026-11-06 Batch 37 = 전국 확장 24개 동(경주 문무대왕면, 안동 풍산읍·송하동, 아산 둔포면·온양3동, 부천 역곡1동, 천안 봉명동·불당2동,
  // 춘천 교동·동면, 구미 선산읍·산동읍, 경산 진량읍·서부1동·동부동, 청주 봉명2.송정동, 전주 풍남동·중화산1동·인후3동, 포항 구룡포읍·대이동,
  // 원주 우산동, 영주 휴천1동·가흥2동; 새 도시 경주·구미·경산): 학교 57곳 등록(전국 학교 route 기존) + 새 도시 조합 route 81(27×3, noindex)
  // + 동 hub 24 + 동×과목 106 + 학년 hub 56 + 학년×과목 207 = +474 → 14693 → 15167. 도시 hub 3개는 noindex → 색인 전환.
  // sitemap 1804 → 2200(+396 = 신규 393 + 도시 hub 3), noindex 12887 → 12965(+78 = 조합 81 − 전환 3).
  // 2026-11-06 학습 가이드 9편 추가(국어·영어·수학 각 2, 고등 내신·수능·중등 내신 각 1, 전부 색인) = +9 → 15167 → 15176,
  // sitemap 2200 → 2209, noindex 12965 유지.
  totalRoutes: 15176,
  // 2026-10-06: +6 indexed region×grade×subject pages (STEP 8, quality gate GREEN).
  // They were already routes (noindex fallback), so totalRoutes is unchanged.
  // 2026-10-06: −5 school×subject pages held noindex (src/data/schoolSubjectNoindex.ts, editorial AMBER holds).
  // 2026-10-07: +5 school×subject holds released after GREEN rewrite (공시 평가계획), −2 반포중(휴교) school page + math page
  // held noindex (src/data/schoolNoindex.ts, schoolSubjectNoindex.ts): 199 → 202, noindex 1281 → 1278.
  // 2026-10-16 2단계: 행정동×과목 9개(송산2동·흥선동·신곡2동 × 국어·영어·수학)를 학교알리미 평가계획으로 다시 써서
  // 품질 게이트 GREEN → qualityNoindex에서 제외되어 색인: sitemap 212 → 221, noindex 2020 → 2011.
  // 2026-10-16 확대: 나머지 12개 동 × 국어·영어·수학 36개도 같은 방식(src/data/dongSubjectContent.ts)으로 GREEN
  // → 색인: sitemap 221 → 257, noindex 2011 → 1975. 행정동×과목 사회·과학 30개와 동 허브 15개는 RED·noindex 유지.
  // 2026-10-19 의정부 완성: 행정동×과목 사회·과학 30개를 같은 방식으로 다시 써서 GREEN, 행정동 허브 15개도 동별 과목
  // 평가계획 요약을 실어 GREEN → 색인 45개 추가: sitemap 257 → 302, noindex 1975 → 1930 (route 수 변화 없음).
  sitemapCount: 2209,
  noindexCount: 12965,
  brokenLinks: 0,
};
