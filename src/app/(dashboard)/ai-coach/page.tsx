"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Dumbbell, Clock, Zap, RefreshCw } from "lucide-react";

const muscleGroups = [
  { value: "CHEST", label: "Chest" },
  { value: "BACK", label: "Back" },
  { value: "SHOULDERS", label: "Shoulders" },
  { value: "BICEPS", label: "Biceps" },
  { value: "TRICEPS", label: "Triceps" },
  { value: "LEGS", label: "Legs" },
  { value: "CORE", label: "Core" },
  { value: "GLUTES", label: "Glutes" },
  { value: "FULL_BODY", label: "Full Body" },
];

const equipment = [
  { value: "BARBELL", label: "Barbell" },
  { value: "DUMBBELL", label: "Dumbbells" },
  { value: "MACHINE", label: "Machines" },
  { value: "CABLE", label: "Cables" },
  { value: "BODYWEIGHT", label: "Bodyweight" },
  { value: "KETTLEBELL", label: "Kettlebell" },
];

interface WorkoutSuggestion {
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

export default function AICoachPage() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");
  const [duration, setDuration] = useState("45");
  const [suggestion, setSuggestion] = useState<WorkoutSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSelection = (value: string, list: string[], setter: (v: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((v) => v !== value));
    } else {
      setter([...list, value]);
    }
  };

  const generateWorkout = async () => {
    if (selectedMuscles.length === 0) {
      setError("Please select at least one muscle group");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          muscleGroups: selectedMuscles,
          equipment: selectedEquipment,
          difficulty,
          duration: parseInt(duration),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate workout");
      }

      const data = await res.json();
      setSuggestion(data);
    } catch (err) {
      setError("Failed to generate workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI Coach
        </h1>
        <p className="text-gray-400">
          Get personalized workout suggestions powered by AI
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Muscle Groups */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Target Muscle Groups
            </label>
            <div className="flex flex-wrap gap-2">
              {muscleGroups.map((mg) => (
                <Badge
                  key={mg.value}
                  className={`cursor-pointer transition-colors ${
                    selectedMuscles.includes(mg.value)
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    toggleSelection(mg.value, selectedMuscles, setSelectedMuscles)
                  }
                >
                  {mg.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Available Equipment
            </label>
            <div className="flex flex-wrap gap-2">
              {equipment.map((eq) => (
                <Badge
                  key={eq.value}
                  className={`cursor-pointer transition-colors ${
                    selectedEquipment.includes(eq.value)
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() =>
                    toggleSelection(eq.value, selectedEquipment, setSelectedEquipment)
                  }
                >
                  {eq.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Difficulty & Duration */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Difficulty Level"
              options={[
                { value: "BEGINNER", label: "Beginner" },
                { value: "INTERMEDIATE", label: "Intermediate" },
                { value: "ADVANCED", label: "Advanced" },
              ]}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
            <Select
              label="Duration (minutes)"
              options={[
                { value: "30", label: "30 minutes" },
                { value: "45", label: "45 minutes" },
                { value: "60", label: "60 minutes" },
                { value: "90", label: "90 minutes" },
              ]}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <Button
            onClick={generateWorkout}
            className="w-full gap-2"
            size="lg"
            isLoading={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            Generate Workout
          </Button>
        </CardContent>
      </Card>

      {/* Generated Workout */}
      {suggestion && (
        <Card className="border-purple-500/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {suggestion.name}
                </CardTitle>
                <p className="mt-1 text-sm text-gray-400">
                  {suggestion.description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={generateWorkout}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-purple-500/20 text-purple-400">
                <Clock className="mr-1 h-3 w-3" />
                {suggestion.estimatedDuration} min
              </Badge>
              <Badge className="bg-green-500/20 text-green-400">
                {suggestion.difficulty}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400">
                <Dumbbell className="mr-1 h-3 w-3" />
                {suggestion.exercises.length} exercises
              </Badge>
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {suggestion.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-800 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <p className="mt-1 text-sm text-gray-400">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <Badge variant="secondary">{index + 1}</Badge>
                  </div>
                  {exercise.notes && (
                    <p className="mt-2 text-sm text-gray-500">{exercise.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Action */}
            <Button className="w-full gap-2" size="lg">
              <Dumbbell className="h-4 w-4" />
              Start This Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
