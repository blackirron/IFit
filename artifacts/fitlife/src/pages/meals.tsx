import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Utensils, PieChart } from 'lucide-react';
import { useFitLifeData, Meal } from '@/hooks/useData';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Meals() {
  const { meals, setMeals } = useFitLifeData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '', calories: 0, protein: 0, carbs: 0, fat: 0, type: 'lunch', date: format(new Date(), 'yyyy-MM-dd')
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayMeals = meals.filter(m => m.date === today);

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast({ title: 'Error', description: 'Please enter name and calories', variant: 'destructive' });
      return;
    }
    const mealToAdd: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      date: newMeal.date || today,
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein),
      carbs: Number(newMeal.carbs),
      fat: Number(newMeal.fat),
      type: newMeal.type as any
    };
    setMeals([...meals, mealToAdd]);
    setIsOpen(false);
    toast({ title: 'Meal logged!', description: `${mealToAdd.name} added successfully.` });
    setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, type: 'lunch', date: today });
  };

  const handleDelete = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
    toast({ title: 'Meal removed' });
  };

  const macroData = [
    { name: 'Protein', value: todayMeals.reduce((s, m) => s + m.protein, 0), color: 'hsl(var(--chart-1))' },
    { name: 'Carbs', value: todayMeals.reduce((s, m) => s + m.carbs, 0), color: 'hsl(var(--chart-2))' },
    { name: 'Fat', value: todayMeals.reduce((s, m) => s + m.fat, 0), color: 'hsl(var(--chart-3))' },
  ];

  const totalCals = todayMeals.reduce((s, m) => s + m.calories, 0);

  return (
    <PageTransition className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nutrition</h1>
          <p className="text-slate-500">Track your daily intake</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-energy text-white shadow-lg hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log a Meal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Meal Name</label>
                <Input value={newMeal.name} onChange={e => setNewMeal({ ...newMeal, name: e.target.value })} placeholder="e.g. Chicken Salad" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Calories</label>
                  <Input type="number" value={newMeal.calories || ''} onChange={e => setNewMeal({ ...newMeal, calories: e.target.valueAsNumber })} placeholder="kcal" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newMeal.type} onValueChange={(v: any) => setNewMeal({ ...newMeal, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Protein (g)</label>
                  <Input type="number" value={newMeal.protein || ''} onChange={e => setNewMeal({ ...newMeal, protein: e.target.valueAsNumber })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Carbs (g)</label>
                  <Input type="number" value={newMeal.carbs || ''} onChange={e => setNewMeal({ ...newMeal, carbs: e.target.valueAsNumber })} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Fat (g)</label>
                  <Input type="number" value={newMeal.fat || ''} onChange={e => setNewMeal({ ...newMeal, fat: e.target.valueAsNumber })} />
                </div>
              </div>
            </div>
            <Button onClick={handleAddMeal} className="w-full bg-gradient-energy text-white">Save Meal</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="glass-card col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Today's Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-8 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
               <div>
                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Cals</p>
                 <p className="text-2xl font-bold text-rose-500">{totalCals}</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Today's Log</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[300px] overflow-y-auto">
              {todayMeals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <Utensils className="h-8 w-8 mb-2 opacity-50" />
                  <p>No meals logged today</p>
                </div>
              ) : (
                <StaggerContainer>
                  {todayMeals.map(meal => (
                    <StaggerItem key={meal.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 font-bold text-xs uppercase">
                          {meal.type.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{meal.name}</p>
                          <p className="text-xs text-slate-500">{meal.calories} kcal • {meal.protein}P {meal.carbs}C {meal.fat}F</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(meal.id)} className="text-slate-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
