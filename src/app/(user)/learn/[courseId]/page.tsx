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
export default async function CoursePlayerPage({ params }: { params: { courseId: string } }) {
    const supabase = await createClient();
    const { courseId } = params;

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
        redirect('/dashboard');
    }

    // Sort valid data
    const sortedModules = course.modules?.sort((a: any, b: any) => a.order_index - b.order_index).map((m: any) => ({
        ...m,
        lessons: m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || []
    })) || [];

    // Pass data to Client Component for interactivity
    return <CoursePlayerClient course={course} modules={sortedModules} />;
}
