"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Password state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [hasAccess, setHasAccess] = useState(false);
    const [enrolledCourse, setEnrolledCourse] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch profile data
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // Check for enrollment and fetch course details
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('id, courses(title)')
                .eq('user_id', user.id);

            if (enrollments && enrollments.length > 0) {
                setHasAccess(true);
                // @ts-ignore - Supabase types join
                if (enrollments[0]?.courses?.title) {
                    // @ts-ignore
                    setEnrolledCourse(enrollments[0].courses.title);
                }
            }

            setUser({ ...user, profile });

            // Split full name if available
            if (profile?.full_name) {
                const parts = profile.full_name.split(" ");
                setFirstName(parts[0]);
                setLastName(parts.slice(1).join(" "));
            } else if (user.user_metadata?.full_name) {
                const parts = user.user_metadata.full_name.split(" ");
                setFirstName(parts[0]);
                setLastName(parts.slice(1).join(" "));
            }

            setLoading(false);
        };
        fetchUser();
    }, []);

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
            // For OAuth users, this might throw or not work as expected if they don't have a password set.
            // But we will disable the UI for them. This is a safeguard.
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

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const initials = user?.profile?.full_name
        ? user.profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
        : user?.email?.[0]?.toUpperCase() || "U";

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
                    {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
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
                                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                                </Avatar>
                                {/* Avatar upload could be added here later */}
                                {/* <Button variant="outline">Change Avatar</Button> */}
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
                                    {/* Supabase doesn't require current password for updates if logged in, but we could ask for it if we used the admin api or verify endpoint. 
                                        For standard client update, it just overwrites. We'll skip "Current Password" for now as standard Supabase client flow. */}
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
