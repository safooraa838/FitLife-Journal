
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  id: string;
  email: string | null;
  displayName?: string | null;
  fitnessGoals?: string;
  dietaryPreferences?: string;
  // We avoid storing PII, but some non-sensitive preferences can be here
}

export type WorkoutIntensity = "low" | "medium" | "high";

export interface Workout {
  id?: string;
  userId: string;
  exerciseType: string;
  duration: number; // in minutes
  intensity: WorkoutIntensity;
  date: Timestamp; // Firestore Timestamp
  createdAt: Timestamp;
}

export interface Meal {
  id?: string;
  userId: string;
  foodItems: string; // Could be a comma-separated list or JSON string
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  date: Timestamp; // Firestore Timestamp
  createdAt: Timestamp;
}
