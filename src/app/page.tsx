import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mic, GitBranch, BarChart } from 'lucide-react';
import { PageTransition } from '@/components/page-transition';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
const voiceImage = PlaceHolderImages.find(img => img.id === 'feature-voice');
const echoImage = PlaceHolderImages.find(img => img.id === 'feature-echo');
const insightsImage = PlaceHolderImages.find(img => img.id === 'feature-insights');

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 w-full z-10">
          <Link href="#" className="flex items-center justify-center" prefetch={false}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
              <path d="M12 7C9.24 7 7 9.24 7 12C7 12.55 7.45 13 8 13C8.55 13 9 12.55 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 12.55 15.45 13 16 13C16.55 13 17 12.55 17 12C17 9.24 14.76 7 12 7Z" fill="currentColor"/>
            </svg>
            <span className="ml-2 text-lg font-bold">EchoJournal</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Button variant="ghost" asChild>
              <Link href="/login" prefetch={false}>
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login" prefetch={false}>
                Sign Up
              </Link>
            </Button>
          </nav>
        </header>
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 mt-16">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                {heroImage && (
                    <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      data-ai-hint={heroImage.imageHint}
                      width={600}
                      height={400}
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                    />
                )}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                      The Journal that Listens Back
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      EchoJournal is your private space to reflect, powered by AI to help you discover more about yourself.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" asChild>
                      <Link href="/login" prefetch={false}>
                        Start Your Journey
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Smarter Way to Journal</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Go beyond simple note-taking. EchoJournal uses cutting-edge AI to provide deeper insights.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
                <Card className="glassmorphism">
                  <CardHeader>
                    <Mic className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>Voice & Text Journaling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Speak your mind or type it out. Our app seamlessly transcribes your voice entries.</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardHeader>
                    <GitBranch className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>Echo Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Let our AI connect the dots, revealing recurring themes and patterns in your thoughts over time.</p>
                  </CardContent>
                </Card>
                <Card className="glassmorphism">
                  <CardHeader>
                    <BarChart className="w-8 h-8 mb-2 text-primary" />
                    <CardTitle>Mood Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Visualize your emotional landscape with AI-powered sentiment analysis and beautiful charts.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-muted-foreground">&copy; 2024 EchoJournal. All rights reserved.</p>
        </footer>
      </div>
    </PageTransition>
  );
}
