
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExerciseSet, WorkoutSession } from "@/types";
import { ArrowLeft, ArrowRight, Check, Clock, Save } from "lucide-react";
import { toast } from "sonner";

const TrainingSession = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { plans, exercises, addWorkoutSession } = useData();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionData, setSessionData] = useState<WorkoutSession>({
    id: "",
    planId: planId || "",
    startTime: new Date().toISOString(),
    exercisesData: [],
  });

  // Find the selected plan
  const selectedPlan = plans.find((plan) => plan.id === planId);

  useEffect(() => {
    if (!selectedPlan) {
      toast.error("Training plan not found");
      navigate("/training");
      return;
    }

    // Initialize exercise data
    const initialExercisesData = selectedPlan.exercises.map((planExercise) => {
      const sets: ExerciseSet[] = Array.from({ length: planExercise.sets }, () => ({
        weight: 0,
        reps: planExercise.reps,
        completed: false,
      }));

      return {
        exerciseId: planExercise.exerciseId,
        sets,
      };
    });

    setSessionData((prev) => ({
      ...prev,
      planId: selectedPlan.id,
      exercisesData: initialExercisesData,
    }));
  }, [selectedPlan, planId, navigate]);

  if (!selectedPlan) {
    return <div>Loading...</div>;
  }

  const currentPlanExercise = selectedPlan.exercises[currentExerciseIndex];
  const currentExerciseData = sessionData.exercisesData[currentExerciseIndex];
  
  if (!currentPlanExercise || !currentExerciseData) {
    return <div>Loading exercise data...</div>;
  }

  const currentExercise = exercises.find(
    (ex) => ex.id === currentPlanExercise.exerciseId
  );

  if (!currentExercise) {
    return <div>Exercise not found</div>;
  }

  const handleWeightChange = (setIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSessionData((prev) => {
      const updatedExercisesData = [...prev.exercisesData];
      updatedExercisesData[currentExerciseIndex] = {
        ...updatedExercisesData[currentExerciseIndex],
        sets: updatedExercisesData[currentExerciseIndex].sets.map((set, idx) =>
          idx === setIndex ? { ...set, weight: numValue } : set
        ),
      };
      return { ...prev, exercisesData: updatedExercisesData };
    });
  };

  const handleRepsChange = (setIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setSessionData((prev) => {
      const updatedExercisesData = [...prev.exercisesData];
      updatedExercisesData[currentExerciseIndex] = {
        ...updatedExercisesData[currentExerciseIndex],
        sets: updatedExercisesData[currentExerciseIndex].sets.map((set, idx) =>
          idx === setIndex ? { ...set, reps: numValue } : set
        ),
      };
      return { ...prev, exercisesData: updatedExercisesData };
    });
  };

  const toggleSetCompleted = (setIndex: number) => {
    setSessionData((prev) => {
      const updatedExercisesData = [...prev.exercisesData];
      updatedExercisesData[currentExerciseIndex] = {
        ...updatedExercisesData[currentExerciseIndex],
        sets: updatedExercisesData[currentExerciseIndex].sets.map((set, idx) =>
          idx === setIndex ? { ...set, completed: !set.completed } : set
        ),
      };
      return { ...prev, exercisesData: updatedExercisesData };
    });
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < selectedPlan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleFinishWorkout = () => {
    const finishedSession: WorkoutSession = {
      ...sessionData,
      endTime: new Date().toISOString(),
    };
    
    addWorkoutSession(finishedSession);
    toast.success("Workout completed and saved!");
    navigate("/progress");
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <div className="flex items-center mb-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate("/training")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-soturiy-brown">{selectedPlan.title}</h1>
        </div>
        <p className="text-gray-600">
          Exercise {currentExerciseIndex + 1} of {selectedPlan.exercises.length}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-soturiy-brown">{currentExercise.title}</CardTitle>
            <div className="flex mt-2 gap-2">
              <Badge className="bg-soturiy-beige text-soturiy-brown">
                {currentExercise.muscleGroup}
              </Badge>
              <Badge variant="outline" className="border-soturiy-beige">
                {currentExercise.difficulty}
              </Badge>
            </div>
          </div>
          {currentPlanExercise.restTime > 0 && (
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Rest: {currentPlanExercise.restTime}s</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="my-4">{currentExercise.description}</p>
          {currentExercise.imageUrl && (
            <div className="mb-4 rounded-md overflow-hidden">
              <img 
                src={currentExercise.imageUrl} 
                alt={currentExercise.title} 
                className="w-full max-h-64 object-cover"
              />
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">Sets</h3>
            <div className="grid grid-cols-12 gap-2 font-medium mb-2 text-sm">
              <div className="col-span-1">Set</div>
              <div className="col-span-4">Weight (kg)</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-3">Completed</div>
            </div>
            
            {currentExerciseData.sets.map((set, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-center">
                <div className="col-span-1 text-center font-medium">{index + 1}</div>
                <div className="col-span-4">
                  <Input 
                    type="number"
                    value={set.weight}
                    onChange={(e) => handleWeightChange(index, e.target.value)}
                    className="form-input" 
                  />
                </div>
                <div className="col-span-4">
                  <Input 
                    type="number"
                    value={set.reps}
                    onChange={(e) => handleRepsChange(index, e.target.value)}
                    className="form-input" 
                  />
                </div>
                <div className="col-span-3 flex justify-center">
                  <Checkbox 
                    checked={set.completed}
                    onCheckedChange={() => toggleSetCompleted(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentExerciseIndex === selectedPlan.exercises.length - 1 ? (
            <Button 
              onClick={handleFinishWorkout}
              className="bg-soturiy-brown hover:bg-soturiy-dark-brown"
            >
              <Check className="mr-2 h-4 w-4" />
              Finish Workout
            </Button>
          ) : (
            <Button
              onClick={handleNextExercise}
              className="bg-soturiy-brown hover:bg-soturiy-dark-brown"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TrainingSession;
