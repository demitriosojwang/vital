'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Shield, Search, UserPlus, LayoutDashboard, Eye } from 'lucide-react';

const navLinks = [
  { href: '/contractors', label: 'Find Contractors', icon: Search },
  { href: '/clients', label: 'Vet Clients', icon: Eye },
  { href: '/register', label: 'Register as Contractor', icon: UserPlus },
  { href: '/disputes', label: 'Dispute Registry', icon: Shield },
  { href: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight">
              E Contractor
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground hidden sm:block">
              Kenya&apos;s Trusted Contractor Platform
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" size="sm" className="gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contractors" className="hidden md:block">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Search className="h-4 w-4 mr-1" />
              Search Now
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                E Contractor
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t">
                  <Link href="/contractors" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground">
                      <Search className="h-4 w-4 mr-2" />
                      Search Contractors
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}