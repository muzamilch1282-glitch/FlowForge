import { LandingHeader } from '@/components/landing/landing-header';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingTrustBar } from '@/components/landing/landing-trust-bar';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingCollaborationSection } from '@/components/landing/landing-collaboration-section';
import { LandingFeatureSections } from '@/components/landing/landing-feature-sections';
import { LandingAiSection } from '@/components/landing/landing-ai-section';
import { LandingAnalyticsSection } from '@/components/landing/landing-analytics-section';
import { LandingTestimonialsSection } from '@/components/landing/landing-testimonials-section';
import { LandingValueSection } from '@/components/landing/landing-value-section';
import { LandingCtaSection } from '@/components/landing/landing-cta-section';
import { LandingFooter } from '@/components/landing/landing-footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* 1. Hero + Product Preview */}
        <LandingHero />
        {/* 2. Trust / Value Proposition */}
        <LandingTrustBar />
        {/* 3. Project Management */}
        <LandingFeatures />
        {/* 4. Collaboration */}
        <LandingCollaborationSection />
        {/* 5. Automation */}
        <LandingFeatureSections />
        {/* 6. AI Assistant */}
        <LandingAiSection />
        {/* 7. Analytics */}
        <LandingAnalyticsSection />
        {/* 8. Feature Overview Cards */}
        <LandingTestimonialsSection />
        {/* 9. Team Productivity */}
        <LandingValueSection />
        {/* 10. Final CTA */}
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
