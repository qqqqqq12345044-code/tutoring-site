import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = buildMetadata({
  title: "이용약관",
  description: `${siteConfig.brandName} 이용약관 안내`,
  path: "/terms",
});

const sections = [
  { title: "제1조 (목적)", body: "본 약관은 회사가 제공하는 과외 상담 및 매칭 서비스 이용과 관련한 조건과 절차를 규정함을 목적으로 합니다." },
  { title: "제2조 (서비스의 제공)", body: "회사는 이용자의 상담 신청을 바탕으로 학생에게 맞는 과외 선생님을 안내하는 서비스를 제공합니다." },
  { title: "제3조 (이용자의 의무)", body: "이용자는 상담 신청 시 정확한 정보를 제공해야 하며, 허위 정보 제공으로 인한 불이익은 이용자에게 있습니다." },
  { title: "제4조 (서비스의 변경 및 중단)", body: "회사는 서비스 운영상 필요한 경우 제공하는 서비스의 내용을 변경하거나 중단할 수 있습니다." },
];

export default function TermsPage() {
  return (
    <section className="container-page py-10 md:py-14 max-w-3xl">
      <Breadcrumb items={[{ name: "이용약관", href: "/terms" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">이용약관</h1>
      <div className="mt-8 flex flex-col gap-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-navy">{s.title}</h2>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
