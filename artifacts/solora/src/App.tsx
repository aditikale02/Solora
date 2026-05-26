import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LeadInquiryProvider } from "@/components/lead/LeadInquiryProvider";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useSessionRole } from "@/hooks/use-session-role";
import { useLocation } from "wouter";

const Home = lazy(() => import("@/pages/Home"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DestinationsPage = lazy(() => import("@/pages/Destinations"));
const DestinationDetailPage = lazy(() => import("@/pages/DestinationDetail"));
const CategoryDetailPage = lazy(() => import("@/pages/CategoryDetail"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const PackagesPage = lazy(() => import("@/pages/Packages"));
const PackageDetailPage = lazy(() => import("@/pages/PackageDetail"));

const queryClient = new QueryClient();

function ProtectedAdminRoute() {
  const session = useAdminSession();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (session.status !== "loading" && session.status !== "signed-in") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate, session.status]);

  if (session.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1A1714] text-[#F7F0E6]">
        <p className="text-sm text-[#F7F0E6]/70">Checking admin session...</p>
      </main>
    );
  }

  if (session.status !== "signed-in") {
    return null;
  }

  return <AdminDashboard />;
}

function ProtectedUserRoute() {
  const session = useSessionRole();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (session.status === "signed-out") {
      navigate("/auth", { replace: true });
    }

    if (session.status === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate, session.status]);

  if (session.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1A1714] text-[#F7F0E6]">
        <p className="text-sm text-[#F7F0E6]/70">Checking your travel profile...</p>
      </main>
    );
  }

  if (session.status !== "user") {
    return null;
  }

  return <Dashboard />;
}

function Router() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#1A1714] text-[#F7F0E6]">
          <p className="text-sm text-[#F7F0E6]/70">Loading...</p>
        </main>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/login" component={AuthPage} />
        <Route path="/signup" component={AuthPage} />
        <Route path="/packages" component={PackagesPage} />
        <Route path="/packages/:slug" component={PackageDetailPage} />
        <Route path="/destinations" component={DestinationsPage} />
        <Route path="/destinations/:slug" component={DestinationDetailPage} />
        <Route path="/categories/:slug" component={CategoryDetailPage} />
        <Route path="/dashboard" component={ProtectedUserRoute} />
        <Route path="/admin/login" component={AuthPage} />
        <Route path="/admin/dashboard" component={ProtectedAdminRoute} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LeadInquiryProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </LeadInquiryProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
