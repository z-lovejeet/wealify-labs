"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProfileClientProps {
    user: any;
    hasAccess: boolean;
    enrolledCourse: string | null;
}

export default function ProfileClient({ user, hasAccess, enrolledCourse }: ProfileClientProps) {
    const supabase = createClient();
    const router = useRouter();
    const [updating, setUpdating] = useState(false);

    // Initial State Setup
    const getInitials = () => {
        return user?.profile?.full_name
            ? user.profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
            : user?.email?.[0]?.toUpperCase() || "U";
    };

    const getFirstName = () => {
        if (user?.profile?.full_name) {
            return user.profile.full_name.split(" ")[0];
        }
        return user?.user_metadata?.full_name?.split(" ")[0] || "";
    };

    const getLastName = () => {
        if (user?.profile?.full_name) {
            return user.profile.full_name.split(" ").slice(1).join(" ");
        }
        return user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "";
    };

    const [firstName, setFirstName] = useState(getFirstName());
    const [lastName, setLastName] = useState(getLastName());

    // Password state
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleUpdateProfile = async () => {
        if (!user) return;
        setUpdating(true);

        const fullName = `${firstName} ${lastName}`.trim();

        try {
            // Update auth metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (authError) throw authError;

            // Update profiles table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (profileError) throw profileError;

            toast.success("Profile updated successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            toast.success("Password updated successfully. Logging out...");
            await supabase.auth.signOut();
            router.push("/login");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const isOAuthUser = user?.app_metadata?.provider && user?.app_metadata?.provider !== 'email';

    return (
        <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your profile details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={user?.profile?.avatar_url || user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={user?.email} disabled className="bg-muted" />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button onClick={handleUpdateProfile} disabled={updating}>
                                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Course Access Block */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Access</CardTitle>
                            <CardDescription>Status of your course enrollment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                                <div>
                                    <h4 className="font-semibold">{enrolledCourse || "The Modern Side Hustle Blueprint"}</h4>
                                    <p className="text-sm text-muted-foreground">Lifetime Access</p>
                                </div>
                                <div>
                                    {hasAccess ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            Not Enrolled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                {isOAuthUser
                                    ? "Your account is managed by a third-party provider (Google/GitHub). You cannot change your password here."
                                    : "Change your password here. After saving, you'll be logged out."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isOAuthUser ? (
                                <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-border">
                                    Signed in via {user?.app_metadata?.provider}. Please manage your password through that provider.
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm Password</Label>
                                        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button onClick={handleChangePassword} disabled={isOAuthUser || passwordLoading}>
                                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
