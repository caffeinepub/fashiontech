import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import LandingPage from './pages/LandingPage';
import CourseStorefront from './pages/CourseStorefront';
import CourseDetailPage from './pages/CourseDetailPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import { Loader2 } from 'lucide-react';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
});

const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/storefront',
  component: CourseStorefront,
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  storefrontRoute,
  courseDetailRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

function RootLayout() {
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header isAdmin={isAdmin || false} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function IndexPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showDashboard = isAuthenticated && userProfile !== null && !isAdmin;
  const showAdminPanel = isAuthenticated && userProfile !== null && isAdmin;

  if (loginStatus === 'initializing' || (isAuthenticated && (profileLoading || isAdminLoading))) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your fashion journey...</p>
        </div>
      </div>
    );
  }

  if (showAdminPanel) {
    return <AdminPanel userProfile={userProfile!} />;
  }

  if (showDashboard) {
    return <Dashboard userProfile={userProfile!} />;
  }

  return (
    <>
      <LandingPage />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
