import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCourse, useHasPurchasedCourse, useCreateCheckoutSession, useGetCallerUserProfile, useCreatePaypalPayment } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Lock, ShoppingCart, CheckCircle, ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { storeSessionParameter } from '../utils/urlParams';

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const { data: course, isLoading: courseLoading } = useGetCourse(courseId);
  const { data: hasPurchased, isLoading: purchaseLoading } = useHasPurchasedCourse(courseId);
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const createCheckout = useCreateCheckoutSession();
  const createPaypalPayment = useCreatePaypalPayment();

  if (courseLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-12 bg-muted rounded w-1/3 animate-pulse" />
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/storefront' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  const handleStripeCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this course');
      return;
    }

    if (!userProfile) {
      setShowProfileSetup(true);
      return;
    }

    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const items = [{
        productName: course.title,
        productDescription: course.description,
        priceInCents: BigInt(4900),
        currency: 'usd',
        quantity: BigInt(1),
      }];

      // Store courseId in session storage before redirect
      storeSessionParameter('pendingPurchaseCourseId', courseId);

      const sessionJson = await createCheckout.mutateAsync({ items, successUrl, cancelUrl });
      
      // Parse the JSON response from backend
      const session = JSON.parse(sessionJson);
      
      if (!session?.id || !session?.url) {
        throw new Error('Invalid checkout session response');
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  const handlePaypalCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this course');
      return;
    }

    if (!userProfile) {
      setShowProfileSetup(true);
      return;
    }

    try {
      // Generate a unique session ID for PayPal
      const sessionId = `paypal_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Store courseId and PayPal session ID in session storage before redirect
      storeSessionParameter('pendingPurchaseCourseId', courseId);
      storeSessionParameter('pendingPaypalSessionId', sessionId);

      // Create PayPal payment in backend
      await createPaypalPayment.mutateAsync({ courseId, sessionId });

      // In a real implementation, the backend would return a PayPal approval URL
      // For now, we'll simulate the PayPal flow by redirecting to a mock URL
      // that will redirect back to our success page with the token parameter
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const returnUrl = `${baseUrl}/payment-success?token=${sessionId}&paymentSource=paypal`;
      
      // Redirect to PayPal (in production, this would be the actual PayPal approval URL)
      window.location.href = returnUrl;
    } catch (error: any) {
      console.error('PayPal checkout error:', error);
      toast.error(error.message || 'Failed to create PayPal payment');
    }
  };

  const isLoading = courseLoading || purchaseLoading || profileLoading;
  const isCheckoutDisabled = isLoading || createCheckout.isPending || createPaypalPayment.isPending;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate({ to: '/storefront' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <CardTitle className="text-4xl">{course.title}</CardTitle>
                  {course.free ? (
                    <Badge variant="secondary" className="text-sm">Free</Badge>
                  ) : (
                    <Badge className="text-sm">Paid</Badge>
                  )}
                </div>
                <CardDescription className="text-lg">{course.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <img 
              src="/assets/generated/course-detail-hero.dim_800x400.jpg" 
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            {/* Purchase/Access Section */}
            {!isAuthenticated ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Login Required</h3>
                      <p className="text-sm text-muted-foreground">
                        Please login to {course.free ? 'access' : 'purchase'} this course
                      </p>
                    </div>
                    <Button 
                      size="lg" 
                      onClick={handleLogin}
                      disabled={loginStatus === 'logging-in'}
                    >
                      {loginStatus === 'logging-in' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : hasPurchased || course.free ? (
              <Card className="bg-success/5 border-success/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-success" />
                      <div>
                        <h3 className="text-lg font-semibold">Course Unlocked</h3>
                        <p className="text-sm text-muted-foreground">
                          You have full access to all course materials
                        </p>
                      </div>
                    </div>
                    <Button size="lg" onClick={() => navigate({ to: '/' })}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Purchase This Course</h3>
                        <p className="text-sm text-muted-foreground">
                          Get lifetime access to all course materials
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">$49</div>
                        <div className="text-sm text-muted-foreground">one-time payment</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        size="lg" 
                        className="flex-1"
                        onClick={handleStripeCheckout}
                        disabled={isCheckoutDisabled}
                      >
                        {createCheckout.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Pay with Stripe
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="flex-1"
                        onClick={handlePaypalCheckout}
                        disabled={isCheckoutDisabled}
                      >
                        {createPaypalPayment.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Pay with PayPal
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Course Modules</h3>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, index) => (
                  <AccordionItem key={index} value={`module-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-3">
                        {hasPurchased || course.free ? (
                          <BookOpen className="h-5 w-5 text-primary" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span>Module {index + 1}: {module}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 text-muted-foreground">
                        {hasPurchased || course.free ? (
                          <p>Access this module content from your dashboard.</p>
                        ) : (
                          <p>Purchase the course to unlock this module.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Setup Modal - conditionally rendered */}
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
