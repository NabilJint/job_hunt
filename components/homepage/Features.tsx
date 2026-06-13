const features = [
  {
    title: "Smart Matching",
    description: "GPT-4o analyzes your profile and job descriptions to give you an honest match score from 0-100.",
    highlight: "Match Score Analytics"
  },
  {
    title: "Automated Research",
    description: "Our AI agent visits company blogs, about pages, and engineering docs to find the real inside story.",
    highlight: "Company Dossiers"
  },
  {
    title: "Resume Generation",
    description: "Create a professional, polished resume from your profile data with one click. No more formatting hell.",
    highlight: "One-Click PDF"
  }
];

export function Features() {
  return (
    <section className="w-full py-24 px-6 bg-surface">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-accent-muted rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-accent rounded-sm" />
              </div>
              <h3 className="text-text-primary text-xl font-bold">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
              <span className="text-accent font-medium text-sm">
                {feature.highlight} →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
