"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Chrome, ArrowLeft, Loader2 } from "lucide-react";
import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getURL } from "@/lib/get-url";

export default function LoginPage() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isResetting, setIsResetting] = React.useState<boolean>(false)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const supabase = createClient()
    const router = useRouter()

    const handleEmailLogin = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                if (error.message.includes("Invalid login credentials")) {
                    toast.error("Invalid email or password. Please try again.")
                } else if (error.message.includes("Email not confirmed")) {
                    toast.error("Email not verified")
                } else {
                    toast.error(error.message)
                }
            } else {
                toast.success("Logged in successfully!")
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${getURL()}auth/callback`,
                },
            })
            if (error) {
                toast.error(error.message)
            }
        } catch (error) {
            toast.error("An unexpected error occurred")
        } finally {
            // Usually redirects away, so loading state might persist until unload
        }
    }

    const handleResetPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first.");
            return;
        }
        setIsResetting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${getURL()}auth/callback?next=/dashboard/settings`,
            });
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Password reset link sent! Check your email.");
            }
        } catch (error) {
            toast.error("Failed to send reset email.");
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                        <Image src="/brand-icon.png" alt="Logo" fill className="object-contain p-2" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>Enter your email to sign in to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="m@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading || isResetting}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <button
                                onClick={handleResetPassword}
                                disabled={isResetting || isLoading}
                                className="text-xs text-primary hover:underline disabled:opacity-50"
                            >
                                {isResetting ? "Sending..." : "Forgot password?"}
                            </button>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading || isResetting}
                        />
                    </div>
                    <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        onClick={handleEmailLogin}
                        disabled={isLoading || isResetting}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isLoading || isResetting}>
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || isResetting}>
                            <Chrome className="mr-2 h-4 w-4" /> Google
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">Don't have an account? <Link href="/register" className="text-primary hover:underline">Sign up</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
