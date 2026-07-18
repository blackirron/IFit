import { useState } from 'react';
import { format } from 'date-fns';
import { Scale, TrendingDown, Ruler } from 'lucide-react';
import { useFitLifeData, WeightEntry, MeasurementEntry } from '@/hooks/useData';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Progress() {
  const { weightLog, setWeightLog, measurements, setMeasurements, profile, setProfile } = useFitLifeData();
  const { toast } = useToast();
  const [newWeight, setNewWeight] = useState('');
  const [newMeas, setNewMeas] = useState({ chest: 0, waist: 0, hips: 0, arms: 0, legs: 0 });
  const [bmiHeight, setBmiHeight] = useState(profile.height);

  const sortedLog = [...weightLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const chartData = sortedLog.slice(-30).map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    weight: entry.weight
  }));

  const currentWeight = sortedLog.length > 0 ? sortedLog[sortedLog.length - 1].weight : profile.weight;
  const initialWeight = sortedLog.length > 0 ? sortedLog[0].weight : profile.weight;
  const diff = currentWeight - initialWeight;
  const isLoss = diff < 0;

  // BMI Calculation: weight (kg) / height (m)^2
  // converting lbs to kg for standard BMI, and height from cm to m
  const weightKg = currentWeight * 0.453592;
  const heightM = bmiHeight / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '0';

  const handleAddWeight = () => {
    if (!newWeight) return;
    const entry: WeightEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: parseFloat(newWeight),
      unit: 'lbs'
    };
    
    const existing = weightLog.findIndex(e => e.date === entry.date);
    if (existing >= 0) {
      const newLog = [...weightLog];
      newLog[existing] = entry;
      setWeightLog(newLog);
    } else {
      setWeightLog([...weightLog, entry]);
    }
    
    setProfile({ ...profile, weight: parseFloat(newWeight) });
    setNewWeight('');
    toast({ title: 'Weight logged successfully' });
  };

  const handleAddMeasurements = () => {
    const entry: MeasurementEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(new Date(), 'yyyy-MM-dd'),
      chest: Number(newMeas.chest),
      waist: Number(newMeas.waist),
      hips: Number(newMeas.hips),
      arms: Number(newMeas.arms),
      legs: Number(newMeas.legs)
    };
    setMeasurements([...measurements, entry]);
    toast({ title: 'Measurements saved' });
  };

  return (
    <PageTransition className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Progress</h1>
        <p className="text-slate-500">Track your body transformation</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card bg-gradient-to-br from-violet-500 to-indigo-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Current Weight</p>
                <h2 className="text-4xl font-bold">{currentWeight} <span className="text-xl font-normal text-white/80">lbs</span></h2>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <div className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${isLoss ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100'}`}>
                {isLoss ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1 rotate-180" />}
                {Math.abs(diff).toFixed(1)} lbs
              </div>
              <span className="text-sm text-white/70">since start</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardContent className="p-6 flex flex-col justify-center h-full">
             <h3 className="text-lg font-bold mb-4">Log Today's Weight</h3>
             <div className="flex gap-4">
               <div className="relative flex-1">
                 <Input 
                   type="number" 
                   value={newWeight} 
                   onChange={e => setNewWeight(e.target.value)} 
                   className="pl-4 pr-12 text-lg h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                   placeholder={currentWeight.toString()} 
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">lbs</span>
               </div>
               <Button onClick={handleAddWeight} className="h-12 px-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                 Save Entry
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weight">Weight Trend</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weight">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Weight Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Body Measurements (inches)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Chest</label>
                  <Input type="number" value={newMeas.chest || ''} onChange={e => setNewMeas({...newMeas, chest: e.target.valueAsNumber})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Waist</label>
                  <Input type="number" value={newMeas.waist || ''} onChange={e => setNewMeas({...newMeas, waist: e.target.valueAsNumber})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Hips</label>
                  <Input type="number" value={newMeas.hips || ''} onChange={e => setNewMeas({...newMeas, hips: e.target.valueAsNumber})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Arms</label>
                  <Input type="number" value={newMeas.arms || ''} onChange={e => setNewMeas({...newMeas, arms: e.target.valueAsNumber})} />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Legs</label>
                  <Input type="number" value={newMeas.legs || ''} onChange={e => setNewMeas({...newMeas, legs: e.target.valueAsNumber})} />
                </div>
              </div>
              <Button onClick={handleAddMeasurements}>Save Measurements</Button>

              {measurements.length > 0 && (
                <div className="mt-8 space-y-2">
                  <h4 className="font-bold text-sm">Recent Logs</h4>
                  {measurements.slice(-5).reverse().map(m => (
                    <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm">
                      <span className="font-medium text-slate-500">{m.date}</span>
                      <div className="flex gap-4">
                        <span>C: {m.chest}"</span>
                        <span>W: {m.waist}"</span>
                        <span>H: {m.hips}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bmi">
          <Card className="glass-card">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">BMI Calculator</h3>
                    <p className="text-slate-500 text-sm">Body Mass Index is a simple calculation using your height and weight. Note that it doesn't distinguish between muscle and fat.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Height (cm)</label>
                      <Input type="number" value={bmiHeight} onChange={e => {
                        setBmiHeight(e.target.valueAsNumber);
                        setProfile({ ...profile, height: e.target.valueAsNumber });
                      }} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Weight (lbs) - <i>Updates via Progress</i></label>
                      <Input type="number" value={currentWeight} disabled className="bg-slate-50 dark:bg-slate-900" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-primary mb-2">
                    {bmi}
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-widest text-slate-500">Your BMI</div>
                  
                  <div className="w-full mt-8 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-400 w-1/4" title="Underweight" />
                    <div className="h-full bg-emerald-400 w-[20%]" title="Healthy" />
                    <div className="h-full bg-amber-400 w-[15%]" title="Overweight" />
                    <div className="h-full bg-rose-500 w-[40%]" title="Obese" />
                  </div>
                  <div className="w-full flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                    <span>18.5</span>
                    <span>25.0</span>
                    <span>30.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  );
}
