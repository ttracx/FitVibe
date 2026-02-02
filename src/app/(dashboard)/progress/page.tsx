import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { WorkoutChart, MuscleGroupChart } from "@/components/charts/workout-chart";

async function getProgressData(userId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const [workouts, exercises] = await Promise.all([
    db.workout.findMany({
      where: {
        userId,
        completedAt: { gte: thirtyDaysAgo },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
      orderBy: { completedAt: "asc" },
    }),
    db.workoutExercise.findMany({
      where: {
        workout: {
          userId,
          completedAt: { gte: thirtyDaysAgo },
        },
      },
      include: {
        exercise: true,
        sets: true,
      },
    }),
  ]);

  return { workouts, exercises };
}

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) return null;

  const { workouts, exercises } = await getProgressData(session.user.id);

  // Prepare workout frequency data
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const workoutsByDate = workouts.reduce((acc, w) => {
    const date = format(w.completedAt, "yyyy-MM-dd");
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const frequencyData = last30Days.map((date) => ({
    date: format(date, "MMM d"),
    value: workoutsByDate[format(date, "yyyy-MM-dd")] || 0,
  }));

  // Prepare volume data (total sets per day)
  const volumeByDate = workouts.reduce((acc, w) => {
    const date = format(w.completedAt, "yyyy-MM-dd");
    const totalSets = w.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    acc[date] = (acc[date] || 0) + totalSets;
    return acc;
  }, {} as Record<string, number>);

  const volumeData = last30Days.map((date) => ({
    date: format(date, "MMM d"),
    value: volumeByDate[format(date, "yyyy-MM-dd")] || 0,
  }));

  // Prepare muscle group data
  const muscleGroupCounts = exercises.reduce((acc, ex) => {
    const group = ex.exercise.muscleGroup.replace("_", " ");
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const muscleGroupData = Object.entries(muscleGroupCounts)
    .map(([name, workouts]) => ({ name, workouts }))
    .sort((a, b) => b.workouts - a.workouts);

  // Calculate summary stats
  const totalWorkouts = workouts.length;
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalReps = exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + (set.reps || 0), 0),
    0
  );
  const totalWeight = exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets.reduce(
        (s, set) => s + (set.weight || 0) * (set.reps || 0),
        0
      ),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-gray-400">Track your fitness journey over time</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Last 30 Days</p>
            <p className="text-3xl font-bold text-orange-500">{totalWorkouts}</p>
            <p className="text-sm text-gray-500">workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Total Sets</p>
            <p className="text-3xl font-bold text-blue-500">{totalSets}</p>
            <p className="text-sm text-gray-500">sets completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Total Reps</p>
            <p className="text-3xl font-bold text-green-500">{totalReps.toLocaleString()}</p>
            <p className="text-sm text-gray-500">reps performed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-400">Total Volume</p>
            <p className="text-3xl font-bold text-purple-500">
              {(totalWeight / 1000).toFixed(1)}k
            </p>
            <p className="text-sm text-gray-500">lbs lifted</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WorkoutChart
          data={frequencyData}
          title="Workout Frequency"
          type="bar"
          color="#f97316"
          valueLabel="workouts"
        />
        <WorkoutChart
          data={volumeData}
          title="Training Volume (Sets)"
          type="area"
          color="#3b82f6"
          valueLabel="sets"
        />
      </div>

      <MuscleGroupChart data={muscleGroupData} />

      {totalWorkouts === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-400">
              Start logging workouts to see your progress charts!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
