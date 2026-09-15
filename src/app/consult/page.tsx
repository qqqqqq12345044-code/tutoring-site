import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConsultForm from "@/components/ConsultForm";

export const metadata = buildMetadata({
  title: "무료 상담 신청",
  description: "학년과 과목, 지역을 남겨주시면 1:1 과외 진행 가능 여부와 방법을 상담해드립니다.",
  path: "/consult",
});

export default function ConsultPage() {
  return (
    <section className="bg-brand-light">
      <div className="container-page py-10 md:py-16">
        <Breadcrumb items={[{ name: "무료상담", href: "/consult" }]} />
        <div className="max-w-2xl mx-auto text-center mt-4 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy leading-snug">
            우리 아이에게 필요한 과외,
            <br />
            현재 고민부터 알려주세요
          </h1>
          <p className="mt-3 text-text-muted text-sm md:text-base leading-relaxed">
            학년과 과목, 지역을 남겨주시면 수업 가능 여부와 진행 방법을 상담해드립니다.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <ConsultForm />
        </div>
      </div>
    </section>
  );
}
