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
import { Loader2, ShieldCheck, UserCheck, KeyRound } from "lucide-react";

interface ProfileClientProps {
    user: any;
    hasAccess: boolean;
    enrolledCourse: string | null;
}

export default function ProfileClient({ user, hasAccess, enrolledCourse }: ProfileClientProps) {
    const supabase = createClient();
    const router = useRouter();
    const [updating, setUpdating] = useState(false);

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
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (authError) throw authError;

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
            const { error: authError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (authError) throw authError;

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
        <div className="space-y-8 max-w-4xl py-4 animate-in fade-in duration-300">
            <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Account Settings</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Manage your identity details, security credentials, and course privileges.
                </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="mb-6 bg-card/60 border border-border/50 p-1 rounded-2xl">
                    <TabsTrigger value="account" className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Profile Details
                    </TabsTrigger>
                    <TabsTrigger value="password" className="rounded-xl text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Security & Password
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
                    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-primary" />
                                Personal Identity
                            </CardTitle>
                            <CardDescription>Update your public full name displayed on certificates and comments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="w-20 h-20 border-2 border-primary/20 shadow-md">
                                    <AvatarImage src={user?.profile?.avatar_url || user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-foreground text-base">{user?.profile?.full_name || user?.email}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Role: <span className="font-semibold text-primary uppercase">{user?.profile?.role || "Student"}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">First Name</Label>
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-xl bg-background/60" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Last Name</Label>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-xl bg-background/60" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold">Email Address</Label>
                                <Input value={user?.email} disabled className="bg-muted/50 rounded-xl text-muted-foreground" />
                                <p className="text-[11px] text-muted-foreground">Registered email tied to your crypto purchases and course progress.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2 pb-6 px-6">
                            <Button onClick={handleUpdateProfile} disabled={updating} className="font-bold rounded-xl px-6">
                                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Identity
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Course Access Status Card */}
                    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                Platform Credential Status
                            </CardTitle>
                            <CardDescription>Verified status of your curriculum access.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-5 border border-border/50 rounded-2xl bg-background/50">
                                <div>
                                    <h4 className="font-bold text-foreground">{enrolledCourse || "The Modern Side Hustle Blueprint"}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">Lifetime Unrestricted Access</p>
                                </div>
                                <div>
                                    {hasAccess ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Active Student
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            Not Enrolled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card className="border border-border/60 bg-card/70 backdrop-blur-xl rounded-3xl shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <KeyRound className="w-5 h-5 text-primary" />
                                Password & Credentials
                            </CardTitle>
                            <CardDescription>
                                {isOAuthUser
                                    ? "Your account is managed by an OAuth provider (Google/GitHub). You cannot change your password here."
                                    : "Update your account password. For security, saving a new password will require re-login."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isOAuthUser ? (
                                <div className="p-4 bg-muted/40 rounded-2xl text-xs text-muted-foreground border border-border/50">
                                    Signed in via {user?.app_metadata?.provider}. Please manage authentication through your external provider.
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold">New Password</Label>
                                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-xl bg-background/60" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold">Confirm New Password</Label>
                                        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-xl bg-background/60" />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2 pb-6 px-6">
                            <Button onClick={handleChangePassword} disabled={isOAuthUser || passwordLoading} className="font-bold rounded-xl px-6">
                                {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
