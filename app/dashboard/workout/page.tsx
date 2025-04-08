"use client";

import { useState, useEffect } from 'react';
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
  id?: string;
  isHeader?: boolean;
}

interface BodyPartData {
  title: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutData {
  [key: string]: BodyPartData;
}

interface MainExercise {
  _id: string;
  main_name: string;
  subtype?: Array<{ [key: string]: string }>;
}

interface ApiResponse {
  data: MainExercise[];
  success: boolean;
}

// Updated interface for sub-exercise details including an image
interface SubExerciseDetails {
  _id: string;
  name: string;
  description?: string;
  instructions?: string | string[];
  muscle_group?: string;
  equipment?: string;
  difficulty?: string;
  image_url?: string; // Option 1: URL to the image
  image_base64?: string; // Option 2: Base64-encoded image data
}

// Mock data
const mockWorkoutData: WorkoutData = {
  chest: {
    title: "Chest",
    description: "Exercises targeting your chest",
    exercises: [
      {
        name: "Chest Exercises",
        sets: "",
        reps: "",
        difficulty: "header",
        equipment: "",
        id: "chest-header",
        isHeader: true
      },
      {
        name: "Bench Press",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell",
        id: "bench-press"
      },
      {
        name: "Push-ups",
        sets: "3",
        reps: "10-15",
        difficulty: "beginner",
        equipment: "bodyweight",
        id: "push-ups"
      }
    ]
  },
  shoulders: {
    title: "Shoulders",
    description: "Exercises targeting your shoulders",
    exercises: [
      {
        name: "Shoulder Exercises",
        sets: "",
        reps: "",
        difficulty: "header",
        equipment: "",
        id: "shoulders-header",
        isHeader: true
      },
      {
        name: "Overhead Press",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell",
        id: "overhead-press"
      },
      {
        name: "Lateral Raises",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells",
        id: "lateral-raises"
      },
      {
        name: "Front Raises",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "dumbbells",
        id: "front-raises"
      }
    ]
  },
  biceps: {
    title: "Biceps",
    description: "Exercises targeting your biceps",
    exercises: [
      {
        name: "Bicep Exercises",
        sets: "",
        reps: "",
        difficulty: "header",
        equipment: "",
        id: "biceps-header",
        isHeader: true
      },
      {
        name: "Barbell Curls",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "barbell",
        id: "barbell-curls"
      },
      {
        name: "Hammer Curls",
        sets: "3",
        reps: "10-12",
        difficulty: "beginner",
        equipment: "dumbbells",
        id: "hammer-curls"
      },
      {
        name: "Concentration Curls",
        sets: "3",
        reps: "10-12",
        difficulty: "beginner",
        equipment: "dumbbell",
        id: "concentration-curls"
      }
    ]
  },
  triceps: {
    title: "Triceps",
    description: "Exercises targeting your triceps",
    exercises: [
      {
        name: "Tricep Exercises",
        sets: "",
        reps: "",
        difficulty: "header",
        equipment: "",
        id: "triceps-header",
        isHeader: true
      },
      {
        name: "Tricep Dips",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "bodyweight",
        id: "tricep-dips"
      },
      {
        name: "Tricep Pushdowns",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "cable machine",
        id: "tricep-pushdowns"
      },
      {
        name: "Skull Crushers",
        sets: "3",
        reps: "8-12",
        difficulty: "intermediate",
        equipment: "EZ bar",
        id: "skull-crushers"
      }
    ]
  },
  legs: {
    title: "Legs",
    description: "Exercises targeting your legs",
    exercises: [
      {
        name: "Leg Exercises",
        sets: "",
        reps: "",
        difficulty: "header",
        equipment: "",
        id: "legs-header",
        isHeader: true
      },
      {
        name: "Squats",
        sets: "4",
        reps: "10-12",
        difficulty: "intermediate",
        equipment: "barbell",
        id: "squats"
      },
      {
        name: "Lunges",
        sets: "3",
        reps: "12-15",
        difficulty: "beginner",
        equipment: "bodyweight",
        id: "lunges"
      }
    ]
  }
};

const mockSubExerciseDetails: { [key: string]: SubExerciseDetails } = {
  "bench-press": {
    _id: "bench-press",
    name: "Bench Press",
    description: "A compound exercise that targets the chest, shoulders, and triceps.",
    instructions: [
      "Lie flat on the bench with your feet firmly planted on the ground",
      "Grip the barbell slightly wider than shoulder-width",
      "Lower the bar to your chest with control",
      "Press the bar back up to the starting position"
    ],
    muscle_group: "Chest, Shoulders, Triceps",
    equipment: "Barbell, Bench",
    difficulty: "intermediate",
    image_url: "https://example.com/bench-press.jpg"
  },
  "push-ups": {
    _id: "push-ups",
    name: "Push-ups",
    description: "A fundamental bodyweight exercise that strengthens the chest, shoulders, triceps, and core.",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders",
      "Keep your body in a straight line from head to heels",
      "Lower your body until your chest nearly touches the ground",
      "Push back up to the starting position while maintaining proper form"
    ],
    muscle_group: "Chest, Shoulders, Triceps, Core",
    equipment: "Bodyweight",
    difficulty: "beginner",
    image_url: "https://example.com/push-ups.jpg"
  },
  "overhead-press": {
    _id: "overhead-press",
    name: "Overhead Press",
    description: "A compound exercise that primarily targets the shoulders while also engaging the triceps and upper chest.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold the barbell at shoulder height with palms facing forward",
      "Press the bar overhead until arms are fully extended",
      "Lower the bar back to shoulder height with control"
    ],
    muscle_group: "Shoulders, Triceps, Upper Chest",
    equipment: "Barbell",
    difficulty: "intermediate",
    image_url: "https://example.com/overhead-press.jpg"
  },
  "lateral-raises": {
    _id: "lateral-raises",
    name: "Lateral Raises",
    description: "An isolation exercise that targets the lateral deltoids for broader, more defined shoulders.",
    instructions: [
      "Stand with dumbbells at your sides, palms facing in",
      "Keep a slight bend in your elbows",
      "Raise the dumbbells out to the sides until arms are parallel to the ground",
      "Lower the weights back down with control"
    ],
    muscle_group: "Shoulders (Lateral Deltoids)",
    equipment: "Dumbbells",
    difficulty: "beginner",
    image_url: "https://example.com/lateral-raises.jpg"
  },
  "front-raises": {
    _id: "front-raises",
    name: "Front Raises",
    description: "An isolation exercise targeting the anterior deltoids for stronger, more developed front shoulders.",
    instructions: [
      "Stand holding dumbbells in front of your thighs",
      "Keep your arms straight with a slight bend in the elbows",
      "Raise the dumbbells forward until arms are parallel to the ground",
      "Lower back down with control"
    ],
    muscle_group: "Shoulders (Anterior Deltoids)",
    equipment: "Dumbbells",
    difficulty: "beginner",
    image_url: "https://example.com/front-raises.jpg"
  },
  "barbell-curls": {
    _id: "barbell-curls",
    name: "Barbell Curls",
    description: "An isolation exercise that targets the biceps brachii.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold the barbell with an underhand grip",
      "Curl the bar up while keeping elbows close to your sides",
      "Lower the bar back down with control"
    ],
    muscle_group: "Biceps",
    equipment: "Barbell",
    difficulty: "beginner",
    image_url: "https://example.com/barbell-curls.jpg"
  },
  "hammer-curls": {
    _id: "hammer-curls",
    name: "Hammer Curls",
    description: "A bicep variation that targets the brachialis and brachioradialis muscles for complete arm development.",
    instructions: [
      "Stand holding dumbbells with palms facing each other",
      "Keep your upper arms stationary against your sides",
      "Curl the weights up while maintaining the neutral grip",
      "Lower the dumbbells back down with control"
    ],
    muscle_group: "Biceps, Brachialis, Forearms",
    equipment: "Dumbbells",
    difficulty: "beginner",
    image_url: "https://example.com/hammer-curls.jpg"
  },
  "concentration-curls": {
    _id: "concentration-curls",
    name: "Concentration Curls",
    description: "An isolation exercise that maximizes bicep peak contraction and helps develop better mind-muscle connection.",
    instructions: [
      "Sit on a bench with feet flat on the floor",
      "Rest your elbow on the inner part of your thigh",
      "Curl the dumbbell up towards your shoulder",
      "Lower the weight back down with control"
    ],
    muscle_group: "Biceps",
    equipment: "Dumbbell",
    difficulty: "beginner",
    image_url: "https://example.com/concentration-curls.jpg"
  },
  "tricep-dips": {
    _id: "tricep-dips",
    name: "Tricep Dips",
    description: "A bodyweight exercise that primarily targets the triceps while also engaging the chest and shoulders.",
    instructions: [
      "Position yourself between parallel bars",
      "Lower your body by bending your elbows",
      "Keep your torso upright and elbows close to your body",
      "Press back up to the starting position"
    ],
    muscle_group: "Triceps, Chest, Shoulders",
    equipment: "Parallel Bars",
    difficulty: "intermediate",
    image_url: "https://example.com/tricep-dips.jpg"
  },
  "tricep-pushdowns": {
    _id: "tricep-pushdowns",
    name: "Tricep Pushdowns",
    description: "An isolation exercise that effectively targets all three heads of the triceps muscles.",
    instructions: [
      "Stand facing a cable machine with high attachment",
      "Grab the bar with an overhand grip at shoulder width",
      "Keep your upper arms close to your body",
      "Push the bar down until your arms are fully extended",
      "Slowly return to the starting position"
    ],
    muscle_group: "Triceps",
    equipment: "Cable Machine",
    difficulty: "beginner",
    image_url: "https://example.com/tricep-pushdowns.jpg"
  },
  "skull-crushers": {
    _id: "skull-crushers",
    name: "Skull Crushers",
    description: "An isolation exercise that targets the long head of the triceps for complete arm development.",
    instructions: [
      "Lie on a bench holding an EZ bar above your chest",
      "Keep your upper arms perpendicular to the ground",
      "Lower the bar toward your forehead by bending your elbows",
      "Extend your arms back up to the starting position"
    ],
    muscle_group: "Triceps",
    equipment: "EZ Bar",
    difficulty: "intermediate",
    image_url: "https://example.com/skull-crushers.jpg"
  },
  "squats": {
    _id: "squats",
    name: "Squats",
    description: "A fundamental lower body exercise that targets the quadriceps, hamstrings, and glutes.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your body by bending your knees and hips",
      "Keep your chest up and back straight",
      "Return to the starting position by extending your knees and hips"
    ],
    muscle_group: "Quadriceps, Hamstrings, Glutes",
    equipment: "Barbell (optional)",
    difficulty: "intermediate",
    image_url: "https://example.com/squats.jpg"
  },
  "lunges": {
    _id: "lunges",
    name: "Lunges",
    description: "A unilateral exercise that develops leg strength, balance, and coordination.",
    instructions: [
      "Stand with feet hip-width apart",
      "Take a big step forward with one leg",
      "Lower your body until both knees are bent at 90 degrees",
      "Push off the front foot to return to starting position",
      "Alternate legs with each rep"
    ],
    muscle_group: "Quadriceps, Hamstrings, Glutes, Calves",
    equipment: "Bodyweight",
    difficulty: "beginner",
    image_url: "https://example.com/lunges.jpg"
  }
};

