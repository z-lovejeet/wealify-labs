import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

const COURSE_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

export default async function DashboardPage() {
    const supabase = await createClient(); // Await strictly needed for server client

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    // Parallel Fetch: Profile, Course, Enrollments
    const [profileResult, courseResult, enrollmentResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('courses').select('*').eq('id', COURSE_ID).single(),
        supabase.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', COURSE_ID)
    ]);

    const profile = profileResult.data;
    const courseData = courseResult.data;
    const enrollments = enrollmentResult.data;

    const userWithProfile = { ...user, profile };
    const userIsEnrolled = enrollments && enrollments.length > 0;

    let newStats = { totalLessons: 0, completedLessons: 0, progress: 0 };

    if (userIsEnrolled && courseData) {
        const { data: modules } = await supabase
            .from('modules')
            .select('id, lessons(id)')
            .eq('course_id', COURSE_ID);

        let total = 0;
        let lessonIds: string[] = [];

        if (modules) {
            modules.forEach((m: any) => {
                if (m.lessons) {
                    total += m.lessons.length;
                    m.lessons.forEach((l: any) => lessonIds.push(l.id));
                }
            });
        }
        newStats.totalLessons = total;

        if (lessonIds.length > 0) {
            // Count completed lessons for this user (using stored completion table)
            const { count } = await supabase
                .from('lesson_completions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .in('lesson_id', lessonIds);

            newStats.completedLessons = count || 0;
        }

        newStats.progress = newStats.totalLessons > 0
            ? Math.round((newStats.completedLessons / newStats.totalLessons) * 100)
            : 0;
    }

    return (
        <DashboardClient
            user={userWithProfile}
            course={courseData}
            isEnrolled={!!userIsEnrolled}
            stats={newStats}
        />
    );
}
