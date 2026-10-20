# 광주·전남 / 세종 — 공식 행정구역과 사이트 구조 분석 (2026-10-20, 분석만 · 적용 NO)

## 1. 광주·전남
### 현재
- 공식 표(행정안전부 jscode20261012, KIKmix): 시도 **전남광주통합특별시**(1200000000) 하나, 시군구 27개
  (목포·여수·순천·나주·광양 / 동구·서구·남구·북구·광산구 / 담양~신안 17개 군). 코드 접두 121xx~128xx.
- NEIS: 광주(F10)·전남(Q10) 교육청은 그대로이고, 대부분 주소가 이미 "전남광주통합특별시 …"(일부 "전라남도 …").
  전국 매핑에서 통합 시도로 확정 1,156곳(+PENDING 21).
- 사이트(`src/data/regions.ts`): province `gwangju`(광주광역시) 아래 5개 구, `jeonnam`(전라남도) 아래 22개 시군.
  **route 29개(허브), 전부 noindex, sitemap 0, 등록 학교 0, 동 페이지 0.** 색인된 URL이 없다.
- 이름 대응: 통합 시도의 시군구 27개 이름이 사이트 노드 27개와 1:1(광주 5개 구 ↔ gwangju-*, 나머지 22개 ↔ jeonnam 아래).

### 선택지
| 안 | 내용 | URL 변화 | 위험 |
|---|---|---|---|
| A (권장, 1단계) | URL 그대로. 데이터 매핑만: KIKmix `전남광주통합특별시 + 시군구명` → 기존 노드(구 5개는 gwangju, 그 외 jeonnam) | 없음 | 표시명(광주광역시/전라남도)과 공식 시도명 불일치 — 페이지 문구에서 "2026년 통합 이후 행정동 코드 기준" 안내로 해소 |
| B | 통합 시도 노드 신설(`/region/jeonnam-gwangju/...`), 기존 29개 → 301 | 29개 리다이렉트 | 색인 URL은 없지만 내부 링크·breadcrumb·sitemap 생성기·validator 전부 수정, 통합 명칭·약칭 미확정 |
| C | `gwangju` 유지 + `jeonnam/*` → `gwangju/*` 301 (이전 분석안) | 22개 리다이렉트 | 전남 시군을 광주 아래 두는 표기가 공식 구조와도 사용자 인식과도 다름 |

### A안 적용 시 작업 (승인 후)
1. `scripts/official/lib/admin-dong-table.ts` `officialSigunguNames`: province fullName이 표에 없으면 통합 시도에서 같은 시군구명을 찾는다
   (광주 5개 구는 gwangju 노드에만, 22개는 jeonnam에만 — 이름이 겹치는 구는 없음, 테스트로 고정).
2. `school-import.ts` 재실행 → unmapped-region 1,156 → candidate. route 변화 0(등록은 promote 때만).
3. 동 batch를 열 때: 그 도시에 등록 학교가 없으면 조합 route(~27)·허브 색인 게이트가 켜지므로 첫 batch는 route delta를 먼저 계산
   (`--summary`) — `hasRegionComboRoutes` 보호 때문에 promote가 거부하므로, 첫 학교 등록은 별도 결정 필요.
4. canonical·breadcrumb·sitemap: URL 불변이라 변경 없음. 롤백: 매핑 함수 한 곳 되돌리기.

## 2. 세종
### 현재
- 공식 표: 시도 세종특별자치시, 시군구 행 1개(이름 빈 값, 3611000000), 읍·면·동 25개. 단층 구조.
- 전국 매핑: 105곳 중 104곳 확정(빈 시군구 처리, 2026-10-20), PENDING 1.
- 사이트: province `sejong` 노드 1개(children 없음), route 1개(`/region/sejong`), noindex, 학교 0.
- 동 route는 `/region/[province]/[city]/[dong]` 형식이라 **city 단계가 없는 세종은 지금 구조로 표현할 수 없다.**

### 선택지
| 안 | URL 예 | 비고 |
|---|---|---|
| S1 | `/region/sejong/sejong/[dong]` (city 노드 `sejong` 추가) | 기존 route 코드 그대로, 경로에 세종이 두 번 — breadcrumb 중복 처리 필요 |
| S2 | `/region/sejong/[dong]` (province 직속 동) | 새 route 형식(페이지·generateStaticParams·sitemap·indexability·validator) — 구조 변경 |
- 둘 다 새 public URL이 생기므로 이번 작업에서는 구현하지 않음. 데이터 쪽(매핑·후보 목록)은 이미 세종을 지원(status `unmapped-region`, 사유 "사이트 지역 노드 없음").
- 권장: S1(최소 변경). 승인되면 city 노드 1개 + 읍면동 batch를 같은 커밋에 넣고, 조합 route 증가분(~27)을 미리 계산.
