import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useConfirmCheckoutSession, useConfirmPaypalPayment } from '../hooks/useQueries';
import { getUrlParameter, getSessionParameter, clearSessionParameter } from '../utils/urlParams';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const confirmCheckout = useConfirmCheckoutSession();
  const confirmPaypal = useConfirmPaypalPayment();
  const [confirmationState, setConfirmationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Check if this is a PayPal return by looking for the token parameter
        const paypalToken = getUrlParameter('token');
        const paymentSource = getUrlParameter('paymentSource');
        
        if (paypalToken && paymentSource === 'paypal') {
          // PayPal payment flow
          const courseId = getSessionParameter('pendingPurchaseCourseId');
          const sessionId = getSessionParameter('pendingPaypalSessionId');
          
          if (!sessionId) {
            setErrorMessage('PayPal session ID is missing. Please contact support if you were charged.');
            setConfirmationState('error');
            return;
          }

          if (!courseId) {
            setErrorMessage('Course information is missing. Please contact support to verify your purchase.');
            setConfirmationState('error');
            return;
          }

          // Confirm the PayPal payment with backend
          await confirmPaypal.mutateAsync({ sessionId, courseId });
          
          // Clear the pending purchase from session storage
          clearSessionParameter('pendingPurchaseCourseId');
          clearSessionParameter('pendingPaypalSessionId');
          
          setConfirmationState('success');
        } else {
          // Stripe payment flow
          const sessionId = getUrlParameter('session_id');
          
          if (!sessionId) {
            setErrorMessage('Payment session ID is missing. Please contact support if you were charged.');
            setConfirmationState('error');
            return;
          }

          // Read pending courseId from session storage
          const courseId = getSessionParameter('pendingPurchaseCourseId');
          
          if (!courseId) {
            setErrorMessage('Course information is missing. Please contact support to verify your purchase.');
            setConfirmationState('error');
            return;
          }

          // Confirm the checkout with backend
          await confirmCheckout.mutateAsync({ sessionId, courseId });
          
          // Clear the pending purchase from session storage
          clearSessionParameter('pendingPurchaseCourseId');
          
          setConfirmationState('success');
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'Failed to confirm payment. Please contact support.');
        setConfirmationState('error');
      }
    };

    confirmPayment();
  }, []);

  if (confirmationState === 'loading') {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">Confirming Payment...</CardTitle>
                <CardDescription className="text-lg">
                  Please wait while we verify your purchase
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This should only take a moment. Do not close this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (confirmationState === 'error') {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center border-destructive/50">
            <CardHeader className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">Payment Confirmation Error</CardTitle>
                <CardDescription className="text-lg">
                  {errorMessage}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground text-sm">
                  If you were charged, your purchase will be processed. Please check your dashboard or contact support for assistance.
                </p>
              </div>
              <div className="space-y-3">
                <Button size="lg" className="w-full" onClick={() => navigate({ to: '/' })}>
                  Go to Dashboard
                </Button>
                <Button size="lg" variant="outline" className="w-full" onClick={() => navigate({ to: '/storefront' })}>
                  Browse Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center border-success/50">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
              <img 
                src="/assets/generated/stripe-success-icon.dim_64x64.png" 
                alt="Success"
                className="w-12 h-12"
              />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Payment Successful!</CardTitle>
              <CardDescription className="text-lg">
                Your course purchase has been completed successfully
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center justify-center gap-2 text-success mb-2">
                <CheckCircle className="h-5 w-5" />
                <p className="font-semibold">Course Unlocked</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You now have lifetime access to all course materials and future updates
              </p>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => navigate({ to: '/' })}>
                Go to Dashboard
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={() => navigate({ to: '/storefront' })}>
                Browse More Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
