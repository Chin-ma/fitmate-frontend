import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExerciseProps {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  completed?: boolean;
}

interface WorkoutDetailProps {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  type: string;
  goal: string;
  exercises: ExerciseProps[];
}

export function WorkoutDetail({
  title,
  description,
  duration,
  difficulty,
  type,
  goal,
  exercises,
}: WorkoutDetailProps) {
  const totalExercises = exercises.length;
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const progress = Math.round((completedExercises / totalExercises) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button>Start Workout</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workout Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="font-medium">{duration}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
              <p className="font-medium">{difficulty}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="font-medium">{type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Goal</p>
              <p className="font-medium">{goal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle>Exercise List</CardTitle>
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground">{completedExercises}/{totalExercises}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Exercises</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="remaining">Remaining</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ExerciseList exercises={exercises} />
            </TabsContent>
            <TabsContent value="completed">
              <ExerciseList exercises={exercises.filter(ex => ex.completed)} />
            </TabsContent>
            <TabsContent value="remaining">
              <ExerciseList exercises={exercises.filter(ex => !ex.completed)} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline">Previous Workout</Button>
          <Button>Next Workout</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Coach Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="italic">
              "This workout is designed to target your upper body strength. 
              Focus on maintaining proper form during the shoulder press. If you feel any discomfort, 
              reduce the weight. For push-ups, try to keep your core engaged throughout the movement.
              Keep track of your max reps for each exercise to monitor progress."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExerciseList({ exercises }: { exercises: ExerciseProps[] }) {
  if (exercises.length === 0) {
    return <p className="text-muted-foreground py-4">No exercises in this category.</p>;
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div key={index} className="flex items-center p-4 rounded-lg border">
          <div className="mr-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exercise.sets} sets x {exercise.reps} reps • {exercise.rest} rest
            </p>
          </div>
          <div>
            {exercise.completed ? (
              <div className="bg-primary/10 text-primary font-medium text-sm px-3 py-1 rounded-full">
                Completed
              </div>
            ) : (
              <Button variant="outline" size="sm">Mark Complete</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 