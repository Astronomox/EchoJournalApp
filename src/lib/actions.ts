// This file contains placeholder server actions.
// In a real application, you would replace these with actual database calls to a service like Firestore.
// For now, they return mock data to allow the UI to be built.

'use server';

import type { JournalEntry, DuolingoGrade } from '@/lib/types';

const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  { id: '1', content: 'Today was a great day. I felt productive and happy. I managed to finish a big project at work and even had time to go for a run in the park. The weather was perfect.', createdAt: new Date('2023-10-26T10:00:00Z'), mood: 'Positive' },
  { id: '2', content: 'Feeling a bit down today. Things didn\'t go as planned and I had a small argument with a friend. Hoping for a better day tomorrow.', createdAt: new Date('2023-10-25T18:30:00Z'), mood: 'Negative' },
  { id: '3', content: 'A pretty normal day. Nothing special happened, but it was calm and peaceful. I read a book and listened to some music.', createdAt: new Date('2023-10-24T14:00:00Z'), mood: 'Neutral' },
];

const MOCK_DUOLINGO_GRADES: DuolingoGrade[] = [
    { id: 'd1', date: new Date('2023-10-26'), grade: 95 },
    { id: 'd2', date: new Date('2023-10-25'), grade: 88 },
    { id: 'd3', date: new Date('2023-10-24'), grade: 92 },
    { id: 'd4', date: new Date('2023-10-22'), grade: 76 },
];

// MOCK JOURNAL ACTIONS
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  console.log('Fetching entries for user:', userId);
  // In a real app, you would fetch from Firestore where userId matches.
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_JOURNAL_ENTRIES;
}

export async function addJournalEntry(userId: string, content: string, mood: string): Promise<JournalEntry> {
  console.log('Adding entry for user:', userId, { content, mood });
  const newEntry: JournalEntry = {
    id: String(Date.now()),
    content,
    createdAt: new Date(),
    mood,
  };
  // In a real app, you would add this to Firestore.
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_JOURNAL_ENTRIES.unshift(newEntry);
  return newEntry;
}

// MOCK STREAK ACTIONS
export async function getDuolingoGrades(userId: string): Promise<DuolingoGrade[]> {
    console.log('Fetching duolingo grades for user:', userId);
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_DUOLINGO_GRADES;
}

export async function addDuolingoGrade(userId: string, date: Date, grade: number): Promise<DuolingoGrade> {
    console.log('Adding duolingo grade for user:', userId, { date, grade });
    const newGrade: DuolingoGrade = {
        id: String(Date.now()),
        date,
        grade,
    };
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_DUOLINGO_GRADES.push(newGrade);
    return newGrade;
}
