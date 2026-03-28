# EchoJournal

**The journal that actually listens back.**

Most journal apps are just fancy notepads. You write into them and nothing comes out. I wanted something different — a space where your thoughts don't just get stored, they get understood.

EchoJournal is an AI-powered journaling app built for people who want to understand themselves better. Not therapy. Not a chatbot. Just a mirror that helps you see patterns you'd never notice on your own.

## What It Does

Write or speak your entries — the app transcribes your voice automatically. Over time, the AI quietly works in the background doing something I call **Echo Mode**: it reads across all your past entries and surfaces recurring themes, emotional patterns, and things your mind keeps coming back to without you realising it.

You also get:
- **Mood tracking with sentiment analysis** — your emotional landscape visualised over days, weeks, months
- **Voice + text journaling** — speak freely or type, whatever feels natural that day
- **Pattern recognition** — "you've mentioned anxiety 12 times this month" hits different when you see it charted

## Why I Built It

I needed it myself. Sometimes the thoughts in your head are too tangled to sort out alone. I figured if I needed something like this, other people did too.

## Tech Stack

- **Framework:** Next.js
- **Backend:** Firebase (Firestore, Auth)
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel

## Live Demo

[echo-journal-app.vercel.app](https://echo-journal-app.vercel.app)

## Getting Started
```bash
git clone https://github.com/Astronomox/EchoJournalApp
cd EchoJournalApp
npm install
npm run dev
```

Set up your `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
GEMINI_API_KEY=
```

---

Built by Abdullahi Oriola — a developer who journals too much and codes even more.
