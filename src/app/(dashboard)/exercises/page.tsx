import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Search } from "lucide-react";

const muscleGroupColors: Record<string, string> = {
  CHEST: "bg-red-500/20 text-red-400",
  BACK: "bg-blue-500/20 text-blue-400",
  SHOULDERS: "bg-yellow-500/20 text-yellow-400",
  BICEPS: "bg-purple-500/20 text-purple-400",
  TRICEPS: "bg-pink-500/20 text-pink-400",
  LEGS: "bg-green-500/20 text-green-400",
  CORE: "bg-orange-500/20 text-orange-400",
  GLUTES: "bg-cyan-500/20 text-cyan-400",
  CARDIO: "bg-emerald-500/20 text-emerald-400",
  FULL_BODY: "bg-indigo-500/20 text-indigo-400",
};

async function getExercises() {
  return db.exercise.findMany({
    orderBy: [{ muscleGroup: "asc" }, { name: "asc" }],
  });
}

export default async function ExercisesPage() {
  const exercises = await getExercises();

  // Group by muscle group
  const grouped = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscleGroup]) acc[exercise.muscleGroup] = [];
    acc[exercise.muscleGroup].push(exercise);
    return acc;
  }, {} as Record<string, typeof exercises>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <p className="text-gray-400">
          Browse our collection of {exercises.length} exercises
        </p>
      </div>

      {exercises.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Dumbbell className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold">No exercises found</h3>
            <p className="mt-2 text-gray-400">
              The exercise library is being set up.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([muscleGroup, groupExercises]) => (
            <div key={muscleGroup}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Badge className={muscleGroupColors[muscleGroup] || ""}>
                  {muscleGroup.replace("_", " ")}
                </Badge>
                <span className="text-sm text-gray-500">
                  ({groupExercises.length} exercises)
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupExercises.map((exercise) => (
                  <Card
                    key={exercise.id}
                    className="transition-colors hover:border-orange-500/50"
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{exercise.name}</h3>
                      {exercise.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                          {exercise.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {exercise.difficulty}
                        </Badge>
                        {exercise.equipment && (
                          <Badge variant="secondary">
                            {exercise.equipment.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
