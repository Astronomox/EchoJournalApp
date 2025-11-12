"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase";
import { getJournalEntries } from "@/lib/actions";
import { generateMoodInsights } from "@/ai/flows/generate-mood-insights";
import type { JournalEntry } from "@/lib/types";
import { PageTransition } from "@/components/page-transition";
import { MoodChart } from "@/components/mood-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InsightsPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        const fetchedEntries = await getJournalEntries(user.uid);
        setEntries(fetchedEntries);

        if (fetchedEntries.length > 1) {
            const allEntriesContent = fetchedEntries.map(e => `Date: ${e.createdAt.toISOString().split('T')[0]}\n${e.content}`).join('\n\n---\n\n');
            const moodInsightsResult = await generateMoodInsights({ journalEntries: allEntriesContent });
            setInsights(moodInsightsResult.moodInsights);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
        setInsights("Could not load AI insights at this time.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  return (
    <PageTransition>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
          <BarChart3 className="mr-2 h-6 w-6"/>
          Mood Insights
        </h1>
      </div>
      <div className="grid gap-6 mt-4 md:grid-cols-2">
        <div className="md:col-span-2">
          {loading ? <Skeleton className="h-[350px] w-full" /> : <MoodChart entries={entries} />}
        </div>
        
        <Card className="md:col-span-2 glassmorphism">
          <CardHeader>
            <CardTitle>AI-Powered Summary</CardTitle>
            <CardDescription>
              An analysis of your recent mood trends and topics based on your journal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            ) : insights ? (
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{insights}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data for an AI summary. Write a few more entries!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
