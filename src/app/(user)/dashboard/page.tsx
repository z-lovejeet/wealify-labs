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

    // Parallel Fetch ALL: Profile, Course, Enrollments, Modules, Completions
    // We can fetch modules and completions blindly for the course/user because we have the IDs
    const [profileResult, courseResult, enrollmentResult, modulesResult, completionsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('courses').select('*').eq('id', COURSE_ID).single(),
        supabase.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', COURSE_ID),
        supabase.from('modules').select('id, lessons(id)').eq('course_id', COURSE_ID),
        supabase.from('lesson_completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('course_id', COURSE_ID)
    ]);

    const profile = profileResult.data;
    const courseData = courseResult.data;
    const enrollments = enrollmentResult.data;

    const userWithProfile = { ...user, profile };
    const userIsEnrolled = enrollments && enrollments.length > 0;

    let newStats = { totalLessons: 0, completedLessons: 0, progress: 0 };

    if (userIsEnrolled && courseData) {
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
            course={courseData}
            isEnrolled={!!userIsEnrolled}
            stats={newStats}
        />
    );
}
