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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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
            } else if (siteSettings.enable_nowpayments === 'true') {
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

    const handleCryptoPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            const response = await fetch('/api/payments/nowpayments/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course.id }),
            });
            const data = await response.json();

            if (data.invoice_url) {
                window.location.href = data.invoice_url;
            } else {
                console.error("Invoice Error:", data);
                const errorMessage = data.details?.message || data.error || "Failed to create crypto invoice";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            toast.error(error.message);
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    const payPalInitialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={payPalInitialOptions}>
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

                            <div className="space-y-8">
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

                                    {(!settings.enable_paypal && !settings.enable_nowpayments) ? (
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
                                                onClick={() => settings.enable_nowpayments === 'true' && setPaymentMethod("crypto")}
                                                className={`
                                                    relative cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all
                                                    ${settings.enable_nowpayments !== 'true' ? "opacity-50 cursor-not-allowed bg-muted" : paymentMethod === "crypto" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50"}
                                                `}
                                            >
                                                <Bitcoin className="w-6 h-6 mb-1" />
                                                <div className="text-center">
                                                    <span className="font-semibold text-sm block">Crypto</span>
                                                    <span className="text-[10px] text-muted-foreground">NOWPayments</span>
                                                </div>
                                                {settings.enable_nowpayments !== 'true' && <span className="text-xs text-destructive font-bold">(Disabled)</span>}
                                                {paymentMethod === "crypto" && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 p-6 bg-muted/30 rounded-lg border border-border/50 min-h-[100px] flex items-center justify-center flex-col gap-4">
                                        {paymentMethod === "paypal" && (
                                            <div className="w-full max-w-sm">
                                                <PayPalButtons
                                                    style={{ layout: "vertical", shape: "rect", label: "pay" }}
                                                    createOrder={async () => {
                                                        const response = await fetch('/api/payments/paypal/create-order', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ courseId: course.id })
                                                        });
                                                        const order = await response.json();
                                                        return order.id;
                                                    }}
                                                    onApprove={async (data) => {
                                                        const response = await fetch('/api/payments/paypal/capture-order', {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ orderID: data.orderID })
                                                        });
                                                        const result = await response.json();
                                                        if (result.success) {
                                                            toast.success("Purchase successful! Enrolling you now...");
                                                            window.location.href = `/learn/${course.id}`;
                                                        } else {
                                                            toast.error("Payment failed. Please try again.");
                                                        }
                                                    }}
                                                    onError={(err) => {
                                                        console.error("PayPal Error:", err);
                                                        toast.error("An error occurred with PayPal.");
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {paymentMethod === "crypto" && (
                                            <div className="space-y-4 animate-in fade-in w-full">
                                                <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                                                    <div className="bg-background border px-2 py-1 rounded text-xs">BTC</div>
                                                    <div className="bg-background border px-2 py-1 rounded text-xs">ETH</div>
                                                    <div className="bg-background border px-2 py-1 rounded text-xs">USDC</div>
                                                    <div className="bg-background border px-2 py-1 rounded text-xs">LTC</div>
                                                </div>
                                                <p className="text-sm text-muted-foreground text-center mb-4">
                                                    You will be redirected to <span className="font-bold text-foreground">NOWPayments</span> to complete your transaction safely.
                                                </p>
                                                <Button
                                                    onClick={handleCryptoPayment}
                                                    disabled={processing}
                                                    className="w-full font-bold shadow-lg h-12"
                                                >
                                                    {processing ? <Loader2 className="animate-spin mr-2" /> : <Bitcoin className="mr-2 h-4 w-4" />}
                                                    Pay with Crypto
                                                </Button>
                                            </div>
                                        )}

                                        {!paymentMethod && (
                                            <p className="text-sm text-muted-foreground">Select a payment method above.</p>
                                        )}
                                    </div>
                                </div>
                                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" /> SSL Encrypted & Secure Payment
                                </p>
                            </div>
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

                                    <span className="font-bold text-lg">PayPal</span>
                                    <span className="font-bold text-lg">NOWPayments</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PayPalScriptProvider>
    );
}
