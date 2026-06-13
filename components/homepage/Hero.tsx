import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full pt-20 pb-32 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center gap-6">
        <h1 className="text-text-darkest text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl">
          Find your next dream job <br />
          <span className="text-accent">powered by AI</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl leading-relaxed">
          JobPilot discovers relevant jobs, scores them against your profile, 
          and researches companies automatically. Stop spending hours on research 
          and start applying to the right roles.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/login">
            <Button className="bg-accent text-accent-foreground rounded-md px-8 py-6 text-lg font-medium hover:bg-accent-dark transition-colors">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-border text-text-primary rounded-md px-8 py-6 text-lg font-medium hover:bg-surface-secondary transition-colors">
              Find Your First Match
            </Button>
          </Link>
        </div>
        
        <div className="relative mt-16 w-full max-w-5xl aspect-video rounded-2xl border border-border shadow-2xl overflow-hidden bg-surface">
          <Image 
            src="/images/dashboard-demo.png" 
            alt="JobPilot Dashboard Demo" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
