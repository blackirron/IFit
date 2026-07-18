import { useLocalStorage, useLocalSet } from './useLocalStorage';
import { subDays, format } from 'date-fns';

export type Meal = { id: string; date: string; name: string; calories: number; protein: number; carbs: number; fat: number; type: 'breakfast' | 'lunch' | 'dinner' | 'snack' };
export type Exercise = { id: string; date: string; name: string; sets: number; reps: number; weight: number; duration: number; type: 'cardio' | 'strength' | 'flexibility' };
export type ScheduleItem = { id: string; title: string; type: 'workout' | 'meal'; done: boolean };
export type WeightEntry = { id: string; date: string; weight: number; unit: 'lbs' | 'kg' };
export type MeasurementEntry = { id: string; date: string; chest: number; waist: number; hips: number; arms: number; legs: number };
export type SleepEntry = { id: string; date: string; bedtime: string; waketime: string; duration: number; quality: number };
export type Profile = { name: string; age: number; height: number; weight: number; goal: string; avatar: string };
export type Badge = { id: string; title: string; description: string; icon: string; category: string; earned: boolean; earnedDate?: string; progress?: number; total?: number };

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useFitLifeData() {
  const [seeded, setSeeded] = useLocalStorage('fitlife_seeded', false);

  const [meals, setMeals] = useLocalStorage<Meal[]>('fitlife_meals', []);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('fitlife_exercises', []);
  const [schedule, setSchedule] = useLocalStorage<Record<string, ScheduleItem[]>>('fitlife_schedule', {});
  const [weightLog, setWeightLog] = useLocalStorage<WeightEntry[]>('fitlife_weight_log', []);
  const [measurements, setMeasurements] = useLocalStorage<MeasurementEntry[]>('fitlife_measurements', []);
  const [water, setWater] = useLocalStorage<Record<string, number>>('fitlife_water', {});
  const [sleep, setSleep] = useLocalStorage<SleepEntry[]>('fitlife_sleep', []);
  const [profile, setProfile] = useLocalStorage<Profile>('fitlife_profile', {
    name: 'Alex Athlete', age: 28, height: 175, weight: 180, goal: 'Build Muscle', avatar: ''
  });

  const storiesLikes = useLocalSet<string>('fitlife_stories_likes');
  const storiesBookmarks = useLocalSet<string>('fitlife_stories_bookmarks');
  const tipsFavorites = useLocalSet<string>('fitlife_tips_favorites');

  const [badges, setBadges] = useLocalStorage<Record<string, Badge>>('fitlife_badges', {
    'early-bird': { id: 'early-bird', title: 'Early Bird', description: 'Log a workout before 7 AM', icon: 'Sunrise', category: 'consistency', earned: false },
    'first-week': { id: 'first-week', title: 'First Week', description: 'Log activity for 7 consecutive days', icon: 'CalendarDays', category: 'streaks', earned: false },
    'hydration-hero': { id: 'hydration-hero', title: 'Hydration Hero', description: 'Drink 8 glasses of water in a day', icon: 'Droplets', category: 'nutrition', earned: false },
    'meal-planner': { id: 'meal-planner', title: 'Meal Planner', description: 'Log 4 meals in a single day', icon: 'Utensils', category: 'nutrition', earned: false },
    'iron-pumper': { id: 'iron-pumper', title: 'Iron Pumper', description: 'Log 5 strength workouts', icon: 'Dumbbell', category: 'strength', earned: false, progress: 0, total: 5 },
    'cardio-king': { id: 'cardio-king', title: 'Cardio King', description: 'Log 10 cardio workouts', icon: 'HeartPulse', category: 'cardio', earned: false, progress: 0, total: 10 },
    'sleep-master': { id: 'sleep-master', title: 'Sleep Master', description: 'Get 8+ hours of sleep for 3 days straight', icon: 'Moon', category: 'recovery', earned: false }
  });

  return {
    seeded, setSeeded,
    meals, setMeals,
    exercises, setExercises,
    schedule, setSchedule,
    weightLog, setWeightLog,
    measurements, setMeasurements,
    water, setWater,
    sleep, setSleep,
    profile, setProfile,
    badges, setBadges,
    storiesLikes, storiesBookmarks, tipsFavorites
  };
}

