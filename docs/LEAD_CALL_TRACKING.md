# Lead / Telegram / Call Tracking (기존 전화번호 유지형) — 운영 문서

DORAN(dorancoaching.com)과 교과설계소(gyogwaseolgye.com)의 공통 구조. 두 repo의 core(`lib/leads/*` /
`src/lib/leads/*`)는 import 확장자만 다르고 내용이 같다 — 한쪽을 고치면 다른 쪽도 맞춘다.
작성: 2026-10-27. **이 문서의 모든 기능은 env를 넣기 전까지 OFF다(기존 Production 동작과 동일).**

## 1. 흐름

```
방문(UTM/referrer/NaPm) ─ sessionStorage(first touch + last touch)
   ├─ 웹 상담 저장 성공 ─→ LeadEvent(WEB_FORM) ─→ Telegram "신규 상담"
   └─ tel: 클릭 ─(sendBeacon)→ PhoneClickEvent(클릭 시점 attribution snapshot)
                                        │
기존 번호로 실제 통화 ─(착신전환)→ Call Provider ─ signed webhook ─→ /api/calls/webhook
                                        │  verify → idempotency → normalize → 클릭과 매칭
                                        └─→ LeadEvent(PHONE, CONFIRMED|LIKELY|UNKNOWN) ─→ Telegram "통화 완료/부재중"
대시보드: GET /api/leads/dashboard (Bearer LEAD_DASHBOARD_TOKEN) → 집계 contract
```

- 전화번호 값/표시/CTA UI는 바꾸지 않았다. tel: 계측은 layout에 마운트한 위임 click listener(capture,
  `preventDefault` 없음, beacon fire-and-forget) 하나로 모든 tel: 링크에 적용된다.
- 전화 attribution 신뢰도: provider가 click id를 돌려주면 **CONFIRMED**, 클릭 후 3분 안에 시작된 통화면
  **LIKELY(추정)**, 그 외 **UNKNOWN**. LIKELY는 Telegram/대시보드에 "추정"으로 따로 표시하고 matched와 섞지 않는다.
  같은 클릭을 두 통화에 재사용하지 않으며, window 안 후보들의 유입이 서로 다르면 `ambiguous=true`.

## 2. 파일

| 역할 | DORAN | 교과설계소 |
|---|---|---|
| schema | `lib/leads/types.ts` | `src/lib/leads/types.ts` |
| 입력 정리/마스킹 | `sanitize.ts` | 동일 |
| flags | `flags.ts` | 동일 |
| Telegram adapter + 메시지 | `telegram.ts` | 동일 |
| 클릭↔통화 매칭 | `callMatching.ts` | 동일 |
| CallProvider interface + HMAC | `callProvider.ts`, `providers/{mock,twilio,index}.ts` | 동일 |
| STT/요약 결정 | `summary.ts` | 동일 |
| 저장소 seam(in-memory) | `store.ts` | 동일 |
| 대시보드 contract | `dashboard.ts` | 동일 |
| orchestration(테스트 가능) | `service.ts`, `server.ts` | 동일 |
| 브라우저 공통 | `clientCore.ts` | 동일 |
| 사이트 연결부 | `doranClient.ts`(기존 `lib/attribution.ts` 재사용) | `attribution.ts`(신규, 같은 규칙) + `gyogwaseolgyeClient.ts` |
| 마운트 | `components/LeadTracking.tsx` + `app/layout.tsx` 2줄 | `src/components/analytics/LeadTracking.tsx` + layout 2줄 |
| 웹 lead 생성 지점 | `ConsultationSection.tsx` 성공 분기 1줄 → `POST /api/leads/web` | `/api/consult` 저장 성공 후 `after()` |
| routes | `app/api/leads/{web,phone-click,dashboard}`, `app/api/calls/webhook` | `src/app/api/leads/{phone-click,dashboard}`, `src/app/api/calls/webhook` |
| 검증 | `npm run validate:leads` | `npm run validate:leads` |

## 3. 환경변수 / Feature flags (전부 기본 OFF, 값이 정확히 `true`일 때만 ON)

