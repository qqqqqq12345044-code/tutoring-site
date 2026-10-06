/**
 * 교과설계소 상담 신청 Web App (Google Apps Script) — v2 (idempotent)
 *
 * 이 파일 전체를 Apps Script 편집기의 Code.gs에 붙여넣고, "배포 관리"에서
 * 기존 배포를 새 버전으로 업데이트합니다(URL 유지). 설치 절차와 설계
 * 근거는 docs/setup/consult-google-apps-script.md 참고.
 *
 * 한 요청 = Sheets 1행 + 관리자 메일 1통. 같은 submissionId가 여러 번
 * 도착해도(응답 유실 후 재전송, 동시 중복 요청) 행/메일은 한 번만 생깁니다.
 *
 *   CacheService  — 이미 처리한 ID를 빠르게 되돌려주는 fast path. 최대 6시간,
 *                   Google이 언제든 비울 수 있으므로 정확성의 근거로 쓰지 않음.
 *   LockService   — 스크립트 전체 락. "ID 조회 → 행 추가 → 메일 → 표시"를
 *                   한 번에 한 실행만 하도록 직렬화(동시 중복 요청 대응).
 *   Sheets 접수ID 열 — 영구 기록. 캐시가 비어도 이 열에서 ID를 찾으면
 *                   이미 저장된 요청으로 판단.
 *   PropertiesService — WEBHOOK_SECRET 보관 전용. 저장 용량(500KB)이 작아
 *                   ID 저장소로는 쓰지 않음.
 *
 * submissionId가 없는 구버전 요청은 v1과 똑같이 매번 저장/발송합니다.
 */

var COL_SUBMISSION_ID = 12; // L열: 접수ID
var COL_MAIL_SENT = 13; // M열: 알림메일 ("Y" = 발송 완료)
var LOCK_WAIT_MS = 20000;
var CACHE_TTL_SECONDS = 21600; // CacheService 최대치(6시간)
var SUBMISSION_ID_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond(false, "bad request");
  }

  var expectedSecret = getExpectedSecret_();
  if (!expectedSecret || data.secret !== expectedSecret) {
    return respond(false, "unauthorized");
  }

  var submissionId =
    typeof data.submissionId === "string" && SUBMISSION_ID_PATTERN.test(data.submissionId)
      ? data.submissionId
      : "";
  var cache = CacheService.getScriptCache();
  var cacheKey = "consult:" + submissionId;

  if (submissionId && cache.get(cacheKey) === "done") {
    return respond(true, "duplicate", { mail: "already" });
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_WAIT_MS)) {
    // 아무것도 쓰지 않은 상태 — 호출자가 같은 submissionId로 재시도해도 안전.
    return respond(false, "busy");
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureColumns(sheet);
    var row = submissionId ? findRowBySubmissionId(sheet, submissionId) : 0;
    var isDuplicate = row > 0;

    if (!isDuplicate) {
      sheet.appendRow([
        data.submittedAt || new Date().toISOString(),
        data.studentName || "",
        data.phone || "",
        data.grade || "",
        data.subject || "",
        data.province || "",
        data.cityDetail || "",
        data.availableTime || "",
        data.message || "",
        data.sourceUrl || "",
        data.agree ? "Y" : "N",
        submissionId,
        "",
      ]);
      SpreadsheetApp.flush();
      row = sheet.getLastRow();
    }

    // 행은 있는데 메일 표시가 없으면(이전 실행이 저장 후 메일 전에 실패) 메일만 보냄.
    var mail = "already";
    if (sheet.getRange(row, COL_MAIL_SENT).getValue() !== "Y") {
      if (data.adminEmail) {
        sendAdminEmail(data);
        sheet.getRange(row, COL_MAIL_SENT).setValue("Y");
        SpreadsheetApp.flush();
        mail = "sent";
      } else {
        mail = "skipped";
      }
    }

    if (submissionId) {
      cache.put(cacheKey, "done", CACHE_TTL_SECONDS);
    }
    return respond(true, isDuplicate ? "duplicate" : "ok", { row: row, mail: mail });
  } catch (err) {
    return respond(false, "error");
  } finally {
    lock.releaseLock();
  }
}

/**
 * WEBHOOK_SECRET 스크립트 속성을 우선 사용. 속성이 없으면 LEGACY_WEBHOOK_SECRET
 * 전역(이 저장소에 없는 별도 스크립트 파일에서 정의)을 폴백으로 씁니다 — 속성
 * 도입 전에 배포된 스크립트가 secret을 코드에 넣어 두었던 경우를 위한 것이고,
 * secret 값 자체는 어떤 경우에도 이 저장소에 두지 않습니다.
 */
function getExpectedSecret_() {
  var fromProperty = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
  if (fromProperty) return fromProperty;
  return typeof LEGACY_WEBHOOK_SECRET === "string" ? LEGACY_WEBHOOK_SECRET : "";
}

/** 접수ID(L)·알림메일(M) 열이 시트 범위에 없으면(11열까지만 있는 시트) 열을 추가. */
function ensureColumns(sheet) {
  var missing = COL_MAIL_SENT - sheet.getMaxColumns();
  if (missing > 0) sheet.insertColumnsAfter(sheet.getMaxColumns(), missing);
}

/** 접수ID 열에서 정확히 일치하는 셀의 행 번호, 없으면 0. */
function findRowBySubmissionId(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return 0;
  var match = sheet
    .getRange(1, COL_SUBMISSION_ID, lastRow, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function sendAdminEmail(data) {
  MailApp.sendEmail({
    to: data.adminEmail,
    subject: "[교과설계소] 새 상담 신청 - " + (data.studentName || ""),
    body:
      "새 상담 신청이 접수되었습니다.\n\n" +
      "학생 이름: " + (data.studentName || "") + "\n" +
      "전화번호: " + (data.phone || "") + "\n" +
      "학년: " + (data.grade || "") + "\n" +
      "과목: " + (data.subject || "") + "\n" +
      "지역: " + (data.province || "") + " " + (data.cityDetail || "") + "\n" +
      "희망 시간: " + (data.availableTime || "") + "\n" +
      "문의사항: " + (data.message || "") + "\n" +
      "유입 페이지: " + (data.sourceUrl || "") + "\n" +
      "접수 시각: " + (data.submittedAt || "") + "\n\n" +
      "전체 내역은 Google Sheets에서 확인하세요.",
  });
}

/** extra: 진단용 부가 필드(row, mail). 개인정보는 넣지 않습니다. */
function respond(ok, message, extra) {
  var body = { ok: ok, message: message, v: 2 };
  for (var key in extra || {}) body[key] = extra[key];
  var output = ContentService.createTextOutput(JSON.stringify(body));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
