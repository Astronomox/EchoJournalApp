"use client";

import { useState, useMemo } from "react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { JournalEntry } from "@/lib/types";
import { identifyThematicConnections } from "@/ai/flows/identify-thematic-connections";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EchoPage() {
  const { user, firestore } = useFirebase();
  const [themes, setThemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const entriesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'journalEntries');
  }, [user, firestore]);

  const { data: entries, isLoading: entriesLoading } = useCollection<JournalEntry>(entriesQuery);

  const handleAnalyze = async () => {
    if (!user || !entries) return;
    setLoading(true);
    setError(null);
    setThemes([]);
    try {
      if (entries.length < 2) {
        setError("You need at least two journal entries for Echo mode to find connections.");
        setLoading(false);
        return;
      }
      const entryContents = entries.map(e => e.content);
      const result = await identifyThematicConnections({ journalEntries: entryContents });
      setThemes(result.themes);
    } catch (e) {
      setError("An error occurred while analyzing your journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
            <BotMessageSquare className="mr-2 h-6 w-6"/>
            Echo Mode
        </h1>
      </div>

      <Card className="mt-4 glassmorphism">
        <CardHeader>
          <CardTitle>Discover Thematic Connections</CardTitle>
          <CardDescription>
            Echo Mode analyzes your past journal entries to reveal recurring themes and patterns in your thoughts.
            Click the button below to see what your journal has to say back to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
            <Button onClick={handleAnalyze} disabled={loading || entriesLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? 'Analyzing...' : 'Analyze My Journal'}
            </Button>
        </CardContent>
      </Card>
      
      {error && <p className="mt-4 text-center text-destructive">{error}</p>}
      
      <div className="mt-6">
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-20 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        {!loading && themes.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Identified Themes</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((theme, index) => (
                <Card key={index} className="glassmorphism">
                  <CardHeader>
                    <CardTitle className="text-lg text-center">{theme}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
