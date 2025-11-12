"use client";

import { useMemo } from "react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from 'firebase/firestore';
import { generateMoodInsights } from "@/ai/flows/generate-mood-insights";
import type { JournalEntry } from "@/lib/types";
import { PageTransition } from "@/components/page-transition";
import { MoodChart } from "@/components/mood-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function InsightsPage() {
  const { user, firestore } = useFirebase();
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const entriesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'journalEntries');
  }, [user, firestore]);

  const { data: entries, isLoading: loadingEntries } = useCollection<JournalEntry>(entriesQuery);

  const entriesWithDates = useMemo(() => {
    if (!entries) return [];
    return entries.map(e => {
        let date;
        if (e.createdAt instanceof Timestamp) {
            date = e.createdAt.toDate();
        } else if (e.createdAt && typeof e.createdAt === 'object' && 'seconds' in e.createdAt) {
            date = new Timestamp((e.createdAt as any).seconds, (e.createdAt as any).nanoseconds).toDate();
        }
        else if(e.createdAt) {
            date = new Date(e.createdAt as any);
        } else {
            date = new Date();
        }
        return { ...e, createdAt: date };
    })
  }, [entries]);

  useEffect(() => {
    async function fetchInsights() {
      if (!entriesWithDates || entriesWithDates.length < 2) {
        setInsights(null);
        return;
      };
      setLoadingInsights(true);
      try {
        const allEntriesContent = entriesWithDates.map(e => `Date: ${new Date(e.createdAt).toISOString().split('T')[0]}\n${e.content}`).join('\n\n---\n\n');
        const moodInsightsResult = await generateMoodInsights({ journalEntries: allEntriesContent });
        setInsights(moodInsightsResult.moodInsights);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
        setInsights("Could not load AI insights at this time.");
      } finally {
        setLoadingInsights(false);
      }
    }
    fetchInsights();
  }, [entriesWithDates]);

  const loading = loadingEntries || loadingInsights;

  return (
    <PageTransition>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
          <BarChart3 className="mr-2 h-6 w-6"/>
          Mood Insights
        </h1>
      </div>
      <div className="grid gap-6 mt-4 md:grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          {loadingEntries ? <Skeleton className="h-[350px] w-full" /> : <MoodChart entries={entriesWithDates || []} />}
        </div>
        
        <Card className="lg:col-span-2 glassmorphism">
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
