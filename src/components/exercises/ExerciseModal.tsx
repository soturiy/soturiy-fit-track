
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
import { Exercise, MuscleGroup, ExerciseType, DifficultyLevel } from "@/types";
import { toast } from "sonner";

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
}

const muscleGroups: MuscleGroup[] = [
  "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body", "Cardio"
];

const exerciseTypes: ExerciseType[] = [
  "Strength", "Cardio", "Flexibility", "Balance"
];

const difficultyLevels: DifficultyLevel[] = [
  "Beginner", "Intermediate", "Advanced", "Expert"
];

const ExerciseModal = ({ exercise, isOpen, onClose }: ExerciseModalProps) => {
  const { addExercise, updateExercise, deleteExercise } = useData();
  const isEditing = !!exercise;

  const [formData, setFormData] = useState<Omit<Exercise, 'id'>>({
    title: "",
    description: "",
    muscleGroup: "Chest",
    exerciseType: "Strength",
    difficulty: "Beginner",
    imageUrl: "",
  });

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup,
        exerciseType: exercise.exerciseType,
        difficulty: exercise.difficulty,
        imageUrl: exercise.imageUrl || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        muscleGroup: "Chest",
        exerciseType: "Strength",
        difficulty: "Beginner",
        imageUrl: "",
      });
    }
  }, [exercise]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Exercise title is required");
      return;
    }

    if (isEditing && exercise) {
      updateExercise({ ...formData, id: exercise.id });
      toast.success("Exercise updated successfully");
    } else {
      addExercise(formData);
      toast.success("Exercise added successfully");
    }
    onClose();
  };

  const handleDelete = () => {
    if (exercise) {
      deleteExercise(exercise.id);
      toast.success("Exercise deleted successfully");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-soturiy-brown">
            {isEditing ? "Edit Exercise" : "Add New Exercise"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="muscleGroup" className="text-sm font-medium">Muscle Group</label>
            <Select 
              value={formData.muscleGroup} 
              onValueChange={(value) => handleSelectChange("muscleGroup", value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="exerciseType" className="text-sm font-medium">Exercise Type</label>
            <Select 
              value={formData.exerciseType} 
              onValueChange={(value) => handleSelectChange("exerciseType", value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select Exercise Type" />
              </SelectTrigger>
              <SelectContent>
                {exerciseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="difficulty" className="text-sm font-medium">Difficulty Level</label>
            <Select 
              value={formData.difficulty} 
              onValueChange={(value) => handleSelectChange("difficulty", value)}
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (optional)</label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
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
                    This action cannot be undone. This will permanently delete the exercise.
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

export default ExerciseModal;
