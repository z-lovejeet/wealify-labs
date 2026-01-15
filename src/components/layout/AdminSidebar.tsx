"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Users, ShoppingCart, Settings, LogOut, Mail, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const adminSidebarItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard }, // Base admin path usually dashboard
    { title: "Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { title: "Certificates", href: "/admin/certificates", icon: Award },
    { title: "Reviews", href: "/admin/reviews", icon: Star },
    { title: "Messages", href: "/admin/messages", icon: Mail },
    { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r bg-card/50 md:block w-64 min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col gap-2 p-4 h-full">
                <div className="py-2">
                    <div className="px-4 mb-2 flex items-center gap-2">
                        <span className="font-bold text-xl tracking-tighter text-primary">AdminPanel</span>
                    </div>
                </div>
                <nav className="flex flex-col gap-1">
                    {adminSidebarItems.map((item) => (
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
