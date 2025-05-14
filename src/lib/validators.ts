
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
export type LoginFormData = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});
export type SignupFormData = z.infer<typeof SignupSchema>;

export const WorkoutSchema = z.object({
  exerciseType: z.string().min(1, { message: "Exercise type is required." }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1 minute." }),
  intensity: z.enum(["low", "medium", "high"], { message: "Intensity is required." }),
  date: z.date({ required_error: "Date is required." }),
});
export type WorkoutFormData = z.infer<typeof WorkoutSchema>;

export const MealSchema = z.object({
  foodItems: z.string().min(1, { message: "Food items are required." }),
  calories: z.coerce.number().min(0, { message: "Calories must be a positive number." }),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  date: z.date({ required_error: "Date is required." }),
});
export type MealFormData = z.infer<typeof MealSchema>;

export const ProfileSchema = z.object({
  displayName: z.string().optional(),
  fitnessGoals: z.string().optional(),
  dietaryPreferences: z.string().optional(),
});
export type ProfileFormData = z.infer<typeof ProfileSchema>;
