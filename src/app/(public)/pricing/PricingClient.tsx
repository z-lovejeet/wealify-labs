"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Sparkles, ShieldCheck, Zap, ArrowRight, Bitcoin, Bot, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PricingClientProps {
    user: any;
    hasAccess: boolean;
    course: any;
}

export default function PricingClient({ user, hasAccess, course }: PricingClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const price = course?.price ? Number(course.price) : 14.99;
    const regularPrice = 49.99;

    const handleAction = () => {
        setLoading(true);
        if (hasAccess) {
            router.push(`/learn/${course.id}`);
        } else if (user) {
            router.push('/checkout');
        } else {
            router.push('/register');
        }
    };

    const getButtonText = () => {
        if (loading) return "Processing...";
        if (hasAccess) return "Resume Masterclass";
        if (user) return "Proceed to Crypto Checkout";
        return "Get Instant Lifetime Access";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-28"
        >
            <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-amber-500/20 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

                <Card className="bg-card/90 backdrop-blur-2xl border-primary/40 shadow-2xl relative overflow-hidden rounded-3xl ring-1 ring-primary/30">
                    {/* Top Ribbon */}
                    <div className="bg-gradient-to-r from-amber-500/20 via-primary/30 to-amber-500/20 py-2.5 px-4 text-center border-b border-primary/20 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Flagship Tier &bull; Masterclass + AI Studio
                        </span>
                    </div>

                    <CardContent className="p-8 md:p-10 space-y-8">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <span>70% Launch Discount</span>
                                <span>&bull;</span>
                                <span>Limited Slots</span>
                            </div>

                            <div className="flex items-baseline justify-center gap-3 mb-2">
                                <span className="text-2xl text-muted-foreground line-through decoration-red-500/60 font-medium">
                                    ${regularPrice.toFixed(2)}
                                </span>
                                <span className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
                                    ${price.toFixed(2)}
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                                Save 70% ($35.00 off catalog price of $49.99). One-time payment, lifetime access.
                            </p>
                        </div>

                        {/* Feature Checklist with AI Highlights */}
                        <div className="space-y-3.5 pt-4 border-t border-border/50 text-sm">
                            {/* AI Features Prominently Displayed */}
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>AI Venture Studio Included ($0 Additional)</span>
                                </div>
                                <div className="space-y-1.5 text-xs text-foreground/90">
                                    <div className="flex items-center gap-2">
                                        <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span className="font-semibold text-white">24/7 AI Masterclass Mentor (Groq / Claude 120B)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span className="font-semibold text-white">AI Venture Idea & Viability Auditor</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                        <span className="font-semibold text-white">Direct-Response Offer & Copywriting Architect</span>
                                    </div>
                                </div>
                            </div>

                            {/* Core Curriculum Features */}
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">Instant Access to 47 Comprehensive Chapters</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">All Downloadable Worksheets & Notion OS Templates</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">7 End-to-End Business Model Blueprints</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">Interactive Cinema Player & PDF Workspace</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">Official Digital Certificate of Completion</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-foreground/90 font-medium">Private Community Access & Future Updates Free</span>
                            </div>
                        </div>

                        {/* Interactive CTA */}
                        <Button
                            size="lg"
                            onClick={handleAction}
                            disabled={loading}
                            className="w-full h-14 text-base md:text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5" />
                            )}
                            <span>{getButtonText()}</span>
                            {!loading && (
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            )}
                        </Button>

                        {/* Payment Support Footer */}
                        <div className="pt-2 border-t border-border/40 text-center space-y-3">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Bitcoin className="w-4 h-4 text-primary" />
                                <span>Secured by <strong>NOWPayments</strong></span>
                            </div>

                            <div className="flex justify-center gap-2 flex-wrap">
                                {["BTC", "ETH", "USDT", "SOL", "LTC"].map((coin) => (
                                    <span key={coin} className="text-[11px] font-mono font-bold bg-secondary/30 border border-border/60 px-2.5 py-1 rounded-md text-muted-foreground">
                                        {coin}
                                    </span>
                                ))}
                                <span className="text-[11px] text-muted-foreground/80 self-center">+300 coins</span>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span>Immediate automated enrollment upon blockchain confirmation</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
