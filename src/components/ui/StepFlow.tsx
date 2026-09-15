export interface Step {
  title: string;
  body?: string;
}

export default function StepFlow({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr">
      {steps.map((step, i) => (
        <div key={step.title} className="relative flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-navy text-white text-sm font-bold shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < steps.length - 1 && (
              <span className="hidden lg:block flex-1 h-px bg-border-subtle" />
            )}
          </div>
          <p className="font-bold text-navy mt-1">{step.title}</p>
          {step.body && <p className="text-sm text-text-muted leading-relaxed">{step.body}</p>}
        </div>
      ))}
    </div>
  );
}
