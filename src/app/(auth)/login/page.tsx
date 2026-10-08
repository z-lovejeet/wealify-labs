"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Chrome, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getURL } from "@/lib/get-url";

export default function LoginPage() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isResetting, setIsResetting] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const supabase = createClient();
    const router = useRouter();

    const handleEmailLogin = async () => {
        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    toast.error("Invalid email or password. Please try again.");
                } else if (error.message.includes("Email not confirmed")) {
                    toast.error("Email not verified. Please check your inbox.");
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.success("Welcome back! Redirecting...");
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${getURL()}auth/callback`,
                },
            });
            if (error) {
                toast.error(error.message);
            }
        } catch {
            toast.error("An unexpected error occurred");
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }
        setIsResetting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${getURL()}auth/callback?next=/profile`,
            });
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Password reset link sent! Check your inbox.");
            }
        } catch {
            toast.error("Failed to send reset email.");
        } finally {
            setIsResetting(false);
        }
    };

    const handleMagicLink = async () => {
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${getURL()}auth/callback`,
                }
            });
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Magic link sent! Check your email to sign in.");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[130px] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="w-full max-w-md relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[32px] blur-xl opacity-60 pointer-events-none" />

                <Card className="border border-border/60 bg-card/85 backdrop-blur-2xl shadow-2xl rounded-3xl relative overflow-hidden">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 relative overflow-hidden shadow-sm">
                            <Image src="/brand-icon.png" alt="Logo" fill className="object-contain p-2" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-foreground">Welcome Back</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Sign in to resume your course chapters</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading || isResetting}
                                className="rounded-xl bg-background/60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isResetting || isLoading}
                                    className="text-xs text-primary hover:underline disabled:opacity-50 font-medium"
                                    type="button"
                                >
                                    {isResetting ? "Sending..." : "Forgot password?"}
                                </button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading || isResetting}
                                className="rounded-xl bg-background/60"
                            />
                        </div>

                        <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            onClick={handleEmailLogin}
                            disabled={isLoading || isResetting}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Masterclass"}
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl"
                            onClick={handleMagicLink}
                            disabled={isLoading || isResetting}
                            type="button"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                            Sign in with Magic Link
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold" onClick={() => handleSocialLogin('github')} disabled={isLoading || isResetting}>
                                <Github className="mr-2 h-4 w-4" /> GitHub
                            </Button>
                            <Button variant="outline" className="rounded-xl text-xs font-semibold" onClick={() => handleSocialLogin('google')} disabled={isLoading || isResetting}>
                                <Chrome className="mr-2 h-4 w-4" /> Google
                            </Button>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center pb-6 border-t border-border/40 pt-4">
                        <p className="text-xs text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
