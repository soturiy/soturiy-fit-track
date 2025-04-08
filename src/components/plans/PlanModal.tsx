
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useData } from "@/context/DataContext";
import { TrainingPlan, PlanExercise } from "@/types";
import { Plus, Trash, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface PlanModalProps {
  plan: TrainingPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal = ({ plan, isOpen, onClose }: PlanModalProps) => {
  const { exercises, addPlan, updatePlan, deletePlan } = useData();
  const isEditing = !!plan;

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    exercises: PlanExercise[];
  }>({
    title: "",
    description: "",
    exercises: [],
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        description: plan.description,
        exercises: [...plan.exercises],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        exercises: [],
      });
    }
  }, [plan]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = () => {
    if (exercises.length === 0) {
      toast.error("No exercises available. Create exercises first.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseId: exercises[0].id,
          sets: 3,
          reps: 10,
          restTime: 60,
        },
      ],
    }));
  };

  const handleRemoveExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleExerciseChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value,
      };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Plan title is required");
      return;
    }

    if (formData.exercises.length === 0) {
      toast.error("At least one exercise is required");
      return;
    }

    if (isEditing && plan) {
      updatePlan({
        ...plan,
        title: formData.title,
        description: formData.description,
        exercises: formData.exercises,
      });
      toast.success("Plan updated successfully");
    } else {
      addPlan({
        title: formData.title,
        description: formData.description,
        exercises: formData.exercises,
      });
      toast.success("Plan created successfully");
    }
    onClose();
  };

  const handleDelete = () => {
    if (plan) {
      deletePlan(plan.id);
      toast.success("Plan deleted successfully");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-soturiy-brown">
            {isEditing ? "Edit Training Plan" : "Create Training Plan"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input min-h-[80px]"
            />
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-soturiy-brown">Exercises</h3>
              <Button
                onClick={handleAddExercise}
                size="sm"
                className="bg-soturiy-brown hover:bg-soturiy-dark-brown"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Exercise
              </Button>
            </div>

            {formData.exercises.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">No exercises added yet</p>
                <Button 
                  onClick={handleAddExercise} 
                  variant="outline" 
                  className="mt-2"
                >
                  Add Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border border-soturiy-beige rounded-md bg-white flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">Exercise {index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Exercise</label>
                        <Select
                          value={exercise.exerciseId}
                          onValueChange={(value) =>
                            handleExerciseChange(index, "exerciseId", value)
                          }
                        >
                          <SelectTrigger className="form-input mt-1">
                            <SelectValue placeholder="Select Exercise" />
                          </SelectTrigger>
                          <SelectContent>
                            {exercises.map((ex) => (
                              <SelectItem key={ex.id} value={ex.id}>
                                {ex.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">Sets</label>
                          <Input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "sets",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="form-input mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Reps</label>
                          <Input
                            type="number"
                            min="1"
                            value={exercise.reps}
                            onChange={(e) =>
                              handleExerciseChange(
                                index,
                                "reps",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="form-input mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Rest Time (seconds)</label>
                      <Input
                        type="number"
                        min="0"
                        value={exercise.restTime}
                        onChange={(e) =>
                          handleExerciseChange(
                            index,
                            "restTime",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="form-input mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          {isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the training plan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div>
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-soturiy-brown hover:bg-soturiy-dark-brown">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
