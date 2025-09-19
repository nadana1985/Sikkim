import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Component examples for design preview
import HeaderExample from "@/components/examples/Header";
import MonasteryCardExample from "@/components/examples/MonasteryCard";
import HeroSectionExample from "@/components/examples/HeroSection";
import FestivalCardExample from "@/components/examples/FestivalCard";
import MonasteryMapExample from "@/components/examples/MonasteryMap";
import VirtualTourExample from "@/components/examples/VirtualTour";
import AdminDashboardExample from "@/components/examples/AdminDashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Main application routes */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      
      {/* Design component examples for preview */}
      <Route path="/preview/header" component={HeaderExample} />
      <Route path="/preview/monastery-cards" component={MonasteryCardExample} />
      <Route path="/preview/hero" component={HeroSectionExample} />
      <Route path="/preview/festival-cards" component={FestivalCardExample} />
      <Route path="/preview/map" component={MonasteryMapExample} />
      <Route path="/preview/virtual-tour" component={VirtualTourExample} />
      <Route path="/preview/admin" component={AdminDashboardExample} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
