
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MuscleGroup, WorkoutSession } from "@/types";
import { Calendar, Clock, Dumbbell, Gauge } from "lucide-react";

const Progress = () => {
  const { workoutHistory, exercises, plans } = useData();

  // Get total workouts completed
  const totalWorkouts = workoutHistory.reduce(
    (sum, day) => sum + day.workoutSessions.length,
    0
  );

  // Calculate total workout time in minutes
  const totalWorkoutTimeMinutes = workoutHistory.reduce((sum, day) => {
    return sum + day.workoutSessions.reduce((daySum, session) => {
      if (session.startTime && session.endTime) {
        const start = new Date(session.startTime).getTime();
        const end = new Date(session.endTime).getTime();
        return daySum + (end - start) / (1000 * 60); // Convert ms to minutes
      }
      return daySum;
    }, 0);
  }, 0);

  // Format the time for display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Calculate most used muscle group
  const muscleGroupCounts: Record<MuscleGroup, number> = {
    "Chest": 0,
    "Back": 0,
    "Shoulders": 0,
    "Arms": 0,
    "Legs": 0,
    "Core": 0,
    "Full Body": 0,
    "Cardio": 0,
  };

  workoutHistory.forEach(day => {
    day.workoutSessions.forEach(session => {
      const plan = plans.find(p => p.id === session.planId);
      if (plan) {
        plan.exercises.forEach(planExercise => {
          const exercise = exercises.find(e => e.id === planExercise.exerciseId);
          if (exercise) {
            muscleGroupCounts[exercise.muscleGroup]++;
          }
        });
      }
    });
  });

  let mostUsedMuscleGroup: MuscleGroup = "Chest";
  let maxCount = 0;
  
  (Object.entries(muscleGroupCounts) as [MuscleGroup, number][]).forEach(([group, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedMuscleGroup = group;
    }
  });

  // Create data for volume progress chart
  const volumeProgressData = workoutHistory.map(day => {
    const date = new Date(day.date).toLocaleDateString();
    let volume = 0;
    
    day.workoutSessions.forEach(session => {
      session.exercisesData.forEach(exerciseData => {
        exerciseData.sets.forEach(set => {
          if (set.completed) {
            volume += set.weight * set.reps;
          }
        });
      });
    });
    
    return {
      date,
      volume
    };
  });

  // Create data for workout frequency by day of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const workoutsByDay: Record<string, number> = {};
  
  daysOfWeek.forEach(day => {
    workoutsByDay[day] = 0;
  });
  
  workoutHistory.forEach(day => {
    const date = new Date(day.date);
    const dayOfWeek = daysOfWeek[date.getDay()];
    workoutsByDay[dayOfWeek] += day.workoutSessions.length;
  });
  
  const workoutFrequencyData = Object.entries(workoutsByDay).map(([day, count]) => ({
    day,
    workouts: count
  }));

  // Function to get recent workouts
  const getRecentWorkouts = () => {
    const allSessions: { date: string; session: WorkoutSession }[] = [];
    
    workoutHistory.forEach(day => {
      day.workoutSessions.forEach(session => {
        allSessions.push({
          date: day.date,
          session
        });
      });
    });
    
    return allSessions
      .sort((a, b) => new Date(b.session.startTime).getTime() - new Date(a.session.startTime).getTime())
      .slice(0, 5); // Get last 5 workouts
  };

  const recentWorkouts = getRecentWorkouts();

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-soturiy-brown mb-4">Progress</h1>
        <p className="text-gray-600">
          Track your fitness journey and see your improvements over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Workouts</CardDescription>
            <CardTitle className="text-3xl text-soturiy-brown flex items-center">
              <Dumbbell className="mr-2 h-5 w-5" />
              {totalWorkouts}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Time</CardDescription>
            <CardTitle className="text-3xl text-soturiy-brown flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              {formatTime(totalWorkoutTimeMinutes)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardDescription>Most Trained</CardDescription>
            <CardTitle className="text-3xl text-soturiy-brown flex items-center">
              <Gauge className="mr-2 h-5 w-5" />
              {mostUsedMuscleGroup}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="pb-2">
            <CardDescription>Last Workout</CardDescription>
            <CardTitle className="text-3xl text-soturiy-brown flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {recentWorkouts.length > 0 ? new Date(recentWorkouts[0].date).toLocaleDateString() : "N/A"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="volume" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="volume">Volume Progress</TabsTrigger>
          <TabsTrigger value="frequency">Workout Frequency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="volume">
          <Card>
            <CardHeader>
              <CardTitle>Volume Progress</CardTitle>
              <CardDescription>
                Total volume (weight × reps) over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {volumeProgressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volumeProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="volume" 
                        name="Volume (kg)" 
                        stroke="#6D4C41" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No workout data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="frequency">
          <Card>
            <CardHeader>
              <CardTitle>Workout Frequency</CardTitle>
              <CardDescription>
                Number of workouts by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                {totalWorkouts > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutFrequencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="workouts" name="Workouts" fill="#6D4C41" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No workout data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>
            Your latest training sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => {
                const plan = plans.find(p => p.id === workout.session.planId);
                const duration = workout.session.endTime ? 
                  (new Date(workout.session.endTime).getTime() - new Date(workout.session.startTime).getTime()) / (1000 * 60) : 
                  0;
                
                return (
                  <div key={index} className="p-4 border border-soturiy-beige rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{plan?.title || "Unknown Plan"}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatTime(duration)}</span>
                      <span className="mx-2">•</span>
                      <Dumbbell className="h-4 w-4 mr-1" />
                      <span>{workout.session.exercisesData.length} exercises</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-6">
              <p className="text-gray-500">
                No workout history available yet. Start training to see your progress!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Progress;
