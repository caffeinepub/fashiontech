import { useState } from 'react';
import { useGetCourses } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, ChevronRight, Lock, Sparkles, GraduationCap, Filter } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Course } from '../backend';

export default function CourseStorefront() {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useGetCourses();
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Find the "Fashion From Zero to Pro" course by ID
  const zeroToProCourse = courses?.find(c => c.id === 'fashion_from_zero_to_pro');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="h-12 bg-muted rounded w-1/3 animate-pulse" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredCourses = courses?.filter((course) => {
    if (tierFilter === 'all') return true;
    if (tierFilter === 'free') return course.free;
    if (tierFilter === 'paid') return !course.free;
    return true;
  }) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Course <span className="gradient-text">Storefront</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Explore our comprehensive collection of fashion courses. From free foundational content to premium masterclasses.
            </p>
            <img 
              src="/assets/generated/course-storefront-banner.dim_800x300.png" 
              alt="Course Storefront"
              className="w-full max-w-2xl h-48 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Featured Course */}
          {zeroToProCourse && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Featured Course</h2>
                <Badge variant="default" className="bg-primary">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Complete Program
                </Badge>
              </div>
              <Card 
                className="hover-lift cursor-pointer group relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
                onClick={() => navigate({ to: '/courses/$courseId', params: { courseId: zeroToProCourse.id } })}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">3 Levels</Badge>
                        <Badge variant="outline">Beginner to Pro</Badge>
                      </div>
                      <CardTitle className="text-3xl group-hover:text-primary transition-colors mb-3">
                        {zeroToProCourse.title}
                      </CardTitle>
                      <CardDescription className="text-base">
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
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Starting from</span>
                      <span className="text-2xl font-bold text-primary">Free</span>
                    </div>
                    <Button size="lg" className="group-hover:bg-primary/90">
                      View Course
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Course Filter */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Courses</h2>
              <p className="text-muted-foreground">
                Browse {filteredCourses.length} available courses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="free">Free Only</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate({ to: '/courses/$courseId', params: { courseId: course.id } })}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new courses.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseCard({ 
  course, 
  onClick 
}: { 
  course: Course; 
  onClick: () => void;
}) {
  return (
    <Card className="hover-lift cursor-pointer group relative overflow-hidden" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant={course.free ? 'secondary' : 'default'}>
            {course.free ? 'Free' : 'Paid'}
          </Badge>
          <Badge variant="outline">
            <BookOpen className="h-3 w-3 mr-1" />
            {course.modules.length} Modules
          </Badge>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full group-hover:bg-primary/10">
          View Course
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
