"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { singleCourse } from "@/lib/mock-data";
import { Loader2, Lock, ShieldCheck, CreditCard, Wallet, Smartphone, CheckCircle2, Star, Bitcoin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";
import { getPlatformSettings } from "@/app/actions/settings";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(singleCourse);
    const [settings, setSettings] = useState<any>({});
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        const checkAuth = async () => {
            // Fetch Settings
            const siteSettings = await getPlatformSettings();
            setSettings(siteSettings);

            // Set default payment method
            if (siteSettings.enable_paypal === 'true') {
                setPaymentMethod("paypal");
            } else if (siteSettings.enable_coinbase === 'true') {
                setPaymentMethod("crypto");
            }

            // Fetch Course Details
            const { data: courseData } = await supabase
                .from('courses')
                .select('*')
                .eq('id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
                .single();

            if (courseData) {
                setCourse(courseData);
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?next=/checkout");
                return;
            }
            setUser(user);

            // Check if already owned
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', courseData ? courseData.id : singleCourse.id);

            if (enrollments && enrollments.length > 0) {
                router.push(`/learn/${courseData ? courseData.id : singleCourse.id}`);
            }

            setLoading(false);
        };
        checkAuth();
    }, []);

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            toast.error("Please select a valid payment method.");
            return;
        }

        setProcessing(true);
        try {
            // Emulate processing processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { error } = await supabase
                .from('enrollments')
                .insert({
                    user_id: user.id,
                    course_id: course.id
                });

            if (error) throw error;

            toast.success("Purchase successful! Welcome aboard 🚀");

            setTimeout(() => {
                router.push(`/learn/${course.id}`);
            }, 1000);

        } catch (error: any) {
            toast.error("Failed to process purchase: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="container max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-24"
                >
                    {/* Left Column: Checkout Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                            <p className="text-muted-foreground">Detailed & Secure payment processing.</p>
                        </div>

                        <form onSubmit={handlePurchase} className="space-y-8">
                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                                    Personal Details
                                </h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First name</Label>
                                            <Input id="firstName" placeholder="John" defaultValue={user?.user_metadata?.full_name?.split(' ')[0]} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last name</Label>
                                            <Input id="lastName" placeholder="Doe" defaultValue={user?.user_metadata?.full_name?.split(' ')[1]} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input id="email" type="email" value={user?.email} disabled className="bg-muted text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Method */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                                    Payment Method
                                </h3>

                                {(!settings.enable_paypal && !settings.enable_coinbase) ? (
                                    <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg text-destructive text-sm text-center font-medium">
                                        No payment methods are currently available. Please contact support.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* PayPal Option */}
                                        <div
                                            onClick={() => settings.enable_paypal === 'true' && setPaymentMethod("paypal")}
                                            className={`
                                                relative cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all
                                                ${settings.enable_paypal !== 'true' ? "opacity-50 cursor-not-allowed bg-muted" : paymentMethod === "paypal" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}
                                            `}
                                        >
                                            <Wallet className="w-6 h-6 mb-1" />
                                            <span className="font-semibold text-sm">PayPal</span>
                                            {settings.enable_paypal !== 'true' && <span className="text-xs text-destructive font-bold">(Disabled)</span>}
                                            {paymentMethod === "paypal" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />}
                                        </div>

                                        {/* Crypto Option */}
                                        <div
                                            onClick={() => settings.enable_coinbase === 'true' && setPaymentMethod("crypto")}
                                            className={`
                                                relative cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all
                                                ${settings.enable_coinbase !== 'true' ? "opacity-50 cursor-not-allowed bg-muted" : paymentMethod === "crypto" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}
                                            `}
                                        >
                                            <Bitcoin className="w-6 h-6 mb-1" />
                                            <div className="text-center">
                                                <span className="font-semibold text-sm block">Crypto</span>
                                                <span className="text-[10px] text-muted-foreground">Coinbase Commerce</span>
                                            </div>
                                            {settings.enable_coinbase !== 'true' && <span className="text-xs text-destructive font-bold">(Disabled)</span>}
                                            {paymentMethod === "crypto" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 p-6 bg-muted/30 rounded-lg border border-border/50 min-h-[100px] flex items-center justify-center">
                                    {paymentMethod === "paypal" && (
                                        <div className="space-y-4 text-center py-2 animate-in fade-in">
                                            <p className="text-sm text-muted-foreground">
                                                You will be redirected to <span className="font-bold text-foreground">PayPal</span> to complete your purchase securely. Cards accepted.
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === "crypto" && (
                                        <div className="space-y-4 animate-in fade-in">
                                            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                                                <div className="bg-background border px-2 py-1 rounded text-xs">BTC</div>
                                                <div className="bg-background border px-2 py-1 rounded text-xs">ETH</div>
                                                <div className="bg-background border px-2 py-1 rounded text-xs">USDC</div>
                                                <div className="bg-background border px-2 py-1 rounded text-xs">LTC</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground text-center">
                                                Pay anonymously and securely using Crypto via <span className="font-bold text-foreground">Coinbase Commerce</span>.
                                            </p>
                                        </div>
                                    )}

                                    {!paymentMethod && (
                                        <p className="text-sm text-muted-foreground">Select a payment method above.</p>
                                    )}
                                </div>
                            </div>

                            <Button disabled={processing || !paymentMethod} type="submit" size="lg" className="w-full text-lg h-14 font-bold rounded-xl shadow-lg shadow-primary/20">
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay with {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'crypto' ? 'Crypto' : '...'} <ShieldCheck className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" /> SSL Encrypted & Secure Payment
                            </p>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:pl-12 space-y-8">
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl space-y-6">
                            <h3 className="text-xl font-bold">Order Summary</h3>

                            <div className="flex gap-4 items-start">
                                <div className="w-24 h-24 bg-muted rounded-lg shrink-0 overflow-hidden relative">
                                    {/* Placeholder for course image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                        <Smartphone className="text-primary w-8 h-8" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">{course.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                                        <CheckCircle2 className="w-3 h-3" /> Lifetime Access
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${course.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${course.price}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Proof */}
                        <div className="bg-secondary/20 rounded-2xl p-6 border border-border/50">
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                            </div>
                            <p className="italic text-muted-foreground text-sm leading-relaxed mb-4">
                                "The best investment I made for my career. The checkout process was smooth and I got access instantly. Highly recommended!"
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">MC</div>
                                <span className="text-sm font-semibold">Michael Chen</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground opacity-60">
                            <div className="text-xs uppercase tracking-widest mb-1">Secured By</div>
                            <div className="flex items-center gap-6 grayscale">
                                {/* Simple Mock Text/Logos for requested providers */}
                                <span className="font-bold text-lg">Stripe</span>
                                <span className="font-bold text-lg">PayPal</span>
                                <span className="font-bold text-lg">Coinbase</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