export default function WorkoutPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData>(mockWorkoutData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("chest");
  const [subExerciseDetails, setSubExerciseDetails] = useState<SubExerciseDetails | null>(null);
  const [loadingSubExercise, setLoadingSubExercise] = useState(false);

  const fetchSubExerciseDetails = async (exerciseId: string) => {
    setLoadingSubExercise(true);
    setSubExerciseDetails(null);
    
    // Simulate API delay
    setTimeout(() => {
      const details = mockSubExerciseDetails[exerciseId];
      if (details) {
        setSubExerciseDetails(details);
      }
      setLoadingSubExercise(false);
    }, 500);
  };

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    fetchSubExerciseDetails(exerciseId);
  };

  const closeSubExerciseDetails = () => {
    setSelectedExercise(null);
    setSubExerciseDetails(null);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container p-6 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading workouts...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your exercises</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-6 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (Object.keys(workoutData).length === 0) {
    return (
      <div className="container p-6 flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No exercises found</h2>
          <p className="text-muted-foreground">We couldn't find any exercises in our database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Library</h1>
          <p className="text-muted-foreground mt-1">Choose exercises to build your perfect workout routine</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
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
            className="w-4 h-4 mr-2"
          >
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
          Create Workout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="inline-flex h-auto p-1 bg-muted/50">
            {Object.keys(workoutData).map((bodyPart) => (
              <TabsTrigger 
                key={bodyPart} 
                value={bodyPart} 
                className="capitalize px-4 py-2 data-[state=active]:bg-background"
              >
                {workoutData[bodyPart].title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {Object.entries(workoutData).map(([bodyPart, data]) => (
          <TabsContent key={bodyPart} value={bodyPart} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.exercises.filter(ex => !ex.isHeader).map((exercise, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                  onClick={() => exercise.id && handleExerciseSelect(exercise.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {exercise.name}
                    </CardTitle>
                    <CardDescription>
                      {exercise.sets} sets × {exercise.reps} reps
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className={getDifficultyColor(exercise.difficulty)}>
                        {capitalizeFirstLetter(exercise.difficulty)}
                      </Badge>
                      <Badge variant="outline">
                        {capitalizeFirstLetter(exercise.equipment)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-auto">
            <CardHeader className="sticky top-0 bg-background z-10 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{subExerciseDetails?.name}</CardTitle>
                  <CardDescription className="mt-1.5">
                    {subExerciseDetails?.muscle_group}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeSubExerciseDetails}
                  className="rounded-full h-8 w-8 -mr-2"
                >
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
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loadingSubExercise ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Loading exercise details...</p>
                </div>
              ) : subExerciseDetails ? (
                <div className="space-y-6">
                  {subExerciseDetails.image_url && (
                    <div className="rounded-lg overflow-hidden bg-muted">
                      <img
                        src={subExerciseDetails.image_url}
                        alt={subExerciseDetails.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground">{subExerciseDetails.description}</p>
                  </div>

                  {subExerciseDetails.instructions && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Instructions</h3>
                      <ol className="space-y-3">
                        {Array.isArray(subExerciseDetails.instructions) ? (
                          subExerciseDetails.instructions.map((instruction: string, idx: number) => (
                            <li key={idx} className="flex gap-3 text-muted-foreground">
                              <span className="font-medium text-foreground">{idx + 1}.</span>
                              {instruction}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">{subExerciseDetails.instructions}</li>
                        )}
                      </ol>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Difficulty</h4>
                      <Badge variant="secondary" className={getDifficultyColor(subExerciseDetails.difficulty || '')}>
                        {capitalizeFirstLetter(subExerciseDetails.difficulty || '')}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Equipment</h4>
                      <Badge variant="outline">
                        {subExerciseDetails.equipment}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Target</h4>
                      <Badge variant="secondary">
                        {subExerciseDetails.muscle_group?.split(',')[0]}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button className="w-full">Add to Workout</Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Failed to load exercise details. Please try again.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}