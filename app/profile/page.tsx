import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProfilePageClient } from "./ProfilePageClient"

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-8 py-12 flex flex-col gap-6">
        <ProfilePageClient />
      </main>
      <Footer />
    </div>
  )
}