| 변수 | 위치 | 의미 |
|---|---|---|
| `NEXT_PUBLIC_LEAD_EVENTS_ENABLED` | client(build 시 inline → 바꾸면 **재배포**) | first-touch 저장 + 웹 lead beacon/attribution 전송 |
| `NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED` | client(재배포) | tel: 클릭 beacon |
| `LEAD_EVENTS_ENABLED` | server | 웹 LeadEvent 생성 |
| `LEAD_TELEGRAM_ENABLED` | server | Telegram 알림 |
| `TELEGRAM_LEAD_BOT_TOKEN` / `TELEGRAM_LEAD_CHAT_ID` | server secret | 없으면 알림 비활성 |
| `PHONE_CLICK_TRACKING_ENABLED` | server | `/api/leads/phone-click` 수신 |
| `PHONE_CLICK_TELEGRAM_ENABLED` | server | 클릭 즉시 알림(노이즈 → 기본 OFF 권장) |
| `CALL_PROVIDER_ENABLED` | server | `/api/calls/webhook` 수신 |
| `CALL_PROVIDER` | server | `mock`(Production에서 거부) / `twilio` |
| `CALL_WEBHOOK_SECRET` | server secret | mock HMAC secret |
| `TWILIO_AUTH_TOKEN` / `TWILIO_WEBHOOK_URL` | server secret | twilio 서명 검증(URL은 콘솔에 등록한 정확한 webhook URL) |
| `CALL_RECORDING_ENABLED` | server | OFF면 transcript 조회 안 함(DISABLED) |
| `CALL_AI_SUMMARY_ENABLED` | server | OFF면 요약 안 함(DISABLED) |
| `LEAD_DASHBOARD_TOKEN` | server secret(24자 이상) | 없으면 대시보드 404 |

## 4. 활성화 순서 (각 단계 사용자 승인 후)

- **Phase A 웹 상담 Telegram**: Bot 생성 → token/chat id를 Vercel **Preview**에 등록 → `LEAD_EVENTS_ENABLED`,
  `LEAD_TELEGRAM_ENABLED`, `NEXT_PUBLIC_LEAD_EVENTS_ENABLED`=true → Preview 재배포 → fake 상담 1건(실제 번호 대신
  010-0000-0000) → 메시지 확인 → Production 승인. DORAN은 Apps Script 저장 흐름을 바꾸지 않는다(성공 후 별도 beacon).
- **Phase B 전화 클릭 attribution**: `NEXT_PUBLIC_PHONE_CLICK_TRACKING_ENABLED`, `PHONE_CLICK_TRACKING_ENABLED`.
  ⚠ 기본 store가 인스턴스 메모리라 **Phase C 전에 durable store(KV/DB/Sheet)를 `LeadEventStore`로 붙여야** 매칭이
  인스턴스 간에 유지된다(현재 미구현 — 저장소 선택은 사용자 결정).
- **Phase C 기존 번호 연동 provider**: 아래 비교표 참고. 착신전환 설정은 사용자가 통신사에서 직접.
- **Phase D 통화 완료 이벤트**: `CALL_PROVIDER_ENABLED`, `CALL_PROVIDER`, secret.
- **Phase E 녹취/STT/요약**: 고지·동의·보관기간 확정 후 `CALL_RECORDING_ENABLED`, `CALL_AI_SUMMARY_ENABLED`.
  provider 요약이 있으면 그것만 쓰고, 별도 외부 AI 요약 adapter는 **아직 없음**(구현 시 별도 승인).

## 5. 기존 번호 연동 Provider 비교 (2026-10-27 웹 조사, 공식 문서 기준 / 미확인은 UNKNOWN)

| Provider | 기존 번호 그대로 | 방식 | 내부 provider 번호 | API/Webhook | 녹취/STT/요약 | 비용 | 적합도 |
|---|---|---|---|---|---|---|---|
| Twilio | Y(착신) | 010 → 착신전환 → Twilio KR 번호 | **필요**(KR 번호는 사업자 등록) | Y / Y(X-Twilio-Signature) | 녹취 API Y, 한국어 STT/요약 UNKNOWN | UNKNOWN | 2순위(조건부) — scaffold 구현 |
| 채널톡 전화 | Y(착신) | 010 → 착신 부가서비스 → 채널톡 070 | **필요(070)** | Open API Y, 통화 webhook UNKNOWN | 녹취/STT Y(2023 보도), 요약 UNKNOWN | UNKNOWN | 2순위 — webhook 확인 필요 |
| Calloud | Y(착신) | 착신전환 | 필요(유형 미기재) | UNKNOWN | 녹취 Y, 나머지 UNKNOWN | 앱 무료 표기 | 2순위 하 |
| SKT 에이닷 / LG U+ 익시오 / Galaxy AI | Y(같은 회선) | 단말/통신사 기능 | 불필요 | **없음** | Y/Y/Y(앱·단말 내부만) | UNKNOWN / 단말 포함 | 2순위(서버 연동 불가) |
| KT AI 통화비서 | UNKNOWN(010 경로 불명) | 착신 모드 | UNKNOWN | 없음 | 부재 메모(앱) | Lite 5천/Std 2만원/월(2022 기사) | 보류 |
| Quo(OpenPhone)·CallRail·RingCentral·Aircall | — | — | 필요 | — | — | — | **제외**(KR 번호 없음/미확인) |
| Dialpad | — | provider 번호 필수, KR Restricted | 필요 | — | — | — | 제외 |
| 050비즈콜 | N | 새 050 번호 | — | — | — | — | **제외**(새 번호) |

