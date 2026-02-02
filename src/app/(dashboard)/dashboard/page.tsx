import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
  Plus,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatDuration, getStreakEmoji } from "@/lib/utils";

async function getDashboardData(userId: string) {
  const [
    recentWorkouts,
    streak,
    totalWorkouts,
    thisWeekWorkouts,
  ] = await Promise.all([
    db.workout.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    }),
    db.streak.findUnique({
      where: { userId },
    }),
    db.workout.count({
      where: { userId },
    }),
    db.workout.count({
      where: {
        userId,
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return { recentWorkouts, streak, totalWorkouts, thisWeekWorkouts };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const { recentWorkouts, streak, totalWorkouts, thisWeekWorkouts } =
    await getDashboardData(session.user.id);

  const stats = [
    {
      name: "Total Workouts",
      value: totalWorkouts.toString(),
      icon: Dumbbell,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      name: "This Week",
      value: thisWeekWorkouts.toString(),
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      name: "Current Streak",
      value: `${streak?.currentStreak || 0} ${getStreakEmoji(streak?.currentStreak || 0)}`,
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
    },
    {
      name: "Best Streak",
      value: (streak?.longestStreak || 0).toString(),
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {session.user.name?.split(" ")[0] || "Athlete"}! 💪
          </h1>
          <p className="text-gray-400">
            Let&apos;s crush your fitness goals today.
          </p>
        </div>
        <Link href="/workouts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Log Workout
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/workouts/new">
          <Card className="cursor-pointer transition-colors hover:border-orange-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Dumbbell className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold">Start Workout</p>
                <p className="text-sm text-gray-400">Log a new workout session</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/templates">
          <Card className="cursor-pointer transition-colors hover:border-orange-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold">Quick Start</p>
                <p className="text-sm text-gray-400">Use a workout template</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ai-coach">
          <Card className="cursor-pointer transition-colors hover:border-orange-500/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <Target className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold">AI Coach</p>
                <p className="text-sm text-gray-400">Get workout suggestions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Workouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Workouts</CardTitle>
          <Link href="/workouts">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentWorkouts.length === 0 ? (
            <div className="py-8 text-center">
              <Dumbbell className="mx-auto h-12 w-12 text-gray-600" />
              <p className="mt-4 text-gray-400">No workouts yet</p>
              <Link href="/workouts/new" className="mt-4 inline-block">
                <Button>Log Your First Workout</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 transition-colors hover:bg-gray-800/50">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {workout.duration ? formatDuration(workout.duration) : "N/A"}
                        </span>
                        <span>{workout.exercises.length} exercises</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">
                        {formatDate(workout.completedAt)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
