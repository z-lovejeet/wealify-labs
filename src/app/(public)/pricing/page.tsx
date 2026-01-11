"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, PlayCircle, FileText, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { singleCourse } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [course, setCourse] = useState<any>(singleCourse);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
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
            setUser(user);

            if (user && courseData) {
                const { data: enrollments } = await supabase
                    .from('enrollments')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('course_id', courseData.id);

                if (enrollments && enrollments.length > 0) {
                    setHasAccess(true);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleAction = () => {
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
        <div className="bg-background min-h-screen pt-24 pb-24">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container max-w-6xl mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Start Your Journey <span className="text-primary">Today</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Stop dreaming about financial freedom and start building it. You are one decision away from a completely different life.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Value Proposition */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary" />
                                What's Included In The Blueprint?
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <PlayCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">8 Core Video Modules</h4>
                                        <p className="text-sm text-muted-foreground">Step-by-step HD video training covering mentality, strategy, and execution.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Templates & Resources</h4>
                                        <p className="text-sm text-muted-foreground">Downloadable worksheets, scripts, and planners to speed up your progress.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-card border border-border/50 rounded-xl flex gap-4">
                                    <div className="mt-1 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Private Community Access</h4>
                                        <p className="text-sm text-muted-foreground">Network with like-minded individuals and get answers to your questions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Right Column: Pricing Card */}
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
                                        <span>Free Lifetime Updates</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span>Secure SSL Payment</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    onClick={handleAction}
                                    disabled={loading || hasAccess} // Disable if loading or already owned (though text changes)
                                    className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {getButtonText()}
                                </Button>

                                <div className="flex justify-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                                    {/* Mock payment icons */}
                                    <div className="text-xs font-semibold border px-2 py-1 rounded">VISA</div>
                                    <div className="text-xs font-semibold border px-2 py-1 rounded">Mastercard</div>
                                    <div className="text-xs font-semibold border px-2 py-1 rounded">PayPal</div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
