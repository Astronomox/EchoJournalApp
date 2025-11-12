"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import type { JournalEntry } from "@/lib/types"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const moodToValue = (mood: string) => {
    switch(mood.toLowerCase()){
        case 'positive': return 3;
        case 'neutral': return 2;
        case 'negative': return 1;
        default: return 0;
    }
}

export function MoodChart({ entries }: { entries: JournalEntry[] }) {
  const chartData = entries
    .map(entry => ({
      date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: moodToValue(entry.mood || 'neutral'),
    }))
    .reverse();

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "hsl(var(--primary))",
    },
  }

  if (entries.length < 2) {
    return (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Mood Over Time</CardTitle>
                <CardDescription>Not enough data to display mood chart. You need at least 2 entries.</CardDescription>
            </CardHeader>
        </Card>
    )
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Mood Over Time</CardTitle>
        <CardDescription>A visualization of your mood based on journal entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                      const moodMap = { 3: 'Positive', 2: 'Neutral', 1: 'Negative' };
                      return moodMap[value as keyof typeof moodMap] || 'Unknown';
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="mood"
              type="monotone"
              stroke="var(--color-mood)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-mood)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