결론: **Tier 1(기존 번호 + API/webhook + 녹취/STT/요약)으로 검증된 한국 서비스는 없음.** 010 번호를 서버 이벤트로
받으려면 착신전환이 유일한 경로이고, 그 경우 고객에게는 보이지 않지만 provider 쪽 번호(070/+82)가 내부적으로 생긴다 —
이것을 "새 번호"로 볼지는 사용자 결정. "무응답 시 착신"은 부재중만 잡히고 응답 통화는 기록되지 않는다.
비용·STT 정보 일부는 2022~2023 보도 기준이므로 계약 전 업체에 재확인.
출처: docs.channel.io(번호 연동), twilio.com/en-us/guidelines/kr/regulatory, twilio.com/docs/usage/webhooks/webhooks-security,
support.quo.com webhooks, help.dialpad.com country-coverage, news.sktelecom.com/199235, App Store(AI비즈콜·AI 통화비서·Calloud·050비즈콜).

## 6. 개인정보 / 보안

- LeadEvent/PhoneClickEvent/Telegram/대시보드/로그에 이름·연락처·이메일·주소·상담 내용·transcript 원문 없음.
  웹 lead는 선택형 값(언어/목적/수준, 교과설계소는 과목/학년)과 유입 정보만. 발신번호는 provider가 줄 때만 `010-****-1234`.
- transcript는 요약 입력으로 메모리에서만 쓰고 저장/알림하지 않는다. 로그는 실패 분류 한 줄(`[leads] ... failed: timeout`).
- secret 하드코딩 없음, 서명 검증(HMAC-SHA256 + 5분 replay window / Twilio HMAC-SHA1), timingSafeEqual, 본문 크기 제한,
  IP rate limit(인스턴스 메모리), 중복 webhook 흡수.
- 한계: DORAN `/api/leads/web`은 Apps Script 저장을 서버에서 확인할 수 없어(클라이언트 직접 전송 구조) 위조 beacon이
  가능하다 — rate limit만 있음. 교과설계소는 서버에서 저장 성공 후에만 lead를 만든다.

### 활성화 시 개인정보처리방침에 추가 검토가 필요한 항목(초안 — 사업자 확인 후 문구 확정, 지금 페이지에는 쓰지 않음)
1. 전화 버튼 클릭 시 방문 경로(유입 매체·캠페인·랜딩 페이지·클릭 페이지)와 임의 세션 식별자를 수집(Phase B).
2. 상담 접수 알림을 위해 Telegram(해외 사업자)으로 비식별 유입·선택 정보 전송 → 국외 이전/처리위탁 해당 여부 확인(Phase A).
3. 통화 연동 provider(착신전환) 이용 시 통화 일시·통화 시간·응답 여부 처리, provider 처리위탁 고지(Phase C/D).
4. 녹취·STT·AI 요약: 통화 시작 시 녹음 고지 안내, 동의, 보관 기간·파기, 요약 처리 주체(Phase E). 활성화 전까지 "녹취 중/AI 분석 중" 문구 금지.

## 7. 검증 방법

- `npm run validate:leads` — fake 데이터 64개 시나리오(flag OFF 404/무저장, 웹 lead·PII 미포함, Telegram timeout/http/network 실패 격리,
  클릭 파싱·시계 보정, CONFIRMED/LIKELY/UNKNOWN/ambiguous/재사용 금지, webhook 정상·서명 오류·변조·replay·중복·형식 오류,
  부재중 마스킹, 녹취/요약 OFF, provider 요약 우선, Twilio 서명, 대시보드 집계/UNKNOWN).
- 수동 smoke(로컬 fake env): `next dev`에 위 flag + `CALL_PROVIDER=mock` + fake secret, Telegram token은 비워 둠 → tel 클릭 후
  `/api/calls/webhook`에 서명된 fake 이벤트 → 응답의 `confidence` 확인 → Bearer로 `/api/leads/dashboard`.
