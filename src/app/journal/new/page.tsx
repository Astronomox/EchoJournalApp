"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { JournalEditor } from "@/components/journal-editor";
import { PageTransition } from "@/components/page-transition";
import { useToast } from "@/hooks/use-toast";
import { analyzeEntrySentiment } from "@/ai/flows/analyze-entry-sentiment";
import type { JournalEntry } from "@/lib/types";

export default function NewJournalEntryPage() {
  const { user, firestore } = useFirebase();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not authenticated",
        description: "You must be logged in to create an entry.",
      });
      return;
    }
    setIsSubmitting(true);

    let mood: string | undefined;
    let sentimentScore: number | undefined;

    try {
      const sentimentResult = await analyzeEntrySentiment({ journalEntry: content });
      mood = sentimentResult.sentiment.charAt(0).toUpperCase() + sentimentResult.sentiment.slice(1);
      sentimentScore = sentimentResult.score;
    } catch (aiError) {
      console.warn("AI sentiment analysis failed, but saving entry anyway:", aiError);
      toast({
        title: "AI Analysis Skipped",
        description: "Could not get AI mood analysis, but your entry will be saved without it.",
      });
    }

    try {
      const entriesCol = collection(firestore, 'users', user.uid, 'journalEntries');
      
      const newEntry: Omit<JournalEntry, 'id' | 'createdAt'> = {
        content,
        userId: user.uid,
        createdAt: serverTimestamp() as any, // Let server generate timestamp
      };

      if (mood) newEntry.mood = mood;
      if (sentimentScore !== undefined) newEntry.sentimentScore = sentimentScore;

      await addDoc(entriesCol, newEntry);
      
      toast({
        title: "Entry Saved",
        description: "Your new journal entry has been saved.",
      });
      router.push("/journal");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your journal entry. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">New Journal Entry</h1>
      </div>
      <div className="mt-4">
        <JournalEditor onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </PageTransition>
  );
}
