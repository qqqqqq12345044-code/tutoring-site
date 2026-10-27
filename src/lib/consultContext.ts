import { getRegionBySlug, type RegionNode } from "@/data/regions";
import { getDong } from "@/data/dongs";
import { getSubjectBySlug } from "@/data/subjects";

/**
 * Page context carried from a consult CTA to /consult so the form can start with the subject and area the
 * visitor was already looking at. Only slugs travel in the query string; /consult resolves them against the
 * site's own data and drops anything unknown, so a hand-edited URL can at most leave the form empty.
 * /consult keeps its own canonical (no per-query metadata), and analytics records pathnames only.
 */
export interface ConsultContext {
  subject?: string;
  /** Any region node slug: province, city or district. */
  region?: string;
  /** 행정동 slug within `region` (src/data/dongs.ts). */
  dong?: string;
}

/** Values in the ConsultForm's own option vocabulary (subject.name, province.name, free-text 지역). */
export interface ConsultPrefill {
  subject?: string;
  province?: string;
  cityDetail?: string;
}

export function consultHref(ctx?: ConsultContext): string {
  const params = new URLSearchParams();
  if (ctx?.subject) params.set("subject", ctx.subject);
  if (ctx?.region) params.set("region", ctx.region);
  if (ctx?.region && ctx.dong) params.set("dong", ctx.dong);
  const qs = params.toString();
  return qs ? `/consult?${qs}` : "/consult";
}

function provinceOf(node: RegionNode): RegionNode | undefined {
  let cur: RegionNode | undefined = node;
  while (cur && cur.level !== "province") cur = cur.parentSlug ? getRegionBySlug(cur.parentSlug) : undefined;
  return cur;
}

/** "강서구", "고양시", "수원 영통구" — the way the form's 시/군/구 placeholder is written. */
function areaLabel(node: RegionNode): string {
  if (node.level === "district") return node.fullName;
  return /[시군구]$/.test(node.name) ? node.name : node.fullName;
}

export function resolveConsultPrefill(search: string): ConsultPrefill {
  const params = new URLSearchParams(search);
  const out: ConsultPrefill = {};
  const subject = getSubjectBySlug(params.get("subject") ?? "");
  if (subject) out.subject = subject.name;
  const region = getRegionBySlug(params.get("region") ?? "");
  if (region) {
    const province = provinceOf(region);
    if (province) out.province = province.name;
    if (region.level !== "province") {
      const dong = getDong(region.slug, params.get("dong") ?? "");
      out.cityDetail = dong ? `${areaLabel(region)} ${dong.name}` : areaLabel(region);
    }
  }
  return out;
}
