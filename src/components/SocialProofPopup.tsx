"use client";

import { useState, useEffect } from "react";
import { socialProofUsers } from "@/data/user-data";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ShieldCheck, User } from "lucide-react";

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
            // Pick a random user
            const randomUserIndex = Math.floor(Math.random() * socialProofUsers.length);
            const user = socialProofUsers[randomUserIndex];

            // Fixed action for consistency
            const action: ActionType = "member";

            setCurrentData({ user, action });
            setIsVisible(true);

            // Hide after 6 seconds
            setTimeout(() => {
                setIsVisible(false);

                // Schedule next popup after random 15-30s
                const randomDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
                timeoutId = setTimeout(showReview, randomDelay);
            }, 6000);
        };

        // Initial start after random 15-30s
        const initialDelay = Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000;
        timeoutId = setTimeout(showReview, initialDelay);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && currentData && (
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 z-50 max-w-sm rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:left-6 sm:bottom-6"
                >
                    <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${currentData.action === 'purchased' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
                            }`}>
                            {currentData.action === 'purchased' ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <ShieldCheck className="h-5 w-5" />
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none text-foreground">
                                {currentData.action === 'purchased' ? 'Verified Purchase' : 'New Member Joined'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{currentData.user.name}</span>
                                {" from "}
                                <span className="text-foreground">{currentData.user.country}</span>
                                {currentData.action === 'purchased'
                                    ? " just purchased the course"
                                    : " just joined the community"
                                }
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                Verified • Just now
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
