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

// New interface to match the API response format
interface MainExercise {
  _id: string;
  main_name: string;
  subtype?: Array<{ [key: string]: string }>;
}

interface ApiResponse {
  data: MainExercise[];
  success: boolean;
}

export default function WorkoutPage() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [subExerciseDetails, setSubExerciseDetails] = useState<any>(null);
  const [loadingSubExercise, setLoadingSubExercise] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/exercise/get_all_main_names');
        
        if (!response.ok) {
          throw new Error('Failed to fetch exercise data');
        }
        
        const responseData = await response.json() as ApiResponse;
        console.log('Raw API response:', responseData);
        
        // Check if the response indicates success and contains data
        if (!responseData.success || !responseData.data) {
          throw new Error('Invalid API response format');
        }
        
        // Transform the API data into the format needed for our UI
        const formattedData: WorkoutData = {};
        
        // Process each main exercise category
        for (const mainExercise of responseData.data) {
          const bodyPart = mainExercise.main_name.toLowerCase();
          
          if (!formattedData[bodyPart]) {
            formattedData[bodyPart] = {
              title: capitalizeFirstLetter(bodyPart),
              description: `Exercises targeting your ${bodyPart}`,
              exercises: []
            };
          }
          
          // Add the main exercise as a "header"
          formattedData[bodyPart].exercises.push({
            name: `${capitalizeFirstLetter(mainExercise.main_name)} Exercises`,
            sets: "",
            reps: "",
            difficulty: "header",
            equipment: "",
            id: mainExercise._id,
            isHeader: true
          });
          
          // Fetch the subtypes for this main exercise to get exercise variations
          try {
            const subtypeResponse = await fetch(`http://127.0.0.1:5000/api/exercise/get_exercise_by_id?id=${mainExercise._id}`, {
              method: 'GET',
              headers: {
                'Accept': '*/*'
              }
            });
            
            if (subtypeResponse.ok) {
              const subtypeData = await subtypeResponse.json();
              console.log(`Subtypes for ${bodyPart}:`, subtypeData);
              
              // Check if subtypes exist and process them
              if (subtypeData && subtypeData.subtype && Array.isArray(subtypeData.subtype)) {
                subtypeData.subtype.forEach((subtypeObj: { [key: string]: string }) => {
                  const exerciseName = Object.keys(subtypeObj)[0];
                  const exerciseId = Object.values(subtypeObj)[0] as string;
                  
                  formattedData[bodyPart].exercises.push({
                    name: exerciseName.trim(),
                    sets: "3",
                    reps: "8-12",
                    difficulty: "intermediate",
                    equipment: "various",
                    id: exerciseId,
                    isHeader: false
                  });
                });
              }
            }
          } catch (subtypeErr) {
            console.error(`Error fetching subtypes for ${bodyPart}:`, subtypeErr);
          }
        }

        setWorkoutData(formattedData);
        
        // Set default active tab to the first body part
        if (Object.keys(formattedData).length > 0) {
          setActiveTab(Object.keys(formattedData)[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exercise data:', err);
        setError('Failed to load exercises. Please try again later.');
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Function to fetch sub-exercise details by ID
  const fetchSubExerciseDetails = async (exerciseId: string) => {
    try {
      setLoadingSubExercise(true);
      setSubExerciseDetails(null);
      
      const response = await fetch(`http://127.0.0.1:5000/api/exercise/get_exercise_by_id/${exerciseId}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch exercise details');
      }
      
      const data = await response.json();
      console.log('Sub-exercise details:', data);
      setSubExerciseDetails(data);
      setLoadingSubExercise(false);
    } catch (err) {
      console.error('Error fetching sub-exercise details:', err);
      setLoadingSubExercise(false);
    }
  };

  // Handle exercise selection
  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    fetchSubExerciseDetails(exerciseId);
  };

  // Close sub-exercise details modal
  const closeSubExerciseDetails = () => {
    setSelectedExercise(null);
    setSubExerciseDetails(null);
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    <div className="container p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <Button>Start Workout</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
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
                      exercise.isHeader ? (
                        // Render header style for main exercises
                        <div key={index} className="mt-6 first:mt-0">
                          <h3 className="text-lg font-bold mb-3">{exercise.name}</h3>
                        </div>
                      ) : (
                        // Render normal exercise cards for sub-exercises
                        <Card 
                          key={index} 
                          className="cursor-pointer hover:bg-accent/50 transition-colors ml-4 border-l-4 border-primary/50"
                          onClick={() => exercise.id && handleExerciseSelect(exercise.id)}
                        >
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
                      )
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal for displaying sub-exercise details */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-auto">
            <CardHeader className="sticky top-0 bg-background z-10">
              <div className="flex justify-between items-center">
                <CardTitle>Exercise Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeSubExerciseDetails}
                  className="rounded-full h-8 w-8"
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
            <CardContent>
              {loadingSubExercise ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Loading exercise details...</p>
                </div>
              ) : subExerciseDetails ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{subExerciseDetails.name}</h3>
                    {subExerciseDetails.description && (
                      <p className="text-sm text-muted-foreground mt-1">{subExerciseDetails.description}</p>
                    )}
                  </div>
                  
                  {subExerciseDetails.instructions && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {Array.isArray(subExerciseDetails.instructions) ? (
                          subExerciseDetails.instructions.map((instruction: string, idx: number) => (
                            <li key={idx} className="text-sm">{instruction}</li>
                          ))
                        ) : (
                          <li className="text-sm">{subExerciseDetails.instructions}</li>
                        )}
                      </ol>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    {subExerciseDetails.muscle_group && (
                      <div>
                        <h4 className="text-sm font-semibold">Muscle Group</h4>
                        <p className="text-sm">{subExerciseDetails.muscle_group}</p>
                      </div>
                    )}
                    {subExerciseDetails.equipment && (
                      <div>
                        <h4 className="text-sm font-semibold">Equipment</h4>
                        <p className="text-sm">{subExerciseDetails.equipment}</p>
                      </div>
                    )}
                    {subExerciseDetails.difficulty && (
                      <div>
                        <h4 className="text-sm font-semibold">Difficulty</h4>
                        <p className="text-sm capitalize">{subExerciseDetails.difficulty}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
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