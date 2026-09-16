import { subjects } from "../src/data/subjects";
import { grades } from "../src/data/grades";
import { regions, getChildren } from "../src/data/regions";
import { schools } from "../src/data/schools";
import { guideArticles } from "../src/data/guide";
import { getIndexability } from "../src/lib/indexability";

const staticPaths = ["/", "/subjects", "/grades", "/regions", "/schools", "/guide", "/lesson/visit", "/lesson/online", "/consult", "/privacy", "/terms"];
let indexed = staticPaths.length + subjects.length + grades.length + regions.length + schools.length + guideArticles.length;
let noindex = 0;
for (const city of regions.filter((r) => r.level === "city")) {
  for (const s of subjects) {
    getIndexability("region-subject", { regionSlug: city.slug, subjectSlug: s.slug }).index ? indexed++ : noindex++;
  }
  for (const g of grades) noindex++;
  for (const g of grades) for (const s of subjects) noindex++;
  for (const d of getChildren(city.slug)) for (const s of subjects) noindex++;
}
console.log("indexed(sitemap):", indexed, "noindex:", noindex, "total:", indexed + noindex);
