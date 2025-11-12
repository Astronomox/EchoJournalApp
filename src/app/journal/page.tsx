"use client";

import { useEffect, useState } from "react";
import { getJournalEntries } from "@/lib/actions";
import type { JournalEntry } from "@/lib/types";
import { useAuth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { Skeleton } from "@/components/ui/skeleton";

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getJournalEntries(user.uid).then((data) => {
        setEntries(data);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">My Journal</h1>
        <Button asChild>
          <Link href="/journal/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glassmorphism">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}

        {!loading && entries.length === 0 && (
          <div className="col-span-full text-center py-16">
            <h2 className="text-2xl font-semibold">Your journal is empty</h2>
            <p className="text-muted-foreground mt-2">Start writing to see your entries here.</p>
          </div>
        )}
        
        {!loading && entries.map((entry) => (
          <Card key={entry.id} className="glassmorphism hover:bg-card/80 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(entry.createdAt))}</CardTitle>
              <CardDescription>{new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(entry.createdAt))}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 text-sm text-foreground/80">{entry.content}</p>
            </CardContent>
            {entry.mood && <CardFooter>
              <span className="text-xs text-muted-foreground">Mood: {entry.mood}</span>
            </CardFooter>}
          </Card>
        ))}
      </div>
    </PageTransition>
  );
}
