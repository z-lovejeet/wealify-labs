"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Chrome, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getURL } from "@/lib/get-url";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const supabase = createClient();
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email || !password) {
            toast.error("Please fill in your email and password.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
            if (error) {
                if (error.message.includes("User already registered") || error.message.includes("already registered")) {
                    toast.error("This email is already registered. Please log in.");
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.success("Account created successfully! Please verify your email.");
                router.push("/login");
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
            {/* Ambient Background Glows */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <div className="w-full max-w-md relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary/20 to-emerald-500/20 rounded-[32px] blur-xl opacity-60 pointer-events-none" />

                <Card className="border border-border/60 bg-card/85 backdrop-blur-2xl shadow-2xl rounded-3xl relative overflow-hidden">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 relative overflow-hidden shadow-sm">
                            <Image src="/brand-icon.png" alt="Logo" fill className="object-contain p-2" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-foreground">Create Your Account</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Start building your digital asset portfolio</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Alexander Hamilton"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                className="rounded-xl bg-background/60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="alex@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="rounded-xl bg-background/60"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="rounded-xl bg-background/60"
                            />
                        </div>

                        <Button
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11 shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                            onClick={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Registration"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-card px-2 text-muted-foreground">Or sign up with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="rounded-xl text-xs font-semibold" onClick={() => handleSocialLogin('github')} disabled={isLoading}>
                                <Github className="mr-2 h-4 w-4" /> GitHub
                            </Button>
                            <Button variant="outline" className="rounded-xl text-xs font-semibold" onClick={() => handleSocialLogin('google')} disabled={isLoading}>
                                <Chrome className="mr-2 h-4 w-4" /> Google
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Encrypted Credentials &bull; Strict Data Privacy</span>
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center pb-6 border-t border-border/40 pt-4">
                        <p className="text-xs text-muted-foreground">
                            Already enrolled?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
