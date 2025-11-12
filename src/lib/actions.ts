'use server';

import {
  Timestamp,
  FieldValue,
} from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { JournalEntry, DuolingoGrade } from '@/lib/types';


// JOURNAL ACTIONS
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const entriesCol = adminDb.collection('users').doc(userId).collection('journalEntries');
  const q = entriesCol.orderBy('createdAt', 'desc');
  const snapshot = await q.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      content: data.content,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      mood: data.mood,
      sentimentScore: data.sentimentScore,
    };
  });
}

export async function addJournalEntry(userId: string, content: string, mood: string, sentimentScore: number): Promise<JournalEntry> {
    const entriesCol = adminDb.collection('users').doc(userId).collection('journalEntries');
    const newDocRef = await entriesCol.add({
        content,
        mood,
        sentimentScore,
        createdAt: FieldValue.serverTimestamp(),
        userId,
    });

    return {
        id: newDocRef.id,
        content,
        mood,
        sentimentScore,
        createdAt: new Date(),
    };
}


// STREAK ACTIONS
export async function getDuolingoGrades(userId: string): Promise<DuolingoGrade[]> {
  const gradesCol = adminDb.collection('users').doc(userId).collection('duolingoStreaks');
  const q = gradesCol.orderBy('date', 'desc');
  const snapshot = await q.get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      date: (data.date as Timestamp)?.toDate() || new Date(),
      grade: data.grade,
    };
  });
}

export async function addDuolingoGrade(userId: string, date: Date, grade: number): Promise<DuolingoGrade> {
  const gradesCol = adminDb.collection('users').doc(userId).collection('duolingoStreaks');
  
  // Calculate streak
  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const q = gradesCol.where("date", ">=", yesterday).orderBy("date", "desc");
  const recentGradesSnapshot = await q.get();
  
  let currentStreak = 1;
  if (!recentGradesSnapshot.empty) {
      const lastGrade = recentGradesSnapshot.docs[0].data();
      if (lastGrade && isSameDay(new Date((lastGrade.date as Timestamp).seconds * 1000), yesterday)) {
        currentStreak = (lastGrade.streakLength || 0) + 1;
      }
  }

  const newGradeDoc = {
    userId,
    date: Timestamp.fromDate(date),
    grade,
    streakLength: currentStreak,
  };

  const docRef = await gradesCol.add(newGradeDoc);

  return {
    id: docRef.id,
    date,
    grade,
  };
}

function isSameDay(date1: Date, date2: Date) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}
