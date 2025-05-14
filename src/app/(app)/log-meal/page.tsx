
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Apple, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/PageTitle";
import { useToast } from "@/hooks/use-toast";
import { MealSchema, type MealFormData } from "@/lib/validators";
import { addMeal } from "@/lib/firebase/firestore";
import { useFirebase } from "@/contexts/FirebaseProvider";
import { AppSpinner } from "@/components/AppSpinner";
import { cn } from "@/lib/utils";

export default function LogMealPage() {
  const { user } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MealFormData>({
    resolver: zodResolver(MealSchema),
    defaultValues: {
      foodItems: "",
      calories: 0,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      date: new Date(),
    },
  });

  async function onSubmit(values: MealFormData) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to log a meal.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await addMeal(user.uid, values);
      toast({ title: "Meal Logged!", description: "Your meal has been successfully saved." });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Logging Failed",
        description: error.message || "Could not save your meal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Log Meal" icon={Apple} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Meal Entry</CardTitle>
          <CardDescription>Record the details of your meal, including food items and nutritional information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="foodItems"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Items</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Chicken breast, Brown rice, Broccoli" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="300" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-1.5">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">Optional Macros (in grams):</p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? <AppSpinner size="sm" className="mr-2" /> : null}
                Log Meal
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

