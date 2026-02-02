import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startOfDay, differenceInDays } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workouts = await db.workout.findMany({
    where: { userId: session.user.id },
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

  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, duration, notes, exercises } = await req.json();

    // Create workout with exercises and sets
    const workout = await db.workout.create({
      data: {
        userId: session.user.id,
        name,
        duration,
        notes,
        exercises: {
          create: exercises.map(
            (
              ex: { exerciseId: string; sets: { reps: number; weight: number }[] },
              index: number
            ) => ({
              exerciseId: ex.exerciseId,
              order: index,
              sets: {
                create: ex.sets.map((set: { reps: number; weight: number }, setIndex: number) => ({
                  setNumber: setIndex + 1,
                  reps: set.reps,
                  weight: set.weight,
                })),
              },
            })
          ),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    });

    // Update streak
    await updateStreak(session.user.id);

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    console.error("Failed to create workout:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}

async function updateStreak(userId: string) {
  const streak = await db.streak.findUnique({
    where: { userId },
  });

  const today = startOfDay(new Date());

  if (!streak) {
    await db.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastWorkoutAt: today,
      },
    });
    return;
  }

  const lastWorkout = streak.lastWorkoutAt
    ? startOfDay(streak.lastWorkoutAt)
    : null;
  const daysSinceLast = lastWorkout
    ? differenceInDays(today, lastWorkout)
    : null;

  let newStreak = 1;
  if (daysSinceLast === 0) {
    // Already worked out today, no change
    newStreak = streak.currentStreak;
  } else if (daysSinceLast === 1) {
    // Consecutive day
    newStreak = streak.currentStreak + 1;
  }

  await db.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, streak.longestStreak),
      lastWorkoutAt: today,
    },
  });
}
