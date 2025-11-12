'use server';

/**
 * @fileOverview Analyzes the sentiment of a journal entry.
 *
 * It includes:
 * - analyzeEntrySentiment - A function to trigger the sentiment analysis flow.
 * - AnalyzeEntrySentimentInput - The input type for the analyzeEntrySentiment function.
 * - AnalyzeEntrySentimentOutput - The output type for the analyzeEntrySentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEntrySentimentInputSchema = z.object({
  journalEntry: z.string().describe('The journal entry to analyze.'),
});
export type AnalyzeEntrySentimentInput = z.infer<typeof AnalyzeEntrySentimentInputSchema>;

const AnalyzeEntrySentimentOutputSchema = z.object({
  sentiment: z.string().describe('The sentiment of the journal entry.'),
  score: z.number().describe('A numerical score indicating the sentiment strength.'),
});
export type AnalyzeEntrySentimentOutput = z.infer<typeof AnalyzeEntrySentimentOutputSchema>;

export async function analyzeEntrySentiment(input: AnalyzeEntrySentimentInput): Promise<AnalyzeEntrySentimentOutput> {
  return analyzeEntrySentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEntrySentimentPrompt',
  input: {schema: AnalyzeEntrySentimentInputSchema},
  output: {schema: AnalyzeEntrySentimentOutputSchema},
  prompt: `Analyze the sentiment of the following journal entry. Provide both the sentiment (positive, negative, or neutral) and a numerical score from -1 to 1, where -1 is very negative, 0 is neutral, and 1 is very positive:\n\n{{{journalEntry}}}`,
});

const analyzeEntrySentimentFlow = ai.defineFlow(
  {
    name: 'analyzeEntrySentimentFlow',
    inputSchema: AnalyzeEntrySentimentInputSchema,
    outputSchema: AnalyzeEntrySentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
