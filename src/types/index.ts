
export type MuscleGroup = 
  | "Chest" 
  | "Back" 
  | "Shoulders" 
  | "Arms" 
  | "Legs" 
  | "Core" 
  | "Full Body" 
  | "Cardio";

export type ExerciseType = 
  | "Strength" 
  | "Cardio" 
  | "Flexibility" 
  | "Balance";

export type DifficultyLevel = 
  | "Beginner" 
  | "Intermediate" 
  | "Advanced" 
  | "Expert";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  muscleGroup: MuscleGroup;
  exerciseType: ExerciseType;
  difficulty: DifficultyLevel;
  imageUrl?: string;
}

export interface ExerciseSet {
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  completed: boolean;
}

export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
}

export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  exercises: PlanExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  planId: string;
  startTime: string;
  endTime?: string;
  exercisesData: {
    exerciseId: string;
    sets: ExerciseSet[];
  }[];
}

export interface WorkoutHistory {
  date: string;
  workoutSessions: WorkoutSession[];
}
