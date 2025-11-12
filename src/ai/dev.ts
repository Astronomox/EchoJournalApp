import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mood-insights.ts';
import '@/ai/flows/identify-thematic-connections.ts';
import '@/ai/flows/summarize-journal-entry.ts';
import '@/ai/flows/generate-themes-from-entries.ts';
import '@/ai/flows/analyze-entry-sentiment.ts';
import '@/ai/flows/summarize-journal-entries.ts';