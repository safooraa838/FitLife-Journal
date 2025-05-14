
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppSpinner } from "@/components/AppSpinner";
import { workoutSuggestion, type WorkoutSuggestionInput, type WorkoutSuggestionOutput } from "@/ai/flows/workout-suggestion";

const FormSchema = z.object({
  fitnessGoals: z.string().min(1, "Fitness goals are required."),
  pastWorkoutHistory: z.string().min(1, "Past workout history is required."),
  availableEquipment: z.string().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});
type FormData = z.infer<typeof FormSchema>;

export function WorkoutSuggestionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<WorkoutSuggestionOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fitnessGoals: "",
      pastWorkoutHistory: "",
      availableEquipment: "",
      experienceLevel: "beginner",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await workoutSuggestion(values as WorkoutSuggestionInput);
      setSuggestion(result);
      toast({ title: "Suggestion Ready!", description: "Your personalized workout suggestion is here." });
    } catch (error: any) {
      toast({
        title: "Suggestion Failed",
        description: error.message || "Could not get workout suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Workout Suggestion</CardTitle>
        <CardDescription>Fill in your details to receive an AI-powered workout suggestion.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fitnessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goals</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lose weight, build muscle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pastWorkoutHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Workout History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Cardio 3 times a week, some light lifting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableEquipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Equipment (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dumbbells, resistance bands, treadmill" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <AppSpinner size="sm" className="mr-2" /> : null}
              Get Suggestion
            </Button>
          </form>
        </Form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex-col items-start gap-4 pt-6">
          <h3 className="text-lg font-semibold">Your Workout Suggestion:</h3>
          <p className="text-sm whitespace-pre-wrap">{suggestion.workoutSuggestion}</p>
          <h4 className="text-md font-semibold">Reasoning:</h4>
          <p className="text-sm whitespace-pre-wrap">{suggestion.reasoning}</p>
        </CardFooter>
      )}
    </Card>
  );
}
