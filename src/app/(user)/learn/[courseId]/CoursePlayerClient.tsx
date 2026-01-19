"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Lock, Menu, FileText, Download, ChevronLeft, ArrowLeft, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CoursePlayerClient({
    course,
    modules,
    initialCompletedLessonIds = [],
    userId
}: {
    course: any,
    modules: any[],
    initialCompletedLessonIds?: string[],
    userId?: string
}) {
    const supabase = createClient();
    // Flatten lessons to make navigation easier
    const allLessons = modules.flatMap(m => m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })));
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set(initialCompletedLessonIds));

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

    const handleDownload = () => {
        if (currentLesson.content) {
            window.open(currentLesson.content, '_blank');
            // Auto mark as completed
            if (!completedLessons.has(currentLesson.id)) {
                toggleCompletion(currentLesson.id, true);
            }
        }
    }

    const SidebarContent = () => (
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
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-y-auto">
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
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block w-80 border-l bg-card/30">
                    <SidebarContent />
                </div>
            </div>
        </div>
    );
}
