import Image from "next/image";

const steps = [
  {
    title: "One-time Setup",
    description: "Upload your resume and fill out your profile. Our AI extracts everything automatically to save you time.",
    image: "/images/user-icon.png",
    color: "bg-accent-light text-accent"
  },
  {
    title: "AI-Powered Discovery",
    description: "We find the best roles from Adzuna and score them 0-100 based on your actual skills and experience.",
    image: "/images/jobs-lists.png",
    color: "bg-success-light text-success-darker"
  },
  {
    title: "Deep Company Research",
    description: "Click a button and our agent browses the company&apos;s site to build a full dossier on their culture and tech stack.",
    image: "/images/agnet-log.png",
    color: "bg-info-light text-info-dark"
  }
];

export function HowItWorks() {
  return (
    <section className="w-full py-24 px-6 bg-surface-secondary">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-text-primary text-3xl font-bold mb-4">How it Works</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            We&apos;ve automated the most tedious parts of the job search so you can focus on the interview.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-surface p-8 rounded-2xl border border-border flex flex-col items-center text-center gap-6 hover:shadow-md transition-shadow">
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center overflow-hidden`}>
                <Image src={step.image} alt={step.title} width={40} height={40} />
              </div>
              <h3 className="text-text-primary text-xl font-semibold">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
