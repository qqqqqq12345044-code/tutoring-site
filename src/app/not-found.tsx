import { SearchX } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import RelatedLinks from "@/components/RelatedLinks";

const quickLinks = [
  { label: "과목별 과외", href: "/subjects" },
  { label: "학년별 과외", href: "/grades" },
  { label: "지역별 과외", href: "/regions" },
  { label: "학습가이드", href: "/guide" },
];

export default function NotFound() {
  return (
    <section className="container-page py-24 flex flex-col items-center text-center gap-4">
      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-light text-brand">
        <SearchX className="w-7 h-7" />
      </span>
      <h1 className="text-2xl md:text-3xl font-extrabold text-navy">페이지를 찾을 수 없습니다</h1>
      <p className="text-text-muted text-sm md:text-base max-w-md">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 아래에서 원하는 정보를
        찾아보세요.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <PrimaryButton href="/">홈으로 가기</PrimaryButton>
        <PrimaryButton href="/consult" variant="outline">
          무료 상담받기
        </PrimaryButton>
      </div>
      <div className="mt-6 max-w-md w-full">
        <RelatedLinks title="이런 페이지를 찾고 계셨나요?" links={quickLinks} />
      </div>
    </section>
  );
}
