import { Award, Lock, CheckCircle2, TrendingUp, CalendarDays, Droplets, Utensils, Dumbbell, HeartPulse, Moon, Sunrise } from 'lucide-react';
import { useFitLifeData } from '@/hooks/useData';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ICONS: Record<string, any> = {
  Sunrise, CalendarDays, Droplets, Utensils, Dumbbell, HeartPulse, Moon
};

export default function Badges() {
  const { badges } = useFitLifeData();
  const badgeList = Object.values(badges);
  
  const earned = badgeList.filter(b => b.earned);
  const locked = badgeList.filter(b => !b.earned);

  return (
    <PageTransition className="space-y-10">
      <div className="text-center max-w-2xl mx-auto pt-8 pb-4">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
          <Award className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Trophy Room</h1>
        <p className="text-lg text-slate-500">You've unlocked <span className="font-bold text-slate-900 dark:text-white">{earned.length}</span> out of {badgeList.length} badges. Keep pushing!</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center"><CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" /> Earned Badges</h2>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {earned.map(badge => {
            const Icon = ICONS[badge.icon] || Award;
            return (
              <StaggerItem key={badge.id}>
                <Card className="glass-card border-amber-200 dark:border-amber-900/50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{badge.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{badge.description}</p>
                    {badge.earnedDate && (
                      <div className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                        Earned {new Date(badge.earnedDate).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
        {earned.length === 0 && (
          <div className="text-center p-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">No badges earned yet. Complete daily activities to start collecting!</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center"><Lock className="mr-2 h-5 w-5 text-slate-400" /> Locked Badges</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {locked.map(badge => {
            const Icon = ICONS[badge.icon] || Award;
            return (
              <Card key={badge.id} className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800">
                <CardContent className="p-5 flex items-start gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{badge.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{badge.description}</p>
                    
                    {badge.total && badge.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                          <span>Progress</span>
                          <span>{badge.progress} / {badge.total}</span>
                        </div>
                        <Progress value={(badge.progress / badge.total) * 100} className="h-1.5 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-slate-400" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
