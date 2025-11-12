"use client";

import type { JournalEntry } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star } from "lucide-react";
import { differenceInCalendarDays, subDays, isSameDay } from 'date-fns';

const calculateStreaks = (entries: { date: Date }[]): { currentStreak: number, longestStreak: number } => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const sortedDates = entries.map(e => e.date).sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    // Check if the most recent entry is today or yesterday to start the current streak count
    if (isSameDay(sortedDates[0], today) || isSameDay(sortedDates[0], yesterday)) {
        currentStreak = 1;
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i+1]);
            if (diff === 1) {
                currentStreak++;
            } else if (diff > 1) {
                // The streak is broken
                break;
            }
        }
    }

    if (sortedDates.length > 0) {
        let tempCurrentStreak = 1;
        longestStreak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
             const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i + 1]);
             if (diff === 1) {
                tempCurrentStreak++;
             } else if (diff > 1) {
                // Streak broken, reset
                tempCurrentStreak = 1;
             }
             if (tempCurrentStreak > longestStreak) {
                longestStreak = tempCurrentStreak;
             }
        }
    }


    return { currentStreak, longestStreak };
};

export function StreakCalendar({ entries }: { entries: JournalEntry[]; }) {
  
  const entryDates = entries.map(e => ({ date: new Date(e.createdAt) }));
  const { currentStreak, longestStreak } = calculateStreaks(entryDates);

  const modifiers = {
    journaled: entryDates.map(e => e.date)
  };

  const modifiersStyles = {
    journaled: { 
        color: 'hsl(var(--primary))',
        fontWeight: 'bold',
        textDecoration: 'underline',
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glassmorphism">
        <CardContent className="p-2 flex justify-center">
          <Calendar
            mode="single"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md"
          />
        </CardContent>
      </Card>
      <div className="space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep the flame alive!</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{longestStreak} days</div>
            <p className="text-xs text-muted-foreground">Your personal best.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
