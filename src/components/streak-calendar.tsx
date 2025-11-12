"use client";

import { useState } from "react";
import type { DuolingoGrade } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star } from "lucide-react";
import { differenceInCalendarDays, subDays, isSameDay } from 'date-fns';

const getGradeColor = (grade: number) => {
    if (grade >= 90) return "hsl(var(--primary))";
    if (grade >= 80) return "hsl(var(--accent))";
    if (grade >= 70) return "hsl(var(--secondary-foreground))";
    return "hsl(var(--muted-foreground))";
};

const calculateStreaks = (grades: DuolingoGrade[]): { currentStreak: number, longestStreak: number } => {
    if (grades.length === 0) return { currentStreak: 0, longestStreak: 0 };
    
    const sortedDates = grades.map(g => g.date).sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (isSameDay(sortedDates[0], new Date()) || isSameDay(sortedDates[0], subDays(new Date(), 1))) {
        currentStreak = 1;
        longestStreak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i+1]);
            if (diff === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    let tempCurrentStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
        tempCurrentStreak++;
        if (i < sortedDates.length - 1) {
            const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i + 1]);
            if (diff > 1) {
                if (tempCurrentStreak > longestStreak) {
                    longestStreak = tempCurrentStreak;
                }
                tempCurrentStreak = 0;
            }
        }
    }
    if (tempCurrentStreak > longestStreak) {
        longestStreak = tempCurrentStreak;
    }


    return { currentStreak, longestStreak };
};

export function StreakCalendar({ grades, onDateSelect }: { grades: DuolingoGrade[]; onDateSelect: (date?: Date) => void; }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { currentStreak, longestStreak } = calculateStreaks(grades);

  const modifiers = {
    graded: grades.map(g => g.date)
  };

  const gradeModifiersStyles = {
    graded: grades.reduce((acc, g) => {
      acc[g.date.toISOString().split('T')[0]] = { 
        color: getGradeColor(g.grade), 
        fontWeight: 'bold' 
      };
      return acc;
    }, {} as Record<string, React.CSSProperties>)
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glassmorphism">
        <CardContent className="p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => { setDate(d); onDateSelect(d); }}
            modifiers={modifiers}
            modifiersStyles={gradeModifiersStyles}
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
            <p className="text-xs text-muted-foreground">Keep it up!</p>
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
