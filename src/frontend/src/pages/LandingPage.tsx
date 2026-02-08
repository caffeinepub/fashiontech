import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PricingSection from '../components/PricingSection';
import FeaturedCourseSection from '../components/FeaturedCourseSection';
import { useNavigate } from '@tanstack/react-router';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 fashion-gradient" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  Affordable Fashion Education for All
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Master Fashion Design in the{' '}
                <span className="gradient-text">Digital Age</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Interactive courses, community mentorship, budget-friendly tools, and AI-powered guidance. 
                Your journey to becoming a fashion innovator starts here—accessible to everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate({ to: '/storefront' })}>
                  Browse Courses
                </Button>
                <a href="#pricing">
                  <Button size="lg" variant="secondary">
                    View Pricing
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hover-lift">
                <img 
                  src="/assets/generated/fashion-workspace-hero.dim_1200x600.jpg" 
                  alt="Fashion workspace" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course Section */}
      <FeaturedCourseSection />

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              A comprehensive platform combining education, community, and cutting-edge technology—designed for diverse income groups
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              image="/assets/generated/course-design.dim_400x300.jpg"
              title="Free & Premium Courses"
              description="Access basic courses for free, or unlock advanced content with premium membership. Learn at your own pace."
            />
            <FeatureCard
              image="/assets/generated/community-board.dim_800x500.jpg"
              title="Community Board"
              description="Exchange design ideas, resources, and tips with fellow designers in our vibrant community."
            />
            <FeatureCard
              image="/assets/generated/mentorship-interface.dim_600x400.jpg"
              title="Mentorship System"
              description="Connect with experienced learners for project-based collaboration and personalized guidance."
            />
            <FeatureCard
              image="/assets/generated/material-guide.dim_700x500.jpg"
              title="Budget-Friendly Tools"
              description="AI-powered recommendations for affordable, local materials that fit your budget."
            />
            <FeatureCard
              image="/assets/generated/virtual-runway.dim_1000x600.jpg"
              title="Virtual Fashion Shows"
              description="Experience immersive virtual fashion shows and explore collections in stunning detail."
            />
            <FeatureCard
              image="/assets/generated/3d-design-interface.dim_800x600.jpg"
              title="3D Design Studio"
              description="Create and visualize your fashion designs with our interactive 3D design tools."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Fashion Career?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of aspiring designers on their journey to fashion innovation. Start with our free tier today!
            </p>
            <div className="pt-4">
              <p className="text-lg text-muted-foreground mb-4">
                Sign in with Internet Identity to get started
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <Card className="group glass-effect rounded-2xl overflow-hidden hover-lift">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
