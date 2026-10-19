"""학교알리미 공시 4-가 '교과별(학년별) 교수·학습 및 평가계획' collector + text extractor. Re-runnable.

  python -I -X utf8 scripts/official/schoolinfo_plans.py fetch   --schools <list.tsv> [--year 2026] [--term 3]
  python -I -X utf8 scripts/official/schoolinfo_plans.py extract
  python -I -X utf8 scripts/official/schoolinfo_plans.py preview   # PDFs without a Korean text layer
  python -I -X utf8 scripts/official/schoolinfo_plans.py status

<list.tsv>: one school per line, "NEIS학교코드<TAB>학교명".

Only the public pages a browser uses are requested (school search, the 4-가 attachment list, the attachment
download, and the site's own preview conversion for PDFs whose fonts pdftotext cannot map). No login, CAPTCHA
or robots-excluded path is involved (robots.txt: Allow /). One request per second; everything is cached under
.cache/official/schoolinfo/ and never re-downloaded. A school is used only when the search result's NEIS code
equals the requested code (name matches alone are not trusted).

Text extraction: HWPX (zip, stdlib) and PDF (pdftotext when installed) need nothing extra. HWP (OLE compound
file) needs the `olefile` package — install it, or point OLEFILE_PATH at a directory containing it. Files that
cannot be read are listed by `status`, never guessed.

The extracted text is reading material for a person writing src/data/dongSubjectContent.ts; nothing is
written into the site automatically.
"""
import json
import os
import re
import struct
import subprocess
import sys
import time
import urllib.parse
import urllib.request
import zipfile
import zlib

BASE = "https://www.schoolinfo.go.kr"
ROOT = os.path.join(".cache", "official", "schoolinfo")
MANIFEST = os.path.join(ROOT, "manifest.json")
UA = {"User-Agent": "Mozilla/5.0 (tutoring-site official-data pipeline; low rate)"}
_last = [0.0]


def _wait():
    d = time.time() - _last[0]
    if d < 1.0:
        time.sleep(1.0 - d)
    _last[0] = time.time()


