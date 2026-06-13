import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="w-full py-24 px-6 bg-accent text-accent-foreground text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
          Ready to find your <br /> next big opportunity?
        </h2>
        <p className="text-accent-light text-lg md:text-xl opacity-90">
          Join thousands of developers who are using JobPilot to land roles at the world&apos;s best companies.
        </p>
        <Link href="/login">
          <Button className="bg-surface text-accent font-bold rounded-md px-10 py-6 text-lg hover:bg-surface-secondary transition-colors">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
