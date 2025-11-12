'use server';

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  where,
} from 'firebase/firestore';
import { adminDb } from '@/lib/firebase-admin';
import type { JournalEntry, DuolingoGrade } from '@/lib/types';


// JOURNAL ACTIONS
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const entriesCol = collection(adminDb, 'users', userId, 'journalEntries');
  const q = query(entriesCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      content: data.content,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      mood: data.mood,
    };
  });
}

export async function addJournalEntry(userId: string, content: string, mood: string): Promise<JournalEntry> {
    const entriesCol = collection(adminDb, 'users', userId, 'journalEntries');
    const newDocRef = await addDoc(entriesCol, {
        content,
        mood,
        createdAt: serverTimestamp(),
        userId,
    });

    return {
        id: newDocRef.id,
        content,
        mood,
        createdAt: new Date(),
    };
}


// STREAK ACTIONS
export async function getDuolingoGrades(userId: string): Promise<DuolingoGrade[]> {
  const gradesCol = collection(adminDb, 'users', userId, 'duolingoStreaks');
  const q = query(gradesCol, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
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
  const gradesCol = collection(adminDb, 'users', userId, 'duolingoStreaks');
  
  // Calculate streak
  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const q = query(gradesCol, where("date", ">=", yesterday), orderBy("date", "desc"));
  const recentGradesSnapshot = await getDocs(q);
  
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

  const docRef = await addDoc(gradesCol, newGradeDoc);

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
