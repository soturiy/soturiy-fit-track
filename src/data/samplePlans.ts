
import { TrainingPlan } from '@/types';

export const samplePlans: TrainingPlan[] = [
  {
    id: '1',
    title: 'Full Body Workout',
    description: 'A comprehensive workout plan targeting all major muscle groups',
    exercises: [
      { exerciseId: '1', sets: 3, reps: 10, restTime: 90 }, // Bench Press
      { exerciseId: '2', sets: 3, reps: 8, restTime: 120 }, // Squat
      { exerciseId: '3', sets: 3, reps: 6, restTime: 120 }, // Deadlift
      { exerciseId: '6', sets: 3, reps: 30, restTime: 60 }, // Plank (in seconds)
    ],
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:00:00Z',
  },
  {
    id: '2',
    title: 'Upper Body Focus',
    description: 'Targets chest, back, shoulders, and arms',
    exercises: [
      { exerciseId: '1', sets: 4, reps: 8, restTime: 90 }, // Bench Press
      { exerciseId: '4', sets: 3, reps: 8, restTime: 90 }, // Pull-Up
      { exerciseId: '5', sets: 3, reps: 15, restTime: 60 }, // Push-Up
      { exerciseId: '7', sets: 3, reps: 10, restTime: 90 }, // Overhead Press
    ],
    createdAt: '2023-02-01T12:00:00Z',
    updatedAt: '2023-02-01T12:00:00Z',
  },
  {
    id: '3',
    title: 'Lower Body Day',
    description: 'Focus on legs and core',
    exercises: [
      { exerciseId: '2', sets: 4, reps: 10, restTime: 120 }, // Squat
      { exerciseId: '3', sets: 3, reps: 8, restTime: 120 }, // Deadlift
      { exerciseId: '6', sets: 3, reps: 45, restTime: 60 }, // Plank (in seconds)
    ],
    createdAt: '2023-03-01T12:00:00Z',
    updatedAt: '2023-03-01T12:00:00Z',
  },
];
