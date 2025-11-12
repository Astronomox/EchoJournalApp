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
    switch(mood?.toLowerCase()){
        case 'happy':
        case 'joyful':
        case 'excited':
            return 5;
        case 'content':
        case 'grateful':
            return 4;
        case 'neutral':
        case 'calm':
            return 3;
        case 'sad':
        case 'anxious':
        case 'stressed':
            return 2;
        case 'angry':
        case 'frustrated':
        case 'tired':
            return 1;
        default: return 3; // Default to neutral
    }
}

const valueToMood = (value: number) => {
    switch(value) {
        case 5: return 'Very Positive';
        case 4: return 'Positive';
        case 3: return 'Neutral';
        case 2: return 'Negative';
        case 1: return 'Very Negative';
        default: return 'Unknown';
    }
}

export function MoodChart({ entries }: { entries: JournalEntry[] }) {
  const chartData = entries
    .map(entry => ({
      date: new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moodValue: moodToValue(entry.mood || 'neutral'),
      mood: entry.mood
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
                  formatter={(value, name, props) => {
                      return `${props.payload.mood} (${valueToMood(value as number)})`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="moodValue"
              type="monotone"
              stroke="var(--color-mood)"
              strokeWidth={2}
              name="Mood"
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
