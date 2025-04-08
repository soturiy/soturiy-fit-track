
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Calendar } from "lucide-react";
import { useData } from "@/context/DataContext";
import { TrainingPlan } from "@/types";
import PlanModal from "@/components/plans/PlanModal";

const Plans = () => {
  const { plans, exercises } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlan = () => {
    setSelectedPlan(null);
    setModalOpen(true);
  };

  const handleEditPlan = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  // Helper function to get exercise title by ID
  const getExerciseTitle = (id: string) => {
    const exercise = exercises.find((e) => e.id === id);
    return exercise ? exercise.title : "Unknown Exercise";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-soturiy-brown mb-4 sm:mb-0">Training Plans</h1>
        <Button onClick={handleAddPlan} className="bg-soturiy-brown hover:bg-soturiy-dark-brown">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-soturiy-beige focus:border-soturiy-brown"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card 
            key={plan.id}
            className="exercise-card cursor-pointer"
            onClick={() => handleEditPlan(plan)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-soturiy-brown">{plan.title}</CardTitle>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {formatDate(plan.createdAt)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{plan.description}</p>
              <div className="mb-3">
                <Badge className="bg-soturiy-brown mr-2">
                  {plan.exercises.length} Exercises
                </Badge>
              </div>
              <div className="space-y-2">
                {plan.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="text-sm flex justify-between">
                    <span>{getExerciseTitle(exercise.exerciseId)}</span>
                    <span className="text-gray-500">
                      {exercise.sets} sets × {exercise.reps} reps
                    </span>
                  </div>
                ))}
                {plan.exercises.length > 3 && (
                  <div className="text-sm text-gray-500 italic">
                    +{plan.exercises.length - 3} more exercises
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modalOpen && (
        <PlanModal
          plan={selectedPlan}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Plans;
