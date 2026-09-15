"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchTarget {
  label: string;
  href: string;
}

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
    const match =
      targets.find((t) => t.label === trimmed) ??
      targets.find((t) => t.label.includes(trimmed) || trimmed.includes(t.label));

    if (match) {
      setNotice(null);
      router.push(match.href);
      return;
    }

    setNotice(`'${trimmed}'에 대한 검색 결과가 없습니다. 아래 지역 목록에서 찾아보세요.`);
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (notice) setNotice(null);
            }}
            list="region-search-list"
            placeholder="예) 수원, 영통구, 영통중학교"
            className="w-full rounded-full border border-border-subtle bg-white py-3.5 pl-11 pr-4 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand"
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
      {notice && <p className="mt-2 text-sm text-text-muted">{notice}</p>}
    </div>
  );
}
