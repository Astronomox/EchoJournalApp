'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating mood insights from journal entries.
 *
 * It includes:
 * - generateMoodInsights: A function to trigger the mood insights generation flow.
 * - GenerateMoodInsightsInput: The input type for the generateMoodInsights function.
 * - GenerateMoodInsightsOutput: The output type for the generateMoodInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodInsightsInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('A string containing all journal entries.'),
});
export type GenerateMoodInsightsInput = z.infer<typeof GenerateMoodInsightsInputSchema>;

const GenerateMoodInsightsOutputSchema = z.object({
  moodInsights: z
    .string()
    .describe('Sentiment analysis of journal entries with mood trends.'),
});
export type GenerateMoodInsightsOutput = z.infer<typeof GenerateMoodInsightsOutputSchema>;

export async function generateMoodInsights(input: GenerateMoodInsightsInput): Promise<GenerateMoodInsightsOutput> {
  return generateMoodInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMoodInsightsPrompt',
  input: {schema: GenerateMoodInsightsInputSchema},
  output: {schema: GenerateMoodInsightsOutputSchema},
  prompt: `Analyze the following journal entries and provide sentiment analysis with mood trends:

{{{journalEntries}}}`,
});

const generateMoodInsightsFlow = ai.defineFlow(
  {
    name: 'generateMoodInsightsFlow',
    inputSchema: GenerateMoodInsightsInputSchema,
    outputSchema: GenerateMoodInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
