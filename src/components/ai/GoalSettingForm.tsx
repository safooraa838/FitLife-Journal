
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AppSpinner } from "@/components/AppSpinner";
import { goalSettingAssistant, type GoalSettingAssistantInput, type GoalSettingAssistantOutput } from "@/ai/flows/goal-setting-assistant";

const FormSchema = z.object({
  currentActivityLevel: z.string().min(1, "Current activity level is required."),
  desiredOutcomes: z.string().min(1, "Desired outcomes are required."),
});
type FormData = z.infer<typeof FormSchema>;

export function GoalSettingForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<GoalSettingAssistantOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      currentActivityLevel: "",
      desiredOutcomes: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await goalSettingAssistant(values as GoalSettingAssistantInput);
      setSuggestion(result);
      toast({ title: "Goals Suggested!", description: "AI has helped set some fitness goals for you." });
    } catch (error: any) {
      toast({
        title: "Goal Setting Failed",
        description: error.message || "Could not get goal suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Goal Setting Assistant</CardTitle>
        <CardDescription>Let AI help you set realistic and achievable fitness goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentActivityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Activity Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sedentary, Lightly Active, Moderately Active" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desiredOutcomes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Fitness Outcomes</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lose 10 lbs, run a 5k, feel more energetic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <AppSpinner size="sm" className="mr-2" /> : null}
              Suggest Goals
            </Button>
          </form>
        </Form>
      </CardContent>
      {suggestion && (
        <CardFooter className="flex-col items-start gap-4 pt-6">
          <h3 className="text-lg font-semibold">Suggested Goals:</h3>
          <p className="text-sm whitespace-pre-wrap">{suggestion.suggestedGoals}</p>
        </CardFooter>
      )}
    </Card>
  );
}
