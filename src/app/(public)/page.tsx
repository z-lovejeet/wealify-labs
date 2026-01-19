import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { singleCourse } from "@/lib/mock-data";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Server Component setAll ignore
                    }
                },
            },
        }
    );

    // Fetch Course Details
    let course = singleCourse;
    try {
        const { data: courseData } = await supabase
            .from('courses')
            .select('*')
            .eq('id', "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
            .single();

        if (courseData) {
            course = courseData;
        }
    } catch (e) {
        // use mock
    }

    const { data: { user } } = await supabase.auth.getUser();

    let hasAccess = false;
    if (user) {
        try {
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('id')
                .eq('user_id', user.id)
                .eq('course_id', course.id);

            if (enrollments && enrollments.length > 0) {
                hasAccess = true;
            }
        } catch (e) {
            // ignore
        }
    }

    return <HomeClient user={user} hasAccess={hasAccess} course={course} />;
}
