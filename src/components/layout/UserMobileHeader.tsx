"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, LogOut, Sparkles } from "lucide-react";
import { sidebarItems } from "./UserSidebar";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOutAction } from "@/app/actions/auth";
import { useState } from "react";

interface UserMobileHeaderProps {
    user: any;
}

export function UserMobileHeader({ user }: UserMobileHeaderProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="md:hidden flex items-center justify-between px-5 py-3 border-b border-border/60 bg-background/90 backdrop-blur-2xl sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center space-x-2.5 group">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/brand-icon.png"
                            alt="Student Portal"
                            fill
                            className="object-contain"
                            sizes="32px"
                        />
                    </div>
                    <span className="font-black text-base tracking-tight text-foreground">
                        Student Portal
                    </span>
                </Link>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-border/50 bg-card/60">
                        <Menu className="h-4 w-4" />
                        <span className="sr-only">Toggle navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] border-r border-border/60 bg-background/95 backdrop-blur-3xl p-0">
                    <VisuallyHidden.Root>
                        <SheetTitle>Student Navigation</SheetTitle>
                        <SheetDescription>Main navigation for the student dashboard.</SheetDescription>
                    </VisuallyHidden.Root>

                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-6 border-b border-border/50">
                            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                                <div className="relative w-9 h-9">
                                    <Image
                                        src="/brand-icon.png"
                                        alt="Wealify Labs"
                                        fill
                                        className="object-contain"
                                        sizes="36px"
                                    />
                                </div>
                                <div>
                                    <span className="font-black text-base tracking-tight block">
                                        Wealify Labs
                                    </span>
                                    <span className="text-[10px] text-primary uppercase font-bold tracking-widest flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" /> 2026 Masterclass
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div className="flex-1 overflow-y-auto py-6 px-4">
                            <nav className="flex flex-col space-y-1.5">
                                {sidebarItems.map((item) => (
                                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                                        <div
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all",
                                                pathname === item.href
                                                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.title}
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Footer / User Profile */}
                        <div className="p-6 border-t border-border/50 bg-card/40">
                            {user && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="h-9 w-9 border border-primary/20">
                                            <AvatarImage src={user.user_metadata?.avatar_url || user.avatar_url || user.profile?.avatar_url} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {(user.email || 'U').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-xs truncate">{user.user_metadata?.full_name || user.profile?.full_name || "Member"}</span>
                                            <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                                        </div>
                                    </div>

                                    <form action={signOutAction}>
                                        <Button variant="ghost" className="w-full justify-start text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl" type="submit">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log Out
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
