import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDuration } from "@/lib/utils";

async function getWorkouts(userId: string) {
  return db.workout.findMany({
    where: { userId },
    orderBy: { completedAt: "desc" },
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    },
  });
}

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const workouts = await getWorkouts(session.user.id);

  // Group workouts by month
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const month = new Date(workout.completedAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(workout);
    return acc;
  }, {} as Record<string, typeof workouts>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-gray-400">Track and manage your workout history</p>
        </div>
        <Link href="/workouts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Log Workout
          </Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Dumbbell className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold">No workouts yet</h3>
            <p className="mt-2 text-gray-400">
              Start logging your workouts to track your progress
            </p>
            <Link href="/workouts/new" className="mt-6 inline-block">
              <Button>Log Your First Workout</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedWorkouts).map(([month, monthWorkouts]) => (
            <div key={month}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-300">
                <Calendar className="h-5 w-5" />
                {month}
              </h2>
              <div className="space-y-3">
                {monthWorkouts.map((workout) => (
                  <Link key={workout.id} href={`/workouts/${workout.id}`}>
                    <Card className="cursor-pointer transition-colors hover:border-orange-500/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{workout.name}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {workout.duration
                                  ? formatDuration(workout.duration)
                                  : "N/A"}
                              </span>
                              <span>{workout.exercises.length} exercises</span>
                              <span>
                                {workout.exercises.reduce(
                                  (acc, ex) => acc + ex.sets.length,
                                  0
                                )}{" "}
                                sets
                              </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {workout.exercises.slice(0, 3).map((ex) => (
                                <Badge key={ex.id} variant="secondary">
                                  {ex.exercise.name}
                                </Badge>
                              ))}
                              {workout.exercises.length > 3 && (
                                <Badge variant="outline">
                                  +{workout.exercises.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge>{formatDate(workout.completedAt)}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
