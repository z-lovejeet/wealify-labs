import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, PlayCircle, Lock, Menu, FileText, Download, ChevronLeft, ArrowRight, MonitorPlay } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient"; // Create a client wrapper for state

// This is a Server Component
export default async function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
    const supabase = await createClient();
    const { courseId } = await params;

    // 1. Fetch Course & Modules
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            modules (
                id,
                title,
                order_index,
                lessons (
                    id,
                    title,
                    lesson_type,
                    content,
                    order_index,
                    is_locked
                )
            )
        `)
        .eq('id', courseId)
        .single();

    if (error || !course) {
        console.error("Course Load Error:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h1 className="text-2xl font-bold text-destructive mb-2">Failed to Load Course</h1>
                <p className="text-muted-foreground max-w-md mb-4">You are trying to access a course that might not exist or you do not have permission to view.</p>
                <div className="bg-secondary/50 p-4 rounded-md text-left text-sm font-mono overflow-auto max-w-full mb-6">
                    {error ? JSON.stringify(error, null, 2) : "Course not found"}
                </div>
                <Link href="/dashboard">
                    <Button>Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    // Sort valid data
    const sortedModules = course.modules?.sort((a: any, b: any) => a.order_index - b.order_index).map((m: any) => ({
        ...m,
        lessons: m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || []
    })) || [];

    // Pass data to Client Component for interactivity
    return <CoursePlayerClient course={course} modules={sortedModules} />;
}
