'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating themes from journal entries.
 *
 * It includes:
 * - generateThemesFromEntries: A function to trigger the theme generation flow.
 * - GenerateThemesFromEntriesInput: The input type for the generateThemesFromEntries function.
 * - GenerateThemesFromEntriesOutput: The output type for the generateThemesFromEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThemesFromEntriesInputSchema = z.object({
  journalEntries: z
    .string()
    .describe('A string containing all journal entries to analyze for themes.'),
});
export type GenerateThemesFromEntriesInput = z.infer<typeof GenerateThemesFromEntriesInputSchema>;

const GenerateThemesFromEntriesOutputSchema = z.object({
  themes: z
    .string()
    .describe('A list of thematic connections identified in the journal entries.'),
});
export type GenerateThemesFromEntriesOutput = z.infer<typeof GenerateThemesFromEntriesOutputSchema>;

export async function generateThemesFromEntries(input: GenerateThemesFromEntriesInput): Promise<GenerateThemesFromEntriesOutput> {
  return generateThemesFromEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemesFromEntriesPrompt',
  input: {schema: GenerateThemesFromEntriesInputSchema},
  output: {schema: GenerateThemesFromEntriesOutputSchema},
  prompt: `Analyze the following journal entries and identify recurring themes or topics:\n\n{{{journalEntries}}}`,
});

const generateThemesFromEntriesFlow = ai.defineFlow(
  {
    name: 'generateThemesFromEntriesFlow',
    inputSchema: GenerateThemesFromEntriesInputSchema,
    outputSchema: GenerateThemesFromEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
