"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/firebase";
import { addJournalEntry } from "@/lib/actions";
import { JournalEditor } from "@/components/journal-editor";
import { PageTransition } from "@/components/page-transition";
import { useToast } from "@/components/ui/use-toast";
import { analyzeEntrySentiment } from "@/ai/flows/analyze-entry-sentiment";

export default function NewJournalEntryPage() {
  const { user } = useFirebase();
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
      const sentimentResult = await analyzeEntrySentiment({ journalEntry: content });
      const mood = sentimentResult.sentiment.charAt(0).toUpperCase() + sentimentResult.sentiment.slice(1);
      
      await addJournalEntry(user.uid, content, mood, sentimentResult.score);
      
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
