import { format } from 'date-fns';
import { Flame, Droplet, Moon, Activity, Utensils, Dumbbell, Award, ChevronRight } from 'lucide-react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { useFitLifeData } from '@/hooks/useData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const { profile, meals, exercises, water, sleep, badges } = useFitLifeData();
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayMeals = meals.filter(m => m.date === today);
  const todayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  
  const todayExercises = exercises.filter(e => e.date === today);
  const todayActiveMinutes = todayExercises.reduce((sum, e) => sum + e.duration, 0);

  const todayWater = water[today] || 0;
  const lastSleep = sleep.length > 0 ? sleep[sleep.length - 1] : { duration: 0, quality: 0 };

  const earnedBadgesCount = Object.values(badges).filter(b => b.earned).length;

  const statCards = [
    { title: 'Calories', value: `${todayCalories} kcal`, subtitle: 'Consumed today', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Active', value: `${todayActiveMinutes} min`, subtitle: 'Exercise today', icon: Activity, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Water', value: `${todayWater}/8`, subtitle: 'Glasses today', icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Sleep', value: `${lastSleep.duration} hrs`, subtitle: 'Last night', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good Morning, {profile.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 dark:text-slate-400">Ready to crush your goals today?</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
          <Award className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-sm">{earnedBadgesCount} Badges Earned</span>
        </div>
      </div>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StaggerItem key={i}>
            <Card className="glass-card hover-elevate transition-all duration-300 border-none shadow-sm dark:bg-slate-900/50">
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-slate-500 font-medium">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Today's Energy</CardTitle>
            <Link href="/meals" className="text-sm text-violet-500 font-medium hover:underline flex items-center">
              Details <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Calories Goal</span>
                  <span className="text-rose-500">{todayCalories} / 2500 kcal</span>
                </div>
                <Progress value={Math.min((todayCalories / 2500) * 100, 100)} className="h-3 bg-slate-100 dark:bg-slate-800" indicatorClassName="bg-gradient-energy" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-sm text-slate-500 mb-1">Protein</div>
                  <div className="font-bold">{todayMeals.reduce((sum, m) => sum + m.protein, 0)}g</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-sm text-slate-500 mb-1">Carbs</div>
                  <div className="font-bold">{todayMeals.reduce((sum, m) => sum + m.carbs, 0)}g</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="text-sm text-slate-500 mb-1">Fat</div>
                  <div className="font-bold">{todayMeals.reduce((sum, m) => sum + m.fat, 0)}g</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {todayExercises.length > 0 ? (
              <div className="space-y-4 mt-4">
                {todayExercises.map(ex => (
                  <div key={ex.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{ex.name}</div>
                      <div className="text-xs text-slate-500">{ex.duration} min • {ex.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 flex flex-col items-center">
                <Activity className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm">No activity logged yet.</p>
                <Link href="/exercises" className="text-violet-500 text-sm mt-2 font-medium">Log a workout</Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
