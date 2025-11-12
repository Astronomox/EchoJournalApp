export type JournalEntry = {
  id: string;
  createdAt: Date;
  content: string;
  mood?: string;
  sentimentScore: number;
};

export type Theme = 'light' | 'dark' | 'theme-dark-cosmos' | 'theme-pink-dreams' | 'theme-cream' | 'theme-neon' | 'theme-forest' | 'theme-ocean';
