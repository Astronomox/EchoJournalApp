"use client";

import React, { useEffect, useState } from 'react';
import { useFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NotebookText, BotMessageSquare, BarChart3, CalendarCheck, Settings, LogOut, Plus, Menu } from 'lucide-react';
import { HolographicIcon } from '@/components/holographic-icon';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { signOut } from 'firebase/auth';

const navItems = [
  { href: '/journal', icon: NotebookText, label: 'Journal' },
  { href: '/journal/echo', icon: BotMessageSquare, label: 'Echo' },
  { href: '/journal/new', icon: Plus, label: 'New', isCentral: true },
  { href: '/journal/insights', icon: BarChart3, label: 'Insights' },
  { href: '/journal/streak', icon: CalendarCheck, label: 'Streak' },
];

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading application...</div>
      </div>
    );
  }
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const NavContent = () => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.filter(item => !item.isCentral).map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className="justify-start"
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/journal" className="flex items-center gap-2 font-semibold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/><path d="M12 7C9.24 7 7 9.24 7 12C7 12.55 7.45 13 8 13C8.55 13 9 12.55 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 12.55 15.45 13 16 13C16.55 13 17 12.55 17 12C17 9.24 14.76 7 12 7Z" fill="currentColor"/></svg>
              <span>EchoJournal</span>
            </Link>
          </div>
          <div className="flex-1">
            <NavContent />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        {/* Mobile/Main Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/journal" className="flex items-center gap-2 font-semibold" onClick={() => setSidebarOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/><path d="M12 7C9.24 7 7 9.24 7 12C7 12.55 7.45 13 8 13C8.55 13 9 12.55 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 12.55 15.45 13 16 13C16.55 13 17 12.55 17 12C17 9.24 14.76 7 12 7Z" fill="currentColor"/></svg>
                    <span>EchoJournal</span>
                  </Link>
                </div>
                <div onClick={() => setSidebarOpen(false)}>
                  <NavContent />
                </div>
            </SheetContent>
          </Sheet>
          
          <div className="w-full flex-1" /> {/* Spacer */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/journal/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t flex items-center justify-around z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center text-muted-foreground w-full h-full",
              isActive && "text-primary",
              item.isCentral && "-mt-8"
            )}>
              <div className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  item.isCentral && "bg-primary text-primary-foreground shadow-lg scale-125"
              )}>
                <HolographicIcon icon={item.icon} className={cn("w-6 h-6", isActive && !item.isCentral ? "holographic-icon": "")} />
              </div>
              {!item.isCentral && <span className="text-xs mt-1">{item.label}</span>}
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
