'use server';

/**
 * @fileOverview Identifies thematic connections between journal entries.
 *
 * - identifyThematicConnections - A function that handles the identification of thematic connections.
 * - IdentifyThematicConnectionsInput - The input type for the identifyThematicConnections function.
 * - IdentifyThematicConnectionsOutput - The return type for the identifyThematicConnections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyThematicConnectionsInputSchema = z.object({
  journalEntries: z.array(
    z.string().describe('A past journal entry.')
  ).describe('An array of past journal entries to analyze.'),
});
export type IdentifyThematicConnectionsInput = z.infer<typeof IdentifyThematicConnectionsInputSchema>;

const IdentifyThematicConnectionsOutputSchema = z.object({
  themes: z.array(
    z.string().describe('A common theme identified across the journal entries.')
  ).describe('An array of thematic connections identified in the journal entries.'),
});
export type IdentifyThematicConnectionsOutput = z.infer<typeof IdentifyThematicConnectionsOutputSchema>;

export async function identifyThematicConnections(input: IdentifyThematicConnectionsInput): Promise<IdentifyThematicConnectionsOutput> {
  return identifyThematicConnectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyThematicConnectionsPrompt',
  input: {schema: IdentifyThematicConnectionsInputSchema},
  output: {schema: IdentifyThematicConnectionsOutputSchema},
  prompt: `You are an AI journal analyst.  Your job is to analyze a series of journal entries and identify common themes. Do not include any introductory or concluding remarks. Only give the list of themes.

Journal Entries:
{{#each journalEntries}}
- {{{this}}}
{{/each}}
`,
});

const identifyThematicConnectionsFlow = ai.defineFlow(
  {
    name: 'identifyThematicConnectionsFlow',
    inputSchema: IdentifyThematicConnectionsInputSchema,
    outputSchema: IdentifyThematicConnectionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
