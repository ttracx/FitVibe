import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface WorkoutSuggestion {
  name: string;
  description: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }[];
  estimatedDuration: number;
  difficulty: string;
}

export async function generateWorkoutSuggestion(
  muscleGroups: string[],
  difficulty: string,
  duration: number,
  equipment: string[],
  recentWorkouts?: string[]
): Promise<WorkoutSuggestion> {
  const prompt = `Generate a workout plan with the following requirements:
- Target muscle groups: ${muscleGroups.join(", ")}
- Difficulty level: ${difficulty}
- Target duration: ${duration} minutes
- Available equipment: ${equipment.length > 0 ? equipment.join(", ") : "bodyweight only"}
${recentWorkouts?.length ? `- Recent workouts to avoid repeating: ${recentWorkouts.join(", ")}` : ""}

Return a JSON object with this structure:
{
  "name": "Workout name",
  "description": "Brief workout description",
  "exercises": [
    { "name": "Exercise name", "sets": 3, "reps": "8-12", "notes": "Optional tips" }
  ],
  "estimatedDuration": 45,
  "difficulty": "intermediate"
}

Make sure the workout is balanced, progressive, and follows proper exercise ordering (compound movements first, then isolation).`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert personal trainer. Generate safe, effective workout plans in JSON format only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");
  
  return JSON.parse(content) as WorkoutSuggestion;
}

export async function getExerciseAlternatives(
  exerciseName: string,
  equipment: string[]
): Promise<{ alternatives: { name: string; reason: string }[] }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert personal trainer. Provide exercise alternatives in JSON format.",
      },
      {
        role: "user",
        content: `Suggest 3 alternative exercises for "${exerciseName}" that can be done with: ${equipment.join(", ") || "bodyweight"}. Return JSON: { "alternatives": [{ "name": "...", "reason": "..." }] }`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");
  
  return JSON.parse(content);
}
