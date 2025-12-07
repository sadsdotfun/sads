import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Nexus from "@/pages/Nexus";
import PredictiveConsole from "@/pages/PredictiveConsole";
import Orbiverse from "@/pages/Orbiverse";
import Docs from "@/pages/Docs";
import Roadmap from "@/pages/Roadmap";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Nexus} />
      <Route path="/app" component={PredictiveConsole} />
      <Route path="/orbiverse" component={Orbiverse} />
      <Route path="/docs" component={Docs} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/contact" component={Contact} />
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
