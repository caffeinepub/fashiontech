import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Affordable <span className="gradient-text">Pricing</span> for Everyone
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your budget and learning goals. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid gap-6">
          <img 
            src="/assets/generated/pricing-tiers.dim_800x600.jpg" 
            alt="Pricing tiers"
            className="w-full h-64 object-cover rounded-lg mx-auto max-w-4xl"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
          {/* Free Tier */}
          <Card className="relative hover-lift border-2">
            <div className="absolute top-4 right-4">
              <Badge variant="secondary">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-3xl">Free Tier</CardTitle>
              <CardDescription className="text-lg">Perfect for getting started</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Access to basic courses on sustainable fashion</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Foundational design modules</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Community discussion board</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Mentorship connections</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Budget-friendly design tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>AI material recommendations</span>
                </li>
              </ul>
              <Button className="w-full" size="lg">
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="relative hover-lift border-2 border-primary">
            <div className="absolute top-4 right-4">
              <Badge>Best Value</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-3xl">Premium Tier</CardTitle>
              <CardDescription className="text-lg">Unlock your full potential</CardDescription>
              <div className="pt-4">
                <span className="text-5xl font-bold">$19</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Everything in Free tier, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Advanced courses and masterclasses</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Priority mentorship matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Exclusive virtual fashion shows</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Advanced 3D design tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Personalized AI learning paths</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Course completion certificates</span>
                </li>
              </ul>
              <Button className="w-full" size="lg" variant="default">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            <strong>Our commitment to affordability:</strong> We believe fashion education should be accessible to everyone, 
            regardless of income. That's why we offer a robust free tier and keep our premium pricing affordable for middle-class learners.
          </p>
        </div>
      </div>
    </section>
  );
}
