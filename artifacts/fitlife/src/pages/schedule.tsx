import { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import { useFitLifeData, ScheduleItem } from '@/hooks/useData';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Schedule() {
  const { schedule, setSchedule } = useFitLifeData();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState<{title: string, type: 'workout'|'meal'}>({ title: '', type: 'workout' });

  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  const handleAdd = () => {
    if (!newItem.title) return;
    const currentList = schedule[selectedDate] || [];
    const item: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newItem.title,
      type: newItem.type,
      done: false
    };
    
    setSchedule({
      ...schedule,
      [selectedDate]: [...currentList, item]
    });
    setIsOpen(false);
    setNewItem({ title: '', type: 'workout' });
    toast({ title: 'Plan added' });
  };

  const toggleDone = (dateKey: string, id: string) => {
    const list = schedule[dateKey] || [];
    setSchedule({
      ...schedule,
      [dateKey]: list.map(item => item.id === id ? { ...item, done: !item.done } : item)
    });
  };

  const removePlan = (dateKey: string, id: string) => {
    const list = schedule[dateKey] || [];
    setSchedule({
      ...schedule,
      [dateKey]: list.filter(item => item.id !== id)
    });
  };

  const openDialogForDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setIsOpen(true);
  };

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Weekly Schedule</h1>
        <p className="text-slate-500">Plan your workouts and meals ahead</p>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan for {selectedDate && format(new Date(selectedDate), 'MMMM d')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="What are you planning?" />
            <Select value={newItem.type} onValueChange={(v: any) => setNewItem({...newItem, type: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="workout">Workout</SelectItem>
                <SelectItem value="meal">Meal Prep</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">Add to Plan</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-7 gap-4">
        {weekDays.map(date => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const isToday = dateKey === format(today, 'yyyy-MM-dd');
          const plans = schedule[dateKey] || [];

          return (
            <Card key={dateKey} className={`flex flex-col h-full ${isToday ? 'border-violet-500 ring-1 ring-violet-500 shadow-md' : 'border-slate-200 dark:border-slate-800'}`}>
              <div className={`p-3 text-center border-b ${isToday ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{format(date, 'EEE')}</div>
                <div className={`text-2xl font-bold ${isToday ? 'text-violet-600 dark:text-violet-400' : ''}`}>{format(date, 'd')}</div>
              </div>
              <CardContent className="p-2 flex-1 flex flex-col gap-2 min-h-[150px]">
                {plans.map(plan => (
                  <div key={plan.id} className={`group flex items-start p-2 rounded-md text-sm border transition-colors ${
                    plan.done 
                      ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60' 
                      : plan.type === 'workout' 
                        ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800/50' 
                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800/50'
                  }`}>
                    <button onClick={() => toggleDone(dateKey, plan.id)} className="mr-2 mt-0.5 flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {plan.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4" />}
                    </button>
                    <span className={`flex-1 leading-tight ${plan.done ? 'line-through text-slate-500' : 'font-medium'}`}>
                      {plan.title}
                    </span>
                    <button onClick={() => removePlan(dateKey, plan.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 ml-1">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-auto w-full border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => openDialogForDate(dateKey)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageTransition>
  );
}
