
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  Exercise, 
  TrainingPlan, 
  WorkoutSession, 
  WorkoutHistory 
} from '@/types';

// Sample data for initial state
import { sampleExercises } from '@/data/sampleExercises';
import { samplePlans } from '@/data/samplePlans';

interface DataContextType {
  exercises: Exercise[];
  plans: TrainingPlan[];
  workoutHistory: WorkoutHistory[];
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  addPlan: (plan: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (plan: TrainingPlan) => void;
  deletePlan: (id: string) => void;
  addWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => void;
  updateWorkoutSession: (session: WorkoutSession) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize states with localStorage data or default samples
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('soturiyfit-exercises');
    return saved ? JSON.parse(saved) : sampleExercises;
  });
  
  const [plans, setPlans] = useState<TrainingPlan[]>(() => {
    const saved = localStorage.getItem('soturiyfit-plans');
    return saved ? JSON.parse(saved) : samplePlans;
  });
  
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>(() => {
    const saved = localStorage.getItem('soturiyfit-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('soturiyfit-exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('soturiyfit-plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('soturiyfit-history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  // CRUD operations for exercises
  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    const newExercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (updatedExercise: Exercise) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  // CRUD operations for plans
  const addPlan = (plan: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (updatedPlan: TrainingPlan) => {
    const planWithUpdatedTimestamp = {
      ...updatedPlan,
      updatedAt: new Date().toISOString(),
    };
    setPlans(
      plans.map((plan) =>
        plan.id === updatedPlan.id ? planWithUpdatedTimestamp : plan
      )
    );
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  // Operations for workout sessions
  const addWorkoutSession = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession = {
      ...session,
      id: Date.now().toString(),
    };
    
    // Get the date portion of the startTime
    const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
    
    // Check if we already have an entry for this date
    const existingHistoryIndex = workoutHistory.findIndex(
      (history) => history.date === sessionDate
    );
    
    if (existingHistoryIndex >= 0) {
      // Update the existing entry
      const updatedHistory = [...workoutHistory];
      updatedHistory[existingHistoryIndex] = {
        ...updatedHistory[existingHistoryIndex],
        workoutSessions: [
          ...updatedHistory[existingHistoryIndex].workoutSessions,
          newSession,
        ],
      };
      setWorkoutHistory(updatedHistory);
    } else {
      // Create a new entry
      setWorkoutHistory([
        ...workoutHistory,
        {
          date: sessionDate,
          workoutSessions: [newSession],
        },
      ]);
    }
  };

  const updateWorkoutSession = (updatedSession: WorkoutSession) => {
    // Find which history entry contains this session
    const sessionDate = workoutHistory.find((history) =>
      history.workoutSessions.some((session) => session.id === updatedSession.id)
    )?.date;

    if (sessionDate) {
      const updatedHistory = workoutHistory.map((history) => {
        if (history.date === sessionDate) {
          return {
            ...history,
            workoutSessions: history.workoutSessions.map((session) =>
              session.id === updatedSession.id ? updatedSession : session
            ),
          };
        }
        return history;
      });
      setWorkoutHistory(updatedHistory);
    }
  };

  const value = {
    exercises,
    plans,
    workoutHistory,
    addExercise,
    updateExercise,
    deleteExercise,
    addPlan,
    updatePlan,
    deletePlan,
    addWorkoutSession,
    updateWorkoutSession,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
