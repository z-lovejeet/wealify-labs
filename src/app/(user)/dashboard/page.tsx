import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { singleCourse } from "@/lib/mock-data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile, Enrollments (with Course details), and Default Course fallback
    const [profileResult, enrollmentsResult, defaultCourseResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('enrollments').select('*, courses(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('courses').select('*').limit(1).maybeSingle()
    ]);

    const profile = profileResult.data;
    const enrollments = enrollmentsResult.data || [];
    const userIsEnrolled = enrollments.length > 0;

    // Pick active course (first enrolled course, or first available course in DB, or fallback)
    const activeCourse = (userIsEnrolled && enrollments[0].courses)
        ? enrollments[0].courses
        : (defaultCourseResult.data || singleCourse);

    const userWithProfile = { ...user, profile };
    const newStats = { totalLessons: 0, completedLessons: 0, progress: 0 };

    if (activeCourse?.id) {
        // Fetch modules and completions for the active course
        const [modulesResult, completionsResult] = await Promise.all([
            supabase.from('modules').select('id, lessons(id)').eq('course_id', activeCourse.id),
            supabase.from('lesson_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('course_id', activeCourse.id)
        ]);

        const modules = modulesResult.data;
        let total = 0;
        if (modules) {
            modules.forEach((m: any) => {
                if (m.lessons) {
                    total += m.lessons.length;
                }
            });
        }
        newStats.totalLessons = total;
        newStats.completedLessons = completionsResult.count || 0;

        newStats.progress = newStats.totalLessons > 0
            ? Math.round((newStats.completedLessons / newStats.totalLessons) * 100)
            : 0;
    }

    return (
        <DashboardClient
            user={userWithProfile}
            course={activeCourse}
            isEnrolled={userIsEnrolled}
            stats={newStats}
        />
    );
}
