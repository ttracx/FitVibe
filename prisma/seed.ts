import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // CHEST
  { name: "Bench Press", muscleGroup: "CHEST", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Classic compound movement for chest development" },
  { name: "Incline Bench Press", muscleGroup: "CHEST", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Targets upper chest" },
  { name: "Dumbbell Flyes", muscleGroup: "CHEST", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Isolation movement for chest stretch" },
  { name: "Push-ups", muscleGroup: "CHEST", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Fundamental bodyweight chest exercise" },
  { name: "Cable Crossover", muscleGroup: "CHEST", equipment: "CABLE", difficulty: "INTERMEDIATE", description: "Great for chest isolation and stretch" },
  { name: "Dumbbell Press", muscleGroup: "CHEST", equipment: "DUMBBELL", difficulty: "INTERMEDIATE", description: "Allows greater range of motion than barbell" },
  { name: "Decline Bench Press", muscleGroup: "CHEST", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Targets lower chest" },
  { name: "Chest Dips", muscleGroup: "CHEST", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Bodyweight compound for lower chest" },

  // BACK
  { name: "Deadlift", muscleGroup: "BACK", equipment: "BARBELL", difficulty: "ADVANCED", description: "King of all exercises for posterior chain" },
  { name: "Pull-ups", muscleGroup: "BACK", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Classic vertical pull movement" },
  { name: "Barbell Row", muscleGroup: "BACK", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Heavy compound for back thickness" },
  { name: "Lat Pulldown", muscleGroup: "BACK", equipment: "CABLE", difficulty: "BEGINNER", description: "Machine alternative to pull-ups" },
  { name: "Seated Cable Row", muscleGroup: "BACK", equipment: "CABLE", difficulty: "BEGINNER", description: "Great for mid-back development" },
  { name: "Dumbbell Row", muscleGroup: "BACK", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Unilateral back exercise" },
  { name: "T-Bar Row", muscleGroup: "BACK", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Compound movement for back thickness" },
  { name: "Face Pulls", muscleGroup: "BACK", equipment: "CABLE", difficulty: "BEGINNER", description: "Great for rear delts and upper back" },

  // SHOULDERS
  { name: "Overhead Press", muscleGroup: "SHOULDERS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Primary shoulder compound movement" },
  { name: "Lateral Raises", muscleGroup: "SHOULDERS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Isolation for side deltoids" },
  { name: "Front Raises", muscleGroup: "SHOULDERS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Targets front deltoids" },
  { name: "Arnold Press", muscleGroup: "SHOULDERS", equipment: "DUMBBELL", difficulty: "INTERMEDIATE", description: "Rotational press for all delt heads" },
  { name: "Reverse Flyes", muscleGroup: "SHOULDERS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Targets rear deltoids" },
  { name: "Upright Row", muscleGroup: "SHOULDERS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Compound for shoulders and traps" },

  // BICEPS
  { name: "Barbell Curl", muscleGroup: "BICEPS", equipment: "BARBELL", difficulty: "BEGINNER", description: "Classic bicep builder" },
  { name: "Dumbbell Curl", muscleGroup: "BICEPS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Allows supination for peak contraction" },
  { name: "Hammer Curl", muscleGroup: "BICEPS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Targets brachialis for arm thickness" },
  { name: "Preacher Curl", muscleGroup: "BICEPS", equipment: "DUMBBELL", difficulty: "INTERMEDIATE", description: "Strict isolation for biceps" },
  { name: "Concentration Curl", muscleGroup: "BICEPS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Maximum bicep isolation" },
  { name: "Cable Curl", muscleGroup: "BICEPS", equipment: "CABLE", difficulty: "BEGINNER", description: "Constant tension throughout movement" },

  // TRICEPS
  { name: "Tricep Pushdown", muscleGroup: "TRICEPS", equipment: "CABLE", difficulty: "BEGINNER", description: "Classic tricep isolation" },
  { name: "Skull Crushers", muscleGroup: "TRICEPS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Targets long head of triceps" },
  { name: "Tricep Dips", muscleGroup: "TRICEPS", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Bodyweight tricep builder" },
  { name: "Overhead Tricep Extension", muscleGroup: "TRICEPS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Stretches long head of triceps" },
  { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Compound for tricep mass" },
  { name: "Diamond Push-ups", muscleGroup: "TRICEPS", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Bodyweight tricep focus" },

  // LEGS
  { name: "Squat", muscleGroup: "LEGS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "King of leg exercises" },
  { name: "Leg Press", muscleGroup: "LEGS", equipment: "MACHINE", difficulty: "BEGINNER", description: "Machine compound for quads" },
  { name: "Romanian Deadlift", muscleGroup: "LEGS", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Targets hamstrings and glutes" },
  { name: "Leg Extension", muscleGroup: "LEGS", equipment: "MACHINE", difficulty: "BEGINNER", description: "Quad isolation" },
  { name: "Leg Curl", muscleGroup: "LEGS", equipment: "MACHINE", difficulty: "BEGINNER", description: "Hamstring isolation" },
  { name: "Lunges", muscleGroup: "LEGS", equipment: "DUMBBELL", difficulty: "BEGINNER", description: "Unilateral leg movement" },
  { name: "Calf Raises", muscleGroup: "LEGS", equipment: "MACHINE", difficulty: "BEGINNER", description: "Calf isolation" },
  { name: "Bulgarian Split Squat", muscleGroup: "LEGS", equipment: "DUMBBELL", difficulty: "INTERMEDIATE", description: "Single-leg quad and glute builder" },
  { name: "Hack Squat", muscleGroup: "LEGS", equipment: "MACHINE", difficulty: "INTERMEDIATE", description: "Machine quad emphasis" },
  { name: "Front Squat", muscleGroup: "LEGS", equipment: "BARBELL", difficulty: "ADVANCED", description: "Quad-dominant squat variation" },

  // CORE
  { name: "Plank", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Isometric core stability" },
  { name: "Crunches", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Basic ab flexion" },
  { name: "Leg Raises", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Lower ab emphasis" },
  { name: "Russian Twists", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Rotational core work" },
  { name: "Ab Wheel Rollout", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "ADVANCED", description: "Advanced core stability" },
  { name: "Cable Woodchop", muscleGroup: "CORE", equipment: "CABLE", difficulty: "INTERMEDIATE", description: "Rotational power" },
  { name: "Dead Bug", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Core stability and coordination" },
  { name: "Mountain Climbers", muscleGroup: "CORE", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Dynamic core and cardio" },

  // GLUTES
  { name: "Hip Thrust", muscleGroup: "GLUTES", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Best glute isolation exercise" },
  { name: "Glute Bridge", muscleGroup: "GLUTES", equipment: "BODYWEIGHT", difficulty: "BEGINNER", description: "Bodyweight glute activation" },
  { name: "Cable Kickback", muscleGroup: "GLUTES", equipment: "CABLE", difficulty: "BEGINNER", description: "Glute isolation with constant tension" },
  { name: "Sumo Deadlift", muscleGroup: "GLUTES", equipment: "BARBELL", difficulty: "INTERMEDIATE", description: "Wide stance for more glute activation" },

  // CARDIO
  { name: "Treadmill Running", muscleGroup: "CARDIO", equipment: "CARDIO_MACHINE", difficulty: "BEGINNER", description: "Classic cardio exercise" },
  { name: "Cycling", muscleGroup: "CARDIO", equipment: "CARDIO_MACHINE", difficulty: "BEGINNER", description: "Low-impact cardio" },
  { name: "Rowing Machine", muscleGroup: "CARDIO", equipment: "CARDIO_MACHINE", difficulty: "INTERMEDIATE", description: "Full-body cardio" },
  { name: "Jump Rope", muscleGroup: "CARDIO", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "High-intensity cardio" },
  { name: "Burpees", muscleGroup: "CARDIO", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Full-body cardio movement" },
  { name: "Stair Climber", muscleGroup: "CARDIO", equipment: "CARDIO_MACHINE", difficulty: "INTERMEDIATE", description: "Lower body focused cardio" },
  { name: "Battle Ropes", muscleGroup: "CARDIO", equipment: "BODYWEIGHT", difficulty: "INTERMEDIATE", description: "Upper body cardio" },

  // FULL_BODY
  { name: "Clean and Press", muscleGroup: "FULL_BODY", equipment: "BARBELL", difficulty: "ADVANCED", description: "Olympic lift variation" },
  { name: "Kettlebell Swing", muscleGroup: "FULL_BODY", equipment: "KETTLEBELL", difficulty: "INTERMEDIATE", description: "Explosive hip hinge movement" },
  { name: "Thrusters", muscleGroup: "FULL_BODY", equipment: "DUMBBELL", difficulty: "INTERMEDIATE", description: "Squat to press combination" },
  { name: "Turkish Get-up", muscleGroup: "FULL_BODY", equipment: "KETTLEBELL", difficulty: "ADVANCED", description: "Complex full-body movement" },
  { name: "Man Makers", muscleGroup: "FULL_BODY", equipment: "DUMBBELL", difficulty: "ADVANCED", description: "Burpee with row and press" },
];

async function main() {
  console.log("Seeding exercises...");

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: {
        name_muscleGroup: {
          name: exercise.name,
          muscleGroup: exercise.muscleGroup as any,
        },
      },
      update: {},
      create: {
        name: exercise.name,
        description: exercise.description,
        muscleGroup: exercise.muscleGroup as any,
        equipment: exercise.equipment as any,
        difficulty: exercise.difficulty as any,
      },
    });
  }

  console.log(`Seeded ${exercises.length} exercises`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
