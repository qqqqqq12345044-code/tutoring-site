import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = buildMetadata({
  title: "개인정보처리방침",
  description: `${siteConfig.brandName} 개인정보처리방침 안내`,
  path: "/privacy",
});

const sections = [
  {
    title: "1. 수집하는 개인정보 항목",
    body: [
      "상담 신청 시 학생 학년, 희망 과목, 수업 방식, 희망 지역(시/군/구 또는 동 단위), 보호자 또는 학생 이름, 연락처, 상담 가능 시간, 문의사항을 수집합니다.",
      "정확한 자택 주소는 상담 단계에서 수집하지 않으며, 수업 진행이 확정된 이후 필요한 범위에서 별도로 안내받습니다.",
    ],
  },
  {
    title: "2. 개인정보의 수집 및 이용 목적",
    body: ["상담 및 과외 매칭, 수업 관련 안내와 연락을 위해 개인정보를 이용합니다."],
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: [
      "상담 및 서비스 제공 목적이 달성된 이후에는 관련 법령에 따라 일정 기간 보관 후 지체 없이 파기합니다.",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: ["이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다."],
  },
  {
    title: "5. 이용자의 권리",
    body: ["이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다."],
  },
];

export default function PrivacyPage() {
  return (
    <section className="container-page py-10 md:py-14 max-w-3xl">
      <Breadcrumb items={[{ name: "개인정보처리방침", href: "/privacy" }]} />
      <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-navy">개인정보처리방침</h1>
      <div className="mt-8 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-bold text-navy">{s.title}</h2>
            <div className="mt-2 flex flex-col gap-2">
              {s.body.map((p) => (
                <p key={p} className="text-sm text-text-muted leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
