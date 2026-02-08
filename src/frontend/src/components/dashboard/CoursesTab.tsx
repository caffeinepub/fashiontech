import { useState } from 'react';
import { useGetCourses, useGetPurchasedCourses } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronRight, Lock, Sparkles, GraduationCap, ShoppingBag, CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import CourseDetailModal from './CourseDetailModal';
import FashionZeroToProModal from './FashionZeroToProModal';
import type { Course, UserTier, CourseDescription } from '../../backend';
import { UserTier as UserTierEnum, PaymentStatus } from '../../backend';

interface CoursesTabProps {
  userTier: UserTier;
}

export default function CoursesTab({ userTier }: CoursesTabProps) {
  const navigate = useNavigate();
  const { data: courses, isLoading } = useGetCourses();
  const { data: purchasedCourses, isLoading: purchasedLoading } = useGetPurchasedCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showZeroToProModal, setShowZeroToProModal] = useState(false);
  const isFree = userTier === UserTierEnum.free;

  // Find the "Fashion From Zero to Pro" course by ID
  const zeroToProCourse = courses?.find(c => c.id === 'fashion_from_zero_to_pro');

  if (isLoading || purchasedLoading) {
    return (
      <div className="space-y-8">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-full" />
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
    );
  }

  const purchasedCourseIds = new Set(
    purchasedCourses?.filter(p => p.paymentStatus === PaymentStatus.completed).map(p => p.courseId) || []
  );

  const freeCourses = courses?.filter(c => c.free) || [];
  const paidCourses = courses?.filter(c => !c.free) || [];
  const enrolledCourses = courses?.filter(c => c.free || purchasedCourseIds.has(c.id)) || [];

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Courses</h2>
            <p className="text-muted-foreground">
              {isFree 
                ? 'Explore free courses and purchase premium content'
                : 'Access all your enrolled and purchased courses'
              }
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/storefront' })}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Storefront
          </Button>
        </div>

        {/* Enrolled/Purchased Courses */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Enrolled Courses</h3>
              <Badge variant="secondary">{enrolledCourses.length} Active</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                  isPurchased={purchasedCourseIds.has(course.id)}
                  isEnrolled={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured: Fashion From Zero to Pro */}
        {zeroToProCourse && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Featured Course</h3>
            </div>
            <Card 
              className="hover-lift cursor-pointer group relative overflow-hidden border-primary/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
              onClick={() => navigate({ to: '/courses/$courseId', params: { courseId: zeroToProCourse.id } })}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default" className="bg-primary">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Complete Program
                      </Badge>
                      <Badge variant="secondary">3 Levels</Badge>
                    </div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
                      {zeroToProCourse.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {zeroToProCourse.description}
                    </CardDescription>
                  </div>
                  <img 
                    src="/assets/generated/fashion-zero-to-pro-banner.dim_800x400.png" 
                    alt="Fashion From Zero to Pro"
                    className="hidden md:block w-48 h-24 object-cover rounded-lg border"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full group-hover:bg-primary/90">
                  View Course Details
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Paid Courses */}
        {paidCourses.filter(c => !purchasedCourseIds.has(c.id)).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">Available for Purchase</h3>
              <Badge>Premium Content</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidCourses.filter(c => !purchasedCourseIds.has(c.id)).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => navigate({ to: '/courses/$courseId', params: { courseId: course.id } })}
                  isPurchased={false}
                  isEnrolled={false}
                />
              ))}
            </div>
          </div>
        )}

        {!courses?.length && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
              <p className="text-muted-foreground">
                Check back soon for new courses!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </>
  );
}

function CourseCard({ 
  course, 
  onClick, 
  isPurchased,
  isEnrolled
}: { 
  course: Course; 
  onClick: () => void;
  isPurchased: boolean;
  isEnrolled: boolean;
}) {
  return (
    <Card className="hover-lift cursor-pointer group relative overflow-hidden" onClick={onClick}>
      {isPurchased && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Purchased
          </Badge>
        </div>
      )}
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
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="w-full group-hover:bg-primary/10">
          {isEnrolled ? 'Continue Learning' : 'View Course'}
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}
