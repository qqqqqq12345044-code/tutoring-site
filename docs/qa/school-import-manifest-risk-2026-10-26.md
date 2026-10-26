# school-import.ts `--write` — manifest 부재 시 `operating` 상태 소실 위험 분석 (2026-10-26)

분석만 했다. 코드는 수정하지 않았다(별도 작업 후보).

## 증상
- 학교알리미 manifest(`.cache/official/schoolinfo/manifest.json`, gitignored)가 회사 PC 것이 아닌 환경에서 `npx tsx scripts/official/school-import.ts --write`를 실행하면 `data/official/school-candidates.json`의 기존 약 233교 `operating: "disclosed-2026-3"` 값이 `"unverified"`로 바뀐다(13차 작업 중 diff 466줄로 확인, 저장 전에 중단하고 HEAD 기준으로 필요한 줄만 직접 갱신).

## 근본 원인 (코드 경로)
1. `buildCandidates()`(`school-import.ts` ~149행)는 **저장된 candidates JSON을 입력으로 쓰지 않고** NEIS 전국 목록(`national-school-dongs.json`)에서 후보를 매번 새로 만든다.
2. 각 후보의 `operating`은 같은 함수 안에서 `disclosed.has(r.neisCode) ? "disclosed-2026-3" : "unverified"`로 **현재 manifest만으로 재계산**한다(~200행). `disclosed`는 `disclosedCodes()`(~133행)가 manifest의 `term==="3" && !error && files>0`인 학교 코드 집합이다.
3. `disclosedCodes()`는 manifest 파일이 없으면 빈 집합을 돌려주고, 있어도 **그 환경에서 받은 학교만** 포함한다. 이전 JSON에 있던 `operating` 값과 병합하는 단계가 없다.
4. `--write`는 위 결과를 그대로 `school-candidates.json`에 덮어쓴다(~358행). `diff()`가 변화 요약만 출력하고 저장을 막지는 않는다.
- 결과적으로 `operating`은 "한 번 확인한 사실"이 아니라 "이 PC의 manifest에 지금 있는지"로 취급된다.

## 영향 범위
- `school-candidates.json`의 `operating`(약 233교 → unverified로 회귀). `status`(registered/candidate)는 `schools`/`school-dongs.json`에서 오므로 유지된다.
- `--promote`는 `operating === "disclosed-2026-3"`인 후보만 등록하므로, **manifest가 없는 환경에서 `--write` 이후에 `--promote`를 하면 이미 확인했던 학교도 "공시 미확인"으로 건너뛴다.** (이번 세션에서는 `--promote --write`가 `buildCandidates()`를 메모리에서만 쓰기 때문에 안전했다.)
- 사이트 route에는 직접 영향이 없다(등록된 학교는 `schools.imported.ts`에 이미 있음). 데이터 손실은 검증 이력(어떤 학교의 3차 공시를 확인했는지)이다.
- `--promote`는 추가로 `.cache/official/neis/national-*.json`(학교 상세 NEIS 행)이 필요하며 새 환경에서는 없다 → 단건 조회로 만든 캐시를 쓰는 우회가 필요했다.

## 안전한 호출 조건 (현재 코드 기준)
- `--dongs`, `--summary`, 인자 없는 dry run, `--promote <동코드>`(쓰기 없이)와 `--promote <동코드> --write`(`schools.imported.ts`만 씀)는 candidates JSON을 쓰지 않으므로 안전하다.
- `school-import.ts --write`(인자 없는 저장)는 **전체 manifest가 있는 환경에서만** 실행한다.

## 최소 수정 후보
1. `buildCandidates()`에서 이전 `school-candidates.json`을 읽어 `operating`이 이미 `"disclosed-2026-3"`이면 manifest에 없어도 **유지**(단조 증가: unverified → disclosed만 허용, 반대 방향은 명시 플래그 `--reverify`일 때만).
2. `--write` 직전에 "기존 disclosed였던 코드가 줄어드는 변경"이 있으면 건수를 출력하고 `--force-demote` 없이는 저장을 거부.
3. manifest가 없거나 학교 수가 이전 대비 크게 적으면 경고(예: 이전 disclosed 수의 50% 미만).
4. 필요하면 확인 이력을 gitignored manifest가 아닌 추적되는 JSON(`operating` 확인 일자 포함)으로 옮긴다.

## regression test 아이디어
- 입력: `school-candidates.json`(operating 일부 disclosed) + 빈 manifest → 기대: `--write` 후 disclosed 수가 줄지 않음(수정 후) / 줄면 종료 코드 ≠ 0.
- 입력: manifest에 새 학교 2곳 추가 → 기대: 그 2곳만 unverified → disclosed, 나머지 불변.
- `disclosedCodes()` 단위 테스트: 파일 없음/빈 파일/`term!=="3"`/`error` 있음/`files` 0개 각각.
- 스냅샷: 실제 `school-candidates.json`에 대해 `buildCandidates()` 결과의 `operating` 분포가 manifest 유무와 무관하게 동일해야 함(수정 후).

## 현재 미반영 상태 (참고)
- 14·15·16차 신규 등록 학교 14곳은 `school-candidates.json`에 아직 `status: "registered"`로 갱신되지 않았다(13차 11곳은 직접 반영). 안전한 갱신은 위 수정 후 또는 전체 manifest가 있는 환경에서만 한다.
