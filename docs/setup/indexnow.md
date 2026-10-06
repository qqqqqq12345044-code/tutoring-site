# IndexNow 운영 가이드 (네이버 / Bing 등)

상태(2026-10-06): **전송 준비 구조만 완료, 실제 전송은 한 번도 하지 않음.**
키(`INDEXNOW_KEY`)와 `public/<키>.txt`가 아직 없고, 키를 코드에 하드코딩하지 않는다.

## 구성 요소

| 요소 | 위치 | 역할 |
|---|---|---|
| 스크립트 | `scripts/indexnow.ts` | `prepare` / `status` / `submit [--send]` |
| 키 | 환경변수 `INDEXNOW_KEY` (로컬 전용) | 8~128자 `[a-zA-Z0-9-]`. 코드·저장소에 저장하지 않음 |
| 키 파일 | `public/<키>.txt` (내용 = 키 한 줄, UTF-8) | 배포되어 `https://gyogwaseolgye.com/<키>.txt`로 열려야 함 |
| 변경분 | `node_modules/.cache/indexnow-pending.json` | `prepare`가 만드는 임시 파일 (git 제외) |

IndexNow 키는 **공개되는 것이 정상**이다(소유 증명용 파일이 공개 URL에 놓임). 다만 이 저장소에
키 값이 들어가는 것은 사용자가 직접 정하고 커밋 여부를 판단한다.
`INDEXNOW_KEY`는 로컬에서 스크립트를 돌릴 때만 필요하며 **Vercel 환경변수로 등록할 필요가 없다.**

## 변경분 계산 방식 (`prepare`, 읽기 전용)

운영 `sitemap.xml`(= 직전 배포)과 로컬 `sitemap()`(= 이번 배포)을 비교한다.
- `added`: 로컬에만 있는 URL
- `removed`: 운영에만 있는 URL (noindex 전환·삭제)
- `changed`: 양쪽에 있고 `lastmod`가 다른 URL (`src/data/contentDates.ts` 기준)

2026-10-06 실측: STEP 8 반영본 기준 `added 6 / removed 0 / changed 0` — 운영 198 → 로컬 204로,
이번에 추가한 6개 지역×학년×과목 페이지와 정확히 일치했다. 운영 서버에는 GET만 보냈고 전송은 하지 않았다.

## 전송 절차 (사용자 작업과 Claude 작업 구분)

| 순서 | 작업 | 담당 |
|---|---|---|
| 1 | 키 생성: 아무 도구로 8~128자 `[a-zA-Z0-9-]` 문자열 생성 (예: UUID에서 `-` 제거) | **사용자** |
| 2 | 로컬 `.env.local`에 `INDEXNOW_KEY=<키>` 추가 | **사용자** |
| 3 | `public/<키>.txt` 생성(내용은 키 한 줄)하고 커밋·배포 | 사용자 승인 후 Claude 가능 |
| 4 | 배포 **직전**: `npx tsx scripts/indexnow.ts prepare` | Claude 가능 |
| 5 | 배포 (키 파일이 포함되도록) | **사용자 승인 필요** |
| 6 | 배포 **직후**: `npx tsx scripts/indexnow.ts status` → `READY`인지 확인 | Claude 가능 |
| 7 | `npx tsx scripts/indexnow.ts submit` (dry-run, 요청 내용 출력만) | Claude 가능 |
| 8 | `npx tsx scripts/indexnow.ts submit --send` (실제 전송, 1회) | **사용자 명시 승인 후에만** |

`status`는 키 값을 출력하지 않고 아무것도 전송하지 않는다. 키 미설정·키 파일 미배포·pending 없음 중
하나라도 있으면 `NOT READY`(exit 1)이다. `submit`은 추가로 각 URL이 운영에서 200이고 live sitemap에
있는지 다시 확인하고, 한 번 전송하면 pending 파일을 지워 같은 변경을 두 번 보내지 않는다.

## 네이버 관련

- 네이버는 2023-07 IndexNow 지원을 발표했고 엔드포인트는 스크립트에 `https://searchadvisor.naver.com/indexnow`로 지정돼 있다.
  **첫 `--send` 전에 네이버 공식 안내에서 엔드포인트·요구 조건을 다시 확인할 것**(이번 작업에서는 공식 문서를 직접 확인하지 못했고
  제3자 글 기준으로 "키만 있으면 사용 가능"이라는 설명을 봤을 뿐이다 — 미확인).
- 서치어드바이저 **사이트 등록·소유확인, sitemap/RSS 수동 제출, 수집 요청**은 네이버 계정 로그인이 필요한 작업이라
  Claude가 대신하지 않는다. → **사용자**가 서치어드바이저에서 직접 진행.
- IndexNow는 크롤러에 변경 사실을 알리는 신호일 뿐 색인·노출을 보장하지 않는다.

## 주의

- URL 수 상한은 스크립트에서 500개(`MAX_URLS_PER_RUN`)로 제한한다. 초과하면 중단하고 검토를 요구한다.
- `prepare`는 배포 직전에 다시 실행한다(오래된 pending이 현재 배포와 어긋나지 않도록).
- `.env.local`의 값(상담 Webhook secret 등)은 이 작업과 무관하며 건드리지 않는다.