def http(url, data=None, timeout=60):
    _wait()
    req = urllib.request.Request(url, data=data, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def cp949(s):
    return urllib.parse.quote(s.encode("cp949"))


def load_manifest():
    if os.path.exists(MANIFEST):
        return json.load(open(MANIFEST, encoding="utf-8"))
    return {"schools": {}}


def save_manifest(m):
    os.makedirs(ROOT, exist_ok=True)
    json.dump(m, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def search_id(name, neis_code):
    body = f"SEARCH_MODE=9&SEARCH_TYPE=1&pageNumber=1&SEARCH_KEYWORD={cp949(name)}&SEARCH_SCHUL_NM={cp949(name)}"
    html = http(BASE + "/ei/ss/Pneiss_f01_l0.do", body.encode()).decode("cp949", "ignore")
    pairs = re.findall(r'var schulCd = "([^"]+)"\s*;?\s*var sdSchulCode = "(\d+)"', html)
    for shl, code in pairs:
        if code == neis_code:
            return shl
    return None


def list_attachments(shl, year):
    no = cp949("4-가")
    body = (f"GS_HANGMOK_CD=43&GS_HANGMOK_NO={no}&GS_BURYU_CD=JG110&JG_BURYU_CD=JG040&JG_HANGMOK_CD=14&JG_GUBUN=1"
            f"&JG_YEAR2={year}&SHL_IDF_CD={shl}&GS_TYPE=Y&JG_YEAR={year}&SORT=BR&CHOSEN_JG_YEAR={year}"
            f"&PRE_JG_YEAR={year}&LOAD_TYPE=single")
    html = http(BASE + "/ei/pp/Pneipp_b43_s0p.do", body.encode()).decode("cp949", "ignore")
    term = re.search(r'name="JG_CHASU" value="(\d+)"', html)
    files = re.findall(r"getEiFile\d*\('(\d+)'\);\" title=\"([^\"]*)\"", html)
    files = [(seq, re.sub(r" (알수없는|한글문서|pdf문서|압축파일) 첨부파일$", "", t)) for seq, t in files]
    return (term.group(1) if term else None), files


def fetch(schools_path, year, term):
    m = load_manifest()
    for line in open(schools_path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        code, name = line.split("\t")[:2]
        entry = m["schools"].get(code) or {"name": name}
        if not entry.get("shl"):
            entry["shl"] = search_id(name, code)
        if not entry["shl"]:
            entry["error"] = "학교알리미 검색 결과에 NEIS 코드 일치 없음"
            m["schools"][code] = entry
            print(f"{code} {name}: NOT FOUND")
            continue
        got_term, files = list_attachments(entry["shl"], year)
        entry["year"], entry["term"] = year, got_term
        if got_term != str(term):
            entry["error"] = f"공시 차수 {got_term} (요청 {term}) — 사용하지 않음"
            print(f"{code} {name}: term {got_term} != {term}")
        entry.setdefault("files", {})
        for seq, title in files:
            if "성적관리" in title:
                continue
            ext = title.rsplit(".", 1)[-1].lower() if "." in title else "bin"
            path = os.path.join(ROOT, code, f"{seq}.{ext}")
            if not os.path.exists(path):
                os.makedirs(os.path.dirname(path), exist_ok=True)
                q = (f"SHL_IDF_CD={entry['shl']}&JG_BURYU_CD=JG040&JG_HANGMOK_CD=14&JG_GUBUN=1&JG_YEAR={year}"
                     f"&JG_CHASU={term}&USE_YN=Y&FILE_SEQ={seq}")
                open(path, "wb").write(http(BASE + "/servlets/EiFileDownLoad.do?" + q, timeout=120))
            entry["files"][seq] = {"title": title, "path": path}
        m["schools"][code] = entry
        save_manifest(m)
        print(f"{code} {name}: {len(entry['files'])} files (term {got_term})")


# ── text extraction ───────────────────────────────────────────────────────────

def hwpx_text(path):
    out = []
    with zipfile.ZipFile(path) as z:
        secs = sorted([n for n in z.namelist() if re.match(r"Contents/section\d+\.xml", n)],
                      key=lambda n: int(re.findall(r"\d+", n)[-1]))
        for n in secs:
            x = z.read(n).decode("utf-8", "ignore")
            x = re.sub(r"</hp:p>", "\n", x)
            x = re.sub(r"<hp:tab[^>]*/>", "\t", x)
            out.append(re.sub(r"<[^>]+>", "", x))
    t = "\n".join(out)
    return t.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", '"')


def hwp_text(path):
    if os.environ.get("OLEFILE_PATH"):
        sys.path.insert(0, os.environ["OLEFILE_PATH"])
    import olefile  # noqa: E402 — optional dependency, see module docstring
    ole = olefile.OleFileIO(path)
    compressed = bool(struct.unpack("<I", ole.openstream("FileHeader").read()[36:40])[0] & 1)
    secs = sorted([e for e in ole.listdir() if e[0] == "BodyText"], key=lambda e: int(e[1][7:]))
    out = []
    for e in secs:
        data = ole.openstream(e).read()
        if compressed:
            data = zlib.decompress(data, -15)
        i = 0
        while i < len(data):
            h = struct.unpack("<I", data[i:i + 4])[0]
            tag, size = h & 0x3FF, (h >> 20) & 0xFFF
            i += 4
            if size == 0xFFF:
                size = struct.unpack("<I", data[i:i + 4])[0]
                i += 4
            rec, i = data[i:i + size], i + size
            if tag != 67:  # HWPTAG_PARA_TEXT
                continue
            chars, j = [], 0
            while j + 1 < len(rec):
                c = struct.unpack("<H", rec[j:j + 2])[0]
                if c < 32:
                    if c in (0, 10, 13, 24, 25, 26, 27, 28, 29, 30, 31):
                        j += 2
                        if c in (10, 13):
                            chars.append("\n")
                        continue
                    if c == 9:
                        chars.append("\t")
                    j += 16
                    continue
                chars.append(chr(c))
                j += 2
            out.append("".join(chars).rstrip("\n"))
    return "\n".join(out)


def pdf_text(path):
    r = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True)
    return r.stdout.decode("utf-8", "ignore")


def zip_members(path):
    """Plans uploaded as a .zip: extract members next to it as <seq>_z<n>.<ext> and return their paths."""
    out = []
    with zipfile.ZipFile(path) as z:
        for n, info in enumerate(i for i in z.infolist() if not i.is_dir()):
            name = info.filename.encode("cp437").decode("cp949", "ignore") if info.flag_bits & 0x800 == 0 else info.filename
            ext = name.rsplit(".", 1)[-1].lower()
            dst = f"{path[:-4]}_z{n}.{ext}"
            if not os.path.exists(dst):
                open(dst, "wb").write(z.read(info))
            out.append((dst, name))
    return out


def extract():
    m = load_manifest()
    for code, entry in m["schools"].items():
        for seq, f in list(entry.get("files", {}).items()):
            paths = [(f["path"], f["title"])]
            if f["path"].endswith(".zip"):
                paths = zip_members(f["path"])
                f["members"] = [{"path": p, "title": t} for p, t in paths]
            for p, _ in paths:
                ext = p.rsplit(".", 1)[-1]
                txt = p + ".txt"
                if os.path.exists(txt):
                    continue
                try:
                    t = {"hwpx": hwpx_text, "hwp": hwp_text, "pdf": pdf_text}[ext](p)
                except KeyError:
                    t = f"ERROR unsupported .{ext}"
                except ImportError:
                    t = "ERROR olefile not installed (set OLEFILE_PATH or pip install olefile)"
                except Exception as ex:  # unreadable file — reported by `status`, never guessed
                    t = f"ERROR {ex}"
                open(txt, "w", encoding="utf-8").write(t)
        save_manifest(m)


def preview_lines(xml):
    """Rebuild text lines from one preview page (positioned <text> runs)."""
    items = []
    for mm in re.finditer(r"<text l='([\d.]+)' t='([\d.]+)' w='([\d.]+)' h='([\d.]+)' >(.*?)</text>", xml):
        l, t, w, h, s = float(mm[1]), float(mm[2]), float(mm[3]), float(mm[4]), mm[5]
        if not s or w == 0:
            continue
        s = s.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", '"').replace("&apos;", "'")
        items.append((t + h / 2, l, w, h, s))
    items.sort()
    rows = []
    for it in items:
        if rows and abs(it[0] - rows[-1][0]) < max(4, it[3] * 0.35):
            rows[-1][1].append(it)
        else:
            rows.append([it[0], [it]])
    out = []
    for _, its in rows:
        its.sort(key=lambda x: x[1])
        s, end = "", None
        for _, l, w, h, ch in its:
            if end is not None:
                gap = l - end
                if gap > h * 1.2:
                    s += " | "
                elif gap > h * 0.25 and not s.endswith(" ") and ch != " ":
                    s += " "
            s += ch
            end = l + w
        out.append(s.strip())
    return "\n".join(r for r in out if r)


def preview(year="2026", term="3", max_pages=2000):
    """For PDFs whose text layer has no Hangul, read 학교알리미's own preview conversion into <file>.pv.txt."""
    m = load_manifest()
    for code, entry in m["schools"].items():
        for seq, f in entry.get("files", {}).items():
            p = f["path"]
            if not p.endswith(".pdf") or os.path.exists(p + ".pv.txt"):
                continue
            t = open(p + ".txt", encoding="utf-8", errors="ignore").read() if os.path.exists(p + ".txt") else ""
            if len(re.findall(r"[가-힣]", t)) >= 200:
                continue
            body = (f"SHL_IDF_CD={entry['shl']}&JG_BURYU_CD=JG040&JG_HANGMOK_CD=14&JG_GUBUN=1&JG_YEAR={year}"
                    f"&JG_CHASU={term}&USE_YN=Y&FILE_SEQ={seq}&PREVIEW_TYPE=GONGSI")
            u = http(BASE + "/pn/cm/documentView.do", body.encode(), timeout=300).decode()
            q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query)
            fn, rs = q["fn"][0], q["rs"][0]
            pages, misses, n = [], 0, 1
            while n <= max_pages and misses < 3:
                try:
                    raw = http(f"{BASE}{rs}{fn}.files/{fn}_{n}.xml", timeout=60)
                    pages.append(f"\n===== PAGE {n} =====\n" + preview_lines(raw.decode("utf-8", "ignore")))
                    misses = 0
                except Exception:
                    misses += 1
                n += 1
            open(p + ".pv.txt", "w", encoding="utf-8").write("".join(pages))
            print(f"{code} {seq}: preview {len(pages)} pages")


def status():
    m = load_manifest()
    for code, entry in m["schools"].items():
        files = entry.get("files", {})
        bad = []
        for f in files.values():
            for p in [x["path"] for x in f.get("members", [])] or [f["path"]]:
                txt = p + ".pv.txt" if os.path.exists(p + ".pv.txt") else p + ".txt"
                if not os.path.exists(txt):
                    bad.append(f"{os.path.basename(p)}: not extracted")
                else:
                    t = open(txt, encoding="utf-8", errors="ignore").read()
                    hangul = len(re.findall(r"[가-힣]", t))
                    if t.startswith("ERROR") or hangul < 200:
                        bad.append(f"{os.path.basename(p)}: {t[:60] if t.startswith('ERROR') else f'한글 {hangul}자 (PDF 폰트?)'}")
        print(f"{code} {entry.get('name')} term={entry.get('term')} files={len(files)} {entry.get('error', '')}")
        for b in bad:
            print(f"   ! {b}")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    args = sys.argv[2:]
    opt = lambda k, d=None: args[args.index(k) + 1] if k in args else d  # noqa: E731
    if cmd == "fetch":
        fetch(opt("--schools"), opt("--year", "2026"), opt("--term", "3"))
    elif cmd == "extract":
        extract()
    elif cmd == "preview":
        preview(opt("--year", "2026"), opt("--term", "3"))
    else:
        status()
