"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    PlayCircle,
    Award,
    Clock,
    BookOpen,
    Star,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Check,
    Loader2,
    Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AIVentureValidatorModal } from "@/components/ai/AIVentureValidatorModal";
import { AICopyArchitectModal } from "@/components/ai/AICopyArchitectModal";

interface DashboardClientProps {
    user: any;
    course: any;
    isEnrolled: boolean;
    stats: {
        totalLessons: number;
        completedLessons: number;
        progress: number;
    };
}

export default function DashboardClient({ user, course, isEnrolled, stats }: DashboardClientProps) {
    const [supabase] = useState(() => createClient());

    // Certificate & Review State
    const [certRequests, setCertRequests] = useState<any[]>([]);
    const [userReview, setUserReview] = useState<any>(null);
    const [isLoadingCert, setIsLoadingCert] = useState(true);

    // Dialog States
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isValidatorOpen, setIsValidatorOpen] = useState(false);
    const [isCopyArchitectOpen, setIsCopyArchitectOpen] = useState(false);

    // Form States
    const [certName, setCertName] = useState("");
    const [certEmail, setCertEmail] = useState("");
    const [certStatus, setCertStatus] = useState<"idle" | "submitting" | "success">("idle");

    const [reviewName, setReviewName] = useState("");
    const [reviewCountry, setReviewCountry] = useState("");
    const [reviewFeedback, setReviewFeedback] = useState("");
    const [reviewStatus, setReviewStatus] = useState<"idle" | "submitting" | "success">("idle");

    useEffect(() => {
        if (!user || !course?.id) return;

        const fetchData = async () => {
            const { data } = await supabase
                .rpc('get_user_dashboard_data', {
                    target_course_id: course.id
                });

            if (data) {
                const result = data as any;
                if (result.cert_requests) setCertRequests(result.cert_requests);
                if (result.review) setUserReview(result.review);
            }
            setIsLoadingCert(false);
        };

        fetchData();

        const channel = supabase
            .channel(`dashboard_updates_${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'certificate_requests',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchData();
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'reviews',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, course?.id, supabase]);

    const handleRequestCertificate = async () => {
        setCertStatus("submitting");
        try {
            const { data, error } = await supabase.from('certificate_requests').insert({
                user_id: user.id,
                course_id: course.id,
                full_name: certName.trim(),
                email: certEmail.trim(),
                status: 'pending'
            }).select().single();

            if (error) throw error;

            setCertRequests(prev => [data, ...prev]);
            setCertStatus("success");
            toast.success("Certificate request submitted successfully!");
        } catch (error) {
            console.error("Cert Request Error:", error);
            setCertStatus("idle");
            toast.error("Failed to submit request. Please try again.");
        }
    };

    const handleSubmitReview = async () => {
        setReviewStatus("submitting");
        try {
            const { data, error } = await supabase.from('reviews').insert({
                user_id: user.id,
                course_id: course.id,
                student_name: reviewName.trim(),
                student_country: reviewCountry.trim(),
                feedback: reviewFeedback.trim()
            }).select().single();

            if (error) throw error;

            setUserReview(data);
            setReviewStatus("success");
            toast.success("Thank you! Your review has been submitted.");
        } catch (error) {
            console.error("Review Submit Error:", error);
            setReviewStatus("idle");
            toast.error("Failed to submit review. Please try again.");
        }
    };

    const firstName = user?.profile?.full_name?.split(" ")[0] || user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Member";
    const isCompleted = stats.progress === 100;

    const rejectedCount = certRequests.filter(r => r.status === 'rejected').length;
    const latestRequest = certRequests[0];
    const isBlocked = rejectedCount >= 3;
    const isPending = latestRequest?.status === 'pending';
    const isApproved = latestRequest?.status === 'approved';

    return (
        <div className="space-y-8 animate-in fade-in duration-300 relative">
            {/* Header Greeting Banner */}
            <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-primary/5 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Executive Learning Portal</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            Welcome back, {firstName}!
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                            {isCompleted
                                ? "Outstanding work! You have finished all curriculum modules. Review your certificate credentials below."
                                : `You've achieved ${stats.progress}% completion. Keep up the consistent execution.`}
                        </p>
                    </div>

                    {isEnrolled && course && (
                        <div className="shrink-0">
                            <Link href={`/learn/${course.id}`}>
                                <Button size="lg" className="h-12 px-6 font-bold shadow-lg shadow-primary/25 gap-2 text-base">
                                    <span>Resume Lesson</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* 3 Bento Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <Card className="hover:border-primary/40 transition-all duration-300 bg-card/60 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Overall Progress</CardTitle>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                            <Clock className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-baseline justify-between">
                            <div className="text-3xl font-extrabold font-mono text-foreground">{stats.progress}%</div>
                            <span className="text-xs text-muted-foreground">{stats.completedLessons} of {stats.totalLessons} done</span>
                        </div>
                        <Progress value={stats.progress} className="h-2 bg-muted/50" />
                    </CardContent>
                </Card>

                {/* Metric 2 */}
                <Card className="hover:border-emerald-500/40 transition-all duration-300 bg-card/60 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Completed Chapters</CardTitle>
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <PlayCircle className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-3xl font-extrabold font-mono text-foreground">
                            {stats.completedLessons} <span className="text-lg font-normal text-muted-foreground">/ {stats.totalLessons}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.totalLessons - stats.completedLessons === 0 ? "Curriculum fully completed" : `${stats.totalLessons - stats.completedLessons} chapters remaining`}
                        </p>
                    </CardContent>
                </Card>

                {/* Metric 3 */}
                <Card className="hover:border-amber-500/40 transition-all duration-300 bg-card/60 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Credential Status</CardTitle>
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                            <Award className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-xl font-bold text-foreground">
                            {isApproved ? (
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                    <Check className="w-5 h-5 stroke-[3]" /> Verified
                                </span>
                            ) : isPending ? (
                                <span className="text-primary flex items-center gap-1.5">
                                    <Loader2 className="w-4 h-4 animate-spin" /> In Review
                                </span>
                            ) : isCompleted ? (
                                <span className="text-amber-400">Ready to Claim</span>
                            ) : (
                                <span className="text-muted-foreground">Locked</span>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isApproved ? "Certificate delivered via email" : isCompleted ? "Submit your details to claim" : "Requires 100% completion"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Credential Action Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
                {(() => {
                    if (isApproved) {
                        return (
                            <Button className="gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 border cursor-default" variant="outline">
                                <ShieldCheck className="w-4 h-4" /> Certificate Verified
                            </Button>
                        );
                    }
                    if (isPending) {
                        return (
                            <Button className="gap-2" variant="secondary" disabled>
                                <Clock className="w-4 h-4" /> Verification Pending
                            </Button>
                        );
                    }
                    if (isBlocked) {
                        return (
                            <Button className="gap-2" variant="destructive" disabled>
                                <Award className="w-4 h-4" /> Request Limit Reached
                            </Button>
                        );
                    }

                    return (
                        <Button
                            className="gap-2 font-bold shadow-md shadow-primary/20"
                            variant={isCompleted ? "default" : "outline"}
                            disabled={!isCompleted || isLoadingCert}
                            onClick={() => {
                                setCertName(user?.profile?.full_name || user?.user_metadata?.full_name || "");
                                setCertEmail(user?.email || "");
                                setIsCertModalOpen(true);
                            }}
                        >
                            <Award className="w-4 h-4" />
                            {rejectedCount > 0 ? `Retry Request (${3 - rejectedCount} left)` : "Claim Official Certificate"}
                            {!isCompleted && " (Locked)"}
                        </Button>
                    );
                })()}

                {userReview ? (
                    <Button variant="secondary" disabled className="gap-2 text-xs">
                        <Check className="w-4 h-4 text-emerald-400" /> Review Submitted
                    </Button>
                ) : (
                    <Button
                        variant={isCompleted ? "secondary" : "outline"}
                        disabled={!isCompleted}
                        onClick={() => {
                            setReviewName(user?.profile?.full_name || user?.user_metadata?.full_name || "");
                            setIsReviewModalOpen(true);
                        }}
                        className="gap-2 text-xs font-semibold"
                    >
                        <Star className="w-4 h-4 text-amber-400" /> Write Review {(!isCompleted) && "(Locked)"}
                    </Button>
                )}
            </div>

            {/* AI Venture Studio: 3 Production AI Tools */}
            <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                AI Venture Studio
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">Powered by Claude 5.5 Sonnet</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground mt-1">Interactive AI Acceleration Tools</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tool 1: Venture Idea Validator */}
                    <Card className="bg-card/60 backdrop-blur-md border border-border/60 hover:border-amber-500/40 transition-all rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-foreground">Venture Idea Validator</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Audit product demand, calculate pricing thresholds, and generate a 7-day zero-cost validation test.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsValidatorOpen(true)}
                            className="w-full mt-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-foreground border border-border/80 text-xs font-bold gap-2"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Launch Idea Auditor</span>
                        </Button>
                    </Card>

                    {/* Tool 2: Offer Copy Architect */}
                    <Card className="bg-card/60 backdrop-blur-md border border-border/60 hover:border-emerald-500/40 transition-all rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-foreground">Offer Copy Architect</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Synthesize high-converting hooks, value proposition statements, and risk-reversal guarantees in seconds.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsCopyArchitectOpen(true)}
                            className="w-full mt-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-foreground border border-border/80 text-xs font-bold gap-2"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Generate Copy Suite</span>
                        </Button>
                    </Card>

                    {/* Tool 3: Curriculum AI Copilot */}
                    <Card className="bg-card/60 backdrop-blur-md border border-border/60 hover:border-primary/40 transition-all rounded-2xl p-5 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-foreground">24/7 Chapter Mentor</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    Access real-time guidance directly inside any course chapter to extract action steps and avoid rookie mistakes.
                                </p>
                            </div>
                        </div>
                        <Link href={`/learn/${course?.id || "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"}`}>
                            <Button
                                className="w-full mt-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold gap-2"
                            >
                                <span>Open in Course Player</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>

            {/* Course Overview Card */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">Active Curriculum</h2>
                    <Link href="/my-courses">
                        <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary hover:text-primary/80">
                            View All Courses &rarr;
                        </Button>
                    </Link>
                </div>

                {isEnrolled && course ? (
                    <Card className="overflow-hidden hover:border-primary/40 transition-all duration-300 bg-card/60 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-80 h-52 md:h-auto bg-muted shrink-0 relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <Image
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 320px"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
                                        <BookOpen className="w-14 h-14 text-muted-foreground/40" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className="font-extrabold text-2xl text-foreground tracking-tight">{course.title}</h3>
                                        <span className="shrink-0 bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold border border-green-500/20">
                                            Active
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-semibold text-muted-foreground font-mono">
                                            <span>Progress: {stats.progress}%</span>
                                            <span>{stats.completedLessons} / {stats.totalLessons} Chapters</span>
                                        </div>
                                        <Progress value={stats.progress} className="h-2.5" />
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <Link href={`/learn/${course.id}`}>
                                            <Button size="lg" className="h-11 px-6 font-bold gap-2">
                                                Continue Masterclass <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="text-center py-16 border-dashed border-2 bg-card/30">
                        <div className="w-16 h-16 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Active Enrollments</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
                            You are not currently enrolled in any courses. Explore the curriculum and start building sustainable income.
                        </p>
                        <Link href="/pricing">
                            <Button size="lg" className="font-bold">
                                View Blueprint Pricing
                            </Button>
                        </Link>
                    </Card>
                )}
            </div>

            {/* Modern Certificate Modal */}
            <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
                <DialogContent className="sm:max-w-md p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Request Official Certificate</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Verify your credentials for your accredited certificate of completion.
                        </DialogDescription>
                    </DialogHeader>

                    {certStatus === "success" ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold">Verification Request Submitted!</h3>
                            <p className="text-xs text-muted-foreground">
                                We will verify your course progress and email your verified credential within 24 hours.
                            </p>
                            <Button onClick={() => setIsCertModalOpen(false)} className="w-full font-bold">
                                Done
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="certName">Full Name (as it appears on certificate)</Label>
                                <Input
                                    id="certName"
                                    value={certName}
                                    onChange={(e) => setCertName(e.target.value)}
                                    placeholder="e.g. Michael Chen"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="certEmail">Delivery Email Address</Label>
                                <Input
                                    id="certEmail"
                                    type="email"
                                    value={certEmail}
                                    onChange={(e) => setCertEmail(e.target.value)}
                                    placeholder="e.g. michael@example.com"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setIsCertModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRequestCertificate}
                                    disabled={certStatus === "submitting" || !certName.trim() || !certEmail.trim()}
                                    className="font-bold"
                                >
                                    {certStatus === "submitting" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Claim"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modern Review Modal */}
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogContent className="sm:max-w-md p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Share Your Experience</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Your feedback helps other ambitious builders evaluate the curriculum.
                        </DialogDescription>
                    </DialogHeader>

                    {reviewStatus === "success" ? (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold">Thank You for Your Feedback!</h3>
                            <p className="text-xs text-muted-foreground">Your review has been successfully submitted.</p>
                            <Button onClick={() => setIsReviewModalOpen(false)} className="w-full font-bold">
                                Close
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="reviewName">Your Name</Label>
                                <Input
                                    id="reviewName"
                                    value={reviewName}
                                    onChange={(e) => setReviewName(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reviewCountry">Country / Location</Label>
                                <Input
                                    id="reviewCountry"
                                    value={reviewCountry}
                                    onChange={(e) => setReviewCountry(e.target.value)}
                                    placeholder="e.g. United States"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reviewFeedback">Your Honest Review</Label>
                                <Textarea
                                    id="reviewFeedback"
                                    rows={4}
                                    value={reviewFeedback}
                                    onChange={(e) => setReviewFeedback(e.target.value)}
                                    placeholder="How has the Blueprint helped your business or mindset?"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitReview}
                                    disabled={reviewStatus === "submitting" || !reviewName.trim() || !reviewFeedback.trim()}
                                    className="font-bold"
                                >
                                    {reviewStatus === "submitting" ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* AI Venture Acceleration Modals */}
            <AIVentureValidatorModal
                isOpen={isValidatorOpen}
                onOpenChange={setIsValidatorOpen}
            />
            <AICopyArchitectModal
                isOpen={isCopyArchitectOpen}
                onOpenChange={setIsCopyArchitectOpen}
            />
        </div>
    );
}
