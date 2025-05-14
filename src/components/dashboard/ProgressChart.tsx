
"use client";

import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Meal, Workout } from "@/types";
import { format, parseISO } from "date-fns";

interface ProgressChartProps {
  meals: Meal[];
  workouts: Workout[];
}

interface ChartDataPoint {
  date: string;
  calories?: number;
  workoutDuration?: number;
  workoutCount?: number;
}

export function ProgressChart({ meals, workouts }: ProgressChartProps) {
  const aggregateDataByDate = (): ChartDataPoint[] => {
    const dataMap = new Map<string, ChartDataPoint>();

    meals.forEach(meal => {
      const dateStr = format(meal.date.toDate(), "yyyy-MM-dd");
      const entry = dataMap.get(dateStr) || { date: dateStr, calories: 0, workoutDuration: 0, workoutCount: 0 };
      entry.calories = (entry.calories || 0) + meal.calories;
      dataMap.set(dateStr, entry);
    });

    workouts.forEach(workout => {
      const dateStr = format(workout.date.toDate(), "yyyy-MM-dd");
      const entry = dataMap.get(dateStr) || { date: dateStr, calories: 0, workoutDuration: 0, workoutCount: 0 };
      entry.workoutDuration = (entry.workoutDuration || 0) + workout.duration;
      entry.workoutCount = (entry.workoutCount || 0) + 1;
      dataMap.set(dateStr, entry);
    });
    
    return Array.from(dataMap.values()).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  };

  const chartData = aggregateDataByDate();
  const recentData = chartData.slice(-30); // Show last 30 data points

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} style={{ color: entry.color }} className="text-xs">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calorie Intake Over Time</CardTitle>
          <CardDescription>Daily calorie consumption from logged meals.</CardDescription>
        </CardHeader>
        <CardContent>
          {recentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), "MMM d")} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} name="Calories" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground">Log some meals to see your calorie intake progress.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Duration Over Time</CardTitle>
          <CardDescription>Total workout duration logged daily.</CardDescription>
        </CardHeader>
        <CardContent>
           {recentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(str) => format(parseISO(str), "MMM d")} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="workoutDuration" fill="hsl(var(--chart-2))" name="Workout Duration (min)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <p className="text-center text-muted-foreground">Log some workouts to see your progress.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
