import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";
export type Goal =
  | "lose_weight"
  | "build_muscle"
  | "improve_endurance"
  | "increase_flexibility"
  | "general_fitness"
  | "sport_performance";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active";
export type WorkoutType =
  | "strength"
  | "cardio"
  | "hiit"
  | "yoga"
  | "pilates"
  | "crossfit"
  | "running"
  | "swimming";
export type WorkoutLocation = "gym" | "home" | "both";
export type PreferredTime = "morning" | "afternoon" | "evening" | "flexible";

export interface OnboardingData {
  // Step 1 — personal
  firstName: string;
  lastName: string;
  dateOfBirth: string;   // ISO: YYYY-MM-DD
  gender: Gender | null;

  // Step 2 — goals
  goals: Goal[];

  // Step 3 — fitness
  fitnessLevel: FitnessLevel | null;
  activityLevel: ActivityLevel | null;
  heightCm: string;
  weightKg: string;

  // Step 4 — preferences
  workoutTypes: WorkoutType[];
  workoutLocation: WorkoutLocation | null;

  // Step 5 — schedule
  daysPerWeek: number;
  preferredTime: PreferredTime | null;
  sessionDurationMinutes: number;
}

// Shape the API payload your Node.js backend will receive
export interface OnboardingPayload {
  role: "client";
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender | null;
    heightCm: number;
    weightKg: number;
  };
  fitness: {
    goals: Goal[];
    fitnessLevel: FitnessLevel | null;
    activityLevel: ActivityLevel | null;
    workoutTypes: WorkoutType[];
    workoutLocation: WorkoutLocation | null;
  };
  schedule: {
    daysPerWeek: number;
    preferredTime: PreferredTime | null;
    sessionDurationMinutes: number;
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface OnboardingContextType {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  toggleGoal: (goal: Goal) => void;
  toggleWorkoutType: (type: WorkoutType) => void;
  submitOnboarding: () => Promise<void>;
  isSubmitting: boolean;
}

const initialData: OnboardingData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: null,
  goals: [],
  fitnessLevel: null,
  activityLevel: null,
  heightCm: "",
  weightKg: "",
  workoutTypes: [],
  workoutLocation: null,
  daysPerWeek: 3,
  preferredTime: null,
  sessionDurationMinutes: 45,
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: initialData,
  update: () => {},
  toggleGoal: () => {},
  toggleWorkoutType: () => {},
  submitOnboarding: async () => {},
  isSubmitting: false,
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (patch: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const toggleGoal = (goal: Goal) =>
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));

  const toggleWorkoutType = (type: WorkoutType) =>
    setData((prev) => ({
      ...prev,
      workoutTypes: prev.workoutTypes.includes(type)
        ? prev.workoutTypes.filter((t) => t !== type)
        : [...prev.workoutTypes, type],
    }));

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    try {
      const payload: OnboardingPayload = {
        role: "client",
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          heightCm: parseFloat(data.heightCm) || 0,
          weightKg: parseFloat(data.weightKg) || 0,
        },
        fitness: {
          goals: data.goals,
          fitnessLevel: data.fitnessLevel,
          activityLevel: data.activityLevel,
          workoutTypes: data.workoutTypes,
          workoutLocation: data.workoutLocation,
        },
        schedule: {
          daysPerWeek: data.daysPerWeek,
          preferredTime: data.preferredTime,
          sessionDurationMinutes: data.sessionDurationMinutes,
        },
      };

      // TODO: replace with real API call once Node.js backend is ready
      // await api.post('/onboarding/client', payload);
      console.log("Onboarding payload:", JSON.stringify(payload, null, 2));

      router.replace("/(tabs)/home/index");
    } catch (err) {
      console.error("Onboarding submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ data, update, toggleGoal, toggleWorkoutType, submitOnboarding, isSubmitting }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
