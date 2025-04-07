import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline">Update Progress</Button>
          <Button>Start Workout</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Daily Calories" 
          value="1,850 / 2,200" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
        />
        <SummaryCard 
          title="Workout Streak" 
          value="5 days" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></svg>}
        />
        <SummaryCard 
          title="Weekly Goal" 
          value="3/5 workouts" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
        />
        <SummaryCard 
          title="Progress Score" 
          value="8.5/10" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="diet" className="space-y-4">
        <TabsList className="grid grid-cols-6 gap-4">
          <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          <TabsTrigger value="exercise">Exercise Plan</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="calories">Calorie Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="posture">Posture Check</TabsTrigger>
        </TabsList>

        {/* Diet Plan Tab */}
        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Meal Plan</CardTitle>
              <CardDescription>Customized nutrition plan based on your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <MealSection title="Breakfast" calories="450" time="8:00 AM" 
                  items={["Oatmeal with berries", "Greek yogurt", "Almonds"]} />
                <MealSection title="Lunch" calories="650" time="1:00 PM" 
                  items={["Grilled chicken breast", "Quinoa", "Steamed vegetables"]} />
                <MealSection title="Dinner" calories="550" time="7:00 PM" 
                  items={["Salmon fillet", "Brown rice", "Roasted broccoli"]} />
                <MealSection title="Snacks" calories="300" time="Various" 
                  items={["Apple with peanut butter", "Protein shake"]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Plan Tab */}
        <TabsContent value="exercise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Schedule</CardTitle>
              <CardDescription>Your personalized exercise routine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <WorkoutDay day="Monday" type="Upper Body Strength" duration="45 min" 
                  exercises={["Push-ups 3×12", "Dumbbell Rows 3×10", "Shoulder Press 3×10"]} />
                <WorkoutDay day="Tuesday" type="Cardio" duration="30 min" 
                  exercises={["Running", "HIIT intervals", "Cool-down stretches"]} />
                <WorkoutDay day="Wednesday" type="Lower Body" duration="50 min" 
                  exercises={["Squats 3×15", "Lunges 3×12", "Deadlifts 3×10"]} />
                <WorkoutDay day="Friday" type="Full Body" duration="60 min" 
                  exercises={["Circuit training", "Core workout", "Flexibility"]} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Update Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Progress</CardTitle>
              <CardDescription>Update your measurements and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Weight Goal</span>
                    <span className="text-sm">75kg / 70kg</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Strength Progress</span>
                    <span className="text-sm">Level 3/5</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Cardio Fitness</span>
                    <span className="text-sm">Good</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Measurements</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Calorie Tracking Tab */}
        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Tracker</CardTitle>
              <CardDescription>Monitor your daily nutrition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Daily Target: 2,200 cal</p>
                    <p className="text-sm text-muted-foreground">Consumed: 1,850 cal</p>
                  </div>
                  <Progress value={84} className="w-1/2 h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MacroCard title="Protein" value="120g" target="140g" />
                  <MacroCard title="Carbs" value="200g" target="250g" />
                  <MacroCard title="Fats" value="55g" target="70g" />
                  <MacroCard title="Fiber" value="25g" target="30g" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Log Meal</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Analytics</CardTitle>
              <CardDescription>Your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-[200px]">
                  <p className="font-medium mb-2">Calorie Graph</p>
                  {/* calorie graph would go here */}
                </div>
                <div className="h-[200px]">
                  <p className="font-medium mb-2">Exercise Graph</p>
                  {/* exercise graph would go here */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Workouts This Month" value="12" change="+20%" />
                  <StatCard title="Average Workout Duration" value="45 min" change="+5%" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posture Check Tab */}
        <TabsContent value="posture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posture Analysis</CardTitle>
              <CardDescription>AI-powered posture assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Take or upload a photo for posture analysis</p>
                </div>
                <Button className="w-full">Start Posture Check</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function SummaryCard({ title, value, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MealSectionProps {
  title: string;
  calories: string;
  time: string;
  items: string[];
}

function MealSection({ title, calories, time, items }: MealSectionProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm text-muted-foreground">
          <span>{calories} cal</span>
          <span className="mx-2">•</span>
          <span>{time}</span>
        </div>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
}

interface WorkoutDayProps {
  day: string;
  type: string;
  duration: string;
  exercises: string[];
}

function WorkoutDay({ day, type, duration, exercises }: WorkoutDayProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{day}</h3>
        <div className="text-sm text-muted-foreground">
          <span>{type}</span>
          <span className="mx-2">•</span>
          <span>{duration}</span>
        </div>
      </div>
      <ul className="space-y-1">
        {exercises.map((exercise, i) => (
          <li key={i} className="text-sm">{exercise}</li>
        ))}
      </ul>
    </div>
  );
}

interface MacroCardProps {
  title: string;
  value: string;
  target: string;
}

function MacroCard({ title, value, target }: MacroCardProps) {
  const percentage = (parseInt(value) / parseInt(target)) * 100;
  return (
    <div className="border rounded-lg p-4">
      <p className="font-medium">{title}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-muted-foreground">{value} / {target}</p>
        <Progress value={percentage} className="w-1/2 h-1.5" />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

function StatCard({ title, value, change }: StatCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className={`text-sm mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </p>
    </div>
  );
} 