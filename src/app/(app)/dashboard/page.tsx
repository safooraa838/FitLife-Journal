
"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { PageTitle } from "@/components/PageTitle";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { useFirebase } from "@/contexts/FirebaseProvider";
import { getMeals, getWorkouts } from "@/lib/firebase/firestore";
import type { Meal, Workout } from "@/types";
import { AppSpinner } from "@/components/AppSpinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useFirebase();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const [fetchedMeals, fetchedWorkouts] = await Promise.all([
            getMeals(user.uid),
            getWorkouts(user.uid),
          ]);
          setMeals(fetchedMeals);
          setWorkouts(fetchedWorkouts);
        } catch (e: any) {
          console.error("Error fetching data:", e);
          setError("Failed to load dashboard data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <AppSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" icon={LayoutDashboard} />
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}
      <ProgressChart meals={meals} workouts={workouts} />
       {!loading && meals.length === 0 && workouts.length === 0 && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to FitLife Journal!</CardTitle>
            <CardDescription>Start your fitness journey by logging your activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Log your workouts and meals to see your progress here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
