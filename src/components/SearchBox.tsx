"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { subjects } from "@/data/subjects";
import { programs } from "@/data/programs";

interface SearchTarget {
  label: string;
  href: string;
}

// 지역/학교 검색창에 과목·프로그램명을 입력하는 경우도 있어(예: "수학", "코딩"),
// targets(지역·학교)에서 못 찾으면 이 목록도 함께 확인한 뒤에만 "결과 없음"으로 처리한다.
const topicTargets: SearchTarget[] = [
  ...subjects.map((s) => ({ label: s.name, href: `/subject/${s.slug}` })),
  ...programs.map((p) => ({ label: p.name, href: `/program/${p.slug}` })),
];

export default function SearchBox({ targets }: { targets: SearchTarget[] }) {
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setNotice(null);
      return;
    }
    const allTargets = [...targets, ...topicTargets];
    const match =
      allTargets.find((t) => t.label === trimmed) ??
      allTargets.find((t) => t.label.includes(trimmed) || trimmed.includes(t.label));

    if (match) {
      setNotice(null);
      router.push(match.href);
      return;
    }

    setNotice(`'${trimmed}'에 대한 검색 결과가 없습니다. 지역·학교명 또는 과목명으로 다시 찾아보시거나, 아래 지역 목록을 확인해보세요.`);
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <label htmlFor="region-search-input" className="sr-only">
            지역, 학교 검색
          </label>
          <input
            id="region-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (notice) setNotice(null);
            }}
            list="region-search-list"
            placeholder="예) 수원, 영통중학교, 수학"
            className="w-full rounded-full border border-border-subtle bg-white py-3.5 pl-11 pr-4 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <datalist id="region-search-list">
            {targets.map((t) => (
              <option key={t.href} value={t.label} />
            ))}
          </datalist>
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          과외 찾기
        </button>
      </form>
      {notice && (
        <p role="status" className="mt-2 text-sm text-text-muted">
          {notice}
        </p>
      )}
    </div>
  );
}
