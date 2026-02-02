import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateWorkoutSuggestion } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { muscleGroups, equipment, difficulty, duration } = await req.json();

    if (!muscleGroups || muscleGroups.length === 0) {
      return NextResponse.json(
        { error: "At least one muscle group is required" },
        { status: 400 }
      );
    }

    const suggestion = await generateWorkoutSuggestion(
      muscleGroups,
      difficulty,
      duration,
      equipment || []
    );

    return NextResponse.json(suggestion);
  } catch (error) {
    console.error("AI generation error:", error);
    
    // Return a fallback workout if AI fails
    const fallbackWorkout = {
      name: "Custom Workout",
      description: "A balanced workout targeting your selected muscle groups",
      exercises: [
        { name: "Push-ups", sets: 3, reps: "12-15", notes: "Keep core tight" },
        { name: "Squats", sets: 3, reps: "12-15", notes: "Go parallel or below" },
        { name: "Lunges", sets: 3, reps: "10 each leg", notes: "Keep knee over ankle" },
        { name: "Plank", sets: 3, reps: "30-45 sec", notes: "Maintain straight line" },
        { name: "Mountain Climbers", sets: 3, reps: "20 each side", notes: "Fast pace" },
      ],
      estimatedDuration: 45,
      difficulty: "intermediate",
    };

    return NextResponse.json(fallbackWorkout);
  }
}
