
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppSpinner } from "@/components/AppSpinner";
import { nutritionSuggestion, type NutritionSuggestionInput, type NutritionSuggestionOutput } from "@/ai/flows/nutrition-suggestion";

const FormSchema = z.object({
  dietaryPreferences: z.string().min(1, "Dietary preferences are required."),
  loggedMeals: z.string().min(1, "Logged meals history is required."),
  fitnessGoals: z.string().min(1, "Fitness goals are required."),
});
type FormData = z.infer<typeof FormSchema>;

export function NutritionSuggestionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<NutritionSuggestionOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dietaryPreferences: "",
      loggedMeals: "",
      fitnessGoals: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await nutritionSuggestion(values as NutritionSuggestionInput);
      setSuggestion(result);
      toast({ title: "Suggestion Ready!", description: "Your personalized nutrition suggestion is here." });
    } catch (error: any) {
      toast({
        title: "Suggestion Failed",
        description: error.message || "Could not get nutrition suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Nutrition Suggestion</CardTitle>
        <CardDescription>Provide your dietary info and goals for AI-powered nutrition advice.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preferences</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vegetarian, low-carb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loggedMeals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recent Logged Meals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Breakfast: Oats with berries. Lunch: Chicken salad..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fitnessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goals</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weight loss, muscle gain" {...field} />
                  </FormControl>
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
          <h3 className="text-lg font-semibold">Your Nutrition Suggestions:</h3>
          <p className="text-sm whitespace-pre-wrap">{suggestion.suggestions}</p>
        </CardFooter>
      )}
    </Card>
  );
}
