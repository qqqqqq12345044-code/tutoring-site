"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { subjects } from "@/data/subjects";
import { grades } from "@/data/grades";
import { getProvinces } from "@/data/regions";

const gradeOptions = [...grades.flatMap((g) => g.subGrades.map((sg) => sg.label)), "기타"];

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ConsultForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const provinces = getProvinces();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-border-subtle bg-white p-10 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-brand" />
        <p className="text-lg font-bold text-navy">상담 신청이 접수되었습니다</p>
        <p className="text-sm text-text-muted leading-relaxed">
          남겨주신 연락처로 순차적으로 연락드리겠습니다. 빠른 상담이 필요하시면 카카오톡으로도
          문의해주세요.
        </p>
        <a
          href={siteConfig.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] text-[#191919] font-semibold px-6 py-3 text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          카카오톡으로 상담하기
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border-subtle bg-white p-5 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="학생 학년" required>
          <select name="grade" required className={inputClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            {gradeOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </Field>

        <Field label="희망 과목" required>
          <select name="subject" required className={inputClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
            <option value="기타">기타</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="지역 (시/도)" required>
          <select name="province" required className={inputClass} defaultValue="">
            <option value="" disabled>선택해주세요</option>
            {provinces.map((p) => (
              <option key={p.slug} value={p.name}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="시/군/구 또는 동 (직접입력)">
          <input name="cityDetail" type="text" maxLength={100} placeholder="예) 영통구, 원천동" className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="학생 이름" required>
          <input name="studentName" type="text" required maxLength={50} className={inputClass} />
        </Field>
        <Field label="연락처" required>
          <input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" className={inputClass} />
        </Field>
      </div>

      <Field label="상담 가능 시간">
        <input name="availableTime" type="text" maxLength={100} placeholder="예) 평일 저녁 7시 이후" className={inputClass} />
      </Field>

      <Field label="문의사항">
        <textarea name="message" rows={3} maxLength={1000} className={`${inputClass} resize-none`} />
      </Field>

      <label className="flex items-start gap-2.5 rounded-xl bg-bg-app px-4 py-3.5 text-[13px] text-text-muted leading-relaxed">
        <input
          type="checkbox"
          name="agree"
          required
          className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"
        />
        <span>
          개인정보 수집 및 이용에 동의합니다. 상담을 위해 이름, 연락처, 지역 정보가 수집되며 자세한
          내용은{" "}
          <Link href="/privacy" className="underline hover:text-brand">
            개인정보처리방침
          </Link>
          에서 확인하실 수 있습니다.
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="text-sm text-red-600">
          신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <button
          type="submit"
          disabled={state === "loading"}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand text-white font-semibold py-3.5 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
          무료 상담 신청하기
        </button>
        <a
          href={siteConfig.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[#191919] font-semibold py-3.5 text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          카카오톡으로 상담하기
        </a>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-border-subtle bg-white px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-navy">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {children}
    </label>
  );
}
