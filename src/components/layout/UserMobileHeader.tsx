"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { sidebarItems } from "./UserSidebar";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function UserMobileHeader() {
    const pathname = usePathname();

    return (
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
            <span className="font-bold text-lg">Member Panel</span>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0">
                    <VisuallyHidden.Root>
                        <SheetTitle>Navigation Menu</SheetTitle>
                        <SheetDescription>Main navigation for the student dashboard.</SheetDescription>
                    </VisuallyHidden.Root>
                    <div className="flex flex-col h-full bg-card">
                        <div className="p-6 border-b">
                            <h2 className="font-bold text-xl">Menu</h2>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            {sidebarItems.map((item) => (
                                <Link key={item.href} href={item.href} className="block">
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
                        <div className="p-4 border-t">
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
