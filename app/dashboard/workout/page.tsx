"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  difficulty: string;
  equipment: string;
}

interface BodyPartData {
  title: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutData {
  [key: string]: BodyPartData;
}

// Workout data organized by body parts
const workoutData: WorkoutData = {
  chest: {
    title: "Chest",
    description: "Build upper body strength and muscle definition",
    exercises: [
      {
        name: "Bench Press",
        sets: "3-4",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell, bench"
      },
      {
        name: "Push-ups",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "bodyweight"
      },
      {
        name: "Dumbbell Flyes",
        sets: "3",
        reps: "12-15",
        difficulty: "intermediate",
        equipment: "dumbbells, bench"
      },
      {
        name: "Incline Bench Press",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell, incline bench"
      },
      {
        name: "Cable Crossover",
        sets: "3",
        reps: "12-15",
        difficulty: "intermediate",
        equipment: "cable machine"
      }
    ]
  },
  back: {
    title: "Back",
    description: "Develop a strong and defined back",
    exercises: [
      {
        name: "Pull-ups",
        sets: "3-4",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "pull-up bar"
      },
      {
        name: "Barbell Rows",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell"
      },
      {
        name: "Lat Pulldowns",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "cable machine"
      },
      {
        name: "Deadlifts",
        sets: "3",
        reps: "6-8",
        difficulty: "advanced",
        equipment: "barbell"
      },
      {
        name: "Face Pulls",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "cable machine"
      }
    ]
  },
  legs: {
    title: "Legs",
    description: "Build strong and powerful legs",
    exercises: [
      {
        name: "Squats",
        sets: "4",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell"
      },
      {
        name: "Romanian Deadlifts",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell"
      },
      {
        name: "Leg Press",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "machine"
      },
      {
        name: "Calf Raises",
        sets: "4",
        reps: "15-20",
        difficulty: "beginner",
        equipment: "machine or bodyweight"
      },
      {
        name: "Bulgarian Split Squats",
        sets: "3",
        reps: "10-12 each leg",
        difficulty: "intermediate",
        equipment: "dumbbells, bench"
      }
    ]
  },
  shoulders: {
    title: "Shoulders",
    description: "Build broad and strong shoulders",
    exercises: [
      {
        name: "Overhead Press",
        sets: "4",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell or dumbbells"
      },
      {
        name: "Lateral Raises",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells"
      },
      {
        name: "Front Raises",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells or plate"
      },
      {
        name: "Reverse Flyes",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells"
      },
      {
        name: "Military Press",
        sets: "3",
        reps: "8-12",
        difficulty: "advanced",
        equipment: "barbell"
      }
    ]
  },
  arms: {
    title: "Arms",
    description: "Build defined biceps and triceps",
    exercises: [
      {
        name: "Bicep Curls",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells or barbell"
      },
      {
        name: "Tricep Pushdowns",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "cable machine"
      },
      {
        name: "Hammer Curls",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells"
      },
      {
        name: "Skull Crushers",
        sets: "3",
        reps: "12-15",
        difficulty: "intermediate",
        equipment: "barbell or dumbbells"
      },
      {
        name: "Preacher Curls",
        sets: "3",
        reps: "12-15",
        difficulty: "intermediate",
        equipment: "barbell or dumbbells"
      }
    ]
  }
};

export default function WorkoutPage() {
  const [selectedExercise, setSelectedExercise] = useState(null);

  return (
    <div className="container p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Button>Start Workout</Button>
      </div>

      <Tabs defaultValue="chest" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(workoutData).map((bodyPart) => (
            <TabsTrigger key={bodyPart} value={bodyPart} className="capitalize">
              {workoutData[bodyPart].title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(workoutData).map(([bodyPart, data]) => (
          <TabsContent key={bodyPart} value={bodyPart}>
            <Card>
              <CardHeader>
                <CardTitle>{data.title} Exercises</CardTitle>
                <CardDescription>{data.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {data.exercises.map((exercise, index) => (
                      <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{exercise.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps} reps
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="secondary">{exercise.difficulty}</Badge>
                                <Badge variant="outline">{exercise.equipment}</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4"
                              >
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 