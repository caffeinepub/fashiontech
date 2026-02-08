import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';
import { clearSessionParameter } from '../utils/urlParams';

export default function PaymentFailure() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any pending purchase context when payment is cancelled
    clearSessionParameter('pendingPurchaseCourseId');
    clearSessionParameter('pendingPaypalSessionId');
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center border-destructive/50">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-3xl mb-2">Payment Cancelled</CardTitle>
              <CardDescription className="text-lg">
                Your payment was not completed
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                Don't worry! No charges were made to your account. You can try again whenever you're ready.
              </p>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={() => navigate({ to: '/storefront' })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={() => navigate({ to: '/' })}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
