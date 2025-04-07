import { WorkoutDetail } from '@/components/workout/workout-detail';

export default function WorkoutPage() {
  // Mock data for the workout
  const workout = {
    title: "Upper Body Strength",
    description: "A comprehensive workout targeting all major upper body muscle groups",
    duration: "45 minutes",
    difficulty: "Intermediate",
    type: "Strength Training",
    goal: "Muscle Gain",
    exercises: [
      {
        name: "Push-ups",
        sets: 3,
        reps: 12,
        rest: "60 sec",
        completed: true
      },
      {
        name: "Dumbbell Rows",
        sets: 3,
        reps: 10,
        rest: "60 sec",
        completed: true
      },
      {
        name: "Shoulder Press",
        sets: 3,
        reps: 10,
        rest: "90 sec",
        completed: false
      },
      {
        name: "Tricep Dips",
        sets: 3,
        reps: 12,
        rest: "60 sec",
        completed: false
      },
      {
        name: "Bicep Curls",
        sets: 3,
        reps: 12,
        rest: "60 sec",
        completed: false
      },
      {
        name: "Plank",
        sets: 3,
        reps: 30,
        rest: "45 sec",
        completed: false
      }
    ]
  };

  return (
    <div className="p-6">
      <WorkoutDetail {...workout} />
    </div>
  );
} 