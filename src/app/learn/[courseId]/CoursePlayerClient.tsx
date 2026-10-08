"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Download,
    ExternalLink,
    FileText,
    Loader2,
    Lock,
    Maximize2,
    Minimize2,
    Search,
    Award,
    Sparkles,
    ShieldCheck,
    BookOpen,
    X,
    ChevronDown,
    ChevronRight,
    Trophy,
    RotateCcw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getSignedUrl } from "@/actions/storage";
import { AICopilotDrawer } from "@/components/ai/AICopilotDrawer";

interface CoursePlayerClientProps {
    course: any;
    modules: any[];
    initialCompletedLessonIds?: string[];
    userId?: string;
}

export default function CoursePlayerClient({
    course,
    modules,
    initialCompletedLessonIds = [],
    userId
}: CoursePlayerClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [supabase] = useState(() => createClient());

    // Flatten all curriculum chapters for sequential flow
    const allLessons = useMemo(() => {
        return modules.flatMap((m, mIdx) =>
            (m.lessons || []).map((l: any, lIdx: number) => ({
                ...l,
                moduleTitle: m.title,
                moduleId: m.id,
                moduleOrder: m.order_index ?? (mIdx + 1),
                lessonNumber: lIdx + 1,
            }))
        );
    }, [modules]);

    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(initialCompletedLessonIds));

    // Content Loading (Signed PDF URL)
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [contentError, setContentError] = useState<string | null>(null);

    // Navigation & UI States
    const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const [showThankYou, setShowThankYou] = useState(false);
    const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

    // Certificate Request State
    const [certRequests, setCertRequests] = useState<any[]>([]);
    const [isLoadingCert, setIsLoadingCert] = useState(true);
    const [isRequestingCert, setIsRequestingCert] = useState(false);

    // Active chapter pointer
    const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
    const isCompleted = currentLesson ? completedLessons.has(currentLesson.id) : false;
    const progressPercent = allLessons.length > 0
        ? Math.round((completedLessons.size / allLessons.length) * 100)
        : 0;

    // Check if on final certificate milestone
    const isGraduateView = currentLessonIndex === allLessons.length ||
        (currentLesson?.title?.toLowerCase().includes("thank you") || currentLesson?.title?.toLowerCase().includes("certificate"));

    // Expand current module accordion by default
    useEffect(() => {
        if (currentLesson?.moduleId) {
            setExpandedModules(prev => ({
                ...prev,
                [currentLesson.moduleId]: true
            }));
        }
    }, [currentLesson?.moduleId]);

    // Check for post-purchase success query param
    useEffect(() => {
        if (searchParams?.get("success") === "true") {
            setShowThankYou(true);
            router.replace(`/learn/${course.id}`, { scroll: false });
        }
    }, [searchParams, course.id, router]);

    // Load signed PDF resource whenever active chapter changes
    useEffect(() => {
        if (!currentLesson?.content) {
            setSignedUrl(null);
            setIsLoadingContent(false);
            setContentError(null);
            return;
        }

        let isMounted = true;
        setIsLoadingContent(true);
        setContentError(null);

        async function fetchContent() {
            try {
                if (currentLesson.content.startsWith("http")) {
                    if (isMounted) setSignedUrl(currentLesson.content);
                } else {
                    const cleanPath = currentLesson.content.startsWith("/")
                        ? currentLesson.content.substring(1)
                        : currentLesson.content;
                    const url = await getSignedUrl(course.id, cleanPath);
                    if (isMounted) setSignedUrl(url);
                }
            } catch (err: any) {
                console.error("Error retrieving lesson media:", err);
                if (isMounted) {
                    setContentError(err.message || "Failed to retrieve protected chapter content.");
                    setSignedUrl(null);
                }
            } finally {
                if (isMounted) setIsLoadingContent(false);
            }
        }

        fetchContent();

        return () => {
            isMounted = false;
        };
    }, [currentLesson, course.id]);

    // Realtime sync for certificate requests
    useEffect(() => {
        if (!userId) return;

        const fetchCertificates = async () => {
            const { data } = await supabase
                .from("certificate_requests")
                .select("*")
                .eq("user_id", userId)
                .eq("course_id", course.id)
                .order("created_at", { ascending: false });

            if (data) setCertRequests(data);
            setIsLoadingCert(false);
        };

        fetchCertificates();

        const channel = supabase
            .channel(`cert_status_${userId}`)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "certificate_requests",
                filter: `user_id=eq.${userId}`
            }, () => {
                fetchCertificates();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, course.id, supabase]);

    // Toggle Lesson Completion
    const toggleCompletion = useCallback(async (lessonId: string, markCompleted: boolean) => {
        if (!userId) {
            toast.error("Session expired. Please log in again.");
            return;
        }

        const newCompleted = new Set(completedLessons);
        if (markCompleted) {
            newCompleted.add(lessonId);
        } else {
            newCompleted.delete(lessonId);
        }
        setCompletedLessons(newCompleted);

        try {
            if (markCompleted) {
                const { error } = await supabase.from("lesson_completions").upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    course_id: course.id,
                    completed_at: new Date().toISOString()
                }, {
                    onConflict: "user_id, lesson_id"
                });

                if (error) {
                    console.error("Upsert completion error:", error);
                    toast.error("Failed to record completion.");
                    throw error;
                }
                toast.success("Chapter marked as complete!");
            } else {
                const { error } = await supabase.from("lesson_completions").delete()
                    .eq("user_id", userId)
                    .eq("lesson_id", lessonId);

                if (error) {
                    console.error("Delete completion error:", error);
                    toast.error("Failed to update status.");
                    throw error;
                }
            }
        } catch {
            setCompletedLessons(new Set(initialCompletedLessonIds));
        }
    }, [userId, completedLessons, course.id, initialCompletedLessonIds, supabase]);

    // Next / Previous Navigation Handlers
    const handleNext = useCallback(() => {
        if (currentLessonIndex < allLessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentLessonIndex, allLessons.length]);

    const handlePrev = useCallback(() => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [currentLessonIndex]);

    const handleCompleteAndNext = useCallback(async () => {
        if (currentLesson && !completedLessons.has(currentLesson.id)) {
            await toggleCompletion(currentLesson.id, true);
        }
        handleNext();
    }, [currentLesson, completedLessons, toggleCompletion, handleNext]);

    const handleOpenFullscreen = () => {
        if (signedUrl) {
            window.open(signedUrl, "_blank", "noopener,noreferrer");
            if (currentLesson && !completedLessons.has(currentLesson.id)) {
                toggleCompletion(currentLesson.id, true);
            }
        }
    };

    // Keyboard Shortcuts: Left / Right arrows to switch chapter, C for curriculum
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if active in input / search
            if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

            if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrev();
            } else if (e.key.toLowerCase() === "c") {
                e.preventDefault();
                setIsCurriculumOpen(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    // Certificate submission
    const handleRequestCertificate = async () => {
        if (!userId) return;
        setIsRequestingCert(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", userId)
                .maybeSingle();

            const { data, error } = await supabase.from("certificate_requests").insert({
                user_id: userId,
                course_id: course.id,
                full_name: profile?.full_name || user?.user_metadata?.full_name || "Graduate",
                email: user?.email,
                status: "pending"
            }).select().single();

            if (error) throw error;

            setCertRequests(prev => [data, ...prev]);
            toast.success("Certificate request submitted successfully!");
        } catch (error: any) {
            console.error("Certificate request error:", error);
            toast.error("Failed to request certificate. Please try again.");
        } finally {
            setIsRequestingCert(false);
        }
    };

    // Filter modules and lessons for drawer
    const filteredModules = useMemo(() => {
        if (!searchQuery.trim()) return modules;
        const q = searchQuery.toLowerCase();
        return modules
            .map(m => ({
                ...m,
                lessons: (m.lessons || []).filter((l: any) =>
                    l.title.toLowerCase().includes(q) || m.title.toLowerCase().includes(q)
                )
            }))
            .filter(m => m.lessons.length > 0);
    }, [modules, searchQuery]);

    if (!currentLesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712] text-foreground p-6">
                <div className="text-center space-y-4 max-w-md">
                    <FileText className="w-12 h-12 text-primary mx-auto" />
                    <h2 className="text-2xl font-bold text-white">Curriculum In Preparation</h2>
                    <p className="text-muted-foreground text-sm">Course lessons are being populated. Return to your dashboard.</p>
                    <Link href="/dashboard">
                        <Button className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                            Return to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen h-screen w-full bg-[#030712] text-slate-100 flex flex-col overflow-hidden select-none-text">
            {/* Top Navigation Bar: Minimal, Premium, Apple/Linear aesthetic */}
            <header className="h-16 px-4 md:px-8 border-b border-white/[0.08] bg-[#030712]/90 backdrop-blur-2xl flex items-center justify-between shrink-0 sticky top-0 z-40">
                {/* Left: Back to Student Dashboard */}
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                    <Link href="/dashboard" className="group">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-3.5 h-9 transition-all duration-200 hover:-translate-x-0.5"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1 text-primary" />
                            <span>Dashboard</span>
                        </Button>
                    </Link>

                    <div className="h-4 w-px bg-white/10 hidden sm:block" />

                    {/* Course Title & Current Module */}
                    <div className="min-w-0 flex items-center gap-2">
                        <span className="hidden lg:inline text-xs font-medium text-muted-foreground truncate max-w-[200px]">
                            {course.title}
                        </span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/50 hidden lg:inline" />
                        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full shrink-0">
                            Ch. {currentLessonIndex + 1}/{allLessons.length}
                        </span>
                        <h1 className="text-xs md:text-sm font-semibold text-white truncate max-w-[240px] sm:max-w-md">
                            {currentLesson.title}
                        </h1>
                    </div>
                </div>

                {/* Right: Curriculum Drawer Trigger, Progress, & Controls */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {/* Curriculum Quick Switcher Pill */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCurriculumOpen(true)}
                        className="h-9 px-3.5 rounded-xl border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.09] text-xs font-semibold text-slate-200 hover:text-white gap-2 transition-colors shadow-sm"
                    >
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span className="hidden sm:inline">Curriculum</span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-white/[0.06] px-1.5 py-0.5 rounded">
                            {completedLessons.size}/{allLessons.length}
                        </span>
                    </Button>

                    {/* AI Curriculum Mentor Trigger */}
                    <Button
                        size="sm"
                        onClick={() => setIsAICopilotOpen(true)}
                        className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 border border-amber-500/30 text-amber-300 font-bold text-xs gap-1.5 shadow-sm transition-all"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">AI Mentor</span>
                    </Button>

                    {/* Overall Progress Indicator */}
                    <div className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-xl">
                        <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Progress</div>
                            <div className="text-xs font-bold text-emerald-400 font-mono">{progressPercent}%</div>
                        </div>
                        <div className="w-16">
                            <Progress value={progressPercent} className="h-1.5 bg-white/10" />
                        </div>
                    </div>

                    {/* Theater / Full-Width Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsTheaterMode(prev => !prev)}
                        className="hidden lg:flex w-9 h-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]"
                        title={isTheaterMode ? "Standard Width" : "Theater Full-Width"}
                    >
                        {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>

                    {/* Certificate Badge if 100% complete */}
                    {progressPercent === 100 && (
                        <Button
                            size="sm"
                            onClick={() => setCurrentLessonIndex(allLessons.length - 1)}
                            className="h-9 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs gap-1.5 shadow-lg shadow-amber-500/20"
                        >
                            <Trophy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Certificate</span>
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Stage: Expansive Full Screen Learning Space */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#030712] via-[#050b18] to-[#030712] relative">
                {/* Ambient Top Glow Effect */}
                <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-48 bg-amber-500/[0.05] blur-[100px]" />

                <div className={cn(
                    "w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 transition-all duration-300 pb-28",
                    isTheaterMode ? "max-w-[96vw]" : "max-w-6xl"
                )}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentLesson.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.22 }}
                            className="space-y-6"
                        >
                            {isGraduateView ? (
                                /* Final Certificate & Masterclass Celebration View */
                                <div className="py-8 flex items-center justify-center">
                                    <div className="w-full max-w-2xl bg-[#090e1a]/80 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-black relative overflow-hidden">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 blur-3xl pointer-events-none" />

                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-xl shadow-amber-500/20">
                                            <Award className="w-10 h-10" />
                                        </div>

                                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block mb-3">
                                            Masterclass Completed
                                        </span>

                                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                            Congratulations, Graduate!
                                        </h2>
                                        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                                            You have completed all curriculum chapters of <strong>{course.title}</strong>. Your execution blueprint is ready to deploy.
                                        </p>

                                        <Separator className="my-8 bg-white/10" />

                                        {/* Certificate Status Section */}
                                        <div className="max-w-md mx-auto space-y-4">
                                            {(() => {
                                                const latestRequest = certRequests[0];
                                                const isApproved = latestRequest?.status === "approved";
                                                const isPending = latestRequest?.status === "pending";
                                                const isRejected = latestRequest?.status === "rejected";

                                                if (isApproved) {
                                                    return (
                                                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2 text-center">
                                                            <div className="flex items-center justify-center gap-2 font-bold text-base text-emerald-400">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Official Certificate Issued!
                                                            </div>
                                                            <p className="text-xs text-slate-300">
                                                                Your official credential has been issued. Check your email inbox or contact support for a high-res PDF copy.
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                if (isPending) {
                                                    return (
                                                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-200 space-y-2 text-center">
                                                            <div className="flex items-center justify-center gap-2 font-bold text-sm text-amber-400">
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Verification in Progress
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Our academic team is verifying your completed chapters. Your verified credential will be ready shortly.
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="space-y-3">
                                                        {isRejected && (
                                                            <p className="text-xs text-rose-400 font-medium">
                                                                Previous request was rejected. Please re-submit verification.
                                                            </p>
                                                        )}
                                                        <Button
                                                            onClick={handleRequestCertificate}
                                                            disabled={isRequestingCert || isLoadingCert}
                                                            className="w-full h-12 font-bold shadow-xl shadow-amber-500/25 text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950"
                                                        >
                                                            {isRequestingCert ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    Submitting Claim...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Award className="w-5 h-5 mr-2" />
                                                                    Claim Official Certificate
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                );
                                            })()}

                                            <Link href="/dashboard" className="block pt-2">
                                                <Button variant="ghost" size="sm" className="w-full text-xs text-slate-400 hover:text-white">
                                                    Return to Student Dashboard
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* High-End Cinema Document Player Stage */
                                <>
                                    {/* Chapter Context Header Bar */}
                                    <div className="rounded-2xl border border-white/[0.08] bg-[#080d1a]/80 backdrop-blur-xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                                                    Module {currentLesson.moduleOrder} • {currentLesson.moduleTitle}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground font-mono">
                                                    Chapter {currentLessonIndex + 1} of {allLessons.length}
                                                </span>
                                                {isCompleted && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                                                        <Check className="w-3 h-3" /> Completed
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                                                {currentLesson.title}
                                            </h2>
                                        </div>

                                        {/* Quick Actions for this Document */}
                                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                            {signedUrl && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleOpenFullscreen}
                                                        className="h-9 px-3 rounded-xl border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white gap-1.5"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                                                        <span>Open Fullscreen</span>
                                                    </Button>

                                                    <a href={signedUrl} download={`Chapter-${currentLessonIndex + 1}.pdf`} target="_blank" rel="noreferrer">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-9 px-3 rounded-xl border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white gap-1.5"
                                                        >
                                                            <Download className="w-3.5 h-3.5 text-slate-300" />
                                                            <span>Download PDF</span>
                                                        </Button>
                                                    </a>
                                                </>
                                            )}

                                            {/* Instant Completion Toggle */}
                                            <Button
                                                size="sm"
                                                onClick={() => toggleCompletion(currentLesson.id, !isCompleted)}
                                                className={cn(
                                                    "h-9 px-4 rounded-xl font-bold text-xs gap-1.5 transition-all shadow-md",
                                                    isCompleted
                                                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                                                        : "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.12]"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span>Completed</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>Mark as Complete</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Massive High-Definition Document Canvas */}
                                    <div className="rounded-2xl border border-white/[0.1] bg-[#070b14] shadow-2xl shadow-black overflow-hidden relative ring-1 ring-white/5">
                                        {/* Canvas Header Bar */}
                                        <div className="px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="font-mono text-[11px] text-slate-400">PDF Reader Canvas</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <span>Use pinch or trackpad to zoom</span>
                                            </div>
                                        </div>

                                        {/* Embedded PDF Viewport */}
                                        <div className="relative w-full h-[72vh] md:h-[78vh] min-h-[620px] bg-[#0b0f19] flex items-center justify-center">
                                            {isLoadingContent ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-pulse">
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-300">Decrypting chapter content...</p>
                                                    <div className="w-64 max-w-full space-y-2">
                                                        <Skeleton className="h-3 w-full bg-white/10" />
                                                        <Skeleton className="h-3 w-4/5 mx-auto bg-white/10" />
                                                    </div>
                                                </div>
                                            ) : contentError ? (
                                                <div className="text-center p-8 max-w-md space-y-3">
                                                    <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                                                        <Lock className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="font-bold text-base text-white">Access Notice</h3>
                                                    <p className="text-xs text-slate-400">{contentError}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.location.reload()}
                                                        className="mt-2 text-xs"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                                                        Retry Session
                                                    </Button>
                                                </div>
                                            ) : signedUrl ? (
                                                <div className="w-full h-full relative group">
                                                    <iframe
                                                        src={`${signedUrl}#view=FitH&toolbar=1`}
                                                        title={currentLesson.title}
                                                        className="w-full h-full border-0"
                                                    />
                                                    {/* Floating Helper in case browser restricts embedded iframe */}
                                                    <div className="absolute bottom-5 right-5 opacity-90 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            onClick={handleOpenFullscreen}
                                                            className="shadow-2xl shadow-black bg-slate-900/90 hover:bg-slate-800 text-white border border-white/20 text-xs font-bold backdrop-blur-md rounded-xl"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-primary" />
                                                            Launch in New Tab
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-12 max-w-md space-y-3">
                                                    <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                                                    <h3 className="font-bold text-base text-white">Study Notes Chapter</h3>
                                                    <p className="text-xs text-muted-foreground">
                                                        Review the implementation instructions and mark complete when finished.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Next Step Bar */}
                                    <div className="rounded-2xl border border-white/[0.08] bg-[#090e1a]/80 backdrop-blur-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="space-y-1 text-center sm:text-left">
                                            <div className="text-xs font-bold text-primary uppercase tracking-wider">Next Step</div>
                                            <h4 className="font-bold text-base text-white">
                                                {currentLessonIndex < allLessons.length - 1
                                                    ? `Up Next: ${allLessons[currentLessonIndex + 1]?.title}`
                                                    : "Final Chapter Completed!"}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                Complete this chapter and continue on your masterclass path.
                                            </p>
                                        </div>

                                        <Button
                                            onClick={handleCompleteAndNext}
                                            disabled={currentLessonIndex === allLessons.length - 1 && isCompleted}
                                            className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/20 text-sm gap-2"
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <span>Continue to Next Chapter</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Mark Complete & Continue</span>
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Floating Bottom Navigation Dock: Modern floating island */}
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl">
                    <div className="bg-[#090e1d]/90 backdrop-blur-2xl border border-white/[0.12] rounded-2xl px-4 sm:px-6 py-3 shadow-2xl shadow-black/90 flex items-center justify-between gap-3">
                        {/* Prev Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrev}
                            disabled={currentLessonIndex === 0}
                            className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                            <span className="hidden sm:inline">Previous</span>
                        </Button>

                        {/* Center: Curriculum Quick Drawer Pill */}
                        <div
                            onClick={() => setIsCurriculumOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer transition-colors"
                        >
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-mono font-bold text-slate-200">
                                {currentLessonIndex + 1} / {allLessons.length}
                            </span>
                            <span className="text-[10px] text-muted-foreground hidden sm:inline">
                                ({progressPercent}%)
                            </span>
                        </div>

                        {/* Next Button */}
                        <Button
                            size="sm"
                            onClick={handleNext}
                            disabled={currentLessonIndex === allLessons.length - 1}
                            className="h-9 px-4 rounded-xl text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/[0.1] disabled:opacity-30"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                    </div>
                </div>
            </main>

            {/* Slide-Over Curriculum Drawer (Opened via Curriculum Button) */}
            <Sheet open={isCurriculumOpen} onOpenChange={setIsCurriculumOpen}>
                <SheetContent side="right" className="p-0 w-full sm:max-w-md bg-[#050914] border-l border-white/[0.08] text-slate-100 flex flex-col">
                    <SheetTitle className="sr-only">Course Curriculum</SheetTitle>
                    <SheetDescription className="sr-only">Browse all 48 course chapters</SheetDescription>

                    {/* Drawer Header */}
                    <div className="p-6 border-b border-white/[0.08] bg-[#070c18] space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-lg text-white">Course Curriculum</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {completedLessons.size} of {allLessons.length} chapters completed
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                                <Sparkles className="w-3 h-3" />
                                {progressPercent}%
                            </div>
                        </div>

                        <Progress value={progressPercent} className="h-2 bg-white/10" />

                        {/* Chapter Search Box */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-400/50 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Drawer Scrollable Module & Chapter List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredModules.map((module, mIdx) => {
                            const modId = module.id || `mod-${mIdx}`;
                            const isExpanded = expandedModules[modId] ?? true;
                            const modLessons = module.lessons || [];
                            const modCompletedCount = modLessons.filter((l: any) => completedLessons.has(l.id)).length;
                            const isModComplete = modLessons.length > 0 && modCompletedCount === modLessons.length;

                            return (
                                <div
                                    key={modId}
                                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                                >
                                    {/* Module Header Toggle */}
                                    <button
                                        onClick={() => {
                                            setExpandedModules(prev => ({
                                                ...prev,
                                                [modId]: !prev[modId]
                                            }));
                                        }}
                                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                                    >
                                        <div className="min-w-0 pr-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                                <span>Module {module.order_index ?? (mIdx + 1)}</span>
                                                {isModComplete && (
                                                    <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                                                        <Check className="w-2.5 h-2.5" /> Done
                                                    </span>
                                                )}
                                            </div>
                                            <div className="font-semibold text-xs sm:text-sm text-white truncate mt-0.5">
                                                {module.title}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-[11px] font-mono text-muted-foreground">
                                                {modCompletedCount}/{modLessons.length}
                                            </span>
                                            <ChevronDown className={cn(
                                                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                                                !isExpanded && "-rotate-90"
                                            )} />
                                        </div>
                                    </button>

                                    {/* Module Lessons */}
                                    {isExpanded && (
                                        <div className="border-t border-white/[0.04] p-2 space-y-1 bg-black/20">
                                            {modLessons.map((lesson: any) => {
                                                const globalIdx = allLessons.findIndex(l => l.id === lesson.id);
                                                const isCurrent = globalIdx === currentLessonIndex;
                                                const isDone = completedLessons.has(lesson.id);

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() => {
                                                            setCurrentLessonIndex(globalIdx);
                                                            setIsCurriculumOpen(false);
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
                                                        className={cn(
                                                            "group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer select-none",
                                                            isCurrent
                                                                ? "bg-amber-400/10 border border-amber-400/30 text-amber-300 font-semibold shadow-sm"
                                                                : "hover:bg-white/[0.04] text-slate-300 hover:text-white"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                            {/* Checkbox button */}
                                                            <div
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleCompletion(lesson.id, !isDone);
                                                                }}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer",
                                                                    isDone
                                                                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                                                        : isCurrent
                                                                        ? "border-amber-400/50 hover:border-amber-400"
                                                                        : "border-white/20 hover:border-white/50"
                                                                )}
                                                                title={isDone ? "Mark Incomplete" : "Mark Complete"}
                                                            >
                                                                {isDone ? (
                                                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                                                ) : isCurrent ? (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                                ) : null}
                                                            </div>

                                                            <span className="truncate leading-tight">
                                                                {lesson.title}
                                                            </span>
                                                        </div>

                                                        <div className="shrink-0 flex items-center gap-1.5 ml-2">
                                                            {isCurrent ? (
                                                                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                                    PDF
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Welcome Celebration Modal (Upon Enrollment) */}
            <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
                <DialogContent className="sm:max-w-md text-center p-8 bg-[#090e1a] border border-white/10 text-slate-100">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-4 text-amber-400 animate-in zoom-in duration-300">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-center tracking-tight text-white">
                            Enrollment Verified!
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2 text-sm text-slate-300 leading-relaxed">
                            Welcome to <strong>{course.title}</strong>. Your lifetime access is active.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-xs text-muted-foreground">
                            Start Chapter 1 now. Download each framework and implement the steps.
                        </p>
                        <Button
                            className="w-full h-11 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setShowThankYou(false)}
                        >
                            Begin Chapter 1
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* AI Curriculum Copilot Drawer */}
            <AICopilotDrawer
                isOpen={isAICopilotOpen}
                onOpenChange={setIsAICopilotOpen}
                chapterTitle={currentLesson.title}
                moduleTitle={currentLesson.moduleTitle}
                courseTitle={course.title}
            />
        </div>
    );
}
