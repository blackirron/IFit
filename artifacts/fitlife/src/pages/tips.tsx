import { useState } from 'react';
import { Search, Heart, Share2, Flame, Droplet, Dumbbell, Moon, Info } from 'lucide-react';
import { useFitLifeData } from '@/hooks/useData';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TIPS = [
  { id: '1', title: 'The 80/20 Rule of Nutrition', category: 'Nutrition', icon: Flame, content: 'Focus on whole, nutrient-dense foods 80% of the time, and allow yourself flexibility for your favorite treats the other 20%. This makes diets sustainable long-term.' },
  { id: '2', title: 'Progressive Overload', category: 'Strength', icon: Dumbbell, content: 'To build muscle, you must continually challenge it. Try increasing the weight, reps, or sets slightly each week to force adaptation.' },
  { id: '3', title: 'Hydration Timing', category: 'Hydration', icon: Droplet, content: 'Drink 16oz of water immediately upon waking up to jumpstart your metabolism and rehydrate after 8 hours of sleep.' },
  { id: '4', title: 'Sleep Environment', category: 'Recovery', icon: Moon, content: 'Keep your bedroom cool (around 65°F/18°C), completely dark, and quiet. This signals to your brain that it’s time for deep, restorative sleep.' },
  { id: '5', title: 'Protein Distribution', category: 'Nutrition', icon: Flame, content: 'Instead of eating most of your protein at dinner, aim to spread it evenly across 3-4 meals to maximize muscle protein synthesis throughout the day.' },
  { id: '6', title: 'Active Recovery', category: 'Recovery', icon: Info, content: 'On rest days, light activity like a 20-minute walk or gentle yoga increases blood flow, helping clear metabolic waste from your muscles faster than complete rest.' },
];

export default function Tips() {
  const { tipsFavorites } = useFitLifeData();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFav = (id: string) => {
    if (tipsFavorites.has(id)) tipsFavorites.remove(id);
    else tipsFavorites.add(id);
  };

  const categories = Array.from(new Set(TIPS.map(t => t.category)));

  const filteredTips = TIPS.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(search.toLowerCase()) || tip.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeFilter ? tip.category === activeFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center py-8 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4">Daily Insights</h1>
        <p className="text-white/80 max-w-lg mx-auto mb-8">Bite-sized knowledge to level up your fitness journey.</p>
        
        <div className="max-w-md mx-auto px-4 relative text-slate-900">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tips..." 
            className="pl-12 h-12 rounded-full border-none shadow-inner bg-white/95 focus-visible:ring-2 focus-visible:ring-violet-300"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <Badge 
          variant={activeFilter === null ? "default" : "outline"} 
          className="cursor-pointer px-4 py-1.5 text-sm"
          onClick={() => setActiveFilter(null)}
        >
          All
        </Badge>
        {categories.map(cat => (
          <Badge 
            key={cat} 
            variant={activeFilter === cat ? "default" : "outline"} 
            className="cursor-pointer px-4 py-1.5 text-sm"
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      <StaggerContainer className="grid md:grid-cols-2 gap-6 pb-12">
        {filteredTips.map(tip => {
          const Icon = tip.icon;
          const isFav = tipsFavorites.has(tip.id);
          
          return (
            <StaggerItem key={tip.id}>
              <Card className="glass-card h-full hover-elevate transition-all duration-300 border-none shadow-md">
                <CardContent className="p-6 flex flex-col h-full relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleFav(tip.id)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-rose-100 hover:text-rose-500 transition-colors">
                        <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="w-fit mb-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tip.category}
                  </Badge>
                  
                  <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-1">
                    {tip.content}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
        {filteredTips.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            No tips found matching your search.
          </div>
        )}
      </StaggerContainer>
    </PageTransition>
  );
}
