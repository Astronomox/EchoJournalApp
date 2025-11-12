"use client";

import { useEffect, useState, useMemo } from "react";
import { useFirebase, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { DuolingoGrade } from "@/lib/types";
import { PageTransition } from "@/components/page-transition";
import { StreakCalendar } from "@/components/streak-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {isSameDay, subDays} from 'date-fns'

export default function StreakPage() {
  const { user, firestore } = useFirebase();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [gradeInput, setGradeInput] = useState("");

  const gradesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'duolingoStreaks');
  }, [user, firestore]);

  const { data: grades, isLoading: loading } = useCollection<DuolingoGrade>(gradesQuery);
  const gradesWithDates = useMemo(() => grades?.map(g => ({ ...g, date: new Date(g.date) })) || [], [grades]);
  
  const alreadyGraded = selectedDate ? gradesWithDates.some(g => isSameDay(g.date, selectedDate)) : false;

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDate || !gradeInput || alreadyGraded) return;
    
    const gradeValue = parseInt(gradeInput, 10);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast({ variant: "destructive", title: "Invalid Grade", description: "Please enter a number between 0 and 100." });
      return;
    }
    
    setSubmitting(true);
    try {
      const gradesCol = collection(firestore, 'users', user.uid, 'duolingoStreaks');
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const yesterday = subDays(today, 1);
      
      let currentStreak = 1;
      const sortedGrades = [...gradesWithDates].sort((a,b) => b.date.getTime() - a.date.getTime());
      const lastGrade = sortedGrades[0];

      if (lastGrade && isSameDay(lastGrade.date, yesterday)) {
          // @ts-ignore
          currentStreak = (lastGrade.streakLength || 0) + 1;
      }
      
      await addDoc(gradesCol, {
          userId: user.uid,
          date: selectedDate,
          grade: gradeValue,
          streakLength: currentStreak,
      });

      setGradeInput("");
      toast({ title: "Grade Added!", description: `Your grade for ${selectedDate.toLocaleDateString()} has been saved.` });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not save your grade. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
            <CalendarCheck className="mr-2 h-6 w-6"/>
            Duolingo Streak
        </h1>
      </div>
      <div className="grid gap-6 mt-4">
        {loading ? <Skeleton className="w-full h-80" /> : <StreakCalendar grades={gradesWithDates} onDateSelect={setSelectedDate} />}
        
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Add Daily Grade</CardTitle>
            <CardDescription>Select a day on the calendar and enter your grade below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGrade} className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-auto flex-grow">
                <Label htmlFor="date">Date</Label>
                <Input id="date" value={selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'} readOnly disabled />
              </div>
              <div className="w-full sm:w-auto">
                <Label htmlFor="grade">Grade (0-100)</Label>
                <Input 
                  id="grade" 
                  type="number" 
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g., 95" 
                  disabled={submitting || !selectedDate || alreadyGraded}
                />
              </div>
              <Button type="submit" disabled={submitting || !selectedDate || !gradeInput || alreadyGraded}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {alreadyGraded ? 'Already Graded' : 'Save Grade'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
