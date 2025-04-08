
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { Exercise } from "@/types";
import ExerciseModal from "@/components/exercises/ExerciseModal";

const Exercises = () => {
  const { exercises } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter(
    (exercise) =>
      exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.exerciseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExercise = () => {
    setSelectedExercise(null);
    setModalOpen(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-soturiy-brown mb-4 sm:mb-0">Exercises</h1>
        <Button onClick={handleAddExercise} className="bg-soturiy-brown hover:bg-soturiy-dark-brown">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Exercise
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-soturiy-beige focus:border-soturiy-brown"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="exercise-card cursor-pointer"
            onClick={() => handleEditExercise(exercise)}
          >
            {exercise.imageUrl && (
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img
                  src={exercise.imageUrl}
                  alt={exercise.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-soturiy-brown">{exercise.title}</CardTitle>
                <Badge className="bg-soturiy-brown">{exercise.difficulty}</Badge>
              </div>
              <CardDescription className="mt-1">{exercise.exerciseType}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mr-2 mb-2 border-soturiy-beige">
                {exercise.muscleGroup}
              </Badge>
              <p className="text-sm mt-2 line-clamp-2">{exercise.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {modalOpen && (
        <ExerciseModal
          exercise={selectedExercise}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Exercises;
