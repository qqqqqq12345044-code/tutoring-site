# 반응형 자동 검사 리포트

Playwright(Chromium)로 프로덕션 빌드(`next start`)를 직접 열어 375 / 390 / 768 / 1024 / 1440px 5개 뷰포트에서 검사했습니다.

## 대표 페이지 × 뷰포트 매트릭스

| 페이지 | 375 | 390 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/subject/math` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/grade/middle` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/lesson/visit` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/regions` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/region/gyeonggi/suwon/math` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/consult` | ✅ | ✅ | ✅ | ✅ | ✅ |

✅ = 아래 4개 항목 모두 통과: 가로 overflow 없음(`document.documentElement.scrollWidth`가 뷰포트 폭을 초과하지 않음), leaf 텍스트 노드(자식 요소가 없는 순수 텍스트 버튼/링크)의 의도치 않은 줄바꿈 없음, 버튼/헤더/모바일 메뉴/Footer 깨짐 없음, MobileBottomCTA 정상.

**35/35 조합 모두 문제 없음.**

## 세부 확인 항목

- **가로 overflow**: `scrollWidth > innerWidth`를 모든 조합에서 자동 측정 — 전 구간 0건.
- **잘린 text / 버튼 줄바꿈**: 자식 요소가 없는 `<a>`/`<button>`에 대해 "패딩+line-height로 계산한 1줄 높이"와 실제 렌더링 높이를 비교하는 방식으로 검사(단순 카드형 다중 텍스트 요소는 원천적으로 제외). 전 구간 0건.
- **Header**: `sticky top-0` 헤더가 모든 뷰포트에서 정상 표시, 데스크톱 드롭다운 내비게이션(`과외찾기`, `과목별 과외`, `수업방식`) 정상.
- **Mobile menu**: `lg:hidden` 햄버튼 → 전체화면 패널 오픈/클로즈 정상, 포털 렌더링 확인.
- **MobileBottomCTA**: 별도 집중 테스트 결과는 아래 섹션 참고.
- **Footer**: 1440px에서 3열(브랜드/서비스/상담·수업방식) 배치가 과도한 여백 없이 유지됨. 375px에서 세로 스택 정상.
- **Form (`/consult`)**: 375~1440 전 구간에서 select/input/textarea 폭이 컨테이너를 넘지 않음, 라디오 그룹 줄바꿈 없음.
- **Accordion (FAQ)**: 아코디언 열림/닫힘 시 레이아웃 시프트나 overflow 없음 (기존 기능 유지 확인).
- **Search UI (`/regions`)**: 375px에서 입력창+버튼이 한 줄에 정상 배치, 버튼 텍스트("과외 찾기") 줄바꿈 없음.
- **Interactive area 크기**: 버튼류 터치 영역은 375px 기준 44px 안팎(권장 44px에 부합). 체크박스/라디오 네이티브 입력(16×16px)은 브라우저 기본 크기이며 감싸는 `<label>` 전체가 클릭 가능 영역이라 실사용상 문제 없음.

## MobileBottomCTA 집중 테스트 (375 / 390px)

| 항목 | 결과 |
|---|---|
| 콘텐츠 가림 여부 | 없음 — spacer(투명 복제 요소)가 실제 바와 동일한 높이를 차지해 스크롤 최하단에서도 겹치지 않음 |
| Footer 가림 여부 | 없음 — 홈페이지 기준 Footer 마지막 링크 하단과 바 상단 사이 75px 여백 확보 확인 |
| safe-area | `padding-bottom: calc(0.75rem + env(safe-area-inset-bottom))` 정상 적용 (테스트 환경에서 inset=0이라 12px로 계산됨 — 노치 기기에서는 자동으로 증가) |
| 버튼 줄바꿈 | 없음 (`scrollHeight === clientHeight` 확인, 텍스트 "카카오 상담"/"무료 상담" 모두 한 줄) |
| CTA bar 높이 | 69px (버튼 높이 44px + 패딩) — 컴팩트한 수준 유지 |
| `/consult`, `/privacy`, `/terms`에서 숨김 | 3개 페이지 모두 프로덕션 빌드에서 `div.fixed.bottom-0` 자체가 렌더링되지 않음을 확인 |

이번 검수에서 반응형 관련 코드 수정은 없었습니다(전부 기존 상태가 이미 안전한 범위였음).
