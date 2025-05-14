// nutrition-suggestion.ts
'use server';

/**
 * @fileOverview Provides nutrition suggestions based on user dietary preferences, logged meals, and fitness goals.
 *
 * - nutritionSuggestion - A function that generates nutrition suggestions.
 * - NutritionSuggestionInput - The input type for the nutritionSuggestion function.
 * - NutritionSuggestionOutput - The return type for the nutritionSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionSuggestionInputSchema = z.object({
  dietaryPreferences: z
    .string()
    .describe('The user\u0027s dietary preferences (e.g., vegetarian, vegan, gluten-free).'),
  loggedMeals: z.string().describe('A list of the user\u0027s logged meals, including food items and estimated calorie/macro values.'),
  fitnessGoals: z.string().describe('The user\u0027s fitness goals (e.g., lose weight, gain muscle, maintain weight).'),
});

export type NutritionSuggestionInput = z.infer<typeof NutritionSuggestionInputSchema>;

const NutritionSuggestionOutputSchema = z.object({
  suggestions: z.string().describe('A list of nutrition suggestions tailored to the user\u0027s preferences, meals, and goals.'),
});

export type NutritionSuggestionOutput = z.infer<typeof NutritionSuggestionOutputSchema>;

export async function nutritionSuggestion(input: NutritionSuggestionInput): Promise<NutritionSuggestionOutput> {
  return nutritionSuggestionFlow(input);
}

const nutritionSuggestionPrompt = ai.definePrompt({
  name: 'nutritionSuggestionPrompt',
  input: {schema: NutritionSuggestionInputSchema},
  output: {schema: NutritionSuggestionOutputSchema},
  prompt: `You are a nutrition expert. Provide nutrition suggestions based on the following information:

Dietary Preferences: {{{dietaryPreferences}}}
Logged Meals: {{{loggedMeals}}}
Fitness Goals: {{{fitnessGoals}}}

Provide a list of nutrition suggestions that are tailored to the user's preferences, meals, and goals.`,
});

const nutritionSuggestionFlow = ai.defineFlow(
  {
    name: 'nutritionSuggestionFlow',
    inputSchema: NutritionSuggestionInputSchema,
    outputSchema: NutritionSuggestionOutputSchema,
  },
  async input => {
    const {output} = await nutritionSuggestionPrompt(input);
    return output!;
  }
);
