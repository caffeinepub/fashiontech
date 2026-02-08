import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GraduationCap, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import type { UserTier, CourseDescription, CourseModule } from '../../backend';
import { UserTier as UserTierEnum, CourseLevel } from '../../backend';

interface FashionZeroToProModalProps {
  course: CourseDescription;
  userTier: UserTier;
  onClose: () => void;
}

export default function FashionZeroToProModal({ course, userTier, onClose }: FashionZeroToProModalProps) {
  const isFree = userTier === UserTierEnum.free;

  // Extract modules by level if available
  const beginnerModule = course.modules?.find(m => m.level === CourseLevel.beginner);
  const intermediateModule = course.modules?.find(m => m.level === CourseLevel.intermediate);
  const professionalModule = course.modules?.find(m => m.level === CourseLevel.professional);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Course Banner */}
            <div className="relative rounded-lg overflow-hidden border">
              <img 
                src="/assets/generated/fashion-zero-to-pro-banner.dim_800x400.png" 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-6">
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-primary">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Complete Program
                  </Badge>
                  <Badge variant="secondary">{course.modules?.length || 0} Modules</Badge>
                </div>
              </div>
            </div>

            {/* Course Levels */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Course Levels</h3>
              
              {/* Beginner Level */}
              {beginnerModule && (
                <LevelDetailCard
                  module={beginnerModule}
                  icon="/assets/generated/beginner-level-icon-transparent.dim_64x64.png"
                  isLocked={false}
                  tierLabel="Free"
                />
              )}

              {/* Intermediate Level */}
              {intermediateModule && (
                <LevelDetailCard
                  module={intermediateModule}
                  icon="/assets/generated/intermediate-level-icon-transparent.dim_64x64.png"
                  isLocked={isFree}
                  tierLabel="Paid"
                />
              )}

              {/* Professional Level */}
              {professionalModule && (
                <LevelDetailCard
                  module={professionalModule}
                  icon="/assets/generated/professional-level-icon-transparent.dim_64x64.png"
                  isLocked={isFree}
                  tierLabel="Premium"
                />
              )}
            </div>

            <Separator />

            {/* What You'll Learn */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">What You'll Learn</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <LearningPoint text="Master fashion fundamentals from scratch" />
                <LearningPoint text="Develop your unique personal style" />
                <LearningPoint text="Create professional fashion portfolios" />
                <LearningPoint text="Understand fashion trends and forecasting" />
                <LearningPoint text="Learn fashion business strategies" />
                <LearningPoint text="Utilize AI tools for fashion design" />
              </div>
            </div>

            {isFree && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Unlock Full Access</CardTitle>
                  <CardDescription>
                    Upgrade to premium to access all levels and complete your fashion education journey.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Upgrade to Premium
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isFree && (
            <Button>
              Start Learning
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LevelDetailCard({ 
  module, 
  icon, 
  isLocked, 
  tierLabel 
}: { 
  module: CourseModule; 
  icon: string; 
  isLocked: boolean; 
  tierLabel: string;
}) {
  return (
    <Card className={`${isLocked ? 'opacity-75' : ''} relative`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img src={icon} alt={module.title} className="w-12 h-12" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <Badge variant={tierLabel === 'Free' ? 'secondary' : 'default'}>
                {tierLabel}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {module.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function LearningPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
