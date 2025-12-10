import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Nexus from "@/pages/Nexus";
import PredictionTerminal from "@/pages/PredictionTerminal";
import PredictionConsole from "@/pages/PredictionConsole";
import TradingPage from "@/pages/TradingPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Nexus} />
      <Route path="/terminal" component={PredictionTerminal} />
      <Route path="/app" component={PredictionConsole} />
      <Route path="/markets/:id" component={TradingPage} />
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
