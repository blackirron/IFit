import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Droplet, Moon, Plus, Minus, Star } from 'lucide-react';
import { useFitLifeData, SleepEntry } from '@/hooks/useData';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WaterSleep() {
  const { water, setWater, sleep, setSleep } = useFitLifeData();
  const { toast } = useToast();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayWater = water[today] || 0;
  const WATER_GOAL = 8;

  const [isOpen, setIsOpen] = useState(false);
  const [newSleep, setNewSleep] = useState({ bedtime: '22:00', waketime: '06:00', quality: 3 });

  const addWater = () => {
    setWater({ ...water, [today]: todayWater + 1 });
  };

  const removeWater = () => {
    if (todayWater > 0) {
      setWater({ ...water, [today]: todayWater - 1 });
    }
  };

  const handleLogSleep = () => {
    // Simple duration calc assuming same night
    const start = new Date(`2000-01-01T${newSleep.bedtime}`);
    const end = new Date(`2000-01-02T${newSleep.waketime}`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff > 24) diff -= 24; // If they entered something weird
    
    const entry: SleepEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), // log for previous night
      bedtime: newSleep.bedtime,
      waketime: newSleep.waketime,
      duration: Number(diff.toFixed(1)),
      quality: newSleep.quality
    };

    setSleep([...sleep, entry]);
    setIsOpen(false);
    toast({ title: 'Sleep logged successfully' });
  };

  const sleepChartData = sleep.slice(-7).map(s => ({
    date: format(new Date(s.date), 'MMM d'),
    duration: s.duration,
    quality: s.quality
  }));

  const waterProgress = Math.min((todayWater / WATER_GOAL) * 100, 100);

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recovery</h1>
        <p className="text-slate-500">Track your hydration and rest</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Water Tracker */}
        <Card className="glass-card relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-500/10 dark:bg-blue-500/20 transition-all duration-1000 ease-in-out -z-10" 
            style={{ height: `${waterProgress}%` }} 
          />
          <CardHeader>
            <CardTitle className="flex items-center text-cyan-600 dark:text-cyan-400">
              <Droplet className="mr-2 h-5 w-5 fill-current" /> Hydration
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {todayWater} <span className="text-2xl text-slate-400 font-normal">/ {WATER_GOAL}</span>
            </div>
            <p className="text-sm text-slate-500 mb-8 uppercase tracking-widest font-semibold">Glasses Today</p>
            
            <div className="flex gap-4">
              <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-2" onClick={removeWater} disabled={todayWater === 0}>
                <Minus className="h-6 w-6 text-slate-400" />
              </Button>
              <Button size="icon" className="h-14 w-14 rounded-full bg-gradient-water text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" onClick={addWater}>
                <Plus className="h-8 w-8" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracker */}
        <Card className="glass-card bg-slate-900 text-slate-50 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Moon className="w-48 h-48" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-400">
              <Moon className="mr-2 h-5 w-5 fill-current" /> Sleep
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {sleep.length > 0 ? (
              <div className="py-4">
                <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Last Night</p>
                <div className="text-5xl font-bold mb-6 text-white">{sleep[sleep.length - 1].duration} <span className="text-2xl text-slate-400 font-normal">hrs</span></div>
                
                <div className="flex gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`h-5 w-5 ${star <= sleep[sleep.length - 1].quality ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-slate-400">No sleep logged yet.</div>
            )}
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none">
                  Log Last Night's Sleep
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 text-slate-50 border-slate-800">
                <DialogHeader>
                  <DialogTitle>Log Sleep</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-300">Bedtime</label>
                      <Input type="time" value={newSleep.bedtime} onChange={e => setNewSleep({...newSleep, bedtime: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-300">Wake time</label>
                      <Input type="time" value={newSleep.waketime} onChange={e => setNewSleep({...newSleep, waketime: e.target.value})} className="bg-slate-800 border-slate-700 text-white" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-300">Quality (1-5)</label>
                    <div className="flex gap-2 justify-center py-2 bg-slate-800 rounded-lg">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setNewSleep({...newSleep, quality: star})} className="p-2 transition-transform hover:scale-110">
                          <Star className={`h-8 w-8 ${star <= newSleep.quality ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleLogSleep} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full mt-2">Save Entry</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sleep Duration (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sleepChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                  contentStyle={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="duration" radius={[6, 6, 0, 0]} maxBarSize={50}>
                  {sleepChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.duration >= 7 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
