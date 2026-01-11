"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Settings, LogOut, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Course", href: "/my-courses", icon: BookOpen },
    { title: "Settings", href: "/profile", icon: Settings },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-card/50 md:block w-64 min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-4 h-full">
                <div className="py-2">
                    <h2 className="px-4 text-lg font-semibold tracking-tight mb-2">Member Panel</h2>
                </div>
                <nav className="flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", pathname === item.href && "bg-secondary/20")}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </Button>
                </div>
            </div>
        </div>
    );
}
