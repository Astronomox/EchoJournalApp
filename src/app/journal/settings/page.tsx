"use client";

import { PageTransition } from "@/components/page-transition";
import { useTheme } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import type { Theme } from "@/lib/types";

const themes: { name: string; value: Theme }[] = [
    { name: "Light (Default)", value: "light" },
    { name: "Dark (Default)", value: "dark" },
    { name: "Dark Cosmos", value: "theme-dark-cosmos" },
    { name: "Pink Dreams", value: "theme-pink-dreams" },
    { name: "Cream", value: "theme-cream" },
    { name: "Neon", value: "theme-neon" },
    { name: "Forest", value: "theme-forest" },
    { name: "Ocean", value: "theme-ocean" },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <PageTransition>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center">
                    <SettingsIcon className="mr-2 h-6 w-6"/>
                    Settings
                </h1>
            </div>

            <Card className="mt-4 glassmorphism">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of your journal. Select a theme that inspires you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={theme}
                        onValueChange={(value: Theme) => setTheme(value)}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {themes.map((t) => (
                           <Label key={t.value} htmlFor={t.value} className="block relative">
                             <RadioGroupItem value={t.value} id={t.value} className="sr-only"/>
                             <div className="p-4 rounded-lg border-2 border-transparent cursor-pointer has-[:checked]:border-primary glassmorphism bg-card hover:bg-accent/50">
                                 {t.name}
                             </div>
                           </Label>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

        </PageTransition>
    );
}
