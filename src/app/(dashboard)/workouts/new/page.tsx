"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, X } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: { reps: number; weight: number }[];
}

export default function NewWorkoutPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/exercises");
      const data = await res.json();
      setExercises(data);
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function addExercise() {
    if (!selectedExercise) return;
    const exercise = exercises.find((e) => e.id === selectedExercise);
    if (!exercise) return;

    setWorkoutExercises([
      ...workoutExercises,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: [{ reps: 10, weight: 0 }],
      },
    ]);
    setSelectedExercise("");
  }

  function removeExercise(index: number) {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  }

  function addSet(exerciseIndex: number) {
    const updated = [...workoutExercises];
    const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
    updated[exerciseIndex].sets.push({ ...lastSet });
    setWorkoutExercises(updated);
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter(
      (_, i) => i !== setIndex
    );
    setWorkoutExercises(updated);
  }

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number
  ) {
    const updated = [...workoutExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setWorkoutExercises(updated);
  }

  async function saveWorkout() {
    if (!name || workoutExercises.length === 0) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          duration: duration ? parseInt(duration) : null,
          notes,
          exercises: workoutExercises,
        }),
      });

      if (res.ok) {
        router.push("/workouts");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Log Workout</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={saveWorkout}
            disabled={!name || workoutExercises.length === 0}
            isLoading={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Workout
          </Button>
        </div>
      </div>

      {/* Workout Details */}
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Workout Name"
              placeholder="e.g., Push Day, Leg Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <Input
            label="Notes (optional)"
            placeholder="How did the workout feel?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Add Exercise */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                options={[
                  { value: "", label: "Select an exercise..." },
                  ...exercises.map((e) => ({
                    value: e.id,
                    label: `${e.name} (${e.muscleGroup})`,
                  })),
                ]}
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              />
            </div>
            <Button onClick={addExercise} disabled={!selectedExercise}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {workoutExercises.map((exercise, exIndex) => (
              <div
                key={exIndex}
                className="rounded-lg border border-gray-800 p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{exercise.exerciseName}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(exIndex)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {/* Sets */}
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-sm text-gray-400">
                    <div className="col-span-2">Set</div>
                    <div className="col-span-4">Reps</div>
                    <div className="col-span-4">Weight (lbs)</div>
                    <div className="col-span-2"></div>
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="grid grid-cols-12 items-center gap-2"
                    >
                      <div className="col-span-2">
                        <Badge variant="secondary">{setIndex + 1}</Badge>
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(
                              exIndex,
                              setIndex,
                              "reps",
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) =>
                            updateSet(
                              exIndex,
                              setIndex,
                              "weight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        {exercise.sets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSet(exIndex, setIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => addSet(exIndex)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Set
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {workoutExercises.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No exercises added yet. Select an exercise above to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
