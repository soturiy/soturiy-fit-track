
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataContext";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const { plans } = useData();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-soturiy-brown mb-4">Start Training</h1>
        <p className="text-gray-600">
          Choose a training plan to begin your workout session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="exercise-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-soturiy-brown">{plan.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{plan.description}</p>
              <p className="text-sm mb-4">{plan.exercises.length} exercises</p>
              <Button 
                className="w-full bg-soturiy-brown hover:bg-soturiy-dark-brown"
                onClick={() => navigate(`/training/session/${plan.id}`)}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full text-center p-8 border border-dashed border-gray-300 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No Training Plans Available</h3>
            <p className="text-gray-500 mb-6">
              Create a training plan first to start tracking your workouts.
            </p>
            <Button 
              onClick={() => navigate('/plans')}
              className="bg-soturiy-brown hover:bg-soturiy-dark-brown"
            >
              Create a Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
