"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, BookOpen, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { UserNav } from "./UserNav";
import { createClient } from "@/lib/supabase/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from "next/image";

const mainNavItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Pricing", href: "/pricing" },
];

import { getPlatformSettings } from "@/app/actions/settings";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import { signOutAction } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
    initialUser?: any;
    siteName?: string;
}

export function Navbar({ initialUser, siteName: initialSiteName = "Wealify Labs" }: NavbarProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(initialUser);
    const [siteName, setSiteName] = useState(initialSiteName); // Keep state if we want to support internal updates, or just use prop.
    // Actually, simple is better: derive from prop or just use prop directly if we don't expect client-changes without reload.
    // But let's keep it in state synced with prop to be safe.

    useEffect(() => {
        setSiteName(initialSiteName);
    }, [initialSiteName]);

    const supabase = createClient();

    // Determine if we are in specific layouts
    const isAdmin = pathname?.startsWith("/admin") || user?.profile?.role === 'admin' || user?.role === 'admin';

    const isUserPanel = pathname?.startsWith("/dashboard") || pathname?.startsWith("/my-courses") || pathname?.startsWith("/profile");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                // relying on server prop for initialUser usually enough, but here we cover edge cases
            } else {
                setUser(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        }
    }, [supabase.auth]);

    if (pathname?.startsWith("/learn")) return null; // Hide main navbar in course player

    return (
        <>
            <AnnouncementBanner />
            <header
                className={cn(
                    "sticky top-0 z-50 w-full border-b transition-all duration-300",
                    isScrolled ? "bg-background/80 border-border backdrop-blur-xl shadow-sm py-2" : "bg-background/0 border-transparent py-2"
                )}
            >
                <div className="container flex items-center justify-between max-w-7xl mx-auto px-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/brand-icon.png"
                                    alt={siteName}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {siteName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {!isUserPanel && mainNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Conditional Buttons based on Auth State */}
                        {user ? (
                            <UserNav user={user} />
                        ) : (
                            !isAdmin && !isUserPanel ? (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-primary">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-full px-6 transition-transform hover:scale-105">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {isAdmin ? <Shield className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
                                    <span>{isAdmin ? "Admin Mode" : "Student"}</span>
                                </div>
                            )
                        )}


                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground" suppressHydrationWarning>
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-border/50 bg-background/95 backdrop-blur-3xl p-0">
                                <VisuallyHidden.Root>
                                    <SheetTitle>Mobile Menu</SheetTitle>
                                    <SheetDescription>Main navigation menu.</SheetDescription>
                                </VisuallyHidden.Root>
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="p-6 border-b border-border/50">
                                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src="/brand-icon.png"
                                                    alt={siteName}
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                            <span className="font-bold text-lg tracking-tight">
                                                {siteName}
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Mobile Links */}
                                    <div className="flex-1 overflow-y-auto py-6 px-6">
                                        <nav className="flex flex-col space-y-6">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors flex items-center justify-between group"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.title}
                                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                </Link>
                                            ))}

                                            {user?.profile?.role === 'admin' && (
                                                <>
                                                    <div className="h-px bg-border/50 my-2"></div>
                                                    <Link href="/admin" className="text-lg font-bold text-primary flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                                        <Shield className="w-5 h-5" />
                                                        Admin Panel
                                                    </Link>
                                                </>
                                            )}
                                        </nav>
                                    </div>

                                    {/* Mobile Footer / Auth */}
                                    <div className="p-6 border-t border-border/50 bg-muted/20">
                                        {user ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Avatar>
                                                        <AvatarImage src={user.user_metadata?.avatar_url || user.avatar_url} />
                                                        <AvatarFallback>{(user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{user.full_name || user.email}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                                    </div>
                                                </div>
                                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full justify-start mb-2" variant="secondary">
                                                        <BookOpen className="w-4 h-4 mr-2" />
                                                        My Learning
                                                    </Button>
                                                </Link>
                                                <form action={signOutAction}>
                                                    <Button variant="destructive" className="w-full justify-start" type="submit">
                                                        Log Out
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full">Log in</Button>
                                                </Link>
                                                <Link href="/register" className="w-full" onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full">Get Started</Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        </>
    );
}