export function seedData(data: ReturnType<typeof useFitLifeData>) {
  if (data.seeded) return;
  
  const today = new Date();
  
  // Seed Meals (past 10 days)
  const seededMeals: Meal[] = [];
  for (let i = 0; i < 10; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    seededMeals.push({ id: generateId(), date: d, name: 'Oatmeal & Berries', calories: 350, protein: 12, carbs: 55, fat: 6, type: 'breakfast' });
    seededMeals.push({ id: generateId(), date: d, name: 'Chicken Salad', calories: 450, protein: 40, carbs: 15, fat: 20, type: 'lunch' });
    seededMeals.push({ id: generateId(), date: d, name: 'Salmon & Quinoa', calories: 600, protein: 45, carbs: 40, fat: 25, type: 'dinner' });
    if (i % 2 === 0) seededMeals.push({ id: generateId(), date: d, name: 'Protein Shake', calories: 200, protein: 25, carbs: 10, fat: 3, type: 'snack' });
  }
  data.setMeals(seededMeals);

  // Seed Exercises (past 8 days)
  const seededExercises: Exercise[] = [];
  for (let i = 0; i < 8; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    if (i % 3 === 0) {
      seededExercises.push({ id: generateId(), date: d, name: 'Morning Run', sets: 1, reps: 1, weight: 0, duration: 30, type: 'cardio' });
    } else {
      seededExercises.push({ id: generateId(), date: d, name: 'Bench Press', sets: 4, reps: 8, weight: 135, duration: 15, type: 'strength' });
      seededExercises.push({ id: generateId(), date: d, name: 'Squats', sets: 3, reps: 10, weight: 185, duration: 20, type: 'strength' });
    }
  }
  data.setExercises(seededExercises);

  // Seed Water & Sleep (past 7 days)
  const seededWater: Record<string, number> = {};
  const seededSleep: SleepEntry[] = [];
  for (let i = 0; i < 7; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    seededWater[d] = Math.floor(Math.random() * 4) + 5; // 5 to 8
    seededSleep.push({
      id: generateId(), date: d, 
      bedtime: '22:30', waketime: '06:30', 
      duration: 8, quality: Math.floor(Math.random() * 3) + 3 // 3 to 5
    });
  }
  data.setWater(seededWater);
  data.setSleep(seededSleep);

  // Seed Weight (past 30 days)
  const seededWeight: WeightEntry[] = [];
  let currentWeight = 185;
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(today, i), 'yyyy-MM-dd');
    if (i % 3 === 0) currentWeight -= 0.3; // gradual drop
    seededWeight.push({ id: generateId(), date: d, weight: parseFloat(currentWeight.toFixed(1)), unit: 'lbs' });
  }
  data.setWeightLog(seededWeight);

  // Earn some badges
  const newBadges = { ...data.badges };
  newBadges['early-bird'] = { ...newBadges['early-bird'], earned: true, earnedDate: format(subDays(today, 5), 'yyyy-MM-dd') };
  newBadges['first-week'] = { ...newBadges['first-week'], earned: true, earnedDate: format(subDays(today, 1), 'yyyy-MM-dd') };
  newBadges['hydration-hero'] = { ...newBadges['hydration-hero'], earned: true, earnedDate: format(subDays(today, 2), 'yyyy-MM-dd') };
  newBadges['meal-planner'] = { ...newBadges['meal-planner'], earned: true, earnedDate: format(subDays(today, 3), 'yyyy-MM-dd') };
  newBadges['iron-pumper'] = { ...newBadges['iron-pumper'], earned: true, earnedDate: format(today, 'yyyy-MM-dd'), progress: 5 };
  data.setBadges(newBadges);

  data.setSeeded(true);
}
