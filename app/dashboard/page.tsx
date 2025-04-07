"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Activity, Apple, Dumbbell, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { PostureCheck } from '@/components/posture-check/posture-check';
import { toast } from '@/components/ui/use-toast';

// Interface for the daily metrics
interface DailyMetric {
  workout_completed: boolean;
  total_calories: number;
  calorie_target: number;
  date: string;
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user ID and fetch data on component mount
  useEffect(() => {
    // Get user ID
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setUserId(userEmail);
    } else {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  // Fetch daily metrics when userId changes
  useEffect(() => {
    if (userId) {
      fetchDailyMetrics();
    }
  }, [userId]);

  // Function to fetch daily metrics from the backend
  const fetchDailyMetrics = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const response = await fetch(`http://127.0.0.1:5000/api/daily/metrics?uid=${userId}&date=${currentDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch daily metrics');
      }
      
      const data = await response.json();
      
      // Set metrics from backend or use default values
      setDailyMetrics({
        workout_completed: data.workout_completed || false,
        total_calories: data.total_calories || 0,
        calorie_target: data.calorie_target || 2200,
        date: currentDate
      });
      
    } catch (error) {
      console.error('Error fetching daily metrics:', error);
      
      // Set default data if fetch fails
      setDailyMetrics({
        workout_completed: false,
        total_calories: 0,
        calorie_target: 2200,
        date: new Date().toISOString().split('T')[0]
      });
      
      toast({
        title: "Error loading metrics",
        description: "Could not load today's fitness data. Using default values.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={fetchDailyMetrics} disabled={isLoading}>
            {isLoading ? "Updating..." : "Refresh Data"}
          </Button>
          <Button>Start Workout</Button>
        </div>
      </div>

      {/* Daily Status Overview */}
      {dailyMetrics && (
        <Card className="bg-muted/40">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${dailyMetrics.workout_completed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {dailyMetrics.workout_completed ? 
                    <CheckCircle2 className="w-6 h-6" /> : 
                    <XCircle className="w-6 h-6" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Workout</p>
                  <p className="font-semibold">
                    {dailyMetrics.workout_completed ? 
                      "Completed" : 
                      "Not yet completed"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Calorie Intake</p>
                  <p className="font-semibold">
                    {dailyMetrics.total_calories} / {dailyMetrics.calorie_target} calories
                  </p>
                </div>
                <div className="w-24 md:w-32">
                  <Progress 
                    value={(dailyMetrics.total_calories / dailyMetrics.calorie_target) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground">Today's Date</p>
                <p className="font-semibold">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Daily Calories" 
          value={dailyMetrics ? `${dailyMetrics.total_calories} / ${dailyMetrics.calorie_target}` : "- / -"} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>}
        />
        <SummaryCard 
          title="Workout Streak" 
          value="5 days" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><path d="m13 12-3 5h4l-3 5" /></svg>}
        />
        <SummaryCard 
          title="Today's Workout" 
          value={dailyMetrics ? (dailyMetrics.workout_completed ? "Completed" : "Not Started") : "Unknown"}
          icon={<Dumbbell className="w-5 h-5" />}
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
                {/* Today's Workout Status */}
                <div className="p-4 rounded-lg border">
                  <h3 className="font-medium mb-3">Today's Workout Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {dailyMetrics?.workout_completed ? (
                        <>
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                          <span className="text-green-600 font-medium">Workout Completed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-orange-500 h-5 w-5" />
                          <span className="text-orange-600 font-medium">Workout Not Completed</span>
                        </>
                      )}
                    </div>
                    {!dailyMetrics?.workout_completed && (
                      <Button 
                        size="sm" 
                        onClick={async () => {
                          if (!userId) {
                            toast({
                              title: "User Data Error",
                              description: "Unable to identify user. Please refresh the page.",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          try {
                            const response = await fetch('http://127.0.0.1:5000/api/daily/update_workout', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                uid: userId,
                                date: new Date().toISOString().split('T')[0],
                                workout_completed: true
                              }),
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to update workout status');
                            }
                            
                            toast({
                              title: "Workout Completed",
                              description: "Your workout has been marked as completed for today!",
                            });
                            
                            // Refresh the data
                            fetchDailyMetrics();
                            
                          } catch (error) {
                            console.error('Error updating workout status:', error);
                            toast({
                              title: "Update Failed",
                              description: "There was a problem updating your workout status.",
                              variant: "destructive"
                            });
                          }
                        }}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </div>
                
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
                    <p className="text-lg font-semibold">
                      Daily Target: {dailyMetrics ? dailyMetrics.calorie_target : 2200} cal
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Consumed: {dailyMetrics ? dailyMetrics.total_calories : 0} cal
                    </p>
                  </div>
                  <Progress 
                    value={dailyMetrics ? (dailyMetrics.total_calories / dailyMetrics.calorie_target) * 100 : 0} 
                    className="w-1/2 h-2" 
                  />
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
              <PostureCheck />
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