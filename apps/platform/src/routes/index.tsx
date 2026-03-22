import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/marketing/Navbar'
import { HeroSection } from '@/components/marketing/HeroSection'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { FeatureGrid } from '@/components/marketing/FeatureGrid'
import { SocialNumbers } from '@/components/marketing/SocialNumbers'
import { PricingPreview } from '@/components/marketing/PricingPreview'
import { Footer } from '@/components/marketing/Footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ComparisonTable />
      <HowItWorks />
      <FeatureGrid />
      <SocialNumbers />
      <PricingPreview />
      <Footer />
    </div>
  )
}
