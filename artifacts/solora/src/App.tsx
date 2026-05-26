import { Switch, Route, Router as WouterRouter } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LeadInquiryProvider } from "@/components/lead/LeadInquiryProvider";
import { useAdminSession } from "@/hooks/use-admin-session";
import { useLocation } from "wouter";

const Home = lazy(() => import("@/pages/Home"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
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
        <Route path="/packages" component={PackagesPage} />
        <Route path="/packages/:slug" component={PackageDetailPage} />
        <Route path="/admin/login" component={AdminLogin} />
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
