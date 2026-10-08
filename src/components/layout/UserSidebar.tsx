"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Settings, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";

export const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Curriculum", href: "/my-courses", icon: BookOpen },
    { title: "Account Settings", href: "/profile", icon: Settings },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden border-r border-border/50 bg-card/40 backdrop-blur-xl md:block w-64 min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-5 h-full">
                <div className="pb-3 pt-1">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider w-fit">
                        <Sparkles className="w-3 h-3" />
                        <span>Student Portal</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-1.5 pt-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-xs font-semibold rounded-xl h-10 transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 hover:bg-primary/95 hover:text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                                    )}
                                >
                                    <item.icon className={cn("mr-2.5 h-4 w-4", isActive ? "text-primary-foreground" : "text-primary")} />
                                    {item.title}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 border-t border-border/40">
                    <form action={signOutAction}>
                        <Button
                            type="submit"
                            variant="ghost"
                            className="w-full justify-start text-xs font-semibold rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 h-10 transition-colors"
                        >
                            <LogOut className="mr-2.5 h-4 w-4" />
                            Log Out
                        </Button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
