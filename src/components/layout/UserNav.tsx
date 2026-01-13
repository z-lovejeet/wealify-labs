"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/actions/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserNavProps {
    user: {
        email?: string;
        user_metadata?: {
            full_name?: string;
            avatar_url?: string;
        };
        profile?: {
            full_name?: string;
            email?: string;
            avatar_url?: string;
            role?: string;
        };
    };
}

export function UserNav({ user }: UserNavProps) {
    const router = useRouter();
    const supabase = createClient();

    // const handleSignOut = async () => {
    //     const { error } = await supabase.auth.signOut();
    //     if (error) {
    //         toast.error(error.message);
    //     } else {
    //         toast.success("Logged out successfully");
    //         router.refresh();
    //         router.push("/");
    //     }
    // };

    const full_name = user?.profile?.full_name || user?.user_metadata?.full_name;
    const email = user?.profile?.email || user?.email;
    const avatar_url = user?.profile?.avatar_url || user?.user_metadata?.avatar_url;

    const initials = full_name
        ?.split(" ")
        .map((n: string) => n[0]) // Added type annotation
        .join("")
        .toUpperCase() || email?.[0]?.toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={avatar_url} alt={full_name || ""} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {user?.profile?.role === 'admin' ? (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href="/admin" className="cursor-pointer">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Platform Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/my-courses" className="cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>My Course</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <form action={signOutAction}>
                    <button type="submit" className="w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
