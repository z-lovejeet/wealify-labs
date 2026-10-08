import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CoursePlayerClient from "./CoursePlayerClient";

// This is a Server Component that guards paid course material
export default async function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
    const supabase = await createClient();
    const { courseId } = await params;

    // 1. Fetch user session first
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect(`/login?next=/learn/${courseId}`);
    }

    // 2. Parallel Fetch: Course Details, Enrollment Verification, Profile Role, and Progress
    const [courseResult, enrollmentResult, profileResult, completionsResult] = await Promise.all([
        supabase
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
            .single(),
        supabase
            .from('enrollments')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single(),
        supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single(),
        supabase
            .from('lesson_completions')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
    ]);

    const course = courseResult.data;
    if (!course) {
        redirect("/my-courses");
    }

    const isAdmin = profileResult.data?.role === 'admin';
    const isEnrolled = enrollmentResult.data && (enrollmentResult.data.status === 'active' || !enrollmentResult.data.status);

    // 3. Security Guard: Enforce enrollment or admin status
    if (!isAdmin && !isEnrolled) {
        redirect(`/checkout?courseId=${courseId}&unauthorized=true`);
    }

    // 4. Map completions
    const completedLessonIds: string[] = completionsResult.data
        ? completionsResult.data.map(c => c.lesson_id)
        : [];

    // 5. Sort modules and lessons
    const sortedModules = course.modules?.sort((a: any, b: any) => a.order_index - b.order_index).map((m: any) => ({
        ...m,
        lessons: m.lessons?.sort((a: any, b: any) => a.order_index - b.order_index) || []
    })) || [];

    return (
        <CoursePlayerClient
            course={course}
            modules={sortedModules}
            initialCompletedLessonIds={completedLessonIds}
            userId={user.id}
        />
    );
}
