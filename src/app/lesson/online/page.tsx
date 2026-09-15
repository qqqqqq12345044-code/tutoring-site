import { Video, Globe, MonitorSmartphone, CalendarClock } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import ConsultCTA from "@/components/ConsultCTA";
import RelatedLinks from "@/components/RelatedLinks";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { subjects } from "@/data/subjects";

export const metadata = buildMetadata({
  title: "화상과외 | 전국 어디서든 받는 1:1 맞춤 수업",
  description: "화상 프로그램으로 지역에 관계없이 진행하는 1:1 화상과외를 상담해보세요.",
  path: "/lesson/online",
});

const benefits = [
  { icon: Globe, title: "전국 어디서든 수업", body: "지역에 제한 없이 원하는 곳에서 수업을 받을 수 있습니다." },
  { icon: MonitorSmartphone, title: "폭넓은 선생님 선택", body: "지역과 관계없이 학생에게 맞는 선생님을 선택할 수 있습니다." },
  { icon: Video, title: "화면 공유 실시간 수업", body: "화면 공유와 필기 도구를 활용해 실시간으로 수업합니다." },
  { icon: CalendarClock, title: "유연한 일정 조율", body: "이동 시간이 없어 일정 조율이 상대적으로 수월합니다." },
];

export default function OnlineLessonPage() {
  return (
    <>
      <section className="bg-white border-b border-border-subtle">
        <div className="container-page py-8 md:py-10 flex flex-col gap-6">
          <Breadcrumb items={[{ name: "화상과외", href: "/lesson/online" }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-navy leading-tight">
              전국 어디서든 받는 1:1 화상과외
            </h1>
            <p className="mt-4 text-text-muted leading-relaxed">
              화상 프로그램을 통해 지역에 관계없이 원하는 선생님과 수업을 진행합니다. 화면 공유를
              활용해 방문과외와 비슷한 방식으로 설명과 풀이를 함께 확인할 수 있습니다.
            </p>
            <div className="mt-6">
              <PrimaryButton href="/consult" size="lg">
                화상과외 상담받기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-16">
        <SectionHeader align="left" title="화상과외의 장점" />
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-4 rounded-2xl border border-border-subtle bg-white p-6">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-light text-brand shrink-0">
                <b.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-navy">{b.title}</p>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14 md:pb-16">
        <ConsultCTA title="화상과외 가능 여부를 확인해보세요" description="희망 과목과 시간을 알려주시면 확인해드립니다." />
      </section>

      <section className="container-page pb-16 md:pb-20 grid md:grid-cols-2 gap-4">
        <RelatedLinks
          title="과목별 과외"
          links={subjects.map((s) => ({ label: `${s.name}과외`, href: `/subject/${s.slug}` }))}
        />
        <RelatedLinks title="다른 수업 방식" links={[{ label: "방문과외 알아보기", href: "/lesson/visit" }]} />
      </section>
    </>
  );
}
