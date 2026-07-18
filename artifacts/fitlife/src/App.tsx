import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/Layout';
import { useAppInit } from '@/hooks/useAppInit';

import Dashboard from '@/pages/dashboard';
import Meals from '@/pages/meals';
import Exercises from '@/pages/exercises';
import Schedule from '@/pages/schedule';
import Stories from '@/pages/stories';
import Progress from '@/pages/progress';
import WaterSleep from '@/pages/water-sleep';
import Badges from '@/pages/badges';
import Tips from '@/pages/tips';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/meals" component={Meals} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/stories" component={Stories} />
        <Route path="/progress" component={Progress} />
        <Route path="/water-sleep" component={WaterSleep} />
        <Route path="/badges" component={Badges} />
        <Route path="/tips" component={Tips} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const isReady = useAppInit();

  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
