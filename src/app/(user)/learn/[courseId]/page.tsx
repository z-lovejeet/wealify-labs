"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, PlayCircle, Lock, Menu, FileText, Download, ChevronLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Mock data specifically for player
const modules = [
    { title: "Introduction", lessons: [{ title: "Welcome to the Course", duration: "2:30", completed: true }, { title: "Course Overview", duration: "5:00", completed: true }] },
    { title: "Fundamentals", lessons: [{ title: "Setup Environment", duration: "10:00", completed: false }, { title: "Hello World", duration: "8:30", completed: false }, { title: "Basic Syntax", duration: "15:00", completed: false, locked: true }] },
    { title: "Advanced Topics", lessons: [{ title: "Deep Dive", duration: "20:00", completed: false, locked: true }] }
];

export default function CoursePlayerPage({ params }: { params: { courseId: string } }) {
    const [activeLesson, setActiveLesson] = useState(0);

    const SidebarContent = () => (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-card">
                <h2 className="font-bold text-lg mb-1">Course Content</h2>
                <div className="text-xs text-muted-foreground">34% Completed</div>
                {/* Progress bar could go here */}
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {modules.map((module, mIdx) => (
                        <div key={mIdx}>
                            <h3 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">{module.title}</h3>
                            <div className="space-y-1">
                                {module.lessons.map((lesson, lIdx) => (
                                    <button
                                        key={lIdx}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-2 rounded-md text-sm text-left transition-colors",
                                            !lesson.locked && "hover:bg-muted",
                                            activeLesson === lIdx && mIdx === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground",
                                            lesson.locked && "opacity-50 cursor-not-allowed"
                                        )}
                                        disabled={lesson.locked}
                                    >
                                        {lesson.completed ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        ) : lesson.locked ? (
                                            <Lock className="w-4 h-4 shrink-0" />
                                        ) : (
                                            <PlayCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        <span className="truncate">{lesson.title}</span>
                                        <span className="ml-auto text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Player Header */}
            <header className="h-14 border-b flex items-center px-4 bg-card shrink-0 gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                </Link>
                <div className="h-6 w-[1px] bg-border mx-2" />
                <h1 className="font-semibold text-sm md:text-base truncate">Ultimate Full-Stack SaaS Masterclass</h1>

                <div className="ml-auto flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden">
                                <Menu className="w-4 h-4 mr-2" /> Course Content
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-80">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black relative flex items-center justify-center">
                        <PlayCircle className="w-20 h-20 text-white/20" />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            {/* Controls mockup */}
                        </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome to the Course</h1>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                <span>Last updated Dec 2024</span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                In this lesson, we will go over the course structure, the technologies we will be using, and how to get the most out of this masterclass.
                                Please make sure you have installed Node.js and VS Code before proceeding to the next lesson.
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2"><Download className="w-4 h-4" /> Resources</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="justify-start h-auto py-3">
                                    <FileText className="w-4 h-4 mr-2 text-primary" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Starter Code</div>
                                        <div className="text-xs text-muted-foreground">ZIP • 2MB</div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="justify-start h-auto py-3">
                                    <FileText className="w-4 h-4 mr-2 text-primary" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">Slides</div>
                                        <div className="text-xs text-muted-foreground">PDF • 5MB</div>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-8">
                            <Button variant="outline">Previous Lesson</Button>
                            <Button>Mark as Complete & Next</Button>
                        </div>
                    </div>
                </div>

                {/* Desktop Sidebar (Right side standard for players usually, or Left. Let's do Right like Udemy/Coursera often do for playlist) */}
                <div className="hidden lg:block w-80 border-l bg-card/30">
                    <SidebarContent />
                </div>
            </div>
        </div>
    );
}
