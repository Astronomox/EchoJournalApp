"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
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

export function MoodChart({ entries }: { entries: JournalEntry[] }) {
  const chartData = entries
    .filter(entry => typeof entry.sentimentScore === 'number') // Ensure sentimentScore exists
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime()) // Sort chronologically
    .map(entry => ({
      date: new Date(entry.createdAt as any).toLocaleString('en-US', { month: 'short', day: 'numeric' }),
      sentimentScore: entry.sentimentScore,
      mood: entry.mood
    }));

  const chartConfig = {
    sentiment: {
      label: "Sentiment",
      color: "hsl(var(--primary))",
    },
  }

  if (chartData.length < 2) {
    return (
        <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Mood Over Time</CardTitle>
                <CardDescription>Not enough data to display mood chart. You need at least 2 entries with sentiment scores.</CardDescription>
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
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
            />
            <YAxis
                domain={[-1, 1]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, props) => (
                    <div className="flex flex-col">
                        <span className="font-semibold">{props.payload.mood || 'Neutral'}</span>
                        <span className="text-muted-foreground">Score: {(value as number).toFixed(2)}</span>
                    </div>
                  )}
                  labelFormatter={(label) => label}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="sentimentScore"
              type="monotone"
              stroke="var(--color-sentiment)"
              strokeWidth={2}
              name="Sentiment"
              dot={{
                fill: "var(--color-sentiment)",
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
