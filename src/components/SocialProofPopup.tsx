"use client";

import { useState, useEffect } from "react";
import { socialProofUsers } from "@/data/user-data";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

type ActionType = "purchased" | "member";

interface NotificationData {
    user: { name: string; country: string };
    action: ActionType;
}

export function SocialProofPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentData, setCurrentData] = useState<NotificationData | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const showReview = () => {
            const randomUserIndex = Math.floor(Math.random() * socialProofUsers.length);
            const user = socialProofUsers[randomUserIndex];
            const action: ActionType = "member";

            setCurrentData({ user, action });
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
                const randomDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
                timeoutId = setTimeout(showReview, randomDelay);
            }, 6000);
        };

        const initialDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
        timeoutId = setTimeout(showReview, initialDelay);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && currentData && (
                <motion.div
                    initial={{ opacity: 0, x: -40, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="fixed bottom-5 left-5 z-50 max-w-sm rounded-2xl border border-border/70 bg-card/90 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-primary/20"
                >
                    <div className="flex items-center gap-3.5">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                            <Sparkles className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground">
                                    {currentData.user.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    from {currentData.user.country}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-snug">
                                Enrolled in the <strong className="text-foreground">2026 Blueprint</strong>
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium pt-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Verified enrollment &bull; Just now</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
