
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Workout, Meal, WorkoutFormData, MealFormData } from "@/types";

const WORKOUTS_COLLECTION = "workouts";
const MEALS_COLLECTION = "meals";

// Add Workout
export const addWorkout = async (userId: string, data: WorkoutFormData): Promise<string> => {
  if (!db) throw new Error("Firestore not initialized");
  const workoutData: Omit<Workout, "id" | "createdAt"> & { createdAt: any } = {
    userId,
    exerciseType: data.exerciseType,
    duration: data.duration,
    intensity: data.intensity as Workout["intensity"],
    date: Timestamp.fromDate(data.date),
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "users", userId, WORKOUTS_COLLECTION), workoutData);
  return docRef.id;
};

// Get Workouts
export const getWorkouts = async (userId: string): Promise<Workout[]> => {
  if (!db) throw new Error("Firestore not initialized");
  const q = query(
    collection(db, "users", userId, WORKOUTS_COLLECTION),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Workout));
};

// Add Meal
export const addMeal = async (userId: string, data: MealFormData): Promise<string> => {
  if (!db) throw new Error("Firestore not initialized");
  const mealData: Omit<Meal, "id" | "createdAt"> & { createdAt: any } = {
    userId,
    foodItems: data.foodItems,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    date: Timestamp.fromDate(data.date),
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "users", userId, MEALS_COLLECTION), mealData);
  return docRef.id;
};

// Get Meals
export const getMeals = async (userId: string): Promise<Meal[]> => {
  if (!db) throw new Error("Firestore not initialized");
  const q = query(
    collection(db, "users", userId, MEALS_COLLECTION),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Meal));
};
