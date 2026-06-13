import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-surface-secondary border-t border-border py-12 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-xs">
          <div className="mb-4">
            <Image src="/logo.png" alt="JobPilot" width={120} height={120} className="rounded-[10px]" />
          </div>
          <p className="text-text-secondary text-[14px] leading-[20px]">
            The AI-powered assistant that finds your next dream job. 
            Stop searching, start matching.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-text-primary font-semibold text-[14px]">Product</span>
            <Link href="/dashboard" className="text-text-secondary hover:text-accent text-[14px]">Dashboard</Link>
            <Link href="/find-jobs" className="text-text-secondary hover:text-accent text-[14px]">Find Jobs</Link>
            <Link href="/profile" className="text-text-secondary hover:text-accent text-[14px]">Profile</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-text-primary font-semibold text-[14px]">Company</span>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">About</Link>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">Blog</Link>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">Privacy</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-text-primary font-semibold text-[14px]">Social</span>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">LinkedIn</Link>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">Twitter</Link>
            <Link href="#" className="text-text-secondary hover:text-accent text-[14px]">GitHub</Link>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-muted text-[12px]">© 2026 JobPilot AI. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="text-text-muted text-[12px]">Built with GPT-4o & Browserbase</span>
        </div>
      </div>
    </footer>
  );
}
