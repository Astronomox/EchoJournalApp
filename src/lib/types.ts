export type JournalEntry = {
  id: string;
  createdAt: Date;
  content: string;
  mood?: 'Positive' | 'Negative' | 'Neutral' | string;
  sentimentScore: number;
};

export type DuolingoGrade = {
    id: string;
    date: Date;
    grade: number;
};

export type Theme = 'light' | 'dark' | 'theme-dark-cosmos' | 'theme-pink-dreams' | 'theme-cream' | 'theme-neon' | 'theme-forest' | 'theme-ocean';
