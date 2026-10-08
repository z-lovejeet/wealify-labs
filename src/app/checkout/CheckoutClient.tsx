"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    Loader2, 
    Lock, 
    CheckCircle2, 
    Star, 
    Bitcoin, 
    ShieldCheck, 
    ArrowLeft, 
    Zap, 
    Sparkles, 
    Bot, 
    FileText, 
    HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getPlatformSettings } from "@/app/actions/settings";

interface CheckoutClientProps {
    user: any;
    course: any;
}

export default function CheckoutClient({ user, course }: CheckoutClientProps) {
    const [processing, setProcessing] = useState(false);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const siteSettings = await getPlatformSettings();
                setSettings(siteSettings);
            } catch (err) {
                console.error("Failed to load platform settings:", err);
            } finally {
                setIsLoadingSettings(false);
            }
        };
        loadSettings();
    }, []);

    const isCryptoEnabled = settings.enable_nowpayments !== 'false';

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
            toast.error(error.message || "Could not initiate payment. Please try again.");
            setProcessing(false);
        }
    };

    const regularPrice = 49.99;
    const finalPrice = course?.price ? Number(course.price) : 14.99;
    const discountAmount = (regularPrice - finalPrice).toFixed(2);
    const discountPercent = Math.round(((regularPrice - finalPrice) / regularPrice) * 100);

    return (
        <div className="min-h-screen bg-[#030712] text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Minimal Distraction-Free Luxury Checkout Header */}
            <header className="w-full border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Brand & Back Button */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link 
                            href="/pricing"
                            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04]"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Pricing</span>
                        </Link>

                        <div className="h-4 w-px bg-white/10 hidden sm:block" />

                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="relative w-7 h-7">
                                <Image
                                    src="/brand-icon.png"
                                    alt="Wealify Labs"
                                    fill
                                    className="object-contain"
                                    sizes="28px"
                                    priority
                                />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
                                Wealify Labs
                            </span>
                        </Link>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Lock className="w-3 h-3" />
                            <span className="text-[11px] font-semibold tracking-wide uppercase">256-Bit SSL Encrypted</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Checkout Body */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start"
                >
                    {/* Left Column: Account & Payment Gateway (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Fast & Secure Enrollment</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                Complete Your Order
                            </h1>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                Complete your payment below to unlock instant lifetime access to the masterclass and AI Venture Studio.
                            </p>
                        </div>

                        {/* Step 1: Account Information */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center text-xs font-bold">
                                        1
                                    </div>
                                    <h3 className="text-base font-bold text-white">Student Account</h3>
                                </div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" /> Verified Account
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Enrolled Email</div>
                                    <div className="font-mono text-sm text-white font-medium mt-0.5">{user?.email}</div>
                                </div>
                                <div className="text-slate-400 text-xs sm:text-right">
                                    Lifetime license & completion certificate will be issued to this email.
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Payment Gateway Selection */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.08] backdrop-blur-md space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center text-xs font-bold">
                                        2
                                    </div>
                                    <h3 className="text-base font-bold text-white">Payment Method</h3>
                                </div>
                                <span className="text-xs text-slate-400">Select payment method below</span>
                            </div>

                            {/* Option A: ACTIVE Cryptocurrency via NOWPayments */}
                            <div className="rounded-2xl border-2 border-primary bg-primary/[0.04] p-5 sm:p-6 space-y-4 shadow-lg shadow-primary/5 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                                            <Bitcoin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-base text-white">Cryptocurrency</span>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Active & Instant
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Processed securely by NOWPayments. Instant blockchain enrollment.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center text-black shrink-0 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-black" />
                                    </div>
                                </div>

                                {/* Supported Coins Badges */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                    {["BTC", "ETH", "USDT", "SOL", "USDC", "LTC", "BNB"].map((coin) => (
                                        <span 
                                            key={coin} 
                                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 text-xs font-mono font-medium text-slate-300"
                                        >
                                            {coin}
                                        </span>
                                    ))}
                                    <span className="text-xs text-slate-400 ml-1">+300 cryptocurrencies</span>
                                </div>

                                <div className="pt-2 border-t border-white/[0.06] space-y-3.5">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        You will be redirected to the secure NOWPayments checkout page where you can choose any crypto network. Your account unlocks automatically within minutes upon blockchain verification.
                                    </p>

                                    <Button
                                        onClick={handleCryptoPayment}
                                        disabled={processing || (!isLoadingSettings && !isCryptoEnabled)}
                                        size="lg"
                                        className="w-full h-13 text-base font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                                Generating Secure Invoice...
                                            </>
                                        ) : (
                                            <>
                                                <Bitcoin className="mr-2 h-5 w-5" />
                                                Pay ${finalPrice.toFixed(2)} with Crypto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Option B: DISABLED PayPal / Cards */}
                            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4.5 sm:p-5 opacity-60 cursor-not-allowed select-none transition-all">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800/40 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.787.787 0 0 1 .777-.655h6.326c3.486 0 5.86 1.488 5.485 5.093-.326 3.125-2.22 4.954-5.187 4.954H9.553l-1.47 7.558a.641.641 0 0 1-.633.535l-.374-.868z" />
                                                <path d="M18.847 8.158c-.326 3.125-2.22 4.954-5.187 4.954H10.87l-1.47 7.558a.641.641 0 0 1-.633.535H6.26l.487-2.5 1.47-7.558h2.791c2.967 0 4.861-1.829 5.187-4.954.237-2.278-.65-3.645-2.6-4.321 2.91.433 4.865 2.502 4.752 6.286z" opacity=".7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-slate-300">PayPal / Debit & Credit Cards</span>
                                                <span className="text-[10px] font-semibold bg-white/[0.06] text-amber-300/80 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                                    Temporarily Disabled
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Currently undergoing scheduled API maintenance. Please use Cryptocurrency above.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Offline</span>
                                </div>
                            </div>
                        </div>

                        {/* Security & Support Guarantee Footer */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-white/[0.05] flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                                <div className="text-xs">
                                    <div className="font-semibold text-white">SSL Encrypted</div>
                                    <div className="text-slate-500 text-[11px]">Bank-grade checkout</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-white/[0.05] flex items-center gap-3">
                                <Zap className="w-5 h-5 text-primary shrink-0" />
                                <div className="text-xs">
                                    <div className="font-semibold text-white">Instant Unlock</div>
                                    <div className="text-slate-500 text-[11px]">Automated access</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/30 border border-white/[0.05] flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                <div className="text-xs">
                                    <div className="font-semibold text-white">Founder Support</div>
                                    <div className="text-slate-500 text-[11px]">support@wealifylabs.site</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Features Included (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/[0.1] backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
                            {/* Glowing Header Ribbon */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                                <h3 className="text-lg font-black text-white">Order Summary</h3>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                                    Lifetime Access
                                </span>
                            </div>

                            {/* Course Item Presentation */}
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="font-bold text-white text-base leading-snug">
                                        {course.title || "The Complete Blueprint to Building Digital Wealth"}
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                    {course.description || "The end-to-end framework to build sustainable digital income streams with battle-tested funnels and automated systems."}
                                </p>
                            </div>

                            {/* Price Breakdown Calculation */}
                            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/[0.06] space-y-2.5 text-xs">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Regular Catalog Price</span>
                                    <span className="line-through font-mono text-slate-500">${regularPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-400 font-medium">
                                    <span>Launch Discount ({discountPercent}% OFF)</span>
                                    <span className="font-mono">-${discountAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>AI Venture Studio Tools</span>
                                    <span className="text-emerald-400 font-medium">Included ($0)</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span>Future Content Updates</span>
                                    <span className="text-emerald-400 font-medium">Lifetime Free</span>
                                </div>
                                <Separator className="bg-white/10 my-2" />
                                <div className="flex justify-between items-baseline pt-1">
                                    <span className="text-sm font-bold text-white">Total Amount Due</span>
                                    <div className="text-right">
                                        <div className="text-2xl sm:text-3xl font-black text-primary font-mono">
                                            ${finalPrice.toFixed(2)}
                                        </div>
                                        <div className="text-[10px] text-slate-400">One-time payment &bull; No recurring billing</div>
                                    </div>
                                </div>
                            </div>

                            {/* What's Included Bullet List */}
                            <div className="space-y-3 pt-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Everything Included With Enrollment:
                                </div>
                                <div className="space-y-2.5 text-xs text-slate-300">
                                    <div className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>47 In-Depth Masterclass Chapters & Frameworks</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <span className="font-medium text-white">24/7 AI Masterclass Mentor (Powered by Groq 120B)</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                        <span className="font-medium text-white">AI Venture Idea & Viability Auditor</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                        <span className="font-medium text-white">Direct-Response Offer & Copywriting Architect</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Downloadable Worksheets & Notion Operating Systems</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Official Digital Certificate of Completion</span>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <span>Private Community Access & Lifetime Module Updates</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verified Student Social Proof */}
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2.5">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                    <span className="text-[11px] text-slate-400 ml-1.5 font-semibold">Verified Student Review</span>
                                </div>
                                <p className="text-xs text-slate-300 italic leading-relaxed">
                                    &ldquo;The AI mentor and frameworks alone are worth ten times the price. Paid with USDT in 2 minutes and had instant dashboard access.&rdquo;
                                </p>
                                <div className="text-[11px] text-slate-400 font-medium">
                                    — Michael Chen, Indie Builder
                                </div>
                            </div>
                        </div>

                        {/* NOWPayments Trust Note */}
                        <div className="text-center space-y-1 text-slate-500 text-xs">
                            <div className="flex items-center justify-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Secured by NOWPayments Merchant API</span>
                            </div>
                            <div className="text-[11px]">
                                Need help? Contact us anytime at <a href="mailto:support@wealifylabs.site" className="text-slate-400 underline hover:text-white">support@wealifylabs.site</a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
