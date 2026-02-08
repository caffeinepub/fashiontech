import { useState } from 'react';
import { useGetMyCourseProgress, useUpdateCourseProgress } from '../../hooks/useQueries';
import type { Course } from '../../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, CheckCircle2, Circle, Play } from 'lucide-react';
import { toast } from 'sonner';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
}

export default function CourseDetailModal({ course, onClose }: CourseDetailModalProps) {
  const { data: progress } = useGetMyCourseProgress(course.id);
  const { mutate: updateProgress, isPending } = useUpdateCourseProgress();
  const [currentModule, setCurrentModule] = useState(0);

  const progressPercentage = progress ? Number(progress.progress) : 0;
  const isCompleted = progress?.completed || false;

  const handleStartCourse = () => {
    if (!progress) {
      updateProgress({ courseId: course.id, progress: BigInt(10) });
      toast.success('Course started! Keep learning!');
    }
  };

  const handleCompleteModule = () => {
    const newProgress = Math.min(100, progressPercentage + Math.floor(100 / course.modules.length));
    updateProgress({ courseId: course.id, progress: BigInt(newProgress) });
    
    if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {isCompleted && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>

          {/* Course Modules */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Modules ({course.modules.length})
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {course.modules.map((module, index) => {
                const moduleProgress = (progressPercentage / 100) * course.modules.length;
                const isModuleCompleted = moduleProgress > index;
                const isCurrentModule = Math.floor(moduleProgress) === index;

                return (
                  <AccordionItem key={index} value={`module-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        {isModuleCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        ) : isCurrentModule ? (
                          <Play className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={isCurrentModule ? 'text-primary font-semibold' : ''}>
                          Module {index + 1}: {module}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">
                          Learn about {module.toLowerCase()} through interactive lessons and practical exercises.
                        </p>
                        {isCurrentModule && !isCompleted && (
                          <Button
                            size="sm"
                            onClick={handleCompleteModule}
                            disabled={isPending}
                          >
                            Complete Module
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {!progress && (
              <Button onClick={handleStartCourse} disabled={isPending} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Start Course
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className={progress ? 'flex-1' : ''}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
