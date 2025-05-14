
import { Sparkles } from "lucide-react";

import { PageTitle } from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkoutSuggestionForm } from "@/components/ai/WorkoutSuggestionForm";
import { NutritionSuggestionForm } from "@/components/ai/NutritionSuggestionForm";
import { GoalSettingForm } from "@/components/ai/GoalSettingForm";

export default function AISuggestionsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="AI Powered Suggestions" icon={Sparkles} />
      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="goals">Goal Setting</TabsTrigger>
        </TabsList>
        <TabsContent value="workout" className="mt-6">
          <WorkoutSuggestionForm />
        </TabsContent>
        <TabsContent value="nutrition" className="mt-6">
          <NutritionSuggestionForm />
        </TabsContent>
        <TabsContent value="goals" className="mt-6">
          <GoalSettingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
