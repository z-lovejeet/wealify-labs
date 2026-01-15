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

export default function CoursePlayerClient({ course, modules }: { course: any, modules: any[] }) {
    // Flatten lessons to make navigation easier
    const allLessons = modules.flatMap(m => m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })));
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

    const currentLesson = allLessons[currentLessonIndex];
    if (!currentLesson) return <div className="p-8">No lessons available.</div>;

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
        }
    }

    const SidebarContent = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-card">
                <h2 className="font-bold text-lg mb-1">Course Content</h2>
                <div className="text-xs text-muted-foreground">{allLessons.length} Lessons</div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {modules.map((module, mIdx) => (
                        <div key={mIdx}>
                            <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">{module.title}</h3>
                            <div className="space-y-1">
                                {module.lessons.map((lesson: any, lIdx: number) => {
                                    // Find global index
                                    const globalIndex = allLessons.findIndex(l => l.id === lesson.id);
                                    const isActive = globalIndex === currentLessonIndex;

                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLessonIndex(globalIndex)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-2 rounded-md text-sm text-left transition-colors",
                                                !lesson.is_locked && "hover:bg-muted",
                                                isActive ? "bg-primary/10 text-primary font-medium" : "text-foreground",
                                                lesson.is_locked && "opacity-50 cursor-not-allowed"
                                            )}
                                            disabled={lesson.is_locked}
                                        >
                                            {lesson.is_locked ? (
                                                <Lock className="w-4 h-4 shrink-0" />
                                            ) : (
                                                <FileText className="w-4 h-4 shrink-0" />
                                            )}
                                            <span className="truncate">{lesson.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
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
