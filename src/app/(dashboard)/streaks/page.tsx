import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar, Target, Zap } from "lucide-react";
import { formatDate, getStreakEmoji } from "@/lib/utils";
import { startOfWeek, eachDayOfInterval, format, isSameDay } from "date-fns";

async function getStreakData(userId: string) {
  const [streak, recentWorkouts] = await Promise.all([
    db.streak.findUnique({ where: { userId } }),
    db.workout.findMany({
      where: {
        userId,
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { completedAt: true },
    }),
  ]);

  return { streak, recentWorkouts };
}

export default async function StreaksPage() {
  const session = await auth();
  if (!session?.user) return null;

  const { streak, recentWorkouts } = await getStreakData(session.user.id);

  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;

  // Generate calendar data for current week
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: today,
  });

  const workoutDays = new Set(
    recentWorkouts.map((w) => format(w.completedAt, "yyyy-MM-dd"))
  );

  // Calculate badges
  const badges = [];
  if (currentStreak >= 3) badges.push({ name: "3-Day Warrior", icon: "⚡" });
  if (currentStreak >= 7) badges.push({ name: "Week Champion", icon: "🏅" });
  if (currentStreak >= 14) badges.push({ name: "14-Day Legend", icon: "🌟" });
  if (currentStreak >= 30) badges.push({ name: "30-Day Beast", icon: "🔥" });
  if (longestStreak >= 7) badges.push({ name: "Week Streak Achieved", icon: "✅" });
  if (recentWorkouts.length >= 10) badges.push({ name: "Consistent", icon: "💪" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Streak Tracking</h1>
        <p className="text-gray-400">Stay consistent and build your streak</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-orange-500/20 p-3">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Streak</p>
              <p className="text-3xl font-bold">
                {currentStreak} {getStreakEmoji(currentStreak)}
              </p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-purple-500/20 p-3">
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Longest Streak</p>
              <p className="text-3xl font-bold">{longestStreak}</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-green-500/20 p-3">
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-3xl font-bold">{recentWorkouts.length}</p>
              <p className="text-xs text-gray-500">workouts</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Weekly Goal</p>
              <p className="text-3xl font-bold">
                {weekDays.filter((d) => workoutDays.has(format(d, "yyyy-MM-dd"))).length}/5
              </p>
              <p className="text-xs text-gray-500">days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const date = new Date(weekStart);
              date.setDate(date.getDate() + i);
              const dateStr = format(date, "yyyy-MM-dd");
              const hasWorkout = workoutDays.has(dateStr);
              const isToday = isSameDay(date, today);
              const isPast = date <= today;

              return (
                <div key={day} className="text-center">
                  <p className="mb-2 text-xs text-gray-500">{day}</p>
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
                      hasWorkout
                        ? "bg-orange-500 text-white"
                        : isToday
                        ? "border-2 border-orange-500 bg-gray-800"
                        : isPast
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-800/50 text-gray-600"
                    }`}
                  >
                    {hasWorkout ? "✓" : format(date, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-gray-400">
              Complete workouts to earn badges! Start with a 3-day streak.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <Badge
                  key={badge.name}
                  className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 px-4 py-2 text-sm"
                >
                  <span className="mr-2">{badge.icon}</span>
                  {badge.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10">
        <CardContent className="py-8 text-center">
          <p className="text-2xl font-bold">
            {currentStreak === 0
              ? "Start your streak today! 💪"
              : currentStreak < 3
              ? "You're building momentum!"
              : currentStreak < 7
              ? "Amazing progress! Keep it up!"
              : currentStreak < 14
              ? "You're on fire! 🔥"
              : "UNSTOPPABLE! You're a legend! 🏆"}
          </p>
          <p className="mt-2 text-gray-400">
            {currentStreak === 0
              ? "Log a workout to begin your fitness journey"
              : `You've worked out ${currentStreak} day${currentStreak !== 1 ? "s" : ""} in a row!`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
