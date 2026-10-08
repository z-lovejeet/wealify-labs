"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, BookOpen, User, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { UserNav } from "./UserNav";
import { createClient } from "@/lib/supabase/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import { signOutAction } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainNavItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Pricing", href: "/pricing" },
    { title: "Contact", href: "/contact" },
];

interface NavbarProps {
    initialUser?: any;
    siteName?: string;
}

export function Navbar({ initialUser, siteName: initialSiteName = "Wealify Labs" }: NavbarProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(initialUser);
    const [siteName, setSiteName] = useState(initialSiteName);

    useEffect(() => {
        setSiteName(initialSiteName);
    }, [initialSiteName]);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const supabase = createClient();

    const isAdmin = pathname?.startsWith("/admin") || user?.profile?.role === 'admin' || user?.role === 'admin';
    const isUserPanel = pathname?.startsWith("/dashboard") || pathname?.startsWith("/my-courses") || pathname?.startsWith("/profile");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setUser({ ...session.user, profile });
            } else {
                setUser(null);
            }
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase]);

    if (pathname?.startsWith("/learn")) return null;

    return (
        <>
            <AnnouncementBanner />
            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-all duration-300",
                    isScrolled
                        ? "bg-background/85 border-b border-border/80 backdrop-blur-2xl shadow-lg shadow-black/20 py-2.5"
                        : "bg-transparent border-b border-transparent py-4"
                )}
            >
                <div className="container flex items-center justify-between max-w-7xl mx-auto px-6">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <Image
                                    src="/brand-icon.png"
                                    alt={siteName}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="40px"
                                />
                            </div>
                            <span className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                                {siteName}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-card/40 p-1 rounded-full border border-border/50 backdrop-blur-md">
                        {!isUserPanel && mainNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-xs font-semibold px-4 py-2 rounded-full transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right User Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <UserNav user={user} />
                        ) : (
                            !isAdmin && !isUserPanel ? (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/pricing">
                                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 rounded-full px-5 transition-transform hover:scale-105 active:scale-95">
                                            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Enroll Now
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                                    {isAdmin ? <Shield className="w-3.5 h-3.5 text-primary" /> : <User className="w-3.5 h-3.5 text-primary" />}
                                    <span>{isAdmin ? "Admin Portal" : "Student"}</span>
                                </div>
                            )
                        )}

                        {/* Mobile Sheet Drawer */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-foreground h-9 w-9 rounded-xl border border-border/50 bg-card/50" suppressHydrationWarning>
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l border-border/60 bg-background/95 backdrop-blur-3xl p-0">
                                <VisuallyHidden.Root>
                                    <SheetTitle>Mobile Navigation</SheetTitle>
                                    <SheetDescription>Main navigation drawer</SheetDescription>
                                </VisuallyHidden.Root>
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="p-6 border-b border-border/50">
                                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                            <div className="relative w-9 h-9">
                                                <Image
                                                    src="/brand-icon.png"
                                                    alt={siteName}
                                                    fill
                                                    className="object-contain"
                                                    sizes="36px"
                                                />
                                            </div>
                                            <span className="font-bold text-lg tracking-tight">
                                                {siteName}
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Mobile Navigation Links */}
                                    <div className="flex-1 overflow-y-auto py-6 px-6">
                                        <nav className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "text-base font-medium transition-colors py-2 px-3 rounded-xl flex items-center justify-between",
                                                        pathname === item.href
                                                            ? "bg-primary/10 text-primary font-bold"
                                                            : "text-foreground/80 hover:text-foreground hover:bg-secondary/20"
                                                    )}
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}

                                            {user?.profile?.role === 'admin' && (
                                                <>
                                                    <div className="h-px bg-border/50 my-2" />
                                                    <Link href="/admin" className="text-sm font-bold text-primary flex items-center gap-2 p-2" onClick={() => setIsOpen(false)}>
                                                        <Shield className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                </>
                                            )}
                                        </nav>
                                    </div>

                                    {/* Mobile Auth Drawer Footer */}
                                    <div className="p-6 border-t border-border/50 bg-card/40">
                                        {user ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Avatar className="h-10 w-10 border border-primary/20">
                                                        <AvatarImage src={user.user_metadata?.avatar_url || user.avatar_url} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">{(user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-foreground">{user.full_name || user.email}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                                    </div>
                                                </div>
                                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full justify-start mb-2" variant="secondary">
                                                        <BookOpen className="w-4 h-4 mr-2" />
                                                        My Dashboard
                                                    </Button>
                                                </Link>
                                                <form action={signOutAction}>
                                                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20" type="submit">
                                                        Log Out
                                                    </Button>
                                                </form>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                <Link href="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                                    <Button variant="outline" className="w-full text-xs font-semibold">Log in</Button>
                                                </Link>
                                                <Link href="/pricing" className="w-full" onClick={() => setIsOpen(false)}>
                                                    <Button className="w-full text-xs font-bold bg-primary text-primary-foreground">Get Started</Button>
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
