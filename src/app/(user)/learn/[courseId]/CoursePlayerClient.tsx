"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Lock, Menu, FileText, Download, ChevronLeft, ArrowLeft, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSignedUrl } from "@/actions/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";

// Assuming CoursePlayerClientProps is defined elsewhere or will be defined.
// For now, I'll infer the types based on the new props.
interface CoursePlayerClientProps {
    course: any;
    modules: any[]; // Kept as 'modules' to match usages
    initialCompletedLessonIds?: string[];
    userId?: string;
}

export default function CoursePlayerClient({
    course,
    modules,
    initialCompletedLessonIds = [],
    userId
}: CoursePlayerClientProps) {
    // Use state to keep the client stable across renders
    const [supabase] = useState(() => createClient());
    // Flatten lessons to make navigation easier
    const allLessons = modules.flatMap(m => m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })));
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(initialCompletedLessonIds));

    // Certificate Logic
    const [certRequests, setCertRequests] = useState<any[]>([]);
    const [isLoadingCert, setIsLoadingCert] = useState(true);
    const [isRequestingCert, setIsRequestingCert] = useState(false);

    // Thank You Modal Logic
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        if (searchParams?.get("success") === "true") {
            setShowThankYou(true);
            // Fire confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // Fallback if confetti is not available, but usually safe to assume or just skip if complex. 
                // Since I cannot install packages, I will simulate without the actual confetti package import if it's not there.
                // Wait, I don't see canvas-confetti in package.json from file list, so I'll skip the confetti import and logic to avoid build errors.
                // I will just show the modal.
            }, 250);

            // Clean URL
            router.replace(`/learn/${course.id}`, { scroll: false });
        }
    }, [searchParams, course.id, router]);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            const { data, error } = await supabase
                .rpc('get_user_dashboard_data', {
                    target_course_id: course.id
                });

            if (data) {
                const result = data as any;
                if (result.cert_requests) setCertRequests(result.cert_requests);
            } else if (error) {
                console.error("CoursePlayer RPC Fetch Error:", error);
            }
            setIsLoadingCert(false);
        };

        fetchData();

        // Realtime subscription
        const channel = supabase
            .channel('cert_status')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'certificate_requests',
                filter: `user_id=eq.${userId}`
            }, (payload: any) => {
                fetchData(); // Refresh on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, course.id, supabase]);

    const handleRequestCertificate = async () => {
        if (!userId) return;
        setIsRequestingCert(true);

        try {
            // Get user profile for name/email
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();

            const { data, error } = await supabase.from('certificate_requests').insert({
                user_id: userId,
                course_id: course.id,
                full_name: profile?.full_name || user?.user_metadata?.full_name || 'Student',
                email: user?.email,
                status: 'pending'
            }).select().single();

            if (error) throw error;

            // Instant UI Update
            setCertRequests(prev => [data, ...prev]);

        } catch (error: any) {
            console.error("Cert request failed:", error);
            alert("Failed to request certificate. Please try again.");
        } finally {
            setIsRequestingCert(false);
        }
    };

    const currentLesson = allLessons[currentLessonIndex];
    if (!currentLesson) return <div className="p-8">No lessons available.</div>;

    const toggleCompletion = async (lessonId: string, completed: boolean) => {
        if (!userId) {
            alert("User ID missing. Try logging in again.");
            return;
        }
        // Optimistic update
        const newCompleted = new Set(completedLessons);
        if (completed) {
            newCompleted.add(lessonId);
        } else {
            newCompleted.delete(lessonId);
        }
        setCompletedLessons(newCompleted);

        try {
            if (completed) {
                const { error } = await supabase.from('lesson_completions').upsert({
                    user_id: userId,
                    lesson_id: lessonId,
                    course_id: course.id,
                    completed_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id, lesson_id'
                });

                if (error) {
                    console.error("Supabase Upsert Error:", error);
                    alert(`Error saving progress: ${error.message} (Code: ${error.code})`);
                    throw error;
                }
            } else {
                const { error } = await supabase.from('lesson_completions').delete()
                    .eq('user_id', userId)
                    .eq('lesson_id', lessonId);

                if (error) {
                    console.error("Supabase Delete Error:", error);
                    alert(`Error saving progress: ${error.message}`);
                    throw error;
                }
            }
        } catch (error: any) {
            console.error("Error toggling completion:", error);
            // Revert on error
            setCompletedLessons(new Set(initialCompletedLessonIds));
            // Alert was already shown for supabase errors
        }
    };

    const handleNext = () => {
        if (currentLessonIndex < allLessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
        }
    };

    const handleDownload = async () => {
        if (!currentLesson.content) return;

        let downloadUrl = currentLesson.content;

        // Check if it's a storage path (not a full URL)
        if (!currentLesson.content.startsWith('http')) {
            try {
                // Remove leading slash if present
                const path = currentLesson.content.startsWith('/') ? currentLesson.content.substring(1) : currentLesson.content;

                const signedUrl = await getSignedUrl(path);
                downloadUrl = signedUrl;
            } catch (err: any) {
                console.error("Signing failed:", err);
                alert(err.message || "Could not access private file.");
                return;
            }
        }

        window.open(downloadUrl, '_blank');

        // Auto mark as completed
        if (!completedLessons.has(currentLesson.id)) {
            toggleCompletion(currentLesson.id, true);
        }
    }

    const renderSidebar = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-card">
                <h2 className="font-bold text-lg mb-1">Course Content</h2>
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{allLessons.length} Lessons</span>
                    <span>{Math.round((completedLessons.size / allLessons.length) * 100)}% Complete</span>
                </div>
                <Progress value={(completedLessons.size / allLessons.length) * 100} className="h-1 mt-2" />
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4">
                    <Accordion type="multiple" defaultValue={modules.map(m => `item-${m.id || m.order_index}`)} className="w-full">
                        {modules.map((module, mIdx) => (
                            <AccordionItem key={module.id || mIdx} value={`item-${module.id || module.order_index}`} className="border-b-0 mb-4">
                                <AccordionTrigger className="hover:no-underline py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider text-left">
                                    {module.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-1 pt-1 pl-2 border-l ml-1">
                                        {module.lessons && module.lessons.length > 0 ? (
                                            module.lessons.map((lesson: any) => {
                                                const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                                                const isActive = globalIndex === currentLessonIndex;
                                                const isCompleted = completedLessons.has(lesson.id);

                                                return (
                                                    <div key={lesson.id} className={cn(
                                                        "w-full flex items-start gap-2 p-2 rounded-md transition-colors group",
                                                        isActive ? "bg-primary/10" : "hover:bg-muted"
                                                    )}>
                                                        <div className="pt-1 shrink-0">
                                                            <input
                                                                type="checkbox"
                                                                checked={isCompleted}
                                                                onChange={(e) => toggleCompletion(lesson.id, e.target.checked)}
                                                                className="w-4 h-4 rounded border-primary text-primary focus:ring-primary cursor-pointer accent-primary"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => setCurrentLessonIndex(globalIndex)}
                                                            className={cn(
                                                                "flex-1 text-sm text-left leading-tight break-words", // Added break-words and leading-tight
                                                                isActive ? "text-primary font-medium" : "text-foreground group-hover:text-foreground",
                                                                lesson.is_locked && "opacity-50 cursor-not-allowed"
                                                            )}
                                                            disabled={lesson.is_locked}
                                                        >
                                                            {lesson.title}
                                                        </button>
                                                        {lesson.is_locked && <Lock className="w-3 h-3 shrink-0 opacity-50 mt-1" />}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-xs text-muted-foreground p-2 italic">No lessons yet.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <header className="h-14 border-b flex items-center px-4 bg-card shrink-0 gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                </Link>
                <div className="h-6 w-[1px] bg-border mx-2" />
                <h1 className="font-semibold text-sm md:text-base truncate">{course.title}</h1>

                <div className="ml-auto flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden">
                                <Menu className="w-4 h-4 mr-2" /> Content
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80">
                            <SheetTitle className="sr-only">Course Content</SheetTitle>
                            <SheetDescription className="sr-only">
                                Navigate through the course modules and lessons.
                            </SheetDescription>
                            {renderSidebar()}
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {currentLesson.title === "Thank You Message" ? (
                        // Dedicated Full-Page Thank You Layout
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/30">
                            <div className="max-w-2xl w-full mx-auto space-y-8 text-center bg-card p-10 rounded-xl shadow-sm border">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
                                    <CheckCircle className="w-12 h-12 text-primary" />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                        Congratulations!
                                    </h2>
                                    <p className="text-xl text-muted-foreground font-medium">
                                        You've completed the course.
                                    </p>
                                </div>

                                <Separator className="my-8" />

                                <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed">
                                    <p>
                                        You've taken a massive step toward building your digital future.
                                        We are incredibly proud of your dedication and commitment.
                                    </p>
                                    <p>
                                        Remember, knowledge is only potential power—execution is everything.
                                        Take what you've learned here, apply it consistently, and don't be afraid to experiment.
                                    </p>
                                    <p className="font-semibold text-foreground text-lg pt-2">
                                        Welcome to the top 1%. Your journey has just begun.
                                    </p>
                                </div>

                                <div className="pt-8 flex flex-col items-center gap-4">
                                    <div className="w-full max-w-sm">
                                        {(() => {
                                            const rejectedCount = certRequests.filter(r => r.status === 'rejected').length;
                                            const latestRequest = certRequests[0];
                                            const isBlocked = rejectedCount >= 3;

                                            // 1. Approved
                                            if (latestRequest?.status === 'approved') {
                                                return (
                                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center space-y-3">
                                                        <p className="text-green-600 font-semibold flex items-center justify-center gap-2">
                                                            <CheckCircle className="w-5 h-5" /> Certificate Approved!
                                                        </p>
                                                        <p className="text-sm text-green-700">
                                                            Your certificate will be delivered to you within 24hrs via your email.
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            // 2. Pending
                                            if (latestRequest?.status === 'pending') {
                                                return (
                                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
                                                        <p className="text-yellow-600 font-medium flex items-center justify-center gap-2">
                                                            <Loader2 className="w-4 h-4 animate-spin" /> Certificate Request Pending
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Admin will review your request shortly.
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            // 3. Blocked
                                            if (isBlocked) {
                                                return (
                                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                                                        <p className="text-red-600 font-semibold flex items-center justify-center gap-2">
                                                            <Lock className="w-5 h-5" /> Request Limit Reached
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            You have exceeded the maximum number of rejected requests (3).
                                                            Please contact support.
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            // 4. Default / Retry
                                            return (
                                                <div className="space-y-3">
                                                    {rejectedCount > 0 && (
                                                        <p className="text-sm text-red-500 font-medium">
                                                            Previous request rejected. Attempts remaining: {3 - rejectedCount}
                                                        </p>
                                                    )}
                                                    <Button
                                                        size="lg"
                                                        className="w-full font-semibold text-md shadow-lg shadow-primary/20"
                                                        onClick={handleRequestCertificate}
                                                        disabled={isRequestingCert || isLoadingCert}
                                                    >
                                                        {isRequestingCert ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Requesting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Request Certificate
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard'}>
                                        Return to Dashboard
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Standard Lesson Layout (Player + Details)
                        <>
                            {/* Player/Viewer */}
                            <div className="min-h-[400px] bg-muted relative flex items-center justify-center">
                                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-8 text-center">
                                    <FileText className="w-16 h-16 mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-bold mb-2">{currentLesson.title}</h3>
                                    <p className="mb-4 text-muted-foreground">This is a text/document lesson.</p>
                                    {currentLesson.content ? (
                                        <Button onClick={handleDownload}>
                                            <Download className="w-4 h-4 mr-2" /> Download/View Content
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline">
                                            <Lock className="w-4 h-4 mr-2" /> Content Locked or Unavailable
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Lesson Details */}
                            <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-2xl md:text-3xl font-bold">{currentLesson.title}</h1>

                                        {currentLesson.content && (
                                            <Button variant="outline" size="sm" onClick={handleDownload} title="Download Source">
                                                <Download className="w-4 h-4 mr-2" /> Download
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between pt-4">
                                    <Button variant="outline" onClick={handlePrev} disabled={currentLessonIndex === 0}>
                                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                                    </Button>
                                    <Button onClick={handleNext} disabled={currentLessonIndex === allLessons.length - 1}>
                                        Next <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block w-80 border-l bg-card/30">
                    {renderSidebar()}
                </div>
            </div>
            {/* Thank You / Welcome Modal */}
            <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary animate-in zoom-in duration-300">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Welcome Aboard!</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Payment successful. You now have lifetime access to <strong>{course.title}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <p className="text-sm text-muted-foreground">
                            We are excited to help you start your journey.
                            Click below to start your first lesson.
                        </p>
                        <Button className="w-full" size="lg" onClick={() => setShowThankYou(false)}>
                            Start Learning Now
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
