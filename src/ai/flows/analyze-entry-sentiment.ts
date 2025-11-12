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
  sentiment: z.string().describe('A single, descriptive word for the primary emotion of the journal entry (e.g., Happy, Sad, Angry, Hopeful, Tired, Anxious, Grateful).'),
  score: z.number().describe('A numerical score from -1.0 to 1.0, where -1.0 is very negative, 0 is neutral, and 1.0 is very positive.'),
});
export type AnalyzeEntrySentimentOutput = z.infer<typeof AnalyzeEntrySentimentOutputSchema>;

export async function analyzeEntrySentiment(input: AnalyzeEntrySentimentInput): Promise<AnalyzeEntrySentimentOutput> {
  return analyzeEntrySentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEntrySentimentPrompt',
  input: {schema: AnalyzeEntrySentimentInputSchema},
  output: {schema: AnalyzeEntrySentimentOutputSchema},
  prompt: `Analyze the sentiment of the following journal entry. Provide a single, descriptive word for the primary emotion (e.g., Happy, Sad, Angry, Hopeful, Tired, Anxious, Grateful). Also, provide a numerical score from -1.0 to 1.0, where -1.0 is very negative, 0 is neutral, and 1.0 is very positive:\n\n{{{journalEntry}}}`,
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
