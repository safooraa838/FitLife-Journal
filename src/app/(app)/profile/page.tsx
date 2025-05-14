
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/PageTitle";
import { useToast } from "@/hooks/use-toast";
import { ProfileSchema, type ProfileFormData } from "@/lib/validators";
import { updateUserProfileFirebase, getUserProfile } from "@/lib/firebase/auth";
import { useFirebase } from "@/contexts/FirebaseProvider";
import { AppSpinner } from "@/components/AppSpinner";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const { user, loading: authLoading } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: "",
      fitnessGoals: "",
      dietaryPreferences: "",
    },
  });

  useEffect(() => {
    if (user) {
      setIsFetchingProfile(true);
      getUserProfile(user.uid)
        .then((profile) => {
          if (profile) {
            form.reset({
              displayName: user.displayName || profile.displayName || "",
              fitnessGoals: profile.fitnessGoals || "",
              dietaryPreferences: profile.dietaryPreferences || "",
            });
          } else {
             form.reset({
              displayName: user.displayName || "",
              fitnessGoals: "",
              dietaryPreferences: "",
            });
          }
        })
        .catch(error => {
          console.error("Failed to fetch profile:", error);
          toast({ title: "Error", description: "Failed to load profile data.", variant: "destructive"});
        })
        .finally(() => setIsFetchingProfile(false));
    } else if (!authLoading) {
      setIsFetchingProfile(false); // Not logged in, no profile to fetch
    }
  }, [user, form, toast, authLoading]);

  async function onSubmit(values: ProfileFormData) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await updateUserProfileFirebase(user, values);
      toast({ title: "Profile Updated!", description: "Your profile information has been saved." });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading || isFetchingProfile) {
     return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <AppSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Profile" icon={UserIcon} />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>Manage your account details and preferences. Email is managed via Firebase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
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
                      <Textarea placeholder="e.g., Lose 10kg, run a marathon, improve flexibility" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Vegetarian, gluten-free, high protein" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                {isLoading ? <AppSpinner size="sm" className="mr-2" /> : null}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
