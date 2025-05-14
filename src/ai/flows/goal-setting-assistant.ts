// GoalSettingAssistant.ts
'use server';

/**
 * @fileOverview An AI assistant to help users set realistic and achievable fitness goals.
 *
 * - goalSettingAssistant - A function that provides fitness goal suggestions.
 * - GoalSettingAssistantInput - The input type for the goalSettingAssistant function.
 * - GoalSettingAssistantOutput - The return type for the goalSettingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GoalSettingAssistantInputSchema = z.object({
  currentActivityLevel: z
    .string()
    .describe(
      'The user’s current activity level (e.g., sedentary, lightly active, moderately active, very active).' ),
  desiredOutcomes: z
    .string()
    .describe('The user’s desired fitness outcomes (e.g., weight loss, muscle gain, improved endurance).'),
});
export type GoalSettingAssistantInput = z.infer<typeof GoalSettingAssistantInputSchema>;

const GoalSettingAssistantOutputSchema = z.object({
  suggestedGoals: z
    .string()
    .describe('AI-suggested realistic and achievable fitness goals based on the user’s input.'),
});
export type GoalSettingAssistantOutput = z.infer<typeof GoalSettingAssistantOutputSchema>;

export async function goalSettingAssistant(input: GoalSettingAssistantInput): Promise<GoalSettingAssistantOutput> {
  return goalSettingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalSettingAssistantPrompt',
  input: {schema: GoalSettingAssistantInputSchema},
  output: {schema: GoalSettingAssistantOutputSchema},
  prompt: `You are a personal fitness assistant. A user will provide their current activity level and desired outcomes, and you will help them set realistic and achievable goals.

Current Activity Level: {{{currentActivityLevel}}}
Desired Outcomes: {{{desiredOutcomes}}}

Based on this information, suggest some SMART (Specific, Measurable, Achievable, Relevant, Time-bound) fitness goals for the user. Return the goals in a single paragraph. Do not include any introductory or concluding sentences.`,
});

const goalSettingAssistantFlow = ai.defineFlow(
  {
    name: 'goalSettingAssistantFlow',
    inputSchema: GoalSettingAssistantInputSchema,
    outputSchema: GoalSettingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
