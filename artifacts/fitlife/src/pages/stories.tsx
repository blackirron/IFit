import { Heart, Bookmark, MessageCircle } from 'lucide-react';
import { useFitLifeData } from '@/hooks/useData';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/PageTransition';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

// Mock content
const STORIES = [
  { id: '1', user: 'SarahJ_Fit', img: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', user: 'MikeLift', img: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', user: 'YogaEmma', img: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', user: 'RunChris', img: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', user: 'DietDan', img: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', user: 'AishaFit', img: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', user: 'TomStrong', img: 'https://i.pravatar.cc/150?u=7' },
];

const POSTS = [
  {
    id: 'p1',
    user: 'SarahJ_Fit',
    avatar: 'https://i.pravatar.cc/150?u=1',
    time: '2 hours ago',
    content: "Just hit a new PR on squats today! 🏋️‍♀️ Remember, progress isn't linear. Keep showing up even on the days you don't feel like it. Consistency > Intensity.",
    tags: ['#fitness', '#legday', '#motivation'],
    image: 'bg-gradient-to-br from-purple-400 to-indigo-500' // Placeholder for real image
  },
  {
    id: 'p2',
    user: 'DietDan',
    avatar: 'https://i.pravatar.cc/150?u=5',
    time: '5 hours ago',
    content: "Meal prep Sunday! Made quinoa bowls with roasted chickpeas and lemon tahini dressing. High protein, full of fiber, and takes 20 minutes.",
    tags: ['#nutrition', '#mealprep', '#vegan'],
    image: 'bg-gradient-to-br from-emerald-400 to-teal-500'
  },
  {
    id: 'p3',
    user: 'RunChris',
    avatar: 'https://i.pravatar.cc/150?u=4',
    time: '1 day ago',
    content: "Morning 10K around the lake. The hardest step is always the one out the front door.",
    tags: ['#running', '#cardio', '#morning'],
    image: 'bg-gradient-to-br from-blue-400 to-cyan-500'
  }
];

export default function Stories() {
  const { storiesLikes, storiesBookmarks } = useFitLifeData();

  const toggleLike = (id: string) => {
    if (storiesLikes.has(id)) storiesLikes.remove(id);
    else storiesLikes.add(id);
  };

  const toggleBookmark = (id: string) => {
    if (storiesBookmarks.has(id)) storiesBookmarks.remove(id);
    else storiesBookmarks.add(id);
  };

  return (
    <PageTransition className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-slate-500">Get inspired by others</p>
      </div>

      {/* Stories Rings */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1 snap-start flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600">
              <div className="p-0.5 bg-white dark:bg-slate-950 rounded-full">
                <Avatar className="h-16 w-16 border-2 border-transparent">
                  <AvatarImage src={story.img} />
                  <AvatarFallback>{story.user[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs font-medium truncate w-16 text-center">{story.user}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <StaggerContainer className="space-y-6 pb-10">
        {POSTS.map(post => {
          const isLiked = storiesLikes.has(post.id);
          const isBookmarked = storiesBookmarks.has(post.id);

          return (
            <StaggerItem key={post.id}>
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 glass-card">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{post.user}</div>
                      <div className="text-xs text-slate-500">{post.time}</div>
                    </div>
                  </div>
                </div>
                
                {/* Visual Placeholder (in a real app, this would be an img) */}
                <div className={`w-full aspect-[4/3] ${post.image} flex items-center justify-center`}>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-white font-bold text-xl shadow-lg border border-white/30">
                    {post.tags[0].toUpperCase()}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <button onClick={() => toggleLike(post.id)} className="transition-transform active:scale-90">
                        <Heart className={`h-6 w-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'}`} />
                      </button>
                      <button>
                        <MessageCircle className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                    <button onClick={() => toggleBookmark(post.id)} className="transition-transform active:scale-90">
                      <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-slate-800 text-slate-800 dark:fill-white dark:text-white' : 'text-slate-600 dark:text-slate-300'}`} />
                    </button>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-semibold mr-2">{post.user}</span>
                    <span className="text-slate-700 dark:text-slate-300">{post.content}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs text-violet-500 font-medium">{tag}</span>
                    ))}
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </PageTransition>
  );
}
