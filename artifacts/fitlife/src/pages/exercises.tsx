import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Dumbbell, Plus, Trash2, Activity, Play } from 'lucide-react';
import { useFitLifeData, Exercise } from '@/hooks/useData';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Exercises() {
  const { exercises, setExercises } = useFitLifeData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newEx, setNewEx] = useState<Partial<Exercise>>({
    name: '', sets: 3, reps: 10, weight: 0, duration: 30, type: 'strength', date: format(new Date(), 'yyyy-MM-dd')
  });

  const handleAdd = () => {
    if (!newEx.name) {
      toast({ title: 'Error', description: 'Please enter exercise name', variant: 'destructive' });
      return;
    }
    const item: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      date: newEx.date || format(new Date(), 'yyyy-MM-dd'),
      name: newEx.name,
      sets: Number(newEx.sets),
      reps: Number(newEx.reps),
      weight: Number(newEx.weight),
      duration: Number(newEx.duration),
      type: newEx.type as any
    };
    setExercises([item, ...exercises]);
    setIsOpen(false);
    toast({ title: 'Workout logged!', description: `${item.name} added successfully.` });
    setNewEx({ name: '', sets: 3, reps: 10, weight: 0, duration: 30, type: 'strength', date: format(new Date(), 'yyyy-MM-dd') });
  };

  const handleDelete = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
    toast({ title: 'Workout removed' });
  };

  // Chart data: Active minutes past 7 days
  const todayDate = new Date();
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = format(subDays(todayDate, 6 - i), 'yyyy-MM-dd');
    const dayEx = exercises.filter(e => e.date === d);
    return {
      date: format(subDays(todayDate, 6 - i), 'MMM dd'),
      minutes: dayEx.reduce((sum, e) => sum + e.duration, 0)
    };
  });

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-slate-500">Track your strength and endurance</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white shadow-lg hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Exercise</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Exercise Name</label>
                <Input value={newEx.name} onChange={e => setNewEx({ ...newEx, name: e.target.value })} placeholder="e.g. Bench Press" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newEx.type} onValueChange={(v: any) => setNewEx({ ...newEx, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Duration (min)</label>
                  <Input type="number" value={newEx.duration || ''} onChange={e => setNewEx({ ...newEx, duration: e.target.valueAsNumber })} />
                </div>
              </div>
              
              {newEx.type === 'strength' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Sets</label>
                    <Input type="number" value={newEx.sets || ''} onChange={e => setNewEx({ ...newEx, sets: e.target.valueAsNumber })} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Reps</label>
                    <Input type="number" value={newEx.reps || ''} onChange={e => setNewEx({ ...newEx, reps: e.target.valueAsNumber })} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Weight (lbs)</label>
                    <Input type="number" value={newEx.weight || ''} onChange={e => setNewEx({ ...newEx, weight: e.target.valueAsNumber })} />
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleAdd} className="w-full bg-gradient-primary text-white">Save Exercise</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Activity className="mr-2 h-5 w-5 text-violet-500" /> Active Minutes (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Recent History</h3>
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.slice(0, 12).map((ex) => (
            <StaggerItem key={ex.id}>
              <Card className="hover-elevate transition-all border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 flex flex-col justify-between h-full relative group">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 h-8 w-8"
                    onClick={() => handleDelete(ex.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                      {ex.type === 'cardio' ? <Activity className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight pr-6">{ex.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">{format(new Date(ex.date), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md">
                    {ex.type === 'strength' ? (
                      <>
                        <div><span className="text-slate-500 text-xs">Sets</span> <br/> <span className="font-semibold">{ex.sets}</span></div>
                        <div><span className="text-slate-500 text-xs">Reps</span> <br/> <span className="font-semibold">{ex.reps}</span></div>
                        <div><span className="text-slate-500 text-xs">Weight</span> <br/> <span className="font-semibold">{ex.weight}</span></div>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between">
                         <div><span className="text-slate-500 text-xs">Duration</span> <br/> <span className="font-semibold">{ex.duration} min</span></div>
                         <Play className="h-4 w-4 text-violet-400" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
        {exercises.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
             <Dumbbell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500">No exercises logged yet. Time to get moving!</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
