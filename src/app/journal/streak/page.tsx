"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebase";
import { getDuolingoGrades, addDuolingoGrade } from "@/lib/actions";
import type { DuolingoGrade } from "@/lib/types";
import { PageTransition } from "@/components/page-transition";
import { StreakCalendar } from "@/components/streak-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {isSameDay} from 'date-fns'

export default function StreakPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grades, setGrades] = useState<DuolingoGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [gradeInput, setGradeInput] = useState("");

  const alreadyGraded = selectedDate ? grades.some(g => isSameDay(g.date, selectedDate)) : false;

  useEffect(() => {
    if (user) {
      setLoading(true);
      getDuolingoGrades(user.uid).then((data) => {
        const gradesWithDates = data.map(g => ({ ...g, date: new Date(g.date) }));
        setGrades(gradesWithDates);
        setLoading(false);
      });
    }
  }, [user]);

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
      const newGradeData = await addDuolingoGrade(user.uid, selectedDate, gradeValue);
      const newGrade = { ...newGradeData, date: new Date(newGradeData.date) };
      setGrades(prev => [...prev, newGrade].sort((a,b) => b.date.getTime() - a.date.getTime()));
      setGradeInput("");
      toast({ title: "Grade Added!", description: `Your grade for ${selectedDate.toLocaleDateString()} has been saved.` });
    } catch (error) {
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
        {loading ? <Skeleton className="w-full h-80" /> : <StreakCalendar grades={grades} onDateSelect={setSelectedDate} />}
        
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
