"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";
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
        if (loading) return "Loading...";
        if (hasAccess) return "Go to Course";
        if (user) return "Buy Now";
        return "Get Instant Access";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24"
        >
            <Card className="bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl relative overflow-hidden ring-1 ring-primary/20">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <CardContent className="p-8 md:p-10 space-y-8">
                    <div className="text-center">
                        <Badge variant="secondary" className="mb-4">Limited Time Offer</Badge>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            {/* Mock original price for now since schema update failed */}
                            <span className="text-2xl text-muted-foreground line-through decoration-red-500/50">${(course.price * 2).toFixed(2)}</span>
                            <span className="text-6xl font-black tracking-tighter text-foreground">${course.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">One-time payment. Lifetime access.</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Instant Access to All Course Material</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Mobile-Friendly Learning Platform</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Official Certificate of Completion</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>24/7 Priority Support</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Exclusive Community Access</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Proven Strategies & Blueprints</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Secure SSL Payment</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span>Lifetime Access to Course</span>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleAction}
                        disabled={loading}
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
                    >
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {getButtonText()}
                    </Button>

                    <div className="flex justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                        <div className="text-xs font-semibold border px-2 py-1 rounded">VISA</div>
                        <div className="text-xs font-semibold border px-2 py-1 rounded">Mastercard</div>
                        <div className="text-xs font-semibold border px-2 py-1 rounded">PayPal</div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
