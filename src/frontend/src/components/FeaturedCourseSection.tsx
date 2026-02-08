import { useGetCourses } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function FeaturedCourseSection() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useGetCourses();

  // Find the "Fashion From Zero to Pro" course by ID
  const zeroToProCourse = courses?.find(c => c.id === 'fashion_from_zero_to_pro');

  if (isLoading || !zeroToProCourse) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Featured <span className="gradient-text">Course</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Our comprehensive program to take you from beginner to professional
          </p>
        </div>

        <Card 
          className="max-w-5xl mx-auto hover-lift cursor-pointer group relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
          onClick={() => navigate({ to: '/courses/$courseId', params: { courseId: zeroToProCourse.id } })}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="default" className="bg-primary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Complete Program
                  </Badge>
                  <Badge variant="secondary">3 Levels</Badge>
                  <Badge variant="outline">Beginner to Pro</Badge>
                  <img 
                    src="/assets/generated/featured-course-badge-transparent.dim_100x100.png" 
                    alt="Featured"
                    className="w-6 h-6"
                  />
                </div>
                <CardTitle className="text-3xl md:text-4xl group-hover:text-primary transition-colors mb-3">
                  {zeroToProCourse.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {zeroToProCourse.description}
                </CardDescription>
              </div>
              <img 
                src="/assets/generated/fashion-zero-to-pro-banner.dim_800x400.png" 
                alt="Fashion From Zero to Pro"
                className="w-full md:w-80 h-40 object-cover rounded-lg border shadow-lg"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <LevelCard
                title="Beginner Level"
                description="Fashion Foundations"
                tier="Free"
                icon="/assets/generated/beginner-level-icon-transparent.dim_64x64.png"
              />
              <LevelCard
                title="Intermediate Level"
                description="Style & Identity"
                tier="Paid"
                icon="/assets/generated/intermediate-level-icon-transparent.dim_64x64.png"
              />
              <LevelCard
                title="Professional Level"
                description="Fashion as a Career"
                tier="Premium"
                icon="/assets/generated/professional-level-icon-transparent.dim_64x64.png"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Starting from</span>
                <span className="text-3xl font-bold text-primary">Free</span>
              </div>
              <Button size="lg" className="w-full sm:w-auto group-hover:bg-primary/90">
                Explore Course
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function LevelCard({ 
  title, 
  description, 
  tier, 
  icon 
}: { 
  title: string; 
  description: string; 
  tier: string; 
  icon: string;
}) {
  return (
    <div className="p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <img src={icon} alt={title} className="w-10 h-10" />
        <Badge variant={tier === 'Free' ? 'secondary' : 'default'}>
          {tier}
        </Badge>
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
