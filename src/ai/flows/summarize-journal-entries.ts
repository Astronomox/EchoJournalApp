'use server';

/**
 * @fileOverview Summarizes multiple journal entries based on date ranges or keywords.
 *
 * - summarizeJournalEntries - A function that summarizes the journal entries.
 * - SummarizeJournalEntriesInput - The input type for the summarizeJournalEntries function.
 * - SummarizeJournalEntriesOutput - The return type for the summarizeJournalEntries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJournalEntriesInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      date: z.string().describe('The date of the journal entry.'),
      entry: z.string().describe('The content of the journal entry.'),
    })
  ).describe('An array of journal entries to summarize.'),
  keywords: z.string().optional().describe('Optional keywords to filter the journal entries.'),
  dateRange: z
    .object({
      startDate: z.string().optional().describe('The start date of the range (YYYY-MM-DD).'),
      endDate: z.string().optional().describe('The end date of the range (YYYY-MM-DD).'),
    })
    .optional()
    .describe('Optional date range to filter the journal entries.'),
});

export type SummarizeJournalEntriesInput = z.infer<typeof SummarizeJournalEntriesInputSchema>;

const SummarizeJournalEntriesOutputSchema = z.object({
  summary: z.string().describe('A summary of the journal entries.'),
});

export type SummarizeJournalEntriesOutput = z.infer<typeof SummarizeJournalEntriesOutputSchema>;

export async function summarizeJournalEntries(input: SummarizeJournalEntriesInput): Promise<SummarizeJournalEntriesOutput> {
  return summarizeJournalEntriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJournalEntriesPrompt',
  input: {schema: SummarizeJournalEntriesInputSchema},
  output: {schema: SummarizeJournalEntriesOutputSchema},
  prompt: `Summarize the following journal entries, filtering by keywords "{{{keywords}}}" and date range from "{{{dateRange.startDate}}}" to "{{{dateRange.endDate}}}", if provided:\n\n{{#each journalEntries}}\nDate: {{{date}}}\nEntry: {{{entry}}}\n{{/each}}\n`,
});

const summarizeJournalEntriesFlow = ai.defineFlow(
  {
    name: 'summarizeJournalEntriesFlow',
    inputSchema: SummarizeJournalEntriesInputSchema,
    outputSchema: SummarizeJournalEntriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
