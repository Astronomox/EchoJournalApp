"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
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

    try {
      // Step 1: Save the core journal entry to Firestore immediately.
      const entriesCol = collection(firestore, 'users', user.uid, 'journalEntries');
      const newEntryDoc = await addDoc(entriesCol, {
        content,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Entry Saved",
        description: "Your new journal entry has been saved.",
      });
      
      router.push("/journal");

      // Step 2: *After* saving, attempt the AI sentiment analysis.
      // This is now a non-blocking enhancement.
      try {
        const sentimentResult = await analyzeEntrySentiment({ journalEntry: content });
        const mood = sentimentResult.sentiment.charAt(0).toUpperCase() + sentimentResult.sentiment.slice(1);
        const sentimentScore = sentimentResult.score;

        // If AI is successful, update the document with mood data.
        await updateDoc(newEntryDoc, {
            mood: mood,
            sentimentScore: sentimentScore
        });

      } catch (aiError) {
        // If AI fails, we just log it. The entry is already saved.
        console.warn("AI sentiment analysis failed, but the entry was saved successfully:", aiError);
      }

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
