import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Utensils, Dumbbell, Calendar, LayoutList, LineChart, Droplet, Award, Lightbulb, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useAppInit';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFitLifeData } from '@/hooks/useData';

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useFitLifeData();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Meals', path: '/meals', icon: Utensils },
    { name: 'Exercises', path: '/exercises', icon: Dumbbell },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Stories', path: '/stories', icon: LayoutList },
    { name: 'Progress', path: '/progress', icon: LineChart },
    { name: 'Water & Sleep', path: '/water-sleep', icon: Droplet },
    { name: 'Badges', path: '/badges', icon: Award },
    { name: 'Daily Tips', path: '/tips', icon: Lightbulb },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-1 mt-6 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        return (
          <Link key={item.path} href={item.path} onClick={onClick}>
            <div
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500/20 to-indigo-600/20 text-violet-500 dark:text-violet-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
            F
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-primary">FitLife</span>
        </div>
        
        <div className="px-6 mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              {profile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{profile.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{profile.goal}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
            F
          </div>
          <span className="text-lg font-bold tracking-tight">FitLife</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-white dark:bg-slate-900">
              <div className="p-6 pb-2 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-violet-100 text-violet-700">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{profile.name}</span>
                  <span className="text-xs text-slate-500">{profile.goal}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pb-8">
                <NavLinks onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 flex justify-around p-2 pb-safe">
        {[
          { path: '/', icon: Home, label: 'Home' },
          { path: '/meals', icon: Utensils, label: 'Meals' },
          { path: '/exercises', icon: Dumbbell, label: 'Workout' },
          { path: '/progress', icon: LineChart, label: 'Stats' },
          { path: '/water-sleep', icon: Droplet, label: 'Water' },
        ].map(item => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${isActive ? 'text-violet-500' : 'text-slate-500'}`}>
                <Icon className={`h-6 w-6 mb-1 ${isActive ? 'fill-violet-500/20' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
