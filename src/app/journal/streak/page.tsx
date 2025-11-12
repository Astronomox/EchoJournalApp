"use client";

import { useMemo } from "react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from 'firebase/firestore';
import type { JournalEntry } from "@/lib/types";
import { PageTransition } from "@/components/page-transition";
import { StreakCalendar } from "@/components/streak-calendar";
import { CalendarCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StreakPage() {
  const { user, firestore } = useFirebase();

  const entriesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'journalEntries');
  }, [user, firestore]);

  const { data: entries, isLoading: loading } = useCollection<JournalEntry>(entriesQuery);
  const entriesWithDates = useMemo(() => entries?.map(e => ({ ...e, createdAt: new Date(e.createdAt) })) || [], [entries]);

  return (
    <PageTransition>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
            <CalendarCheck className="mr-2 h-6 w-6"/>
            EchoJournal Streak
        </h1>
      </div>
      <div className="grid gap-6 mt-4">
        {loading ? <Skeleton className="w-full h-80" /> : <StreakCalendar entries={entriesWithDates} />}
      </div>
    </PageTransition>
  );
}
